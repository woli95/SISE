const { FifoQueue } = require('./queues');
const { performance } = require('perf_hooks');
const { _ } = require('lodash');

function checkIfBoardIsSolved (boardArrayA, boardArrayB) {
    return _.isEqual(boardArrayA, boardArrayB);
}

class BFSSolver {
    constructor(order, initialBoardObject, solvedBoardArray) {
        this.order = _.map(order, (direction) => {return direction;});
        this.initialBoardObject = initialBoardObject;
        this.solvedBoardArray = solvedBoardArray;
        this.processedStates = new Set();
        this.openStates = new FifoQueue();
        this.maximumDepth = 0;
    }
    solve() {
        const algorithm_start_time = performance.now();
        // if(checkIfBoardIsSolved(this.initialBoardObject.boardArray, this.solvedBoardArray)) {
        //     return {
        //         solvingDuration: performance.now() - algorithm_start_time,
        //         solvedBoardObject: this.initialBoardObject,
        //         maximumDepth: this.maximumDepth,
        //         visitedNodes: this.processedStates.size + this.openStates.queue.length,
        //         processedNodes: this.processedStates.size
        //     }
        // }
        // else {
            this.openStates.enqueue(this.initialBoardObject);
            while(!this.openStates.isEmpty()) {
                const current_board = this.openStates.dequeue();
                this.processedStates.add(JSON.stringify(current_board.boardArray))
                if (current_board.path.length > this.maximumDepth)
                    this.maximumDepth = current_board_children[i].path.length;
                if(checkIfBoardIsSolved(current_board.boardArray, this.solvedBoardArray)) {
                    return {
                        solvingDuration: performance.now() - algorithm_start_time,
                        solvedBoardObject: current_board,
                        maximumDepth: this.maximumDepth,
                        visitedNodes: this.processedStates.size + this.openStates.queue.length,
                        processedNodes: this.processedStates.size
                    }
                }
                let current_board_children = current_board.getChildren(this.order);
                for(let i = 0; i < current_board_children.length; i++) {
                    if (current_board_children[i].path.length > this.maximumDepth)
                        this.maximumDepth = current_board_children[i].path.length;
                    if (!this.processedStates.has(JSON.stringify(current_board_children[i].boardArray))) {
                        if(checkIfBoardIsSolved(current_board_children[i].boardArray, this.solvedBoardArray)) {
                            return {
                                solvingDuration: performance.now() - algorithm_start_time,
                                solvedBoardObject: current_board_children[i],
                                maximumDepth: this.maximumDepth,
                                visitedNodes: this.processedStates.size + this.openStates.queue.length,
                                processedNodes: this.processedStates.size
                            }
                        }
                        this.openStates.enqueue(current_board_children[i]);
                    }
                }
            }
            console.log("NIE ZNALAZŁEM")
            return {
                solvingDuration: performance.now() - algorithm_start_time,
                solvedBoardObject: null,
                maximumDepth: this.maximumDepth,
                visitedNodes: this.processedStates.size + this.openStates.queue.length,
                processedNodes: this.processedStates.size
            }
        // }
    }
}

module.exports = { BFSSolver };