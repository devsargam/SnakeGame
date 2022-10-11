import { BetterBoard } from "./classes/betterboard";
import { Food } from "./classes/food";

let now;
let then = Date.now();
let delta;

const food = new Food();
const board = new BetterBoard(30, 30, food);

function gameLoop() {
  requestAnimationFrame(gameLoop);

  let interval = 1000 / board.fps;

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);

    board.update();
    board.draw();
  }
}

requestAnimationFrame(gameLoop);
