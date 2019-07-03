var snakes = [];
var deadSnakes = [];
window.onload = function() {
    var iter = 0;
    var itermax;
    var scores = [];

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var unit = 10;
    var xCells = canvas.width / unit;
    var yCells = canvas.height / unit;

    var apple;
    var direction = "R";
    var scoreboard = document.getElementById("score");

    function startGame() {
        for(let i = 0; i < 10; i++) {
            snakes.push(new Snake(xCells, yCells));
        }
    }

    function stopGame(snake) {
        //clearInterval(loop);
        setInterval(function() {
            ctx.fillStyle = "#f00";
            ctx.fillRect(snake.snakeBody[1].x * unit, snake.snakeBody[1].y * unit, unit, unit);
            setTimeout(function() {
                ctx.fillStyle = "#fff";
                ctx.fillRect(snake.snakeBody[1].x * unit, snake.snakeBody[1].y * unit, unit, unit);
            }, 200);
        }, 300);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // draw background
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for(let snake = 0; snake < snakes.length; snake++) {
            // draw apple
            ctx.fillStyle = "#f00";
            ctx.fillRect(snakes[snake].apple.x * unit, snakes[snake].apple.y * unit, unit, unit);
            // draw snake
            ctx.fillStyle = "#ffffffaa";
            //console.log(snakes);

            for(i in snakes[snake].snakeBody) {
                ctx.fillRect(snakes[snake].snakeBody[i].x * unit, snakes[snake].snakeBody[i].y * unit, unit, unit);
            }
            snakes[snake].moveSnake();
            var collisionType = snakes[snake].collision();
            if(collisionType === "S") {
                //scores.push(Number.parseInt(scoreboard.value));
                snakes[snake].getScore();
                deadSnakes.push(snakes[snake]);
                stopGame(snakes[snake]);
                snakes[snake].kill();
                snakes.splice(snake, 1);
            } else if(collisionType === "A") {
                snakes[snake].resetApple();
            }
            if(snakes[snake]) {
                snakes[snake].decideNextMove();
            }
        }
        for(let snake = 0; snake < deadSnakes.length; snake++) {
            for(i in deadSnakes[snake].snakeBody) {
                ctx.fillRect(deadSnakes[snake].snakeBody[i].x * unit, deadSnakes[snake].snakeBody[i].y * unit, unit, unit);
            }
        }
        if(snakes.length === 0) {
            clearInterval(loop);
        }
    }

    startGame();
    //reset();
    var loop = setInterval(draw, 100);
};
