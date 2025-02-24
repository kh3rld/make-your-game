const grid = document.querySelector('.grid')
const resultDisplay = document.querySelector('.score')
const width = 15
const height = 15
const enemiesRemoved = []
let currentShooterIndex  = 202

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

function draw(){
    for(let i = 0; i < enemies.length; i++){
        if (!enemiesRemoved.includes(i)){
            squares[enemies[i]].classList.add('enemy')
           
        }
    }
}
draw()

squares[currentShooterIndex].classList.add('player')

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