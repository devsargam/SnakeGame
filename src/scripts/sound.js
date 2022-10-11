import foodAudio from "..//..//assets/audio/food.mp3";
import button_click from "..//..//assets/audio/buttonClick.mp3";
import gameOverAudio from "..//..//assets/audio/gameover.mp3";
import moveAudio from "..//..//assets/audio/move.mp3";

const buttonSound = new Audio(button_click);
const foodSound = new Audio(foodAudio);
const gameOverSound = new Audio(gameOverAudio);
const moveSound = new Audio(moveAudio);

export const playButtonClickSound = () => {
  buttonSound.play();
};

export const playSnakeEatingSound = () => {
  foodSound.play();
};

export const playGameOverSound = () => {
  gameOverSound.play();
};

export const playMoveSound = () => {
  moveSound.play();
};
