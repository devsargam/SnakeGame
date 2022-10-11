import eating_sound1 from "..//../assets/audio/foodNoise0.mp3";
import eating_sound2 from "..//..//assets/audio/foodNoise1.mp3";
import eating_sound3 from "..//..//assets/audio/foodNoise2.mp3";
import button_click from "..//..//assets/audio/buttonClick.mp3";
import { randomElementFromArray } from "./utils";

const foodSounds = [
  new Audio(eating_sound1),
  new Audio(eating_sound2),
  new Audio(eating_sound3),
];

const buttonSound = new Audio(button_click);

export const playButtonClickSound = () => {
  buttonSound.play();
};

export const playSnakeEatingSound = () => {
  randomElementFromArray(foodSounds).play();
};
