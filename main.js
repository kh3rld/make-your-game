let initialEnemies = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40
];
// Pause the game
pauseButton.addEventListener('click', () => {
    isPaused = true;
});

// Continue the game
continueButton.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        requestAnimationFrame(moveEnemies);
    }
});

// Restart the game
restartButton.addEventListener('click', () => {
    isPaused = false;
    gameOver = false;
    enemiesRemoved.length = 0;
    results = 0;
    resultDisplay.innerHTML = results;
    currentShooterIndex = 202;
    squares.forEach(square => square.classList.remove('enemy', 'player', 'bullet', 'boom'));
    enemies.length = 0;
    initialEnemies.forEach(index => enemies.push(index));
    draw();
    squares[currentShooterIndex].classList.add('player');
    startTime = 0; // Reset the timer
    elapsedTime = 0;
    timerDisplay.textContent = '00:00';
    requestAnimationFrame(moveEnemies);
});

const pressPlay = document.getElementById('press-play');