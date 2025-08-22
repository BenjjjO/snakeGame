const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // grid size
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";
let food = randomFood();
let score = 0;
let game;

// Resize canvas for mobile screens
function resizeCanvas() {
  const size = Math.min(window.innerWidth, window.innerHeight) - 40;
  canvas.width = size - (size % box);
  canvas.height = size - (size % box);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

canvas.addEventListener("touchend", e => {
  const touch = e.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
    else if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (dy > 0 && direction !== "UP") direction = "DOWN";
    else if (dy < 0 && direction !== "DOWN") direction = "UP";
  }
}, { passive: true });

// Optional: support keyboard arrows (desktop)
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function drawGame() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, i) => {
    ctx.fillStyle = i === 0 ? "#0f0" : "#fff";
    ctx.fillRect(segment.x, segment.y, box, box);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(segment.x, segment.y, box, box);
  });

  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    food = randomFood();
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 || snakeY < 0 ||
    snakeX >= canvas.width || snakeY >= canvas.height ||
    snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
  ) {
    clearInterval(game);
    gameOver();
    return;
  }

  snake.unshift(newHead);
}

function randomFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
  } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
  return newFood;
}

function gameOver() {
  document.getElementById("final-score").innerText = "Final Score: " + score;
  document.getElementById("game-over").style.display = "block";
}

// Restart button
document.getElementById("restart-btn").addEventListener("click", () => {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("game-over").style.display = "none";
  food = randomFood();
  clearInterval(game);
  game = setInterval(drawGame, 120);
});

// Start game loop
game = setInterval(drawGame, 120);
