const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('#score-span');
const pauseButton = document.querySelector('#pause');
const continueButton = document.querySelector('#continue');
const restartButton = document.querySelector('#restart');
const timerDisplay = document.querySelector('#timer-span');
const lifeCount = document.getElementById("lives-span");
const width = 15;
const height = 15;
const enemySpeed = 1000;

// Game State Management
const GAME_STATES = {
    START: 'start',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over',
    LIFE_LOST: 'life_lost',
    WON: 'won'
};

let gameState = GAME_STATES.START;
let lastFrameTime = 0;
const FPS = 60;
const FRAME_INTERVAL = 1000 / FPS;

// Game Variables
let enemies = [];
const initialEnemies = [0,1,2,3,4,5,6,7,8,9,10,15,16,17,18,19,20,21,22,23,24,25,30,31,32,33,34,35,36,37,38,39,40];
let enemiesRemoved = [];
let currentShooterIndex = 202;
let bullets = [];
let isGoingRight = true;
let direction = 1;
let lives = 3;
let results = 0;
let startTime = 0;
let lastMoveTime = 0;
let isMovingDown = false;


// Initialize Grid
const squares = [];
for (let i = 0; i < width * height; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
    squares.push(square);
}

// Main Game Loop
function gameLoop(currentTime) {
    requestAnimationFrame(gameLoop);
    const deltaTime = currentTime - lastFrameTime;
    
    if (deltaTime < FRAME_INTERVAL) return;
    lastFrameTime = currentTime - (deltaTime % FRAME_INTERVAL);
    switch(gameState) {
        case GAME_STATES.PLAYING:
            updateGame(currentTime);
            checkCollisions();
            checkWinCondition();
            break;
        case GAME_STATES.LIFE_LOST:
            handleLifeLostState();
            break;
    }
   
    render();
    
}


function updateGame(currentTime) {
    // Update timer
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    updateTimer(elapsed);

    // Enemy movement
    if (currentTime - lastMoveTime >= enemySpeed) {
        moveEnemies();
        lastMoveTime = currentTime;
    }

    // Update bullets
    bullets.forEach((bullet, index) => {
        bullet.position -= width;
        if (bullet.position < 0) bullets.splice(index, 1);
    });
}

function moveEnemies() {
    const activeEnemies = enemies.filter((_, i) => !enemiesRemoved.includes(i));
    
    if (isMovingDown) {
        // Vertical movement phase
        enemies = enemies.map(pos => pos + width);
        isMovingDown = false;
        direction *= -1; // Reverse horizontal direction after moving down
        return;
    }

    // Edge detection for horizontal movement
    let leftEdge = false;
    let rightEdge = false;
    
    if (activeEnemies.length > 0) {
        const positions = activeEnemies.map(pos => pos % width);
        leftEdge = Math.min(...positions) <= 0;
        rightEdge = Math.max(...positions) >= width - 1;
    }

    // Check if need to move down
    if ((direction === 1 && rightEdge) || (direction === -1 && leftEdge)) {
        isMovingDown = true;
        isGoingRight = direction === 1;
        return; 
    }

    // Regular horizontal movement
    enemies = enemies.map(pos => pos + direction);

    // Boundary check (safety)
    enemies = enemies.map(pos => {
        const col = pos % width;
        if (col < 0) return pos + 1;
        if (col >= width) return pos - 1;
        return pos;
    });
}
function checkCollisions() {
    // Bullet-enemy collisions
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemyPos, enemyIndex) => {
            if (bullet.position === enemyPos && !enemiesRemoved.includes(enemyIndex)) {
                handleEnemyHit(bulletIndex, enemyIndex);
            }
        });
    });

    // Player-enemy collision
    if (enemies.includes(currentShooterIndex)) {
        handleLifeLost();
    }
}

function handleEnemyHit(bulletIndex, enemyIndex) {
    bullets.splice(bulletIndex, 1);
    enemiesRemoved.push(enemyIndex);
    results++;
    resultDisplay.textContent = results;


     // Add boom effect
     const enemyPos = enemies[enemyIndex];
     squares[enemyPos].classList.add('boom');
     setTimeout(() => {
         squares[enemyPos].classList.remove('boom');
     }, 300);
}

function handleLifeLost() {
    lives--;
    lifeCount.textContent = lives;
    
    if (lives <= 0) {
        setGameState(GAME_STATES.GAME_OVER);
    } else {
        setGameState(GAME_STATES.LIFE_LOST);
    }
}

function handleLifeLostState() {
    // Reset positions but keep score
    currentShooterIndex = 202;
    enemies = [...initialEnemies];
    direction = 1;
    isGoingRight = true;
}

function checkWinCondition() {
    if (enemiesRemoved.length === enemies.length) {
        setGameState(GAME_STATES.WON);
    }
}

function render() {
    // Clear all
    squares.forEach(square => {
        square.classList.remove('enemy', 'player', 'bullet');
    });

    // Draw active enemies
    enemies.forEach((pos, index) => {
        if (!enemiesRemoved.includes(index)) {
            const col = pos % width;
            const row = Math.floor(pos / width);
            
            if (row < height && col < width) {
                squares[pos].classList.add('enemy');
            }
        }
    });

    // Draw player
    squares[currentShooterIndex].classList.add('player');

    // Draw bullets
    bullets.forEach(bullet => {
        if (bullet.position >= 0 && bullet.position < width * height) {
            squares[bullet.position].classList.add('bullet');
        }
    });
}

function updateTimer(ms) {
    const minutes = Math.floor(ms / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

pauseButton.addEventListener('click', () => {
    if (gameState === GAME_STATES.PLAYING) {
        setGameState(GAME_STATES.PAUSED);
    }
});

continueButton.addEventListener('click', () => {
    if (gameState === GAME_STATES.PAUSED) {
        setGameState(GAME_STATES.PLAYING);
    }
});

// State Management
// Update the setGameState function
function setGameState(newState) {
    gameState = newState;
    const overlay = document.getElementById('overlay');
    const shouldHideOverlay = newState === GAME_STATES.PLAYING;
    
    overlay.classList.toggle('hidden', shouldHideOverlay);
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));

    switch(newState) {
        case GAME_STATES.PAUSED:
            document.getElementById('pauseModal').classList.remove('hidden');
            overlay.classList.remove('hidden');
            break;
        case GAME_STATES.GAME_OVER:
            document.getElementById('finalScore').textContent = results;
            document.getElementById('gameOverModal').classList.remove('hidden');
            overlay.classList.remove('hidden');
            break;
        case GAME_STATES.WON:
            document.getElementById('winScore').textContent = results;
            document.getElementById('winModal').classList.remove('hidden');
            overlay.classList.remove('hidden');
            break;
        case GAME_STATES.LIFE_LOST:
            document.getElementById('remainingLives').textContent = lives;
            document.getElementById('lifeLostModal').classList.remove('hidden');
            overlay.classList.remove('hidden');
            break;
        case GAME_STATES.PLAYING:
            overlay.classList.add('hidden');
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
            break;
    }
}
// Initialize Game
function resetGame() {
    enemies = [...initialEnemies];
    enemiesRemoved = [];
    results = 0;
    lives = 3;
    startTime = 0;
    bullets = [];
    currentShooterIndex = 202;
    direction = 1;
    isGoingRight = true;
    
    // Clear grid
    squares.forEach(square => {
        square.classList.remove('enemy', 'player', 'bullet', 'boom');
    });
    
    // Initial setup
    enemies.forEach(pos => squares[pos].classList.add('enemy'));
    squares[currentShooterIndex].classList.add('player');
    
    // Reset UI
    resultDisplay.textContent = '0';
    lifeCount.textContent = '3';
    timerDisplay.textContent = '00:00';
}

// Start the game loop
requestAnimationFrame(gameLoop);