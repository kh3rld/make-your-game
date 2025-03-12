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
    if (lives > 0) {
        lives--;
        updateLivesDisplay();
    }

    if (lives === 0) {
        handleGameOver(); // Call the game over handler
    }
}

function handleGameOver() {
    gameOver = true;
    hasStarted = false; // Allow the game to be restarted
    startBtn.disabled = false; // Re-enable the start button
    showNotification("Game Over! You lost.");
}

// Combined function to start or restart the game
function initializeGame() {
    // Reset game state
    console.log(">>>>> Starting game...");
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

let hasStarted = false; // Track if the game has started

// Event listener for the start button
const startBtn = document.getElementById('start-button');
startBtn.addEventListener('click', () => {
    if (!hasStarted) { // Only initialize the game if it hasn't started yet
        hasStarted = true;
        initializeGame(); // Initialize the game
        startBtn.disabled = true; // Disable the start
    }
});

// // Event listener for the restart button
// restartButton.addEventListener('click', () => {
//     initializeGame(); // Initialize the game
// });

let lives = 3;
// Function to reduce lives and update the HTML
function reduceLives() {
    if (lives > 0) {
        lives--;
        updateLivesDisplay();
    }

    if (lives === 0) {
        gameOver = true;
        showNotification('Game Over! You lost.');
    }
}

function updateLivesDisplay() {
    const livesSpan = document.getElementById('lives-span');
    livesSpan.textContent = lives.toString();
}