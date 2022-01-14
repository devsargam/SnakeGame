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
    this.prevHead = {
      x: null,
      y: null,
    };
    this.dir = [0, 0];
    this.currDir = null;
    this.scoreNum = 0;
  }

  getRandomFood() {
    this.food = {
      x: randRange(0, 29),
      y: randRange(0, 29),
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
        if (this.snakeBody[0].x === i && this.snakeBody[0].y === j) {
          div.style.backgroundColor = "red";
        }
        if (this.food.x === i && this.food.y === j) {
          div.style.backgroundColor = "blue";
        }
        this.board.appendChild(div);
        this.boxes[i].push(div);
      }
    }
  }

  move() {
    const loop = setInterval(() => {
      const [xPos, yPos] = this.dir;
      this.prevHead.x = this.currHead.x;
      this.prevHead.y = this.currHead.y;
      this.currHead.y += yPos;
      this.currHead.x += xPos;
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

  collision() {
    if (this.currHead.x === this.food.x && this.currHead.y === this.food.y) {
      this.getRandomFood();
      this.boxes[this.food.x][this.food.y].style.backgroundColor = "blue";
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
        (box) => (this.boxes[box.x][box.y].style.backgroundColor = "red")
      );
    } catch (e) {
      console.log(e);
      console.log(this.prevHead);
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
