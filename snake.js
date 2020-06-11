len_w = 100;
time_w = -5;
class Snake {
    constructor(params) {
        let xCells = params[0];
        let yCells = params[1];
        let oldSnake = params[2];
        let mutationIntensity = params[3];

        this.score = 0;
        this.xCells = xCells;
        this.yCells = yCells;
        this.direction = "R";
        this.brain = oldSnake ? new NeuralNetwork([[8, 8, 4], oldSnake.brain, mutationIntensity]) : new NeuralNetwork([[8, 8, 4]]);
        this.survivalTime = 0;

        this.closestKill = {
            "U": 0,
            "R": 1,
            "D": 1,
            "L": 0
        };

        this.apple = {
            x: Math.floor(Math.random() * this.xCells),
            y: Math.floor(Math.random() * this.yCells)
        };

        this.snakeBody = [{
            x: Math.floor(Math.random() * this.xCells),
            y: Math.floor(Math.random() * this.yCells)
        }];

        this.snakeBody.unshift({
            x: this.snakeBody[0].x + 1,
            y: this.snakeBody[0].y
        });
    }

    resetApple() {
        this.apple = {
            x: Math.floor(Math.random() * this.xCells),
            y: Math.floor(Math.random() * this.yCells)
        };
    }

    moveSnake() {
        if(this.direction === "L") {
            this.snakeBody.unshift({
                x: this.snakeBody[0].x - 1,
                y: this.snakeBody[0].y
            });
        } else if(this.direction === "U") {
            this.snakeBody.unshift({
                x: this.snakeBody[0].x,
                y: this.snakeBody[0].y - 1
            });
        } else if(this.direction === "R") {
            this.snakeBody.unshift({
                x: this.snakeBody[0].x + 1,
                y: this.snakeBody[0].y
            });
        } else if(this.direction === "D") {
            this.snakeBody.unshift({
                x: this.snakeBody[0].x,
                y: this.snakeBody[0].y + 1
            });
        }
        this.getClosestKill();
        this.survivalTime++;
    }

    collision() {
        if(this.getScore() < 0) {
            return "S";
        }

        if(this.snakeBody[0].x === this.apple.x && this.snakeBody[0].y === this.apple.y) {
            return "A";
        }

        if(this.snakeBody[0].x >= this.xCells || this.snakeBody[0].x < 0 || this.snakeBody[0].y >= this.yCells || this.snakeBody[0].y < 0) {
            return "S";
        }

        for(var i = 1; i < this.snakeBody.length; i++) {
            if(this.snakeBody[0].x === this.snakeBody[i].x && this.snakeBody[0].y === this.snakeBody[i].y) {
                return "S";
            }
        }

        this.snakeBody.pop();
        return null;
    }

    ghostCollision(snakeHead) {
        if(snakeHead.x >= this.xCells || snakeHead.x < 0 || snakeHead.y >= this.yCells || snakeHead.y < 0) {
            return true;
        }

        for(var i = 1; i < this.snakeBody.length; i++) {
            if(this.snakeBody[0].x === snakeHead.x && this.snakeBody[0].y === snakeHead.y) {
                return true;
            }
        }
    }

    getClosestKill() {
        let u = 9999, d = 9999, r = 9999, l = 9999;

        // get closest distances from the walls
        u = Math.min(this.snakeBody[0].y, u);
        d = Math.min(this.yCells - this.snakeBody[0].y, d);
        l = Math.min(this.snakeBody[0].x, l);
        r = Math.min(this.xCells - this.snakeBody[0].x, r);

        // get closes kills from self
        for(let i = 1; i < this.snakeBody.length; i++) {
            if(this.snakeBody[0].x === this.snakeBody[i].x) {
                if((this.snakeBody[0].y - this.snakeBody[i].y) >= 0) {
                    u = Math.min(this.snakeBody[0].y - this.snakeBody[i].y, u);
                } else {
                    d = Math.min(this.snakeBody[i].y - this.snakeBody[0].y, d);
                }
            } else if(this.snakeBody[0].y === this.snakeBody[i].y) {
                if((this.snakeBody[0].x - this.snakeBody[i].x) >= 0) {
                    l = Math.min(this.snakeBody[0].x - this.snakeBody[i].x, l);
                } else {
                    r = Math.min(this.snakeBody[i].x - this.snakeBody[0].x, r);
                }
            }

            if(i === this.snakeBody.length - 1) {
                this.closestKill = {
                    "U": u,
                    "R": r,
                    "D": d,
                    "L": l
                }
            }
        }
    }

    decideNextMove() {
        let input = [];
        input[0] = this.apple.x / this.xCells;
        input[1] = this.apple.y / this.yCells;
        input[2] = this.snakeBody[0].x / this.xCells;
        input[3] = this.snakeBody[0].y / this.yCells;
        input[4] = this.closestKill["U"] / this.yCells;
        input[5] = this.closestKill["R"] / this.xCells;
        input[6] = this.closestKill["D"] / this.yCells;
        input[7] = this.closestKill["L"] / this.xCells;
        input = math.reshape(math.matrix(input), [8, 1]);

        this.brain.input(input);
        let output = this.brain.predict();
        output = math.transpose(output._data)[0];

        let dirTemplate = ["U", "R", "D", "L"];
        this.direction = dirTemplate[output.indexOf(Math.max(...output))];
    }

    getScore() {
        this.score = (len_w * (this.snakeBody.length - 1)) + (time_w * this.survivalTime);
        // this.score = (this.snakeBody.length - 1) + this.survivalTime;
        return this.score;
    }

    kill() {
        //console.log(this);
        // clearInterval(this.survivalInterval);
    }
}
