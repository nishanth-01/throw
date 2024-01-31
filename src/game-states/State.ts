import { Point, Rectangle } from "pixi.js";
import GameController from "../GameController";

// default state does nothing
export default class State {
  protected controller: GameController;

  constructor(controller: GameController) {
    this.controller = controller;
  }

  // x, y with respect to launcher
  onPointerMove(pointerPos: Point) {}
  onClick() {}

  launchComplete(hit: boolean) {}

  loadLevel() {}

  resize() {
    this.controller.getModel()
      .resize(this.controller.getScreen());
  }
}

