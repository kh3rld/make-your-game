// There are only 4 game states
const GameStates = Object.freeze({
    Running:0,
    Paused:1,
    End:2,
    Continue: 3, // not sure about this
});

// Initially the current game state is in Running Mode
let gameState = GameStates.Running;
const Width = 15;
let currentShooterIndex = 202;
// if an invader is shot, keep track of them
const aliensRemoved = [];
const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

const container =  document.getElementById('game-container');
const scoreBoard = document.getElementById("scoreBoard");
const score = document.querySelector("#score-value");

for (let i = 0; i < Width*Width; i++){
    const square = document.createElement('div')
    // const squareImg = document.createElement('img')
    // square.appendChild(squareImg);
    square.id = i; // each square should have an id
    container.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('#game-container div'))
console.log(squares);


function draw(){
    for(let i = 0; i<alienInvaders.length; i++){
        if(!aliensRemoved.includes(i)){
            squares[alienInvaders[i]].classList.add('invader');
        }
    }
}

draw();

squares[currentShooterIndex].classList.add('shooter');

function moveShooter(event){
    squares[currentShooterIndex].classList.remove('shooter');
    switch (event.key){
        case 'ArrowLeft':
            if (currentShooterIndex % Width !== 0 ){
                currentShooterIndex-=1;
            }
            break
        case 'ArrowRight':
            if (currentShooterIndex % Width < Width - 1){
                currentShooterIndex+=1;
            }
            break
    }
    squares[currentShooterIndex].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter)

// function moveInvaders(){
//     const leftEdge = alienInvaders[0] % Width === 0;
//     const rightEdge = alienInvaders[]
// }