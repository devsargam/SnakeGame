import {
  playButtonClickSound,
  playSnakeEatingSound,
  playGameOverSound,
  playMoveSound,
} from "../sound";
import { directionEnum } from "../utils";
import { Snake } from "./snake";
import { difficulties } from "../difficulty";
import { themes } from "../themes";

export class BetterBoard {
  constructor(rows, cols, food) {
    this.fps = 10;
    this.rows = rows;
    this.cols = cols;
    this.boxes = [];
    this.snake = new Snake();
    this.food = food;
    this.score = 0;
    this.playing = true;
    this.soundOn = true;
    this.paused = false;
    // Imported from other fiiles
    this.themes = themes;
    this.difficulties = difficulties;
    this.selectElements();
    this.input();
    this.init();
  }

  selectElements() {
    this.canvas = document.querySelector("#board");
    this.ctx = this.canvas.getContext('2d');

    this.scoreElement = document.querySelector("#score");
    this.gameOverElement = document.querySelector("#gameover");
    this.themeselect = document.querySelector("#theme");
    this.difficultySelect = document.querySelector("#difficulty");
    this.overlay = document.querySelector("#overlay");
    this.toggleButton = document.querySelector("#toggleButton");
    this.leaderScore = document.querySelector("#leader__score");
    this.overlayHead = document.querySelector("#overlay__head");
    this.selectElems = document.querySelectorAll(".option select");
    this.audioButton = document.querySelector("#audio");
  }

  setupTheme() {
    Object.keys(this.themes).forEach((theme) => {
      const opt = document.createElement("option");
      opt.value = theme;
      opt.innerHTML = theme;
      this.themeselect.appendChild(opt);
    });
  }

  setupDifficulty() {
    Object.keys(this.difficulties).forEach((difficulty) => {
      const opt = document.createElement("option");
      opt.value = difficulty;
      opt.innerHTML = difficulty;
      this.difficultySelect.appendChild(opt);
    });
  }

  selectTheme(e) {
    this.selectedTheme = this.themes[e.target.options[e.target.selectedIndex].text];
    this.bgColor = this.selectedTheme["bg"];
    this.snakeColor = this.selectedTheme["snake"];
    this.foodColor = this.selectedTheme["food"];
    this.selectElems.forEach((element) => {
      element.style.backgroundColor = this.selectedTheme["bg"];
      element.style.color = this.selectedTheme["snake"];
    });
    this.draw();
  }

  selectDifficulty(e) {
    const difficultyValue = e.target.options[e.target.selectedIndex].text;
    this.fps = this.difficulties[difficultyValue];
    console.log(this.fps);
    this.playing = false;
    this.update();
    this.reset();
  }

  update() {
    if (!this.playing) return;
    // Handles accidental button presses
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
    this.checkBestScore();
    this.scoreElement.innerText = `Score: ${
      this.score
    } (Best: ${this.getBestScore()})`;
  }

  getBestScore() {
    if (!localStorage.getItem("best_score")) return 0;
    return parseInt(localStorage.getItem("best_score"));
  }

  checkBestScore() {
    if (this.score > this.getBestScore()) {
      localStorage.setItem("best_score", this.score.toString());
    }
  }

  drawSquare(x, y, color, lineWidth = 1) {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = lineWidth;
    this.ctx.fillRect(x * 20, y * 20, 20, 20);
    this.ctx.strokeRect(x * 20, y * 20, 20, 20);
  }

  drawFood() {
    this.drawSquare(this.food.getFood.x, this.food.getFood.y, this.foodColor);
  }

  drawSnake() {
    for (let box of this.snake.getSnakeBody) {
      this.drawSquare(box.x, box.y, this.snakeColor);
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
      if (this.soundOn) playSnakeEatingSound();
      this.score++;
      this.updateScore();
      this.snake.removeFoodCollision();
      this.snake.foodPosition = this.food.getFood;
    }
    if (this.snake.selfCollision) {
      if (this.soundOn) playGameOverSound();
      this.gameOverElement.innerText = `Game Over! Press any key to start a new game.`;
      this.playing = false;
      this.gameoverCooldown = true;
      // Avoids accidental presses
      setInterval(() => (this.gameoverCooldown = false), 1000);
    }
  }

  clearBoard() {
    this.ctx.clearRect(0, 0, 600, 600);

    for (let i = 0; i < 30; i++)
      for (let j = 0; j < 30; j++)
        this.drawSquare(i, j, this.bgColor, 0.2);
  }

  init() {
    this.initDom();
  }

  addEventListeners() {
    this.themeselect.addEventListener("change", this.selectTheme.bind(this));
    this.difficultySelect.addEventListener(
      "change",
      this.selectDifficulty.bind(this)
    );
    this.toggleButton.addEventListener("click", this.handleToggle.bind(this));
    this.audioButton.addEventListener("click", () => {
      this.soundOn = !this.soundOn;
      this.audioButton.checked = this.soundOn;
      console.log("clicked sound");
    });
  }

  initDom() {
    this.addEventListeners();
    this.updateScore();
    this.setupTheme();
    this.setupDifficulty();

    this.audioButton.checked = true;
    this.leaderScore.innerText = this.getBestScore();
    this.snakeColor = this.themes["dracula"]["snake"];
    this.foodColor = this.themes["dracula"]["food"];
    this.bgColor = this.themes["dracula"]["bg"];
    this.selectElems.forEach((element) => {
      element.style.backgroundColor = this.themes["dracula"]["bg"];
      element.style.color = this.themes["dracula"]["snake"];
    });
  }

  toggleOverlay() {
    if (this.soundOn) {
      playButtonClickSound();
    }
    this.overlay.classList.toggle("visible");
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
          if (this.soundOn) playMoveSound();
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.UP;
          this.currDir = "UP";
          break;

        case "ArrowLeft":
        case "a":
          if (this.currDir === "RIGHT" || this.changedDirection) return;
          if (this.soundOn) playMoveSound();
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.LEFT;
          this.currDir = "LEFT";
          break;

        case "ArrowDown":
        case "s":
          if (this.soundOn) playMoveSound();
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.DOWN;
          this.currDir = "DOWN";
          break;

        case "ArrowRight":
        case "d":
          if (this.currDir === "LEFT" || this.changedDirection) return;
          if (this.soundOn) playMoveSound();
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.RIGHT;
          this.currDir = "RIGHT";
          console.log(this.currDir);
          break;

        case "Escape":
          this.paused = !this.paused;
          if (this.playing) {
            this.paused = true;
          } else {
            this.paused = false;
          }
          this.playing = !this.playing;
          // this.playing = !this.playing;
          this.toggleOverlay();
          break;
      }
    });
  }

  handleToggle() {
    if (!this.playing) {
      this.paused = false;
    } else {
      this.playing = true;
    }
    this.playing = !this.playing;
    this.toggleOverlay();
  }
}
