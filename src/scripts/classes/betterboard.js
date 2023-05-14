import {
  playButtonClickSound,
  playSnakeEatingSound,
  playGameOverSound,
  playMoveSound,
} from "../sound";
import { direction, directionEnum } from "../utils";
import { Snake } from "./snake";
import { difficulties } from "../difficulty";
import { themes } from "../themes";

export class BetterBoard {
  constructor(rows, cols, food) {
    this.food = food;
    this.rows = rows;
    this.cols = cols;

    this.snake = new Snake();
    this.fps = 10;
    this.currDir = "RIGHT";
    this.boxes = [];
    this.score = 0;
    this.playing = true;
    this.soundOn = true;
    this.paused = false;
    // Imported from other files
    this.themes = themes;
    this.difficulties = difficulties;
    this.selectElements();
    this.input();
    this.init();
  }

  selectElements() {
    this.modal = document.querySelector(".modal");
    this.canvas = document.querySelector("#board");
    this.ctx = this.canvas.getContext("2d");
    this.scoreElement = document.querySelector("#score");
    this.bestscoreElement = document.querySelector("#best-score");
    this.themeselect = document.querySelector("#theme");
    this.difficultySelect = document.querySelector("#difficulty");
    this.overlay = document.querySelector("#overlay");
    this.toggleButton = document.querySelector("#toggleButton");
    this.leaderScore = document.querySelector("#leader__score");
    this.overlayHead = document.querySelector("#overlay__head");
    this.selectElems = document.querySelectorAll(".option select");
    this.audioButton = document.querySelector("#audio");
    this.CButton = document.querySelector("#ControlButton");
    this.OButton = document.querySelector("#ObjectiveButton");
    this.Coverlay = document.querySelector("#overlay_control");
    this.Ooverlay = document.querySelector("#overlay_objective");
    this.m1Button = document.querySelector("#MainButton1");
    this.m2Button = document.querySelector("#MainButton2");
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
    this.selectedTheme =
      this.themes[e.target.options[e.target.selectedIndex].text];
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
    this.modal.style.display = "none";
    this.snake = new Snake();
    this.score = 0;
    this.update();
    this.draw();
  }

  updateScore() {
    this.checkBestScore();
    this.scoreElement.innerText = `Score: ${this.score}`;
    this.bestscoreElement.innerText = `Best: ${this.getBestScore()}`;
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
    this.ctx.strokeStyle = "black";
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
      this.modal.style.display = "inline";
      this.playing = false;
      this.gameoverCooldown = true;
      // Avoids accidental presses
      setInterval(() => (this.gameoverCooldown = false), 1000);
    }
  }

  clearBoard() {
    this.ctx.clearRect(0, 0, 600, 600);

    for (let i = 0; i < 30; i++)
      for (let j = 0; j < 30; j++) {
        this.drawSquare(i, j, this.bgColor, 0.2);
      }
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
    this.CButton.addEventListener("click", this.handleToggleControl.bind(this));
    this.OButton.addEventListener(
      "click",
      this.handleToggleObjective.bind(this)
    );
    this.m1Button.addEventListener("click", this.handleToggleMain.bind(this));
    this.m2Button.addEventListener("click", this.handleToggleMain.bind(this));
  }

  initDom() {
    this.addEventListeners();
    this.updateScore();
    this.setupTheme();
    this.setupDifficulty();

    this.audioButton.checked = true;
    this.leaderScore.innerText = this.getBestScore();
    this.snakeColor = this.themes["Dracula"]["snake"];
    this.foodColor = this.themes["Dracula"]["food"];
    this.bgColor = this.themes["Dracula"]["bg"];
    this.selectElems.forEach((element) => {
      element.style.backgroundColor = this.themes["Dracula"]["bg"];
      element.style.color = this.themes["Dracula"]["snake"];
    });
  }

  toggleOverlay() {
    if (this.soundOn) {
      playButtonClickSound();
    }
    this.overlay.classList.toggle("visible");
    this.overlay.style.visibility = "visible";
    this.Ooverlay.style.visibility = "hidden";
    this.Coverlay.style.visibility = "hidden";
  }

  input() {
    window.addEventListener("keydown", (e) => {
      const key = e.key;
      if (!this.playing && !this.gameoverCooldown && !this.paused) {
        this.reset();
      }
      if (this.changedDirection) return;
      console.log(this.currDir);
      switch (key) {
        case "w":
        case "ArrowUp":
          if (this.currDir === direction.DOWN) return;
          if (this.soundOn) playMoveSound();
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.UP;
          this.currDir = direction.UP;
          break;

        case "ArrowLeft":
        case "a":
          if (this.currDir === direction.RIGHT) return;
          if (this.soundOn) playMoveSound();
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.LEFT;
          this.currDir = direction.LEFT;
          break;

        case "ArrowDown":
        case "s":
          if (this.currDir === direction.UP) return;
          if (this.soundOn) playMoveSound();
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.DOWN;
          this.currDir = direction.DOWN;
          break;

        case "ArrowRight":
        case "d":
          if (this.currDir === direction.LEFT) return;
          if (this.soundOn) playMoveSound();
          this.changedDirection = true;
          this.snake.changeVelocity = directionEnum.RIGHT;
          this.currDir = direction.RIGHT;
          break;

        case "Escape":
          this.paused = !this.paused;
          if (this.playing) {
            this.paused = true;
          } else {
            this.paused = false;
          }
          this.playing = !this.playing;
          this.toggleOverlay();
          this.toggleButton.innerText = "Resume";
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

  toggleOverlayControl() {
    if (this.soundOn) {
      playButtonClickSound();
    }
    this.Coverlay.classList.toggle("visible");
    this.Coverlay.style.visibility = "visible";
    this.overlay.style.visibility = "hidden";
    this.Ooverlay.style.visibility = "hidden";
  }

  toggleOverlayObjective() {
    if (this.soundOn) {
      playButtonClickSound();
    }
    this.Ooverlay.classList.toggle("visible");
    this.Ooverlay.style.visibility = "visible";
    this.overlay.style.visibility = "hidden";
    this.Coverlay.style.visibility = "hidden";
  }

  handleToggleObjective() {
    this.paused = false;
    this.playing = true;
    this.toggleOverlayObjective();
  }

  handleToggleControl() {
    this.paused = false;
    this.playing = true;
    this.toggleOverlayControl();
  }

  handleToggleMain() {
    this.playing = true;
    this.toggleOverlay();
  }
}
