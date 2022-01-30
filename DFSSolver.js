const { LifoQueue } = require('./queues');
const { performance } = require('perf_hooks');
const { _ } = require('lodash');

function checkIfBoardIsSolved (boardArrayA, boardArrayB) {
    return _.isEqual(boardArrayA, boardArrayB);
}

class DFSSolver {
    constructor(order, initialBoardObject, solvedBoardArray) {
        this.order = _.map(order, (direction) => {return direction;});
        this.initialBoardObject = initialBoardObject;
        this.solvedBoardArray = solvedBoardArray;
        this.processedStates = new Set();
        this.openStates = new LifoQueue();
        this.maximumDepth = 0;
        this.MAX = 20;
    }

    solve() {
        let processedNodesCount = 0, visitedNodesCount = 0;
        
        const algorithm_start_time = performance.now();
        this.openStates.enqueue(this.initialBoardObject);


        while(!this.openStates.isEmpty()) {
            const current_board = this.openStates.dequeue();
            this.processedStates.add(JSON.stringify(current_board.boardArray));
            if (current_board.path.length >= this.MAX) {
                continue;
            }
            else {
                processedNodesCount++;
                if (current_board.path.length > this.maximumDepth) {
                    this.maximumDepth = current_board.path.length;
                }
                let current_board_children = current_board.getChildren(this.order).reverse();
                for(let i = 0; i < current_board_children.length; i++) {
                    if (current_board_children[i].path.length > this.maximumDepth)
                        this.maximumDepth = current_board_children[i].path.length;
                    if (!(this.processedStates.has(current_board_children[i].boardArray || this.openStates.doesContainArrayOfThisBoard(current_board_children[i])))) {
                        visitedNodesCount++;
                        if(checkIfBoardIsSolved(current_board_children[i].boardArray, this.solvedBoardArray)) {
                            return {
                                solvingDuration: performance.now() - algorithm_start_time,
                                solvedBoardObject: current_board_children[i],
                                maximumDepth: this.maximumDepth,
                                visitedNodes: visitedNodesCount,
                                processedNodes: processedNodesCount
                            }
                        }
                        else {
                            this.openStates.enqueue(current_board_children[i]);
                        }
                    }
                }
            }
        }
        console.log("NIE ZNALEZIONO");
        return {
            solvingDuration: performance.now() - algorithm_start_time,
            solvedBoardObject: null,
            maximumDepth: this.maximumDepth,
            visitedNodes: this.processedStates.size + this.openStates.queue.length,
            processedNodes: this.processedStates.size
        }
    }
}

module.exports = { DFSSolver };