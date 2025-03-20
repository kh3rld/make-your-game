const startBtn = document.getElementById('start-button');
const modals = {
    start: document.getElementById('startModal'),
    pause: document.getElementById('pauseModal'),
    gameOver: document.getElementById('gameOverModal'),
    win: document.getElementById('winModal'),
    lifeLost: document.getElementById('lifeLostModal')
};

// Key State Management
let keyPressed = {};

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (!keyPressed[e.code]) {
        keyPressed[e.code] = true;
        handleKeyPress(e);
    }
});

document.addEventListener('keyup', (e) => {
    keyPressed[e.code] = false;
});

// Handle Key Press
function handleKeyPress(e) {
    if (gameState === GAME_STATES.PLAYING) {
        if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
            const newPos = e.key === 'ArrowLeft'
                ? Math.max(currentShooterIndex - 1, 0)
                : Math.min(currentShooterIndex + 1, width * height - 1);

            // Prevent wrapping around the grid
            if (newPos % width === (e.key === 'ArrowLeft' ? width - 1 : 0)) return;
            currentShooterIndex = newPos;
        }

        if (e.code === 'Space') {
            bullets.push({ position: currentShooterIndex - width });
        }
    }

    // Pause/Resume with 'P' key
    if (e.key.toLowerCase() === 'p') {
        togglePause();
    }
}

// Game Controls
startBtn.addEventListener('click', startGame);
document.getElementById('restart').addEventListener('click', startGame);
document.getElementById('restartGameOver').addEventListener('click', () => {
    startGame();
    modals.gameOver.classList.add('hidden');
});
document.getElementById('restartWin').addEventListener('click', () => {
    startGame();
    modals.win.classList.add('hidden');
});
document.getElementById('restartLife').addEventListener('click', () => {
    startGame();
    modals.lifeLost.classList.add('hidden');
});
document.getElementById('restart1').addEventListener('click', () => {
    startGame();
    modals.lifeLost.classList.add('hidden');
});

// Continue Game
document.getElementById('continue1').addEventListener('click', () => {
    setGameState(GAME_STATES.PLAYING);
});
document.getElementById('continueLife').addEventListener('click', () => {
    setGameState(GAME_STATES.PLAYING);
});

// Pause/Resume
function togglePause() {
    if (gameState === GAME_STATES.PLAYING) {
        gameState = GAME_STATES.PAUSED;
        totalGameTime += performance.now() - startTime;
        startTime = 0;
    } else if (gameState === GAME_STATES.PAUSED) {
        gameState = GAME_STATES.PLAYING;
        startTime = performance.now();
    }
    setGameState(gameState);
}

// Overlay Click to Resume
document.getElementById('overlay').addEventListener('click', (e) => {
    if (gameState === GAME_STATES.PAUSED && e.target === document.getElementById('overlay')) {
        setGameState(GAME_STATES.PLAYING);
    }
});

// Game Initialization
function startGame() {
    resetGame();
    gameState = GAME_STATES.PLAYING;
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    document.getElementById('overlay').classList.add('hidden');
    setGameState(GAME_STATES.PLAYING);
}

// Initial Setup
modals.start.classList.remove('hidden');
document.getElementById('overlay').classList.remove('hidden');