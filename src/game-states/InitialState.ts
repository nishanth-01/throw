import { Point, Rectangle } from "pixi.js";
import State from './State';

export default class InitialState extends State {
  onPointerMove(pos: Point) {
    const model = this.controller.getModel();
    model.updateLauncherAngle(pos);
    model.updateLauncherForce(pos);
  }

  onClick() {
    this.controller.getModel().launch();
    this.controller.changeState(this.controller.onAirState);
  }
}

