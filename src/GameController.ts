import { Application, Container } from "pixi.js";
import GameView from './GameView';
import GameModel from './GameModel';

export default class GameController implements State {
  private _state: State;

  private _view: GameView;
  private _model: GameModel;

  public init(app: Application) {
    
  }

  public get view(): Container {
    return this._view.view;
  }

  public onPointerMove(screenWidth: number, screenHeight: number, x: number, y: number) {
    this._state.onPointerMove(screenWidth, screenHeight, x, y);
  }

  public onClick(screenWidth: number, screenHeight: number, x: number, y: number) {
    this._state.onPointerMove(screenWidth, screenHeight, x, y);
  }

  public launch(deltaFn: (deltaMS: number) => { deltaX: number, deltaY: number }) {
    this._state.launch(deltaFn);
  }

  public changeLauncherAngle(angle: number) {
    this._state.changeLauncherAngle(angle);
  }

  public changeLauncherVelocity(angle: number) {
    this._state.changeLauncherVelocity(angle);
  }

  public resizeView(screenWidth: number, screenHeight: number) {
    this._state.resizeView(screenWidth, screenHeight);
  }

  public resizeModel(screenWidth: number, screenHeight: number) {
    this._state.resizeModel(screenWidth, screenHeight);
  }
}

interface State {
  // x, y with respect to launcher
  onPointerMove: (screenWidth: number, screenHeight: number, x: number, y: number) => void;
  onClick: (screenWidth: number, screenHeight: number, x: number, y: number) => void;

  launch: (deltaFn: (deltaMS: number) => { deltaX: number, deltaY: number }) => void;

  changeLauncherAngle: (angle: number) => void;
  changeLauncherVelocity: (angle: number) => void;

  resizeView: (screenWidth: number, screenHeight: number) => void;
  resizeModel: (screenWidth: number, screenHeight: number) => void;
}

class InitialState implements State {
}

class OnAirState implements State {
}

class EndState implements State {
}
