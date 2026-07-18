const road = document.getElementById("road");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const highScoreText = document.getElementById("highScore");
const engineSound = new Audio("sounds/engine.mp3");
const crashSound = new Audio("sounds/crash.mp3");

engineSound.loop = true;     // Keep playing
engineSound.volume = 0.4;

crashSound.volume = 1.0;

// Load high score from localStorage
let highScore = localStorage.getItem("highScore") || 0;

const highScoreDisplay = document.getElementById("highScoreDisplay");

const lanes = [35,135,235];
let lane = 1;
let score = 0;
let playing = false;
let obstacleLoop;

player.style.left = lanes[lane]+"px";

document.addEventListener("keydown",(e)=>{

    if(!playing) return;

    if(e.key==="ArrowLeft" && lane>0){
        lane--;
    }

    if(e.key==="ArrowRight" && lane<2){
        lane++;
    }

     if(e.key==="a" && lane>0){
        lane--;
    }

    if(e.key==="d" && lane<2){
        lane++;
    }

    player.style.left = lanes[lane]+"px";

});

function createObstacle(){

    if(!playing) return;

    const obs=document.createElement("div");

    obs.className="obstacle";

    const img = document.createElement("img");
    img.src = "img/1.png";
    img.style.width = "100%";
    img.style.height = "100%";

    obs.appendChild(img);

    const randomLane=Math.floor(Math.random()*3);

    obs.style.left=lanes[randomLane]-5+"px";

    road.appendChild(obs);

    let y=-70;

    const move=setInterval(()=>{

        if(!playing){
            clearInterval(move);
            return;
        }

        y+=6;

        obs.style.top=y+"px";

        score++;
        scoreText.innerHTML="Score: "+score;

        const playerRect=player.getBoundingClientRect();
        const obsRect=obs.getBoundingClientRect();

        if(
            playerRect.left<obsRect.right &&
            playerRect.right>obsRect.left &&
            playerRect.top<obsRect.bottom &&
            playerRect.bottom>obsRect.top
        ){
            clearInterval(move);
            endGame();
        }

        if(y>650){
            clearInterval(move);
            obs.remove();
        }

    },20);

}

function startGame() {
    playing = true;

    document.getElementById("startScreen").style.display = "none";

    engineSound.play();

    obstacleLoop = setInterval(createObstacle, 1000);
}

function endGame() {

    playing = false;

    engineSound.pause();
    engineSound.currentTime = 0;

    crashSound.play();

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    finalScore.innerHTML = "Score: " + score;
    highScoreText.innerHTML = "High Score: " + highScore;

    gameOverScreen.style.display = "flex";
}

function restartGame(){

    engineSound.pause();
    engineSound.currentTime = 0;

    crashSound.pause();
    crashSound.currentTime = 0;

    location.reload();

}