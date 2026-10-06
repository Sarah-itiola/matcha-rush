let playerX = 320;
let playerY = 425;

let foodX = 200;
let foodY = -30;

let score = 0;

let highScore =
    Number(localStorage.getItem("matchaRushHighScore")) || 0;

let lastScore =
    Number(localStorage.getItem("matchaRushLastScore")) || 0;

let gameOver = false;
let scoreSaved = false;

let moveLeft = false;
let moveRight = false;

let particles = [];

const goodIngredients = [
    "🍓",
    "🫐",
    "🍯",
    "🥛"
];

let food = "🍓";

const SUPABASE_URL =
    "https://jpbjfhdqqboqfrzitihs.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_dW6KmJVCPe-7NRuQobMe3Q_xSbq1t29";

let database = null;


function setup() {
    let canvas = createCanvas(640, 480);

    canvas.parent("game-container");

    textAlign(CENTER, CENTER);

    noStroke();

    updateScoreBoard();

    newFood();
}


function draw() {
    drawBackground();

    if (gameOver == false) {
        movePlayer();
        moveFood();
        checkCollision();
    }

    drawFood();
    drawPlayer();
    drawParticles();
}


function drawBackground() {
    background("#f7c5cf");

    fill(255, 255, 255, 25);

    for (let x = 40; x < width; x = x + 80) {
        circle(x, 70, 65);
        circle(x + 30, 330, 45);
    }

    fill("#8b6670");

    textSize(10);

    text(
        "MATCHA RUSH ♡",
        width / 2,
        25
    );
}


function movePlayer() {
    if (
        keyIsDown(LEFT_ARROW) ||
        moveLeft == true
    ) {
        playerX = playerX - 5;
    }

    if (
        keyIsDown(RIGHT_ARROW) ||
        moveRight == true
    ) {
        playerX = playerX + 5;
    }

    if (playerX < 30) {
        playerX = 30;
    }

    if (playerX > 610) {
        playerX = 610;
    }
}


function moveFood() {
    let foodSpeed = 3 + score * 0.12;

    if (foodSpeed > 7) {
        foodSpeed = 7;
    }

    foodY = foodY + foodSpeed;

    if (foodY > 500) {

        if (food == "☕") {
            newFood();
        } else {
            endGame(
                "You missed an ingredient 💔"
            );
        }
    }
}


function drawPlayer() {
    textSize(48);

    text(
        "🍵",
        playerX,
        playerY
    );
}


function drawFood() {
    textSize(32);

    text(
        food,
        foodX,
        foodY
    );
}


function checkCollision() {
    let distance = dist(
        playerX,
        playerY,
        foodX,
        foodY
    );

    if (distance < 38) {

        if (food == "☕") {

            endGame(
                "Coffee ruined the matcha ☕"
            );

        } else {

            score = score + 1;

            makeParticles();

            updateScoreBoard();

            newFood();
        }
    }
}


function newFood() {
    foodY = -30;

    foodX = random(
        35,
        605
    );

    let coffeeChance = random(1);

    if (coffeeChance < 0.2) {

        food = "☕";

    } else {

        food = random(
            goodIngredients
        );
    }
}


function makeParticles() {
    for (let i = 0; i < 7; i++) {

        particles.push({
            x: foodX,
            y: foodY,
            speedX: random(-2, 2),
            speedY: random(-3, -1),
            life: 35
        });
    }
}


function drawParticles() {
    textSize(13);

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        let particle = particles[i];

        particle.x =
            particle.x + particle.speedX;

        particle.y =
            particle.y + particle.speedY;

        particle.life =
            particle.life - 1;

        text(
            "✦",
            particle.x,
            particle.y
        );

        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}


function endGame(message) {
    gameOver = true;

    moveLeft = false;
    moveRight = false;

    lastScore = score;

    localStorage.setItem(
        "matchaRushLastScore",
        lastScore
    );

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "matchaRushHighScore",
            highScore
        );
    }

    updateScoreBoard();

    document.getElementById(
        "game-over-title"
    ).textContent = message;

    document.getElementById(
        "final-score"
    ).textContent = score;

    document.getElementById(
        "game-over-panel"
    ).classList.remove("hidden");

    document.getElementById(
        "save-message"
    ).textContent = "";

    document.getElementById(
        "player-name"
    ).value = "";

    document.getElementById(
        "player-name"
    ).disabled = false;

    document.getElementById(
        "save-score-button"
    ).disabled = false;

    document.getElementById(
        "save-score-button"
    ).textContent = "Save score ♡";

    scoreSaved = false;
}


function restartGame() {
    score = 0;

    gameOver = false;
    scoreSaved = false;

    playerX = 320;

    particles = [];

    document.getElementById(
        "game-over-panel"
    ).classList.add("hidden");

    document.getElementById(
        "player-name"
    ).value = "";

    updateScoreBoard();

    newFood();
}


function updateScoreBoard() {
    document.getElementById(
        "score"
    ).textContent = score + " ♡";

    document.getElementById(
        "high-score"
    ).textContent = highScore;

    document.getElementById(
        "last-score"
    ).textContent = lastScore;
}


function keyPressed() {
    let nameInput =
        document.getElementById(
            "player-name"
        );

    if (
        document.activeElement ==
        nameInput
    ) {
        return;
    }

    if (
        gameOver == true &&
        (key == "r" || key == "R")
    ) {
        restartGame();
    }
}


function setupMobileControls() {
    let leftButton =
        document.getElementById(
            "move-left"
        );

    let rightButton =
        document.getElementById(
            "move-right"
        );

    leftButton.addEventListener(
        "pointerdown",
        function () {
            moveLeft = true;
        }
    );

    leftButton.addEventListener(
        "pointerup",
        function () {
            moveLeft = false;
        }
    );

    leftButton.addEventListener(
        "pointerleave",
        function () {
            moveLeft = false;
        }
    );

    rightButton.addEventListener(
        "pointerdown",
        function () {
            moveRight = true;
        }
    );

    rightButton.addEventListener(
        "pointerup",
        function () {
            moveRight = false;
        }
    );

    rightButton.addEventListener(
        "pointerleave",
        function () {
            moveRight = false;
        }
    );
}


function connectDatabase() {
    database =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

    loadLeaderboard();

    setInterval(
        loadLeaderboard,
        30000
    );
}


async function loadLeaderboard() {
    if (database == null) {
        return;
    }

    let result =
        await database
            .from("scores")
            .select("name, score")
            .order(
                "score",
                {
                    ascending: false
                }
            )
            .limit(50);

    if (result.error) {

        console.log(
            result.error
        );

        showLeaderboardMessage(
            "Leaderboard unavailable"
        );

        return;
    }

    let topPlayers = [];
    let usedNames = [];

    for (
        let i = 0;
        i < result.data.length;
        i++
    ) {

        let player =
            result.data[i];

        let simpleName =
            player.name
                .trim()
                .toLowerCase();

        if (
            usedNames.includes(
                simpleName
            ) == false
        ) {

            usedNames.push(
                simpleName
            );

            topPlayers.push(
                player
            );
        }

        if (
            topPlayers.length == 3
        ) {
            break;
        }
    }

    showLeaderboard(
        topPlayers
    );
}


function showLeaderboard(players) {
    let leaderboard =
        document.getElementById(
            "leaderboard-list"
        );

    leaderboard.innerHTML = "";

    let medals = [
        "🥇",
        "🥈",
        "🥉"
    ];

    if (players.length == 0) {

        showLeaderboardMessage(
            "No scores yet — be the first ♡"
        );

        return;
    }

    for (
        let i = 0;
        i < players.length;
        i++
    ) {

        let row =
            document.createElement(
                "article"
            );

        row.className =
            "leaderboard-player";

        let position =
            document.createElement(
                "span"
            );

        position.className =
            "leaderboard-position";

        position.textContent =
            medals[i];

        let name =
            document.createElement(
                "span"
            );

        name.className =
            "leaderboard-name";

        name.textContent =
            players[i].name;

        let playerScore =
            document.createElement(
                "span"
            );

        playerScore.className =
            "leaderboard-score";

        playerScore.textContent =
            players[i].score;

        row.appendChild(
            position
        );

        row.appendChild(
            name
        );

        row.appendChild(
            playerScore
        );

        leaderboard.appendChild(
            row
        );
    }
}


function showLeaderboardMessage(message) {
    let leaderboard =
        document.getElementById(
            "leaderboard-list"
        );

    leaderboard.innerHTML = "";

    let text =
        document.createElement(
            "article"
        );

    text.className =
        "leaderboard-loading";

    text.textContent =
        message;

    leaderboard.appendChild(
        text
    );
}


async function saveScore() {
    if (database == null) {

        document.getElementById(
            "save-message"
        ).textContent =
            "Leaderboard is not connected yet.";

        return;
    }

    if (scoreSaved == true) {
        return;
    }

    let name =
        document.getElementById(
            "player-name"
        ).value.trim();

    if (name.length < 1) {

        document.getElementById(
            "save-message"
        ).textContent =
            "Enter your name first ♡";

        return;
    }

    if (lastScore < 1) {

        document.getElementById(
            "save-message"
        ).textContent =
            "Score at least 1 point first ♡";

        return;
    }

    let saveButton =
        document.getElementById(
            "save-score-button"
        );

    saveButton.disabled = true;

    saveButton.textContent =
        "Saving...";

    let result =
        await database
            .from("scores")
            .insert({
                name: name,
                score: lastScore
            });

    if (result.error) {

        console.log(
            result.error
        );

        document.getElementById(
            "save-message"
        ).textContent =
            "Couldn't save. Try again ♡";

        saveButton.disabled = false;

        saveButton.textContent =
            "Save score ♡";

        return;
    }

    scoreSaved = true;

    document.getElementById(
        "save-message"
    ).textContent =
        "You're officially on the board ♡";

    document.getElementById(
        "player-name"
    ).disabled = true;

    saveButton.textContent =
        "Saved ✓";

    await loadLeaderboard();
}


document.getElementById(
    "save-score-button"
).addEventListener(
    "click",
    saveScore
);


document.getElementById(
    "restart-button"
).addEventListener(
    "click",
    restartGame
);


document.getElementById(
    "player-name"
).addEventListener(
    "keydown",
    function (event) {

        if (event.key == "Enter") {
            saveScore();
        }
    }
);


setupMobileControls();

connectDatabase();