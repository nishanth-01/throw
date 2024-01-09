import * as PIXI from 'pixi.js';
import { Button } from '@pixi/ui';

export default class Game {
  document: Document;
  app: PIXI.Application;

  screenWidth: number;
  screenHeight: number;
  angle = 0; // with respect to positive x-axis

  ball: PIXI.Container;
  jumpButtonContainer: PIXI.Container;
  target: PIXI.Container;

  ballRadius = 10;
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

    // jump button
    this.jumpButtonContainer = new PIXI.Text('JUMP', new PIXI.TextStyle({
      fill: 'white'
    }));

    // target
    this.target = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRect(
        this.screenWidth - this.targetWidth,
        this.screenHeight - this.targetHeight,
        this.targetWidth,
        this.targetHeight)
      .endFill();

    this.app.stage.addChild(this.jumpButtonContainer);
    this.app.stage.addChild(this.ball);
    this.app.stage.addChild(this.target);
  }

  private loadInputListeners() {
    new Button(this.jumpButtonContainer).onPress.connect(() => {
      const ticker = new PIXI.Ticker();
      let elapsedTime = 0;
      const fn = () => {
        if(elapsedTime == -1) {
          ticker.stop();
          console.log('\'lastTime\' is -1');
        }

        const x = -4e-4 * (elapsedTime**2/2) + 0.8*elapsedTime;
        if(x < 0) {
          ticker.stop();
          ticker.remove(fn);
          console.log('ticker stopped');
        }

        this.ball.x = x;
        elapsedTime += ticker.deltaMS;
      };

      ticker.add(fn);

      ticker.start();
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

    this.angle = 0;

    this.loadGraphics();
    this.loadInputListeners();
  }
};
