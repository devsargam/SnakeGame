const randRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

class Board {

  constructor(rows, cols, boardSelector, scoreSelector, gameoverSelector) {
    this.rows = rows;
    this.cols = cols;
    this.boxes = [];
    this.board = document.querySelector(boardSelector);
    this.gameover = document.querySelector(gameoverSelector);
    this.score = document.querySelector(scoreSelector);
    this.themeselect = document.querySelector("#theme")
    this.reset()
    this.foodSounds = [new Audio("./assets/audio/foodNoise0.mp3"),
                      new Audio("./assets/audio/foodNoise1.mp3"),
                      new Audio("./assets/audio/foodNoise2.mp3")];
    this.gameoverCooldown = false

    this.themes = {
      "pink":{
        "bg": "pink",
        "food": "red",
        "snake": "black"
      },
      "classic":{
        "bg": "#33cc33",
        "food": "#8c8c8c",
        "snake": "black"
      },
      "dracula":{
        "bg": "#282a36",
        "food": "#6272a4",
        "snake": "#f8f8f2"
      }
    }
    Object.keys(this.themes).forEach(theme => {
      var opt = document.createElement('option');
      opt.value = theme
      opt.innerHTML = theme
      this.themeselect.appendChild(opt)
    });
    this.themeselect.addEventListener("change", this.selectTheme)
  }

  selectTheme = (e) => {//defined as an arrow function because the scope will channge otherwise, preventing access to `this`
    const theme = e.target.options[e.target.selectedIndex].text
    this.bgcolor = this.themes[theme]['bg']
    this.snakeColor = this.themes[theme]['snake']
    this.foodColor = this.themes[theme]['food']
    this.drawboard()

  }

  updateScoreText() {
    this.score.innerText = `Score: ${this.scoreNum} (Best: ${this.getBestScore()})`;
  }

  getBestScore() {
    if (localStorage.getItem('best_score'))
      return parseInt(localStorage.getItem('best_score'));
    return 0;
  }

  checkBestScore() {
    if (this.scoreNum > this.getBestScore())
      localStorage.setItem('best_score', this.scoreNum.toString());
  }

  getRandomFood() {
    this.food = {
      x: randRange(3, 26),
      y: randRange(3, 26),
    };
    if (
      this.snakeBody.some(
        (box) => box.x === this.food.x && box.y === this.food.y
      )
    ) {
      this.getRandomFood();
    }
  }

  reset(){//reset the board for a new game
    
    this.snakeBody?.forEach(//reset the color of the old snake's squares
      (box) =>
        (this.boxes[box.x][box.y].style.backgroundColor = this.bgcolor));
    this.currHead = {//reset head
      x: randRange(0, 29),
      y: randRange(0, 29),
    };
    this.snakeBody = [//reset snake body
      {
        x: this.currHead.x,
        y: this.currHead.y,
      },
    ];
    this.dir = [0, 0];
    this.currDir = null;
    this.scoreNum = 0;
    this.updateScoreText();
    this.gameover.innerText= "";
    this.playing = true;
  }
 
  init() {
    this.snakeBody = [
      {
        x: this.currHead.x,
        y: this.currHead.y,
      },
    ];
    this.snakeColor = this.themes["pink"]["snake"];
    this.foodColor =  this.themes["pink"]["food"];
    this.bgcolor = this.themes["pink"]["bg"];
    this.getRandomFood();
    this.updateScoreText();
    for (let i = 0; i < this.rows; i++) {
      this.boxes[i] = [];
      for (let j = 0; j < this.cols; j++) {
        let div = document.createElement("div");
        div.classList.add("visible");
        this.board.appendChild(div);
        this.boxes[i].push(div);
      }
    }
    this.drawboard()
  }

  drawboard(){
    this.boxes.forEach(boxrow => {
      boxrow.forEach(box => {
        box.style.backgroundColor = this.bgcolor;
      });
    });
    this.snakeBody?.forEach(//reset the color of the old snake's squares
    (box) =>
      (this.boxes[box.x][box.y].style.backgroundColor = this.snakeColor));
    
      this.boxes[this.food.x][this.food.y].style.backgroundColor = this.foodColor
  }
  move() {
    const loop = setInterval(() => {//store loop in class so we can clear it later
      const [xPos, yPos] = this.dir;
      this.currHead.y += yPos;
      this.currHead.x += xPos;
      if (xPos || yPos) {
        this.selfCollision();
      }
      if (this.currHead.x > this.rows - 1) this.currHead.x = 0;
      if (this.currHead.x < 0) this.currHead.x = this.rows - 1;
      if (this.currHead.y > this.cols - 1) this.currHead.y = 0;
      if (this.currHead.y < 0) this.currHead.y = this.cols - 1;
      if (xPos || yPos) {
        this.snakeBody.unshift({ x: this.currHead.x, y: this.currHead.y });
      }
      this.collision();
      this.update(loop);
    }, 1000 / 10);
  }

  selfCollision() {
    const result = this.snakeBody.some(
      (box) => box.x === this.currHead.x && box.y === this.currHead.y
    );
    if (result) {
      console.log("Collisoin");
      this.playing = false;
      this.gameover.innerText = `Game Over! Press any key to start a new game.`;
      this.gameoverCooldown = true;
      setInterval(() => this.gameoverCooldown = false, 1000)//set gameoverCooldown to true for 1s, to avoid accidental restarts
    } else {
      console.log("nope");
    }
  }

  playRandomSound() {
    this.foodSounds[Math.floor(Math.random() * this.foodSounds.length)].play();
  }

  collision() {
    if (this.currHead.x === this.food.x && this.currHead.y === this.food.y) {
      this.playRandomSound();
      this.getRandomFood();
      this.boxes[this.food.x][this.food.y].style.backgroundColor =
        this.foodColor;
      this.scoreNum++;
      this.checkBestScore();
      this.updateScoreText();
    } else {
      if (this.dir[0] || this.dir[1]) {
        this.removed = this.snakeBody.pop();
        this.boxes[this.removed.x][this.removed.y].style.backgroundColor =
          this.bgcolor;
      }
    }
  }

  update(loop) {
    try {
      if(!this.playing){//it's game over!
        clearInterval(loop);
        return
      }
      this.snakeBody.forEach(
        (box) =>
          (this.boxes[box.x][box.y].style.backgroundColor = this.snakeColor)
      );
    } catch (e) {
      console.log(e);
    }
  }

  input() {
    window.addEventListener("keydown", (e) => {
      const key = e.key;
      if(!this.playing && !this.gameoverCooldown)//restart the game on key press
      {
        this.reset()
        this.move()
      }
      switch (key) {
        case "w":
        case "ArrowUp":
          if (this.currDir === "DOWN") return;
          this.dir = [-1, 0];
          this.currDir = "UP";
          this.update();
          break;
        case "ArrowLeft":
        case "a":
          if (this.currDir === "RIGHT") return;
          this.dir = [0, -1];
          this.currDir = "LEFT";
          this.update();

          break;
        case "ArrowDown":
        case "s":
          if (this.currDir === "UP") return;
          this.dir = [1, 0];
          this.currDir = "DOWN";
          this.update();
          break;
        case "ArrowRight":
        case "d":
          if (this.currDir === "LEFT") return;
          this.dir = [0, 1];
          this.currDir = "RIGHT";
          this.update();
          break;
      }
    });
  }
}

const board = new Board(30, 30, "#board", "#score", "#gameover");
board.init();
board.move();
board.input();
