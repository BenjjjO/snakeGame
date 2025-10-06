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

