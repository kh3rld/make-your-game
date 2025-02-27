const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('#score-span');
const pauseButton = document.querySelector('#pause');
const continueButton = document.querySelector('#continue');
const restartButton = document.querySelector('#restart');
const timerDisplay = document.querySelector('#timer');
const lifeCount = document.getElementById("lives-span");
const width = 15;
const enemySpeed = 300; // Time in milliseconds between enemy movements
const height = 15;

let enemiesRemoved = [];
let currentShooterIndex = 202;
let isGoingRight = true;
let direction = 1;
let results = 0;
let isPaused = false;
let gameOver = false;
let lastTime = 0;
let startTime = 0; // To track the start time of the game
let elapsedTime = 0; // To track the elapsed time
let lives = 3;


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

function updateTimer(time) {
    const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Function to move the enemies
function moveEnemies(timestamp) {
    if (isPaused){
        requestAnimationFrame(removeBullets);
        return;
    }

    if(gameOver){
        requestAnimationFrame(removeBullets);
        lifeCount.innerText = Number(0).toString()
        return;
    }

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
        // requestAnimationFrame(remove);
        remove()

        // Check if any enemy has reached the bottom
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i] >= width * (height - 1)) { // Check if enemy is in the last row
                // gameOver = true;
                showNotification("enemies repositioning.");
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
            if(squares[enemies[i]].classList.contains('player')){
                // enemy has reached the player so we need to reset their position back to the top while maintaining everything else
                looseLife();
            }
        }
        draw();

        // reduce one life if a player touches the enemy
        if (squares[currentShooterIndex].classList.contains('enemy')) {
            looseLife();
            // showNotification("Game Over! You lost",'red');
            return;
        }

        // Game over: win if all enemies are removed
        if (enemiesRemoved.length === enemies.length) {
            gameOver = true;
            showNotification("You win", 'green');
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
            showNotification("Game Over! The enemies escaped.");
            return;
        }
    }

    requestAnimationFrame(moveEnemies);
}

// Start the game loop
requestAnimationFrame(moveEnemies);

let bullets = []; // Array to track active bullets

function shoot(e) {
    if (isPaused || gameOver) return;

    if (e.key === 'ArrowUp') {
        const bulletIndex = currentShooterIndex - width; // Start bullet above shooter
        squares[bulletIndex].classList.add('bullet');
        bullets.push({ index: bulletIndex, intervalId: null }); // Track bullet

        moveBullet(bullets.length - 1); // Start moving the bullet
    }
}

function moveBullet(bulletId) {
    const bullet = bullets[bulletId];
    if (!bullet) return;

    bullet.intervalId = setInterval(() => {
        const currentIndex = bullet.index;

        // Remove bullet from current position
        squares[currentIndex].classList.remove('bullet');

        // Move bullet upward
        const newIndex = currentIndex - width;
        bullet.index = newIndex;

        // Check if bullet goes off-screen
        if (newIndex < 0) {
            clearInterval(bullet.intervalId);
            bullets.splice(bulletId, 1); // Remove bullet from tracking
            return;
        }

        // Check if bullet hits an enemy
        if (squares[newIndex].classList.contains('enemy')) {
            clearInterval(bullet.intervalId);
            bullets.splice(bulletId, 1); // Remove bullet from tracking

            squares[newIndex].classList.remove('enemy');
            squares[newIndex].classList.add('boom'); // Add explosion effect

            setTimeout(() => squares[newIndex].classList.remove('boom'), 300); // Remove explosion after 300ms

            const enemyRemoved = enemies.indexOf(newIndex);
            if (enemyRemoved !== -1) {
                enemiesRemoved.push(enemyRemoved);
                results++;
                resultDisplay.innerHTML = results.toString();
            }
            return;
        }

        squares[newIndex].classList.add('bullet');
    }, 100);
}
if(!isPaused && !gameOver){
    // this prevents shooting while game is over or paused
    document.addEventListener('keydown', shoot);
}
