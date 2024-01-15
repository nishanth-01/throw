import { app } from './index';

import Game from './Game';

const game = new Game();

// load views
export function start() {
  game.start();
  app.stage.addChild(game.view);
}
