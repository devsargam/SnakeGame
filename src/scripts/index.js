import { BetterBoard } from "./classes/betterboard";
import { Snake } from "./classes/snake";
import { Food } from "./classes/food";

let fps = 10;
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;

const snake = new Snake();
const food = new Food();
const board = new BetterBoard(
  30,
  30,
  "#board",
  "#score",
  "#gameover",
  snake,
  food
);

function gameLoop() {
  requestAnimationFrame(gameLoop);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);

    board.update();
    board.draw();
  }
}

requestAnimationFrame(gameLoop);
