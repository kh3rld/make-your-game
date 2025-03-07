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

function showNotification(message) {
    let notifyDiv = document.getElementById("notify");
    let notifyMsg = document.getElementById("notify-msg");

    notifyMsg.textContent = message;
    notifyDiv.className = "";
    notifyDiv.style.display = "block";
    notifyDiv.style.opacity = "1";

    setTimeout(() => {
        notifyDiv.style.opacity = "0";
        setTimeout(() => {
            notifyDiv.style.display = "none";
        }, 500);
    }, 3000);
}

function removeBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bulletIndex = bullets[i];
        squares[bulletIndex].classList.remove('bullet');
        bullets.splice(i, 1); // Remove the bullet from the tracking array
    }
}

function looseLife(){
    if (lives <= 0){
        lifeCount.innerText = lives.toString();
        gameOver=true;
    }
    lives--
    lifeCount.innerText = lives.toString();
}

function startGame() {
    // Reset game state
    enemiesRemoved.length = 0;
    results = 0;
    resultDisplay.innerHTML = results;
    currentShooterIndex = 202; // Reset player position
    squares.forEach(square => square.classList.remove('enemy', 'player', 'bullet', 'boom')); // Clear the grid
    enemies.length = 0;
    initialEnemies.forEach(index => enemies.push(index)); // Reset enemies
    draw(); // Redraw enemies
    squares[currentShooterIndex].classList.add('player'); // Add player
    startTime = 0; // Reset the timer
    elapsedTime = 0;
    timerDisplay.textContent = '00:00'; // Reset timer display
    lifeCount.innerText = Number(3).toString(10); // Reset lives

    // Start the game
    gameOver = false;
    isPaused = false;
    requestAnimationFrame(moveEnemies);
}

function resetEnemies(){
    // if enemies reach the bottom, reduce one life and take them back to the top again

}

// Start the game when the DOM is loaded, maybe add a play button to restrict game from automatically
document.addEventListener('DOMContentLoaded', startGame);

// Restart the game when the restart button is clicked
restartButton.addEventListener('click', startGame);