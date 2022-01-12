class Board {
  constructor(rows, cols, selector) {
    this.rows = rows;
    this.cols = cols;
    this.boxes = [];
    this.board = document.querySelector(selector);
    this.currHead = {
      x: 0,
      y: 0,
    };
    this.prevHead = {
      x: null,
      y: null,
    };
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
        div.innerHTML = `${i} ${j}`;
        div.style.fontSize = "10px";
        this.board.appendChild(div);
        this.boxes[i].push(div);
      }
    }
    console.log(JSON.stringify(this.boxes));
  }

  move() {
    setInterval(() => {
      if (this.currHead.x >= this.boxes.length - 1) {
        this.currHead.x = -1;
        this.currHead.y += 1;
        console.log("yes");
      }
      if (this.currHead.y >= this.boxes.length - 1) {
        this.currHead.x = 0;
        console.log(this.currHead);
      }
      this.currHead.x += 1;
      this.boxes[this.currHead.x][this.currHead.y].style.backgroundColor =
        "red";
    }, 1000 / 15);
  }
}

const board = new Board(10, 10, "#board");
board.init();
// board.move();
