import * as PIXI from 'pixi.js';

export default class Game {
  document: Document;
  app: PIXI.Application;

  screenWidth: number;
  screenHeight: number;

  initialAngle = 0; // with respect to positive x-axis // TODO: units?
  initialVelocity = 10; // TODO: implement // TODO: units?

  inputDisabled = false;

  ball: PIXI.Container;
  target: PIXI.Container;

  ballRadius = 10;
  ballWeight = 0; //TODO: implement, high weight should look metally
  targetWidth = 50;
  targetHeight = 5;

  constructor(document: Document) {
    this.document = document;
  }

  private loadGraphics() {
    // ball
    this.ball = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawCircle(
        this.ballRadius, this.screenHeight-this.ballRadius, this.ballRadius)
      .endFill();


    // target
    this.target = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRect(
        this.screenWidth - this.targetWidth,
        this.screenHeight - this.targetHeight,
        this.targetWidth,
        this.targetHeight)
      .endFill();

    this.app.stage.addChild(this.ball);
    this.app.stage.addChild(this.target);
  }

  private getX(xInitialVelocity: number) {
    return (deltaMS: number) => {
      return xInitialVelocity * deltaMS;
    };
  }

  private getY(yInitialVelocity: number) {
    return (deltaMS: number): number => {
      yInitialVelocity += 0.0002;
      return yInitialVelocity * deltaMS;
    };
    //return (0.0002 * elapsedMS - 0.1) * deltaMS;
  }

  private shoot() {
    this.inputDisabled = true;

    const ticker = new PIXI.Ticker();

    let elapsedMS = 0;
    // TODO: get initial velocity using angle
    let xDelta = this.getX(0.4);
    let yDelta = this.getY(-0.4);

    const fn = () => {
      const deltaMS = ticker.deltaMS;

      const yDeltaNext = yDelta(deltaMS);

      if((this.ball.y + yDeltaNext) > 0) {
        ticker.stop();
        ticker.remove(fn);

        console.log('ticker stopped');

        this.ball.x = this.ball.y = 0;
        // TODO: reload
        this.inputDisabled = false;

        return;
      }

      elapsedMS += deltaMS;
      this.ball.x += xDelta(deltaMS);
      this.ball.y += yDeltaNext;
    };

    ticker.add(fn);

    ticker.start();
  }

  private loadInputListeners() {
    addEventListener('keydown', (event: KeyboardEvent) => {
      if(this.inputDisabled) {
        //TODO: inform user
        console.log(`input disabled, '${event.key}' pressed`);
        return;
      } 

      if(event.key === 'Enter') {
        this.shoot();
      }
    });
  }

  private onViewportChange() {
    // TODO: implement
  }

  start() {
    const root = this.document.body;

    this.app = new PIXI.Application({
      width: root.clientWidth,
      height: root.clientHeight,
    });
    // TODO: remove ts-ignore
    // @ts-ignore
    root.appendChild(this.app.view);

    this.screenWidth = this.app.renderer.width;
    this.screenHeight = this.app.renderer.height;

    this.loadGraphics();
    this.loadInputListeners();
  }
};
