const startBtn = document.getElementById('start-button');
const modals = {
    start: document.getElementById('startModal'),
    pause: document.getElementById('pauseModal'),
    gameOver: document.getElementById('gameOverModal'),
    win: document.getElementById('winModal'),
    lifeLost: document.getElementById('lifeLostModal')
};


// Event Listeners
document.addEventListener('keydown', (e) => {
    if (gameState === GAME_STATES.PLAYING) {
        if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
            const newPos = e.key === 'ArrowLeft' 
                ? Math.max(currentShooterIndex - 1, 0)
                : Math.min(currentShooterIndex + 1, width * height - 1);
            
            if (newPos % width === (e.key === 'ArrowLeft' ? width - 1 : 0)) return;
            currentShooterIndex = newPos;
        }

        if (e.code === 'Space') {
            bullets.push({ position: currentShooterIndex - width });
        }
    }
});

// Game Controls
startBtn.addEventListener('click', startGame);
document.getElementById('restart').addEventListener('click', () => {
    startGame();
});
document.getElementById('restartGameOver').addEventListener('click', () => {
    startGame();
    document.getElementById('gameOverModal').classList.add('hidden');
});

document.getElementById('restartWin').addEventListener('click', () => {
    startGame();
    document.getElementById('winModal').classList.add('hidden');
});
document.getElementById('restartLife').addEventListener('click', () => {
    startGame();
    document.getElementById('lifeLostModal').classList.add('hidden');
});

document.getElementById('continue').addEventListener('click', () => {
    gameState = GAME_STATES.PLAYING;
    setGameState(GAME_STATES.PLAYING);
});

document.getElementById('continueLife').addEventListener('click', () => {
    gameState = GAME_STATES.PLAYING;
    setGameState(GAME_STATES.PLAYING);
});

document.getElementById('overlay').addEventListener('click', (e) => {
    if (gameState === GAME_STATES.PAUSED && e.target === document.getElementById('overlay')) {
        setGameState(GAME_STATES.PLAYING);
    }
});

// Pause/Resume
function togglePause() {
    if (gameState === GAME_STATES.PLAYING) {
        gameState = GAME_STATES.PAUSED;
        requestAnimationFrame((currentTime) => {
            totalGameTime += currentTime - startTime;
            startTime = 0;
        });
    } else if (gameState === GAME_STATES.PAUSED) {
        gameState = GAME_STATES.PLAYING;
    }
    setGameState(gameState);
}


document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'p') {
        togglePause();
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