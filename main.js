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

    var snakesPerGen = 1000;
    var maxGen = 2000;
    var currentGen = 1;

    var loop;

    function newGeneration() {
        deadSnakes = deadSnakes.sort((a, b) => (a.score > b.score) ? 1 : -1).reverse();
        console.log("Generation " + currentGen + "/" + maxGen + ": ");
        if(deadSnakes[0]) console.log("Max Score: " + deadSnakes[0].score);
        if(deadSnakes[0]) console.log("Max Survival Time: " + deadSnakes[0].survivalTime);
        if(deadSnakes[0]) console.log("Max Length: " + (deadSnakes[0].snakeBody.length - 1));
        // console.log(deadSnakes[0]);
        console.log("Going to next generation: " + Math.floor(snakesPerGen / 3));
        startGame();
        loop = setInterval(draw, 10);
    }

    function startGame() {deadSnakes
        let i = 0;
        snakes = [];
        if(deadSnakes.length > 0) {
            for(; i < Math.floor(snakesPerGen / 3); i++) {
                // console.log("deadSnakes[i]: " + deadSnakes[i].score);
                snakes.push(new Snake([xCells, yCells, deadSnakes[i]]));
            }
        }
        deadSnakes = [];
        for(; i < snakesPerGen; i++) {
            snakes.push(new Snake([xCells, yCells]));
        }
        // console.log(snakes[0]);
        document.getElementById('currentGen').value = currentGen;
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

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for(let snake = 0; snake < snakes.length; snake++) {
            ctx.fillStyle = "#f00";
            ctx.fillRect(snakes[snake].apple.x * unit, snakes[snake].apple.y * unit, unit, unit);

            ctx.fillStyle = "#ffffffaa";

            for(i in snakes[snake].snakeBody) {
                ctx.fillRect(snakes[snake].snakeBody[i].x * unit, snakes[snake].snakeBody[i].y * unit, unit, unit);
            }
            snakes[snake].moveSnake();
            var collisionType = snakes[snake].collision();
            if(collisionType === "S") {
                snakes[snake].getScore();
                deadSnakes.push(snakes[snake]);
                // stopGame(snakes[snake]);
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
            if(currentGen < maxGen) {
                newGeneration();
                currentGen++;
                document.getElementById('currentGen').value = currentGen;
                // new generation
            }
        }
    }

    newGeneration();
};
