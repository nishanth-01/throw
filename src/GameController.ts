import { Application, Container, Point, Rectangle } from "pixi.js";

import State from "./game-states/State";
import InitialState from "./game-states/InitialState";
import OnAirState from "./game-states/OnAirState";
import EndState from "./game-states/EndState";

import GameView from './GameView';
import GameModel from './GameModel';

export default class GameController {
  private app: Application;
  private state: State;

  public initialState: InitialState;
  public onAirState: OnAirState;
  public endState: EndState;

  //TODO: make this private or read only
  private view: GameView;
  private model: GameModel;

  public onEndCallback: (hit: boolean) => void;

  public constructor(app: Application, onEndCallback: (hit: boolean) => void) {
    this.app = app;
    this.onEndCallback = onEndCallback;

    this.view = new GameView(this);
    this.model = new GameModel(this.view);

    this.initialState = new InitialState(this);
    this.onAirState = new OnAirState(this);
    this.endState = new EndState(this);
  }

  public init(): Container {
    this.changeState(this.initialState);

    const view = this.view.init();
    this.model.init(this.app.screen);

    return view;
  }

  public getScreen(): Rectangle {
    return this.app.screen
  }

  public getModel(): GameModel {
    return this.model
  }

  public resize(): void {
    this.state.resize();
  }

  public changeState(state: State) {
    this.state = state;
  }

  public onPointerMove(pointerPos: Point) {
    this.state.onPointerMove(pointerPos);
  }

  public onClick() {
    this.state.onClick();
  }

  public launchComplete(hit: boolean): void {
    this.state.launchComplete(hit);
  }

  public loadLevel(): void {
    this.state.loadLevel();
  }
}

