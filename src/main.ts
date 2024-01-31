import * as PIXI from 'pixi.js';
import GameController from './GameController';

const root = document.body;
const scoreKey = 'score';

const app = new PIXI.Application({
  resizeTo: document.body
});

const scoreBoard = new PIXI.Text('0', {
     fontFamily: 'Arial',
     fontSize: 24,
     fill: 0x000000,
     align: 'center',
 });

let score = Number(window.localStorage.getItem(scoreKey));
if(!score)
  score = 0;
let missCount = 0;

scoreBoard.text = score.toString();

// TODO: remove ts-ignore
// @ts-ignore
root.appendChild(app.view);

const gameController = new GameController(app, (hit: boolean) => {
  //TODO: show popup
  if(hit) {
    console.log('hit');
    missCount = 0;
    score++;
  } else {
    console.log('miss');
    missCount++;
    score--;
  }
  if(missCount > 4) {
    window.alert("hint: force projectile is proportional to distance between projectile and pointer");
    missCount = 0;
  }

  if(score < 0) score = 0;
  const scoreText = score.toString();
  window.localStorage.setItem(scoreKey, scoreText);
  scoreBoard.text = scoreText;
  gameController.loadLevel();
});

app.stage.addChild(gameController.init());
app.stage.addChild(scoreBoard);

window.addEventListener('resize', () => {
  gameController.resize()
});
