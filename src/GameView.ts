import * as PIXI from "pixi.js";
import "@pixi/events";

import GameController from "./GameController";

//TODO: update view only when new position is different

export default class GameView {
  private controller: GameController;
  private view: PIXI.Container;

  private ballTicker: PIXI.Ticker;

  private background: PIXI.Graphics;
  private ball: PIXI.Graphics;
  private target: PIXI.Graphics;

  public constructor(controller: GameController) {
    this.controller = controller;

    this.view = new PIXI.Container();

    this.ballTicker = new PIXI.Ticker();
    this.ballTicker.autoStart = true;

    this.background = new PIXI.Graphics();
    this.ball = new PIXI.Graphics();
    this.target = new PIXI.Graphics();
  }

  public init(): PIXI.Container {
    this.background.eventMode = 'static';
    this.ball.eventMode = 'none';
    this.target.eventMode = 'none';

    this.background.addEventListener('click', (e: PointerEvent) => {
      if(e.button === 0) {
        this.controller.onClick();
        return;
      }
    });

    this.background.addEventListener('pointermove', (e: PointerEvent) => {
      this.controller.onPointerMove(new PIXI.Point(e.x, e.y));
    });

    this.view.addChild(this.background, this.ball, this.target);

    return this.view;
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


  public launch(
      xDelta: (deltaMS: number) => number,
      yDelta: (deltaMS: number) => number
  ) {
    let elapsedMS = 0;

    const onChange = () => {
      const deltaMS = this.ballTicker.deltaMS;

      this.ball.x += xDelta(deltaMS);
      this.ball.y += yDelta(deltaMS);

      const hit = this.didHit();
      if(this.ball.y > 0 || hit) {
        this.ballTicker.remove(onChange);

        this.controller.launchComplete(hit);
        return;
      }

      elapsedMS += deltaMS;
    };

    this.ballTicker.add(onChange);
  }

  public updateBackground(pos: PIXI.Rectangle) {
    this.background
      .clear()
      .beginFill(0xffffff)
      .drawRect(pos.x, pos.y, pos.width, pos.height)
      .endFill();
  }

  public updateLauncher(pos: PIXI.Point) {}

  public updateLauncherAngle(angle: number) {}

  public updateLauncherForce(force: number) {}

  public updateTarget(pos: PIXI.Rectangle) {
    this.target
      .clear()
      .beginFill(0x000000)
      .drawRect(pos.x, pos.y, pos.width, pos.height)
      .endFill();
  }

  public updateProjectile(pos: PIXI.Point, radius: number) {
    this.ball.x = 0;
    this.ball.y = 0;

    this.ball
      .clear()
      .beginFill(0x000000)
      .drawCircle(pos.x, pos.y, radius)
      .endFill();
  }

  //TODO: public resize() {}
}
