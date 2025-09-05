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

// Keyboard arrows
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function drawGame() {
  // background
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // snake movement
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  const newHead = { x: snakeX, y: snakeY };

  // check collision
  if (
    snakeX < 0 || snakeY < 0 ||
    snakeX >= canvas.width || snakeY >= canvas.height ||
    snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
  ) {
    clearInterval(game);
    gameOver();
    return;
  }

  // add new head
  snake.unshift(newHead);

  // eat food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    food = randomFood();
  } else {
    snake.pop();
  }

  // draw snake
  snake.forEach((segment, i) => {
    ctx.beginPath();
    ctx.fillStyle = i === 0 ? "#0f0" : "#0c0"; // head brighter
    ctx.arc(
      segment.x + box / 2,
      segment.y + box / 2,
      box / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // connect body with tube
    if (i > 0) {
      ctx.beginPath();
      ctx.strokeStyle = "#0c0";
      ctx.lineWidth = box - 4;
      ctx.moveTo(segment.x + box / 2, segment.y + box / 2);
      ctx.lineTo(snake[i - 1].x + box / 2, snake[i - 1].y + box / 2);
      ctx.stroke();
    }
  });

  // draw food
  ctx.beginPath();
  ctx.fillStyle = "#f00";
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, Math.PI * 2);
  ctx.fill();

  // score text
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, box, 1.5 * box);
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
