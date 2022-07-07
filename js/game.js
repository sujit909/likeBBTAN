const bbtan = document.getElementById("bbtan");
const ctx = bbtan.getContext("2d");
bbtan.style.border = "1px solid #0ff";
ctx.lineWidth = 3;

// GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 20;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 7;
let LIFE = 4; 
let SCORE = 0;
const SCORE_UNIT = 1;
let LEVEL = 1;
const MAX_LEVEL = 5;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

// LOAD BG IMAGE
const BG_IMG = new Image();
BG_IMG.src = "img/background.jpeg";


//PADDLE
const paddle = {
    x : bbtan.width/2 - PADDLE_WIDTH/2,
    y : bbtan.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx :5
}

function drawPaddle(){
    ctx.fillStyle = "#AB5117";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    ctx.strokeStyle = "#AB5117";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// CONTROL THE PADDLE
document.addEventListener("keydown", function(event){
   if(event.keyCode == 37){
       leftArrow = true;
   }else if(event.keyCode == 39){
       rightArrow = true;
   }
});
document.addEventListener("keyup", function(event){
   if(event.keyCode == 37){
       leftArrow = false;
   }else if(event.keyCode == 39){
       rightArrow = false;
   }
});

// MOVE PADDLE
function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < bbtan.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

// BALL
const ball = {
    x : bbtan.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 4,
    dx : 3 * (Math.random() * 2 - 1),
    dy : -3
}

function drawBall(){
    ctx.beginPath();
    
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();
    
    ctx.closePath();
}

// MOVE THE BALL
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// BALL AND WALL COLLISION DETECTION
function ballWallCollision(){
    if(ball.x + ball.radius > bbtan.width || ball.x - ball.radius < 0){
        ball.dx = - ball.dx;
    }
    
    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
    }
    
    if(ball.y + ball.radius > bbtan.height){
        LIFE--; // LOSE LIFE
        brick.row++;
        createBricks();
        resetBall();
    }
}

// function brickPaddleCollision(){
//     console.log(brick.height)
//     if(brick.row > 10){
//         showYouLose();
//         GAME_OVER = true;
//     }
// }

// RESET THE BALL
function resetBall(){
    ball.x = bbtan.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

// BALL AND PADDLE COLLISION
function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
        
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        collidePoint = collidePoint / (paddle.width/2);
        let angle = collidePoint * Math.PI/3;
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

// BRICKS
const brick = {
    row : 1,
    column : 10,
    width : 30,
    height : 30,
    add : 1,
    offSetLeft : 9,
    offSetTop : 20,
    marginTop : 60,
    fillColor : "#111",
    strokeColor : "#BFA53C"
}

let bricks = [];

function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
}

// function addBricks(){
//     for(let r = 0; r < brick.add; r++){
//         bricks[r] = [];
//         for(let c = 0; c < brick.column; c++){
//             bricks[r][c] = {
//                 x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
//                 y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
//                 status : true
//             }
//         }
//     }
// }

createBricks();

// bricks
function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

// ball brick collision
function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    ball.dy = - ball.dy;
                    b.status = false; 
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}

// show game stats
function showGameStats(text, textX, textY, text1, text1X, text1Y){
    ctx.fillStyle = "#000";
    ctx.font = "25px Times New Roman";
    ctx.fillText(text, textX, textY);
    ctx.fillText(text1, text1X, text1Y);
    // ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// DRAW FUNCTION
function draw(){
    drawPaddle();
    
    drawBall();
    
    drawBricks();
    
    // SHOW SCORE
    showGameStats(SCORE, 35, 25, "SCORE", 5, 50);
    // SHOW LIVES
    showGameStats(LIFE, bbtan.width - 25, 25, "LIFE", bbtan.width-55, 50); 
    // SHOW LEVEL
    showGameStats(LEVEL, bbtan.width/2, 25, "LEVEL", bbtan.width/2 - 30, 50);
}

// game over
function gameOver(){
    if(LIFE <= 0){
        showYouLose();
        GAME_OVER = true;
    }
}

// level up
function levelUp(){
    let isLevelDone = true;
    
    // check if all the bricks are broken
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }
    
    if(isLevelDone){
   
        if(LEVEL >= MAX_LEVEL){
            showYouWin();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        LEVEL++;
    }
}

// UPDATE
function update(){
    movePaddle();
    
    moveBall();
    
    ballWallCollision();
    
    ballPaddleCollision();
    
    ballBrickCollision();
    
    gameOver();
    
    levelUp();
}

// GAME LOOP
function loop(){
    ctx.drawImage(BG_IMG, 0, 0);
    
    draw();
    
    update();
    
    if(! GAME_OVER){
        requestAnimationFrame(loop);
    }
}
loop();


const gameover = document.getElementById("gameover");
const winner = document.getElementById("winner");
const loose = document.getElementById("loose");
const restart = document.getElementById("restart");

// PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); 
})

// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    winner.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
    loose.style.display = "block";
}



















