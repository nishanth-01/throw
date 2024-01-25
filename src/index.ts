import * as PIXI from 'pixi.js';
import Game from './Game';

const root = document.body;

export const app = new PIXI.Application({
  width: root.clientWidth,
  height: root.clientHeight,
});


// TODO: remove ts-ignore
// @ts-ignore
root.appendChild(app.view);

const game = new Game();
game.start();
app.stage.addChild(game.view);

window.addEventListener('resize', () => {
  // TODO: resize after throw event finishes
  app.renderer.view.style.width = `${window.innerWidth}px`;
  app.renderer.view.style.height = `${window.innerHeight}px`;
});
