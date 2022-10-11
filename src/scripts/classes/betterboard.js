import { playSnakeEatingSound } from "../sound";
import { directionEnum } from "../utils";
import { Snake } from "./snake";

// TODO
// Make audio when snake eats work DONE
// Highscore and current score feature DONW
// Handle self collision DONE
// start a new game DONE
// Create the title screen
// Manage themes
// Refactor classes and styles of element

export class BetterBoard {
  constructor(
    rows,
    cols,
    boardSelector,
    scoreSelector,
    gameoverSelector,
    food
  ) {
    this.rows = rows;
    this.cols = cols;
    this.boxes = [];
    this.boardSelector = boardSelector;
    this.scoreSelector = scoreSelector;
    this.gameoverSelector = gameoverSelector;
    this.snake = new Snake();
    this.food = food;
    this.score = 0;
    this.playing = true;
    this.selectElements();
    this.input();
    this.init();
  }

  selectElements() {
    this.board = document.querySelector(this.boardSelector);
    this.scoreElement = document.querySelector(this.scoreSelector);
    this.gameOverElement = document.querySelector(this.gameoverSelector);
  }

  update() {
    // Updating stuff here
    if (!this.playing) return;
    this.changedDirection = false;
    this.snake.foodPosition = this.food.getFood;
    this.snake.move();
    this.checkCollision();
  }

  reset() {
    this.clearBoard();
    this.playing = true;
    delete this.snake;
    this.snake = new Snake();
    this.gameOverElement.innerText = "";
    this.score = 0;
    this.update();
    this.draw();
  }

  updateScore() {
    this.scoreElement.innerText = `Score: ${
      this.score
    } (Best: ${this.getBestScore()})`;
  }

  getBestScore() {
    if (!localStorage.getItem("best_score")) return 0;
    return parseInt(localStorage.getItem("best_score"));
  }

  checkBestScore() {
    if (this.scoreNum > this.getBestScore()) {
      localStorage.setItem("best_score", this.scoreNum.toString());
    }
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
    if (!this.playing) return;
    this.clearBoard();
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
      playSnakeEatingSound();
      this.score++;
      this.updateScore();
      this.snake.removeFoodCollision();
      this.snake.foodPosition = this.food.getFood;
    }
    if (this.snake.selfCollision) {
      this.gameOverElement.innerText = `Game Over! Press any key to start a new game.`;
      this.playing = false;
      this.gameoverCooldown = true;
      setInterval(() => (this.gameoverCooldown = false), 1000); //set gameoverCooldown to true for 1s, to avoid accidental restarts
    }
  }

  clearBoard() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.boxes[j][i].style.backgroundColor = "red";
      }
    }
  }

  init() {
    for (let i = 0; i < this.rows; i++) {
      this.boxes[i] = [];
      for (let j = 0; j < this.cols; j++) {
        let div = document.createElement("div");
        div.classList.add("visible");
        this.board.appendChild(div);
        this.boxes[i].push(div);
      }
    }
    this.updateScore();
  }

  input() {
    window.addEventListener("keydown", (e) => {
      const key = e.key;
      if (!this.playing && !this.gameoverCooldown && !this.paused) {
        this.reset();
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
