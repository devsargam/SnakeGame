class Board {
  constructor(rows, cols, selector) {
    this.rows = rows;
    this.cols = cols;
    this.boxes = [];
    this.board = document.querySelector(selector);
    this.currHead = {
      x: 5,
      y: 5,
    };
    this.prevHead = {
      x: null,
      y: null,
    };
    this.dir = [0, 0];
  }

  init() {
    for (let i = 0; i < this.rows; i++) {
      this.boxes[i] = [];
      for (let j = 0; j < this.cols; j++) {
        let div = document.createElement("div");
        div.classList.add("visible");
        if (this.currHead.x === i && this.currHead.y === j) {
          div.style.backgroundColor = "red";
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
      // this.currHead.x += 1;
      this.update(loop);
    }, 1000 / 10);
  }

  update() {
    try {
      this.boxes[this.prevHead.x][this.prevHead.y].style.backgroundColor =
        "pink";
      this.boxes[this.currHead.x][this.currHead.y].style.backgroundColor =
        "red";
    } catch (error) {
      console.log("Game Over bro");
    }
  }

  input() {
    window.addEventListener("keydown", (e) => {
      const key = e.key;
      switch (key) {
        case "w":
        case "ArrowUp":
          console.log("UP");
          this.dir = [-1, 0];
          this.update();
          break;
        case "ArrowLeft":
        case "a":
          console.log("LEFT");
          this.dir = [0, -1];
          this.update();

          break;
        case "ArrowDown":
        case "s":
          this.dir = [1, 0];
          console.log("DOWN");
          this.update();
          break;
        case "ArrowRight":
        case "d":
          console.log("RIGHT");
          this.dir = [0, 1];
          this.update();
          break;
      }
    });
  }
}

const board = new Board(30, 30, "#board");
board.init();
board.move();
board.input();
