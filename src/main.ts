import * as PIXI from 'pixi.js';
import GameController from './GameController';

const root = document.body;

const app = new PIXI.Application({
  resizeTo: document.body
});

// TODO: remove ts-ignore
// @ts-ignore
root.appendChild(app.view);

const gameController = new GameController(app, (hit: boolean) => {
  //TODO: show popup
  console.log(hit ? 'hit' : 'miss');
  gameController.loadLevel();
});

app.stage.addChild(gameController.init());

window.addEventListener('resize', () => {
  gameController.resize()
});
