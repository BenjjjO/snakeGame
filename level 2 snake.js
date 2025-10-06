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
        this.particles = [];
        this.level = 2; // default Level 2 (walls)

        this.colors = {
            snakeHead: '#00ff88',
            snakeBody: '#00cc66',
            food: '#ff4444',
            foodGlow: '#ff6666'
        };

        this.touchStart = { x: 0, y: 0 };
        this.lastDirection = "RIGHT";

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupParticles();
        this.setupControls();
        this.updateHighScore();

        window.addEventListener("resize", () => this.setupCanvas());
        document.getElementById("restart-btn")
            .addEventListener("click", () => this.startGame());

        // Level select buttons
        document.getElementById("level1-btn")
            .addEventListener("click", () => { this.level = 1; this.startGame(); });
        document.getElementById("level2-btn")
            .addEventListener("click", () => { this.level = 2; this.startGame(); });
        
    drawGame() {
        // ... same clearing + grid

        let snakeX = this.snake[0].x;
        let snakeY = this.snake[0].y;

        if (this.direction === "LEFT") snakeX -= this.box;
        if (this.direction === "UP") snakeY -= this.box;
        if (this.direction === "RIGHT") snakeX += this.box;
        if (this.direction === "DOWN") snakeY += this.box;

        // === LEVEL RULES ===
        if (this.level === 1) {
            // Wrap-around level
            if (snakeX < 0) snakeX = this.canvas.width - this.box;
            if (snakeY < 0) snakeY = this.canvas.height - this.box;
            if (snakeX >= this.canvas.width) snakeX = 0;
            if (snakeY >= this.canvas.height) snakeY = 0;
        } else if (this.level === 2) {
            // Wall collision
            if (
                snakeX < 0 || snakeY < 0 ||
                snakeX >= this.canvas.width || snakeY >= this.canvas.height
            ) {
                this.gameOver();
                return;
            }
        }

        const newHead = { x: snakeX, y: snakeY };

        // self collision
        if (this.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(newHead);

        if (this.food && snakeX === this.food.x && snakeY === this.food.y) {
            this.score++;
            this.updateScore();
            this.createFoodParticles(this.food.x, this.food.y);
            this.food = this.randomFood();

            if (this.score % 5 === 0) {
                this.speedLevel++;
                this.gameSpeed = Math.max(80, this.gameSpeed - 10);
                document.getElementById("speedLevel").textContent = this.speedLevel;
                this.restartGameLoop();
            }
        } else {
            this.snake.pop();
        }

        this.drawSnake();
        if (this.food) this.drawFood();
    }
}


        this.startGame();
    }

