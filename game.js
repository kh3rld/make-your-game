const grid = document.querySelector('.grid')
const resultDisplay = document.querySelector('#score')
const width = 15
const height = 15
const enemiesRemoved = []
let currentShooterIndex  = 202
let enemiesId 
let isGoingRight = true
let direction =1
let results = 0

//create the grid for the game
for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

//create an array from the square
const squares = Array.from(document.querySelectorAll('.grid div'))

console.log(squares)

//create an array for the enemies
const enemies = [0,1,2,3,4,5,6,7,8,9,10,
                 15,16,17,18,19,20,21,22,23,24,25,
                 30,31,32,33,34,35,36,37,38,39,40
                ]

// draw the enemy ships
function draw(){
    for(let i = 0; i < enemies.length; i++){
        if (!enemiesRemoved.includes(i)){
            squares[enemies[i]].classList.add('enemy')
           
        }
    }
}
draw()

squares[currentShooterIndex].classList.add('player')

//function to remove the enemies
function remove(){
    for(let i =0; i < enemies.length; i++){
        squares[enemies[i]].classList.remove('enemy')
    }
}


//moving the player(shooter) left and right
function moveShooter(e){
    squares[currentShooterIndex].classList.remove('player')
    switch(e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !==0 ) currentShooterIndex -=1
            break
           
        case 'ArrowRight':
          if(currentShooterIndex % width < width-1) currentShooterIndex += 1
           break
    }
     squares[currentShooterIndex].classList.add('player')
    
        
}
document.addEventListener('keydown', moveShooter)

//function to move the enemies
function moveEnemies(){
    const leffEdge = enemies[0] % width === 0
    const rightEdge = enemies[enemies.length -1] % width === width-1 
    remove()

  

    if (rightEdge && isGoingRight) {
          for (let i=0; i< enemies.length; i++){
        enemies[i] += width +1
        direction = -1
        isGoingRight =false
    }
    }

    if (leffEdge && !isGoingRight) {
        for(let i=0; i< enemies.length; i++){
            enemies[i] += width - 1
            direction =1
            isGoingRight = true
        }
    }

    for(let i=0; i< enemies.length; i++){
        enemies[i] += direction
    }
    draw()

    //game over: lose
    if(squares[currentShooterIndex].classList.contains('enemy')) {
       alert("Game Over! you lost")
        clearInterval(enemiesId)
    }

    //game over: win
    if(enemiesRemoved.length === enemies.length){
        alert("You win")
        clearInterval(enemiesId)
    }
}

enemiesId = setInterval(moveEnemies, 300)


function shoot(e){
    let BulletId
    let currentBulletIndex = currentShooterIndex

    function moveBullet(){
        squares[currentBulletIndex].classList.remove('bullet')
        currentBulletIndex -= width
        squares[currentBulletIndex].classList.add('bullet')

        if (squares[currentBulletIndex].classList.contains('enemy')){
            squares[currentBulletIndex].classList.remove('enemy')
            squares[currentBulletIndex].classList.remove('bullet')
            squares[currentBulletIndex].classList.remove('boom')

            setTimeout(() =>  squares[currentBulletIndex].classList.remove('boom'), 300 );
            clearInterval(BulletId)

            const enemyRemoved = enemies.indexOf(currentBulletIndex)
            enemiesRemoved.push(enemyRemoved)
            results++
            resultDisplay.innerHTML = results
        }

    }

    // switch(e.key) {
    //     case 'ArrowUp':
    //         BulletId = setInterval(moveBullet, 100)
    //         break;
    // }

    if(e.key === 'ArrowUp'){
      BulletId = setInterval(moveBullet, 100)
    }
}

document.addEventListener('keydown', shoot)