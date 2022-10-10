import { randRange } from "../utils";

export class Food {
  constructor() {
    this.randomFood();
  }

  randomFood() {
    this.food = {
      x: randRange(3, 26),
      y: randRange(3, 26),
    };
  }

  get getFood() {
    return structuredClone(this.food);
  }
}
