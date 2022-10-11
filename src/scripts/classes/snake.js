import { randRange } from "../utils";

export class Snake {
  constructor() {
    this.head = {
      x: randRange(0, 29),
      y: randRange(0, 29),
    };
    // Prevent head from mutating
    this.body = [structuredClone(this.head)];
    // TODO: FIX VELOCITY BUG FOR SELF COLLISION
    this.velocity = {
      x: 1,
      y: 0,
    };
    this.snakeCollidedWithItself = false;
    this.snakeCollidedWithFood = false;
  }

  hasVelocity() {
    return !!(this.velocity.x || this.velocity.y);
  }

  increaseHead() {
    const { x, y } = this.velocity;
    this.head.x += x;
    this.head.y += y;
    if (this.head.x > 30 - 1) this.head.x = 0;
    if (this.head.x < 0) this.head.x = 30 - 1;
    if (this.head.y > 30 - 1) this.head.y = 0;
    if (this.head.y < 0) this.head.y = 30 - 1;
  }

  snakeGrow() {
    if (this.hasVelocity()) {
      this.body.unshift(structuredClone(this.head));
      if (this.snakeCollidedWithFood) return;
      if (this.body.length < 4) return;
      this.body.pop();
    }
  }

  // Must be inside the game loop
  move() {
    this.increaseHead();
    this.checkSelfCollision();
    this.checkCollisionWithFood();
    this.snakeGrow();
  }

  set foodPosition(food) {
    this.food = food;
  }

  set changeVelocity(newVelocity) {
    this.velocity = newVelocity;
  }

  checkCollisionWithFood() {
    if (this.head.x === this.food.x && this.head.y === this.food.y) {
      this.snakeCollidedWithFood = true;
    }
  }

  checkSelfCollision() {
    if (this.body.some((box) => box.x === this.head.x && box.y === this.head.y))
      this.snakeCollidedWithItself = true;
  }

  containsFood(food) {
    return this.body.some((box) => box.x === food.x && box.y === food.y);
  }

  get foodCollision() {
    return this.snakeCollidedWithFood;
  }

  get selfCollision() {
    return this.snakeCollidedWithItself;
  }

  removeFoodCollision() {
    this.snakeCollidedWithFood = false;
  }

  removeSelfCollision() {
    this.snakeCollidedWithItself = false;
  }

  get getSnakeBody() {
    return this.body;
  }
}
