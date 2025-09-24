<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enhanced Snake Game</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      margin: 0;
      padding: 10px;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
      position: relative;
    }

    h1 {
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      margin-bottom: 10px;
      text-align: center;
      background: linear-gradient(45deg, #00ff88, #00ccff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
      animation: glow 2s ease-in-out infinite alternate;
    }

    @keyframes glow { from { filter: brightness(1); } to { filter: brightness(1.2); } }

    #level-select {
      margin: 10px 0;
      display: flex;
      gap: 10px;
    }

    #level-select button {
      padding: 10px 20px;
      border: none;
      border-radius: 20px;
      background: linear-gradient(45deg, #00ff88, #00ccff);
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: 0.3s;
    }

    #level-select button:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
    }

    #gameContainer {
      position: relative;
      margin: 10px 0;
      border-radius: 15px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    #gameCanvas {
      border-radius: 10px;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      display: block;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
    }

    #gameInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 25px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    #score { color: #00ff88; font-weight: bold; }
    #highScore { color: #ff6b6b; font-weight: bold; }

    #game-over {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(15px);
      z-index: 1000;
    }

    .game-over-content {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(20, 20, 40, 0.9);
      padding: 30px;
      border-radius: 20px;
      text-align: center;
      border: 2px solid rgba(0, 255, 136, 0.3);
    }

    #restart-btn {
      margin-top: 15px;
      padding: 10px 25px;
      border: none;
      border-radius: 20px;
      background: linear-gradient(45deg, #00ff88, #00ccff);
      color: white;
      font-weight: bold;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <canvas id="particles"></canvas>
  <h1>🐍 Enhanced Snake</h1>

  <div id="level-select">
    <button id="level1-btn">Level 1 (Looping)</button>
    <button id="level2-btn">Level 2 (Walls)</button>
  </div>

  <div id="gameContainer">
    <canvas id="gameCanvas"></canvas>
    <div class="speed-indicator">Speed: <span id="speedLevel">1</span></div>
  </div>

  <div id="gameInfo">
    <div id="score">Score: 0</div>
    <div id="highScore">Best: 0</div>
  </div>

  <div id="game-over">
    <div class="game-over-content">
      <div id="final-score"></div>
      <button id="restart-btn">Play Again</button>
    </div>
  </div>

<script>
class EnhancedSnakeGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.particleCanvas = document.getElementById("particles");
    this.particleCtx = this.particleCanvas.getContext("2d");

    this.box = 20;
    this.snake = [];
    this.direction = "RIGHT";
    this.food = null;
    this.score = 0;
    this.highScore = localStorage.getItem('snakeHighScore') || 0;
    this.game = null;
    this.gameSpeed = 150;
    this.speedLevel = 1;
    this.level = 2; // Default = walls

    this.init();
  }

  init() {
    this.setupCanvas();
    this.setupControls();
    this.updateHighScore();
    document.getElementById("restart-btn")
      .addEventListener("click", () => this.startGame());

    // level selection
    document.getElementById("level1-btn")
      .addEventListener("click", () => { this.level = 1; this.startGame(); });
    document.getElementById("level2-btn")
      .addEventListener("click", () => { this.level = 2; this.startGame(); });

    this.startGame();
  }

  setupCanvas() {
    const maxSize = Math.min(window.innerWidth - 40, window.innerHeight - 250);
    const size = Math.max(280, Math.min(500, maxSize));
    this.canvas.width = Math.floor(size / this.box) * this.box;
    this.canvas.height = Math.floor(size / this.box) * this.box;
  }

  setupControls() {
    document.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft" && this.direction !== "RIGHT") this.direction = "LEFT";
      if (e.key === "ArrowUp" && this.direction !== "DOWN") this.direction = "UP";
      if (e.key === "ArrowRight" && this.direction !== "LEFT") this.direction = "RIGHT";
      if (e.key === "ArrowDown" && this.direction !== "UP") this.direction = "DOWN";
    });
  }

  resetSnake() {
    const cx = Math.floor(this.canvas.width / this.box / 2) * this.box;
    const cy = Math.floor(this.canvas.height / this.box / 2) * this.box;
    this.snake = [{ x: cx, y: cy }];
  }

  randomFood() {
    return {
      x: Math.floor(Math.random() * (this.canvas.width / this.box)) * this.box,
      y: Math.floor(Math.random() * (this.canvas.height / this.box)) * this.box,
    };
  }

  drawGame() {
    this.ctx.fillStyle = "#1a1a1a";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    let snakeX = this.snake[0].x;
    let snakeY = this.snake[0].y;

    if (this.direction === "LEFT") snakeX -= this.box;
    if (this.direction === "UP") snakeY -= this.box;
    if (this.direction === "RIGHT") snakeX += this.box;
    if (this.direction === "DOWN") snakeY += this.box;

    // LEVEL RULES
    if (this.level === 1) {
      // loop around edges
      if (snakeX < 0) snakeX = this.canvas.width - this.box;
      if (snakeY < 0) snakeY = this.canvas.height - this.box;
      if (snakeX >= this.canvas.width) snakeX = 0;
      if (snakeY >= this.canvas.height) snakeY = 0;
    } else {
      // walls
      if (snakeX < 0 || snakeY < 0 || snakeX >= this.canvas.width || snakeY >= this.canvas.height) {
        this.gameOver();
        return;
      }
    }

    const newHead = { x: snakeX, y: snakeY };

    if (this.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      this.gameOver();
      return;
    }

    this.snake.unshift(newHead);

    if (this.food && snakeX === this.food.x && snakeY === this.food.y) {
      this.score++;
      this.updateScore();
      this.food = this.randomFood();
    } else {
      this.snake.pop();
    }

    // draw snake
    this.ctx.fillStyle = "#00ff88";
    this.snake.forEach(seg => this.ctx.fillRect(seg.x, seg.y, this.box-2, this.box-2));

    // draw food
    if (this.food) {
      this.ctx.fillStyle = "#ff4444";
      this.ctx.fillRect(this.food.x, this.food.y, this.box-2, this.box-2);
    }
  }

  updateScore() {
    document.getElementById("score").textContent = "Score: " + this.score;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('snakeHighScore', this.highScore);
      this.updateHighScore();
    }
  }

  updateHighScore() {
    document.getElementById("highScore").textContent = "Best: " + this.highScore;
  }

  restartGameLoop() {
    clearInterval(this.game);
    this.game = setInterval(() => this.drawGame(), this.gameSpeed);
  }

  gameOver() {
    clearInterval(this.game);
    document.getElementById("final-score").innerHTML = 
      `<div>Game Over!</div><div>Final Score: ${this.score}</div>`;
    document.getElementById("game-over").style.display = "block";
  }

  startGame() {
    this.resetSnake();
    this.direction = "RIGHT";
    this.score = 0;
    this.food = this.randomFood();
    document.getElementById("score").textContent = "Score: 0";
    document.getElementById("speedLevel").textContent = "1";
    document.getElementById("game-over").style.display = "none";
    clearInterval(this.game);
    this.game = setInterval(() => this.drawGame(), this.gameSpeed);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new EnhancedSnakeGame();
});
</script>
</body>
</html>
