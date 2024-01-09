import * as PIXI from 'pixi.js';
import { Button } from '@pixi/ui';

export default class Game {
  document: Document;
  app: PIXI.Application;

  screenWidth: number;
  screenHeight: number;
  angle: number;

  ball: PIXI.Container;
  jumpButtonContainer: PIXI.Container;

  ballRadius = 5;

  constructor(document: Document) {
    this.document = document;
  }

  private loadGraphics() {
    // jump ball
    this.ball = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawCircle(
        this.ballRadius, this.screenHeight-this.ballRadius, this.ballRadius)
      .endFill();

    // jump button setup
    this.jumpButtonContainer = new PIXI.Text('JUMP', new PIXI.TextStyle({
      fill: 'white'
    }));
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

  start() {
    const root = this.document.body;

    this.app = new PIXI.Application({
      width: root.clientWidth,
      height: root.clientHeight,
    });
    // TODO: remove ts ignore
    // @ts-ignore
    root.appendChild(this.app.view);

    this.screenWidth = this.app.renderer.width;
    this.screenHeight = this.app.renderer.height;

    this.angle = 0; // with respect to positive x-axis

    this.loadGraphics();
    this.loadInputListeners();

    this.app.stage.addChild(this.jumpButtonContainer);
    this.app.stage.addChild(this.ball);
  }
};




