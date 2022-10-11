import foodAudio from "..//..//assets/audio/food.mp3";
import button_click from "..//..//assets/audio/buttonClick.mp3";

const buttonSound = new Audio(button_click);
const foodSound = new Audio(foodAudio);

export const playButtonClickSound = () => {
  buttonSound.play();
};

export const playSnakeEatingSound = () => {
  foodSound.play();
};
