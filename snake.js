class Snake {
    constructor(xCells, yCells) {
        this.score = 0;
        this.xCells = xCells;
        this.yCells = yCells;
        this.direction = "R";
        this.brain = new NeuralNetwork([8, 8, 4]);
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
    }

    collision() {
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
        let u = 50, d = 50, r = 50, l = 50;
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

        this.brain.input(input);
        let output = this.brain.predict();
        output = math.transpose(output._data);

        let dirTemplate = ["U", "R", "D", "L"];
        this.direction = dirTemplate[output.indexOf(Math.max(...output))];

        console.log(this.direction);
        console.log(output);
    }

    getScore() {
        this.score = this.snakeBody.length - 1;
        return this.score;
    }

    kill() {
        //console.log(this);
    }
}
