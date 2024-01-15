import * as PIXI from 'pixi.js';
import * as navigate from "./navigate";
import Game from './Game';

// dom element to attach to
const root = document.body;

export const app = new PIXI.Application({
  width: root.clientWidth,
  height: root.clientHeight,
});


// TODO: remove ts-ignore
// @ts-ignore
root.appendChild(app.view);

navigate.start();
