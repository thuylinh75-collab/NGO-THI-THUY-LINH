const scoreElement = document.getElementById('score');
const speedElement = document.getElementById('speed');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScoreElement = document.getElementById('final-score');
const gameArea = document.getElementById('game-area');

let player = { speed: 5, score: 0 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

let isPlaying = false;
let gameLoopId;

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
}

function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
}

function stopGame() {
    isPlaying = false;
    cancelAnimationFrame(gameLoopId);
    finalScoreElement.innerText = player.score;
    gameOverScreen.classList.remove('hidden');
}

function checkCollision(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !((aRect.bottom < bRect.top) || 
             (aRect.top > bRect.bottom) || 
             (aRect.right < bRect.left) || 
             (aRect.left > bRect.right));
}

function moveLines() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(item) {
        if(item.y >= 700) {
            item.y -= 750;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function moveEnemies(playerCar) {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(function(item) {
        if(checkCollision(playerCar, item)) {
            stopGame();
        }

        if(item.y >= 750) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * 350) + "px";
        }
        
        // Enemies move slightly slower than the background lines so you catch up to them, 
        // or actually since it's traffic racer, they move down towards you
        item.y += player.speed; 
        item.style.top = item.y + "px";
    });
}

function gamePlay() {
    let playerCar = document.querySelector('#player');
    let road = gameArea.getBoundingClientRect();

    if(isPlaying) {
        moveLines();
        moveEnemies(playerCar);

        if(keys.ArrowUp && player.y > (road.top + 70)) { player.y -= player.speed; }
        if(keys.ArrowDown && player.y < (road.bottom - 120)) { player.y += player.speed; }
        if(keys.ArrowLeft && player.x > 0) { player.x -= player.speed; }
        if(keys.ArrowRight && player.x < (road.width - 50)) { player.x += player.speed; }

        playerCar.style.top = player.y + "px";
        playerCar.style.left = player.x + "px";

        player.score++;
        scoreElement.innerText = player.score;
        
        // Gradually increase speed
        if(player.score % 500 === 0 && player.speed < 15) {
            player.speed += 1;
            speedElement.innerText = player.speed * 10;
        }

        gameLoopId = requestAnimationFrame(gamePlay);
    }
}

function initGame() {
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameArea.innerHTML = ""; // Clear existing elements except overlays... 
    
    // Actually we need to re-add overlays because we cleared them
    gameArea.appendChild(startScreen);
    gameArea.appendChild(gameOverScreen);

    isPlaying = true;
    player.score = 0;
    player.speed = 5;
    scoreElement.innerText = "0";
    speedElement.innerText = player.speed * 10;

    for(let x = 0; x < 5; x++){
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'line');
        roadLine.y = (x * 150);
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }

    let playerCar = document.createElement('div');
    playerCar.setAttribute('class', 'car');
    playerCar.setAttribute('id', 'player');
    gameArea.appendChild(playerCar);

    player.x = playerCar.offsetLeft;
    player.y = playerCar.offsetTop;

    for(let x = 0; x < 3; x++){
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'car enemy');
        enemyCar.y = ((x + 1) * 350) * -1;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        gameArea.appendChild(enemyCar);
    }

    gameLoopId = requestAnimationFrame(gamePlay);
}

startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);
