import * as PIXI from 'pixi.js';
import GameController from './GameController';

const root = document.body;

const app = new PIXI.Application({
  width: root.clientWidth,
  height: root.clientHeight,
});


// TODO: remove ts-ignore
// @ts-ignore
root.appendChild(app.view);

const gameController = new GameController();
gameController.init(app);
app.stage.addChild(gameController.view);
