import { directionEnum } from "../utils";

export class BetterBoard {
  constructor(
    rows,
    cols,
    boardSelector,
    scoreSelector,
    gameoverSelector,
    snake,
    food
  ) {
    this.rows = rows;
    this.cols = cols;
    this.boxes = [];
    this.boardSelector = boardSelector;
    this.scoreSelector = scoreSelector;
    this.gameoverSelector = gameoverSelector;
    this.snake = snake;
    this.food = food;
    this.input();
    this.init();
    console.log(this.snake.getSnakeBody);
  }

  update() {
    // Updating stuff here
    this.changedDirection = false;
    this.snake.foodPosition = this.food.getFood;
    this.snake.move();
    this.checkCollision();
  }

  drawFood() {
    const foodPos = this.food.getFood;
    this.boxes[foodPos.y][foodPos.x].style.backgroundColor = "yellow";
  }

  drawSnake() {
    for (let box of this.snake.getSnakeBody) {
      this.boxes[box.y][box.x].style.backgroundColor = "black";
    }
  }

  draw() {
    // Drawing stuff here
    this.cleanBoard();
    this.drawSnake();
    this.drawFood();
  }

  checkCollision() {
    if (this.snake.foodCollision) {
      this.food.randomFood();
      if (this.snake.containsFood(this.food.getFood)) {
        // Recursively calls itself if food lies inside snake's body
        this.checkCollision();
      }
      this.snake.removeFoodCollision();
      this.snake.foodPosition = this.food.getFood;
    }
    if (this.snake.selfCollision) {
      console.log("collision snake collided with itself");
    }
  }

  cleanBoard() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.boxes[j][i].style.backgroundColor = "red";
      }
    }
  }

  init() {
    this.board = document.querySelector(this.boardSelector);
    for (let i = 0; i < this.rows; i++) {
      this.boxes[i] = [];
      for (let j = 0; j < this.cols; j++) {
        let div = document.createElement("div");
        div.classList.add("visible");
        this.board.appendChild(div);
        this.boxes[i].push(div);
      }
    }
  }

  input() {
    window.addEventListener("keydown", (e) => {
      const key = e.key;
      if (!this.playing && !this.gameoverCooldown && !this.paused) {
        //restart the game on key press
        // this.reset();
        // this.move();
      }
      switch (key) {
        case "w":
        case "ArrowUp":
          if (this.currDir === "DOWN" || this.changedDirection) return;
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.UP;
          this.currDir = "UP";
          console.log(this.currDir);
          break;
        case "ArrowLeft":
        case "a":
          if (this.currDir === "RIGHT" || this.changedDirection) return;
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.LEFT;
          this.currDir = "LEFT";
          console.log(this.currDir);

          break;
        case "ArrowDown":
        case "s":
          if (this.currDir === "UP" || this.changedDirection) return;
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.DOWN;
          this.currDir = "DOWN";
          console.log(this.currDir);
          break;
        case "ArrowRight":
        case "d":
          if (this.currDir === "LEFT" || this.changedDirection) return;
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.RIGHT;
          this.currDir = "RIGHT";
          console.log(this.currDir);
          break;
        case "Escape":
          if (this.playing) {
            this.pauseGame();
          } else {
            this.resumeGame();
          }
          break;
      }
    });
  }
}
