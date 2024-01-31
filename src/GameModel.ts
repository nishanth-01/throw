import { Point, Rectangle } from 'pixi.js';
import '@pixi/math-extras';//for PIXI.Rectangle.equals()
import * as PIXI from 'pixi.js';

import GameView from './GameView';

const G = 0.003; // acceleration due to gravity

export interface Trajectory {
  xDelta: (deltaMS: number) => number;
  yDelta: (deltaMS: number) => number;
}

export default class GameModel {
  public static get ANGLE_MAX() : number {
    return 1.55;
  }

  public static get ANGLE_MIN() : number {
    return 0.17;
  }

  public static get ANGLE_DEFAULT() : number {
    return 0.8;
  }

  public static get FORCE_MAX() : number {
    return 2;
  }

  public static get FORCE_MIN() : number {
    return 0.5;
  }

  public static get FORCE_DEFAULT() : number {
    return 1.5;
  }

  private view: GameView;

  private screen: PIXI.Rectangle;

  private backgroundPos: PIXI.Rectangle;
  private launcherPos: Point;
  private targetPos: PIXI.Rectangle;
  private projectilePos: Point;

  private launcherAngle: number;
  private launcherForce: number;

  private projectileRadius: number;

  public constructor(view: GameView) {
    this.view = view;

    this.backgroundPos = new PIXI.Rectangle();
    this.launcherPos = new Point();
    this.targetPos = new PIXI.Rectangle();
    this.projectilePos = new Point();

    this.launcherAngle = GameModel.ANGLE_DEFAULT;
    this.launcherForce = GameModel.FORCE_DEFAULT;

    this.projectileRadius = 10;
  }

  public init(screen: Rectangle) {
    this.resize(screen);
  }

  private updateView() {
    this.view.updateBackground(this.backgroundPos);
    this.view.updateLauncher(this.launcherPos);
    this.view.updateTarget(this.targetPos)
    //TODO(bug): relocates the object when called in end state
    this.view.updateProjectile(
      this.projectilePos, this.projectileRadius);
  }

  //TODO: scale with width
  public resize(screen: PIXI.Rectangle) {
    this.screen = screen;

    this.backgroundPos.x = 0;
    this.backgroundPos.y = 0;
    this.backgroundPos.width = this.screen.width;
    this.backgroundPos.height = this.screen.height;

    this.loadLevel();

    this.updateView();
  }

  private loadLevel() {
    this.launcherPos.x = 0;
    this.launcherPos.y = this.screen.height;

    this.targetPos.width = 40;
    this.targetPos.height = 5;

    const offset = 4 * this.targetPos.width;
    const maxTargetX = this.screen.width - offset;

    //TODO: set min screen size constraint
    this.targetPos.x = offset + Math.random() * maxTargetX;
    this.targetPos.y = this.screen.height - this.targetPos.height;

    // move to initial position
    this.projectilePos.x = this.projectileRadius;
    this.projectilePos.y = this.screen.height - this.projectileRadius;
  }

  public updateLevel() {
    //TODO: implement levels
    this.loadLevel();
    this.updateView();
  }

  private calculateAngle(pointerPos: Point): number {
    const adj = pointerPos.x;
    const opp = this.launcherPos.y - pointerPos.y;

    return Math.atan(opp/adj);
  }

  public updateLauncherAngle(pointerPos: Point) {
    const angle = this.calculateAngle(pointerPos);

    if(angle > GameModel.ANGLE_MAX) {
      console.log('max angle reached');
      return;
    }
    if(angle < GameModel.ANGLE_MIN) {
      console.log('min angle reached');
      return;
    }

    this.launcherAngle = angle;
    this.view.updateLauncherAngle(this.launcherAngle);
  }

  public updateLauncherForce(pointerPos: Point) {
    const maxRadius = this.screen.width > this.screen.height ? this.screen.height : this.screen.width;

    const adj = pointerPos.x;
    const opp = this.launcherPos.y - pointerPos.y;

    const radius = Math.sqrt(adj**2 + opp**2);

    const force = GameModel.FORCE_MAX * (radius / maxRadius);
    if(force > GameModel.FORCE_MAX || force < GameModel.FORCE_MIN) {
      console.log('force limit reached');
      return;
    }

    this.launcherForce = force;
    this.view.updateLauncherForce(this.launcherForce);
  }

  public launch() {
    let xInitialVelocity
      = Math.cos(this.launcherAngle) * this.launcherForce;
    let yInitialVelocity
      = Math.sin(this.launcherAngle) * -this.launcherForce;

    const xDelta = (deltaMS: number): number => {
      return xInitialVelocity * deltaMS;
    };

    const yDelta = (deltaMS: number): number => {
      yInitialVelocity += G * deltaMS;
      return yInitialVelocity * deltaMS;
    };

    this.view.launch(xDelta, yDelta);
  }
}
