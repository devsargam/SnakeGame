import { playButtonClickSound, playSnakeEatingSound } from "../sound";
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
    // Imported from other fiiles
    this.themes = themes;
    this.difficulties = difficulties;
    this.selectElements();
    this.input();
    this.init();
  }

  selectElements() {
    this.board = document.querySelector("#board");
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
    const theme = e.target.options[e.target.selectedIndex].text;
    this.bgcolor = this.themes[theme]["bg"];
    this.snakeColor = this.themes[theme]["snake"];
    this.foodColor = this.themes[theme]["food"];
    this.selectElems.forEach((element) => {
      element.style.backgroundColor = this.themes[theme]["bg"];
      element.style.color = this.themes[theme]["snake"];
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
    this.boxes[foodPos.y][foodPos.x].style.backgroundColor = this.foodColor;
  }

  drawSnake() {
    for (let box of this.snake.getSnakeBody) {
      this.boxes[box.y][box.x].style.backgroundColor = this.snakeColor;
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
      this.gameOverElement.innerText = `Game Over! Press any key to start a new game.`;
      this.playing = false;
      this.gameoverCooldown = true;
      // Avoids accidental presses
      setInterval(() => (this.gameoverCooldown = false), 1000);
    }
  }

  handleAudio() {
    this.audioButton.addEventListener("click", () => {
      this.soundOn = !this.soundOn;
    });
  }

  clearBoard() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.boxes[j][i].style.backgroundColor = this.bgcolor;
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
    this.setupTheme();
    this.setupDifficulty();
    this.themeselect.addEventListener("change", this.selectTheme.bind(this));
    this.difficultySelect.addEventListener(
      "change",
      this.selectDifficulty.bind(this)
    );
    this.toggleButton.addEventListener("click", this.handleToggle.bind(this));
    this.handleAudio();

    this.audioButton.checked = true;
    this.leaderScore.innerText = this.getBestScore();
    this.snakeColor = this.themes["dracula"]["snake"];
    this.foodColor = this.themes["dracula"]["food"];
    this.bgcolor = this.themes["dracula"]["bg"];
    this.selectElems.forEach((element) => {
      element.style.backgroundColor = this.themes["dracula"]["bg"];
      element.style.color = this.themes["dracula"]["snake"];
    });
  }

  pauseGame() {
    this.toggleOverlay();
    this.playing = false;
    this.paused = true;
  }

  resumeGame() {
    this.toggleOverlay();
    this.playing = true;
    this.paused = false;
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
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.UP;
          this.currDir = "UP";
          break;

        case "ArrowLeft":
        case "a":
          if (this.currDir === "RIGHT" || this.changedDirection) return;
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.LEFT;
          this.currDir = "LEFT";
          break;

        case "ArrowDown":
        case "s":
          if (this.currDir === "UP" || this.changedDirection) return;
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.DOWN;
          this.currDir = "DOWN";
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

  handleToggle(e) {
    if (e.target.innerHTML === "Start") {
      this.toggleOverlay();
      this.overlayHead.innerHTML = "Press Resume to Play";
      e.target.innerHTML = "Resume";
    } else {
      this.resumeGame();
    }
  }
}
