import { randRange } from "../utils";

export class Food {
  constructor() {
    this.randomFood();
  }

  randomFood() {
    this.food = {
      x: randRange(13, 15),
      y: randRange(13, 15),
    };
  }

  get getFood() {
    return structuredClone(this.food);
  }
}
