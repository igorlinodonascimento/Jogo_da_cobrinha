const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const startBtn = document.getElementById("start");

const box = 30;
const gridSize = 600;

canvas.width = gridSize;
canvas.height = gridSize;

/* ===================== */
let snake = [];
let direction = "RIGHT";
let nextDirection = "RIGHT";

let foods = [];
let score = 0;

let game = null;
let gameOverState = false;

/* ===================== */
let highScore = Number(localStorage.getItem("snakeRecord")) || 0;
highScoreText.textContent = highScore;

/* ===================== */
function randomCell() {
    return {
        x: Math.floor(Math.random() * (gridSize / box)) * box,
        y: Math.floor(Math.random() * (gridSize / box)) * box
    };
}

/* ===================== */
function createFood() {
    let f;

    while (true) {
        f = randomCell();

        if (
            !snake.some(s => s.x === f.x && s.y === f.y) &&
            !foods.some(fd => fd.x === f.x && fd.y === f.y)
        ) {
            return f;
        }
    }
}

/* ===================== */
function startGame() {
    snake = [{ x: 300, y: 300 }];
    direction = "RIGHT";
    nextDirection = "RIGHT";

    score = 0;
    scoreText.textContent = score;

    foods = [];
    foods.push(createFood());

    gameOverState = false;

    clearInterval(game);
}

/* ===================== */
document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();

    if ((k === "a" || k === "arrowleft") && direction !== "RIGHT")
        nextDirection = "LEFT";

    if ((k === "d" || k === "arrowright") && direction !== "LEFT")
        nextDirection = "RIGHT";

    if ((k === "w" || k === "arrowup") && direction !== "DOWN")
        nextDirection = "UP";

    if ((k === "s" || k === "arrowdown") && direction !== "UP")
        nextDirection = "DOWN";
});

/* ===================== */
/* 🍎 MAÇÃ ANIMADA */
function drawApple(x, y) {
    const time = Date.now() * 0.006;

    const pulse = Math.sin(time) * 2;

    const cx = x + box / 2;
    const cy = y + box / 2;

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(cx, cy, box / 2 - 4 + pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.arc(cx - 4, cy - 4, 3, 0, Math.PI * 2);
    ctx.fill();
}

/* ===================== */
function gameOver() {
    gameOverState = true;
    clearInterval(game);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeRecord", highScore);
        highScoreText.textContent = highScore;
    }
}

/* ===================== */
function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, gridSize, gridSize);

    /* grid */
    ctx.strokeStyle = "#1a1a1a";
    for (let i = 0; i <= gridSize; i += box) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, gridSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(gridSize, i);
        ctx.stroke();
    }

    if (gameOverState) return;

    direction = nextDirection;

    let hx = snake[0].x;
    let hy = snake[0].y;

    if (direction === "LEFT") hx -= box;
    if (direction === "RIGHT") hx += box;
    if (direction === "UP") hy -= box;
    if (direction === "DOWN") hy += box;

    if (
        hx < 0 || hy < 0 ||
        hx >= gridSize || hy >= gridSize ||
        snake.some(s => s.x === hx && s.y === hy)
    ) {
        return gameOver();
    }

    const newHead = { x: hx, y: hy };

    let ate = false;

    foods.forEach((f, i) => {
        if (f.x === hx && f.y === hy) {
            foods.splice(i, 1);
            ate = true;

            score++;
            scoreText.textContent = score;

            /* 🍎 regra: comeu 1 → nasce 2 */
            foods.push(createFood());
            foods.push(createFood());
        }
    });

    if (!ate) snake.pop();

    snake.unshift(newHead);

    /* 🐍 cobra */
    snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "#00aa55" : "#00ff88";
        ctx.fillRect(s.x, s.y, box, box);

        if (i === 0) {
            ctx.fillStyle = "black";
            ctx.fillRect(s.x + 6, s.y + 7, 4, 4);
            ctx.fillRect(s.x + 18, s.y + 7, 4, 4);
        }
    });

    /* 🍎 maçãs animadas */
    foods.forEach(f => drawApple(f.x, f.y));
}

/* ===================== */
startBtn.addEventListener("click", () => {
    startGame();
    game = setInterval(draw, 110);
});

/* init */
startGame();