const boardSize = 4;
let board = [];
let gameActive = false;

const imageMap = {
  2: "2.png",
  4: "4.png",
  8: "8.png",
  16: "16.png",
  32: "32.png",
  64: "64.png",
  128: "128.png",
  256: "256.png",
  512: "512.png",
  1024: "1024.png",
  2048: "2048.png",
};

const gameBoard = document.getElementById("gameBoard");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

function initBoard() {
  board = Array.from({ length: boardSize }, () =>
    Array(boardSize).fill(0)
  );
  addRandomTile();
  addRandomTile();
  gameActive = true;
  message.textContent = "";
  renderBoard();
}

function renderBoard() {
  gameBoard.innerHTML = "";
  board.flat().forEach(value => {
    const tile = document.createElement("div");
    tile.className = "tile";

    if (value !== 0) {
      const img = document.createElement("img");
      img.src = imageMap[value];
      tile.appendChild(img);
    }

    gameBoard.appendChild(tile);
  });
}

function addRandomTile() {
  let empty = [];
  board.forEach((row, r) =>
    row.forEach((val, c) => {
      if (val === 0) empty.push({ r, c });
    })
  );

  if (!empty.length) return;

  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = 2;
}

function slide(row) {
  row = row.filter(val => val);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;

      if (row[i] === 2048) {
        message.textContent = "🎉 You Win!";
        gameActive = false;
      }

      row[i + 1] = 0;
    }
  }

  row = row.filter(val => val);
  while (row.length < boardSize) row.push(0);
  return row;
}

function rotate(times) {
  for (let t = 0; t < times; t++) {
    board = board[0].map((_, i) =>
      board.map(row => row[i]).reverse()
    );
  }
}

function move(direction) {
  if (!gameActive) return;

  rotate(direction);
  board = board.map(row => slide(row));
  rotate((4 - direction) % 4);

  addRandomTile();
  renderBoard();
  checkGameOver();
}

function checkGameOver() {
  if (board.flat().includes(0)) return;

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (
        (board[r][c] === board[r]?.[c + 1]) ||
        (board[r][c] === board[r + 1]?.[c])
      ) return;
    }
  }

  message.textContent = "💀 Game Over!";
  gameActive = false;
}

/* Keyboard Controls (PC) */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") move(0);
  if (e.key === "ArrowUp") move(1);
  if (e.key === "ArrowRight") move(2);
  if (e.key === "ArrowDown") move(3);
});

/* Swipe Controls (Mobile) */
let startX, startY;

gameBoard.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

gameBoard.addEventListener("touchend", e => {
  const touch = e.changedTouches[0];
  let dx = touch.clientX - startX;
  let dy = touch.clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    dx > 30 ? move(2) : move(0);
  } else {
    dy > 30 ? move(3) : move(1);
  }
});

/* Buttons */
startBtn.addEventListener("click", initBoard);
restartBtn.addEventListener("click", initBoard);

