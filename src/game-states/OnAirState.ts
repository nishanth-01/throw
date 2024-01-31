import State from './State';

export default class OnAirState extends State {
  //TODO: show disabled pointer
  launchComplete(hit: boolean): void {
    this.controller.changeState(this.controller.endState);
    this.controller.getModel().resize(this.controller.getScreen());
    this.controller.onEndCallback(hit);
  }

  resize(): void {
    return;//dont resize
  }
}

