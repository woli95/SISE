const _ = require('lodash');

class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(board, error) {
        this.queue.push([board, error])
    }

    dequeue() {
        let minimum_idx = 0
        let minimum_error = this.queue[0][1]
        for(let i = 0; i < this.queue.length; i++) {
            if(this.queue[i][1] < minimum_error) {
                minimum_error = this.queue[i][1];
                minimum_idx = i;
            }
        }
        let element = this.queue[minimum_idx][0]
        this.queue.splice(minimum_idx, 1);
        return element;
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    doesContainArrayOfThisBoard(element) {
        for(let i = 0; i < this.queue.length; i++) {
            if(_.isEqual(element.boardArray, this.queue[i].boardArray))
                return true;
        }
        return false;
    }
}

class FifoQueue {
    constructor() {
        this.queue = [];
    }
    enqueue(board) {
        this.queue.push(board);
    }
    dequeue() {
        let element = this.queue[0];
        this.queue.splice(0, 1);
        return element;
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

class LifoQueue {
    constructor() {
        this.queue = [];
    }
    enqueue(board) {
        this.queue.push(board);
    }
    dequeue() {
        return this.queue.pop();
    }
    isEmpty() {
        return this.queue.length === 0;
    }
}
module.exports = { PriorityQueue, FifoQueue, LifoQueue };