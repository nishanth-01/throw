import Game from './game';

const game = new Game(document);
game.start();

addEventListener('keydown', (event: KeyboardEvent) => {
  switch(event.key) {
    case ' ':
      game.launch();
      return;
    case 'W':
    case 'w':
      game.increaseAngle();
      return;
    case 'S':
    case 's':
      game.decreaseAngle();
      return;
    case 'A':
    case 'a':
      game.increaseVelocity();
      return;
    case 'D':
    case 'd':
      game.decreaseVelocity();
      return;
    default:
      // TODO: show controls
      console.log(`no handler for '${event.key}' key`);
      return;
  }
});
