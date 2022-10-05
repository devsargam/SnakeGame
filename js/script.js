const randRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

class Board {
  constructor(rows, cols, boardSelector, scoreSelector) {
    this.rows = rows;
    this.cols = cols;
    this.boxes = [];
    this.board = document.querySelector(boardSelector);
    this.score = document.querySelector(scoreSelector);
    this.currHead = {
      x: randRange(0, 29),
      y: randRange(0, 29),
    };
    this.dir = [0, 0];
    this.currDir = null;
    this.scoreNum = 0;
    this.snakeColor = "black";
    this.foodColor = "red";
    this.foodSounds = [new Audio("./assets/audio/foodNoise0.mp3"),
                      new Audio("./assets/audio/foodNoise1.mp3"),
                      new Audio("./assets/audio/foodNoise2.mp3")];
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

  init() {
    this.snakeBody = [
      {
        x: this.currHead.x,
        y: this.currHead.y,
      },
    ];
    this.getRandomFood();
    this.score.innerText = `Score: ${this.scoreNum}`;
    for (let i = 0; i < this.rows; i++) {
      this.boxes[i] = [];
      for (let j = 0; j < this.cols; j++) {
        let div = document.createElement("div");
        div.classList.add("visible");
        for (const body of this.snakeBody) {
          if (body.x === i && body.y === j) {
            console.log(body);
            div.style.backgroundColor = this.snakeColor;
          }
        }
        if (this.food.x === i && this.food.y === j) {
          div.style.backgroundColor = this.foodColor;
        }
        this.board.appendChild(div);
        this.boxes[i].push(div);
      }
    }
  }

  move() {
    const loop = setInterval(() => {
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
      this.score.innerText = `Score: ${this.scoreNum}`;
    } else {
      if (this.dir[0] || this.dir[1]) {
        this.removed = this.snakeBody.pop();
        this.boxes[this.removed.x][this.removed.y].style.backgroundColor =
          "pink";
      }
    }
  }

  update() {
    try {
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

const board = new Board(30, 30, "#board", "#score");
board.init();
board.move();
board.input();
