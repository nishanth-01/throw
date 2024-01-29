import { Container, Graphics, DisplayObject, Ticker } from "pixi.js";

export default class GameView {
  private _view = new Container();

  private ballTicker = new Ticker();

  private ball: DisplayObject;
  private target: DisplayObject;

  private ballRadius = 10;

  private targetWidth = 20;
  private targetHeight = 5;

  public get view() : Container {
    return this._view;
  }

  public init(width: number, height: number) {
    this.ballTicker.autoStart = true;

    // ball
    this.ball = new Graphics()
      .beginFill(0xffffff)
      .drawCircle(
        this.ballRadius, height-this.ballRadius, this.ballRadius)
      .endFill();

    // target
    this.target = new Graphics()
      .beginFill(0xffffff)
      .drawRect(
        width - this.targetWidth - 100,
        height - this.targetHeight,
        this.targetWidth,
        this.targetHeight)
      .endFill();

    this._view.addChild(this.ball, this.target);
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


  public launch(deltaX, deltaY, onEnd: (hit: boolean) => void) {

    let elapsedMS = 0;

    const onChange = () => {
      const deltaMS = this.ballTicker.deltaMS;

      this.ball.x += deltaX(deltaMS);
      this.ball.y += deltaY(deltaMS);

      const hit = this.didHit();
      if(this.ball.y > 0 || hit) {
        this.ballTicker.remove(onChange);

        //TODO: try using async/await instead of callback
        onEnd(hit);
        return;
      }

      elapsedMS += deltaMS;
    };

    this.ballTicker.add(onChange);
  }

  //TODO: public resize() {}
}
