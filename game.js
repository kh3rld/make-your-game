const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('#score-span');
const pauseButton = document.querySelector('#pause');
const continueButton = document.querySelector('#continue');
const restartButton = document.querySelector('#restart');
const timerDisplay = document.querySelector('#timer');
const width = 15;
const height = 15;
const enemiesRemoved = [];
let currentShooterIndex = 202;
let isGoingRight = true;
let direction = 1;
let results = 0;
let isPaused = false;
let gameOver = false;
let lastTime = 0;
const enemySpeed = 900; // Time in milliseconds between enemy movements
let startTime = 0; // To track the start time of the game
let elapsedTime = 0; // To track the elapsed time

// Create the grid for the game
for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
}

// Create an array from the square
const squares = Array.from(document.querySelectorAll('.grid div'));

// Create an array for the enemies
const enemies = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40
];

// Draw the enemy ships
function draw() {
    for (let i = 0; i < enemies.length; i++) {
        if (!enemiesRemoved.includes(i)) {
            squares[enemies[i]].classList.add('enemy');
        }
    }
}
draw();

squares[currentShooterIndex].classList.add('player');

// Function to remove the enemies
function remove() {
    for (let i = 0; i < enemies.length; i++) {
        squares[enemies[i]].classList.remove('enemy');
    }
}

// Moving the player(shooter) left and right
function moveShooter(e) {
    if (isPaused || gameOver) return;
    squares[currentShooterIndex].classList.remove('player');
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    squares[currentShooterIndex].classList.add('player');
}
document.addEventListener('keydown', moveShooter);

// Function to move the enemies
function moveEnemies(timestamp) {
    if (isPaused || gameOver) return;

    if (!startTime) startTime = timestamp; // Initialize start time
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;

    // Update the timer
    elapsedTime = timestamp - startTime;
    updateTimer(elapsedTime);

    if (deltaTime >= enemySpeed) {
        lastTime = timestamp;

        const leftEdge = enemies[0] % width === 0;
        const rightEdge = enemies[enemies.length - 1] % width === width - 1;
        remove();

        // Check if any enemy has reached the bottom
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i] >= width * (height - 1)) { // Check if enemy is in the last row
                gameOver = true;
                alert("Game Over! The enemies reached the bottom.");
                return; // Stop further execution
            }
        }

        // Move enemies left or right and down
        if (rightEdge && isGoingRight) {
            for (let i = 0; i < enemies.length; i++) {
                enemies[i] += width + 1;
                direction = -1;
                isGoingRight = false;
            }
        }

        if (leftEdge && !isGoingRight) {
            for (let i = 0; i < enemies.length; i++) {
                enemies[i] += width - 1;
                direction = 1;
                isGoingRight = true;
            }
        }

        for (let i = 0; i < enemies.length; i++) {
            enemies[i] += direction;
        }
        draw();

        // Game over: lose if player is hit by an enemy
        if (squares[currentShooterIndex].classList.contains('enemy')) {
            gameOver = true;
            alert("Game Over! You lost");
            return;
        }

        // Game over: win if all enemies are removed
        if (enemiesRemoved.length === enemies.length) {
            gameOver = true;
            alert("You win");
            return;
        }

        // Game over: lose if enemies disappear without being shot
        let allEnemiesOffScreen = true;
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i] < width * height) { // Check if any enemy is still on the grid
                allEnemiesOffScreen = false;
                break;
            }
        }
        if (allEnemiesOffScreen) {
            gameOver = true;
            alert("Game Over! The enemies escaped.");
            return;
        }
    }

    requestAnimationFrame(moveEnemies);
}

// Function to update the timer display
function updateTimer(time) {
    const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Start the game loop
requestAnimationFrame(moveEnemies);

function shoot(e) {
    if (isPaused || gameOver) return;
    let BulletId;
    let currentBulletIndex = currentShooterIndex;

    function moveBullet() {
        if (gameOver) return;
        squares[currentBulletIndex].classList.remove('bullet');
        currentBulletIndex -= width;
        squares[currentBulletIndex].classList.add('bullet');

        if (squares[currentBulletIndex].classList.contains('enemy')) {
            squares[currentBulletIndex].classList.remove('enemy');
            squares[currentBulletIndex].classList.remove('bullet');
            squares[currentBulletIndex].classList.remove('boom');

            setTimeout(() => squares[currentBulletIndex].classList.remove('boom'), 300);
            clearInterval(BulletId);

            const enemyRemoved = enemies.indexOf(currentBulletIndex);
            enemiesRemoved.push(enemyRemoved);
            results++;
            resultDisplay.innerHTML = results.toString();
        }
    }

    if (e.key === 'ArrowUp') {
        BulletId = setInterval(moveBullet, 100);
    }
}

document.addEventListener('keydown', shoot);

