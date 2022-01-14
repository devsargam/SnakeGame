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
    this.len = 0;
  }

  getRandomFood() {
    this.food = {
      x: randRange(0, 29),
      y: randRange(0, 29),
    };
  }

  init() {
    this.getRandomFood();
    this.score.innerText = `Score: ${this.len}`;
    for (let i = 0; i < this.rows; i++) {
      this.boxes[i] = [];
      for (let j = 0; j < this.cols; j++) {
        let div = document.createElement("div");
        div.classList.add("visible");
        if (this.currHead.x === i && this.currHead.y === j) {
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
      this.currHead.x += xPos;
      this.currHead.y += yPos;
      if (this.currHead.x > 29) this.currHead.x = 0;
      if (this.currHead.x < 0) this.currHead.x = 29;
      if (this.currHead.y > 29) this.currHead.y = 0;
      if (this.currHead.y < 0) this.currHead.y = 29;
      this.collision();
      this.update(loop);
    }, 1000 / 10);
  }

  collision() {
    if (this.currHead.x === this.food.x && this.currHead.y === this.food.y) {
      console.log("Collision");
      this.getRandomFood();
      this.boxes[this.food.x][this.food.y].style.backgroundColor = "blue";
      this.len++;
      this.score.innerText = `Score: ${this.len}`;
      console.log(this.len);
    }
  }

  update() {
    try {
      this.boxes[this.prevHead.x][this.prevHead.y].style.backgroundColor =
        "pink";
      this.boxes[this.currHead.x][this.currHead.y].style.backgroundColor =
        "red";
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
          this.dir = [-1, 0];
          this.update();
          break;
        case "ArrowLeft":
        case "a":
          this.dir = [0, -1];
          this.update();

          break;
        case "ArrowDown":
        case "s":
          this.dir = [1, 0];
          this.update();
          break;
        case "ArrowRight":
        case "d":
          this.dir = [0, 1];
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
