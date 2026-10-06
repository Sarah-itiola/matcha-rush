let playerX = 320;
let playerY = 430;

let foodX = 200;
let foodY = 0;

let score = 0;
let highScore = 0;
let lastScore = 0;

let gameOver = false;

let ingredients = ["🍓", "🫐", "🍯", "🥛", "☕"];
let food = "🍓";

function setup() {
    let canvas = createCanvas(640, 480);
    canvas.parent("game-container");

    noStroke();
}

function draw() {
    background("#f7c5cf");

    textSize(45);
    text("🍵", playerX, playerY);

    if (keyIsDown(LEFT_ARROW) && gameOver == false) {
        playerX = playerX - 4;
    }

    if (keyIsDown(RIGHT_ARROW) && gameOver == false) {
        playerX = playerX + 4;
    }

    textSize(30);
    text(food, foodX, foodY);

    if (gameOver == false) {
        foodY = foodY + 3;
    }

    if (dist(playerX, playerY, foodX, foodY) < 25 && gameOver == false) {

        if (food == "☕") {
            endGame();
        } else {
            score = score + 1;

            document.getElementById("score").textContent = score + " ♡";

            newFood();
        }
    }

    if (foodY > 480 && gameOver == false) {
        endGame();
    }

    if (gameOver == true) {
        fill(60);
        textSize(30);

        text("You lost! Press R to restart", 120, 240);
    }
}

function newFood() {
    foodY = 0;
    foodX = random(30, 610);

    food = random(ingredients);
}

function endGame() {
    gameOver = true;

    lastScore = score;

    if (score > highScore) {
        highScore = score;
    }

    document.getElementById("last-score").textContent = lastScore;
    document.getElementById("high-score").textContent = highScore;
}

function keyPressed() {
    if (key == "r" || key == "R") {
        score = 0;
        gameOver = false;

        playerX = 320;

        document.getElementById("score").textContent = "0 ♡";

        newFood();
    }
}