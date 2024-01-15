import * as PIXI from 'pixi.js';
import { app } from './index';


const G = 0.003; // acceleration due to gravity

function rad(deg: number): number {
  return deg * Math.PI / 180;
}

export default class Game {
  private static ANGLE_MAX = rad(88);
  private static ANGLE_MIN = rad(10);
  private static ANGLE_DEFAULT = rad(45);
  private static ANGLE_STEP = rad(1);

  private static VELOCITY_MIN = 0.5;
  private static VELOCITY_MAX = 3;
  private static VELOCITY_DEFAULT = 1.45;
  private static VELOCITY_STEP = 0.1;

  public view = new PIXI.Container();

  private screenWidth: number;
  private screenHeight: number;

  // with respect to positive x-axis, anti-clockwise
  private launchAngle = Game.ANGLE_DEFAULT;
  private launchVelocity = Game.VELOCITY_DEFAULT;

  private inputDisabled = false;

  private ball: PIXI.Container;
  private ballRadius = 10;
  private ballWeight = 0; //TODO: implement, heavy ball should look metally

  private target: PIXI.Container;
  private targetWidth = 20;
  private targetHeight = 5;

  private ballTicker: PIXI.Ticker;


  private setAngle(newAngle: number) {
    if(this.inputDisabled) {
      console.log('can\'t set angle, input disabled');
      return;
    }

    if(newAngle > Game.ANGLE_MAX) {
      console.log('max angle reached');
      return;
    }
    if(newAngle < Game.ANGLE_MIN) {
      console.log('min angle reached');
      return;
    }

    this.launchAngle = newAngle;
    console.log('angle set to', this.launchAngle, 'radians');
  }

  private setVelocity(newVelocity: number) {
    if(this.inputDisabled) {
      console.log('can\'t set velocity, input disabled');
      return;
    }

    if(newVelocity > Game.VELOCITY_MAX) {
      console.log('max velocity reached');
      return;
    }
    if(newVelocity < Game.VELOCITY_MIN) {
      console.log('min velocity reached');
      return;
    }

    this.launchVelocity = newVelocity;
    console.log('velocity set to', this.launchVelocity, 'px/ms');
  }

  private didHit() {
    // TODO: use ball shaped 'hitArea' instead of boundbox
    const targetBound = this.ball.getBounds();
    const ballBound = this.target.getBounds();

    // TODO: check at bottom and sides may not be necessary
    return ballBound.x < targetBound.x + targetBound.width
      && ballBound.x + ballBound.width > targetBound.x
      && ballBound.y < targetBound.y + targetBound.height
      && ballBound.y + ballBound.height > targetBound.y;
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
        this.screenWidth - this.targetWidth - 100,
        this.screenHeight - this.targetHeight,
        this.targetWidth,
        this.targetHeight)
      .endFill();

    this.ballTicker = new PIXI.Ticker();

    this.view.addChild(this.ball, this.target);
  }

  private trajectoryX(xInitialVelocity: number) {
    return (deltaMS: number) => {
      return xInitialVelocity * deltaMS;
    };
  }

  private trajectoryY(yInitialVelocity: number) {
    return (deltaMS: number): number => {
      yInitialVelocity += G * deltaMS;

      return yInitialVelocity * deltaMS;
    };
  }

  private reload() {
    this.ball.x = this.ball.y = 0;
    // TODO: implement
  }

  launch() {
    if(this.inputDisabled) {
      console.log('can\'t launch, input disabled');
      return;
    }

    this.inputDisabled = true;

    let elapsedMS = 0;
    let deltaX = this.trajectoryX(
      this.launchVelocity * Math.cos(this.launchAngle));
    let deltaY = this.trajectoryY(
      -(this.launchVelocity * Math.sin(this.launchAngle)));

    const onChange = () => {
      const deltaMS = this.ballTicker.deltaMS;

      this.ball.x += deltaX(deltaMS);
      this.ball.y += deltaY(deltaMS);

      const hit = this.didHit();
      if(this.ball.y > 0 || hit) {
        console.log(hit ? 'Hit!' : 'Miss :(');

        this.ballTicker.stop();
        this.ballTicker.remove(onChange);

        this.reload();
        this.inputDisabled = false;

        return;
      }

      elapsedMS += deltaMS;
    };

    this.ballTicker.add(onChange);
    this.ballTicker.start();
  }

  private onResize() {
    // TODO: implement
  }

  start() {
    this.screenWidth = app.renderer.width;
    this.screenHeight = app.renderer.height;

    this.loadGraphics();

    // TODO: use the containers 'addEventListener'
    addEventListener('keydown', (event: KeyboardEvent) => {
      switch(event.key) {
        case ' ':
          this.launch();
          return;
        case 'W':
        case 'w':
          this.setAngle(this.launchAngle + Game.ANGLE_STEP);
          return;
        case 'S':
        case 's':
          this.setAngle(this.launchAngle - Game.ANGLE_STEP);
          return;
        case 'A':
        case 'a':
          this.setVelocity(this.launchVelocity + Game.VELOCITY_STEP);
          return;
        case 'D':
        case 'd':
          this.setVelocity(this.launchVelocity - Game.VELOCITY_STEP);
          return;
        default:
          // TODO: show controls
          console.log(`no handler for '${event.key}' key`);
          return;
      }
    });
  }
};
