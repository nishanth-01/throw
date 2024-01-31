import State from './State';

export default class EndState extends State {
  //TODO: resize if necessary
  loadLevel() {
    //TODO: implement levels
    this.controller.getModel().updateLevel();
    this.controller.changeState(this.controller.initialState);
  }
}
