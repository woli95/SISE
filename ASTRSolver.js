const { PriorityQueue } = require('./queues');
const { performance } = require('perf_hooks');
const _ = require('lodash');


function checkIfBoardIsSolved (boardArrayA, boardArrayB) {
    return _.isEqual(boardArrayA, boardArrayB);
}

class ASTRSolver {
    constructor(distanceHeuristics, initialBoardObject, solvedBoardArray) {
        this.distanceHeuristics = distanceHeuristics;
        this.initialBoardObject = initialBoardObject;
        this.solvedBoardArray = solvedBoardArray;
        this.processedStates = new Set();
        this.openStates = new PriorityQueue();
        this.maximumDepth = 0;
    }
    solve() {
        const algorithm_start_time = performance.now();
        calculateDistance = this.distanceHeuristics === 'hamm' ? this.calculateHammingDistance : this.calculateManhattanDistance;
        let visitedNodesCount = 0, 
            processedNodesCount = 0;


        if(checkIfBoardIsSolved(this.initialBoardObject.boardArray, this.solvedBoardArray) === true) {
            return {
                solvingDuration: performance.now() - algorithm_start_time,
                solvedBoardObject: this.initialBoardObject,
                maximumDepth: this.maximumDepth,
                visitedNodes: this.processedStates.size + this.openStates.queue.length,
                processedNodes: this.processedStates.size
            }
        }
        else {
            this.openStates.enqueue(this.initialBoardObject, calculateDistance(this.initialBoardObject, this.solvedBoardArray));
            while(!this.openStates.isEmpty()) {
                const current_board = this.openStates.dequeue();
                processedNodesCount++;
                this.processedStates.add(JSON.stringify(current_board.boardArray));
                if (current_board.path.length > this.maximumDepth) 
                    this.maximumDepth = current_board.path.length;
                let current_board_children = current_board.getChildren(['D', 'R', 'U', 'L']);
                for(let i = 0; i < current_board_children.length; i++) {
                    if (current_board_children[i].path.length > this.maximumDepth)
                        this.maximumDepth = current_board_children[i].path.length;
                    if (this.processedStates.has(JSON.stringify(current_board_children[i].boardArray)) || this.openStates.doesContainArrayOfThisBoard(current_board_children[i])) {
                        continue;
                    }
                    if (checkIfBoardIsSolved(current_board_children[i].boardArray, this.solvedBoardArray)) {
                        return {
                            solvingDuration: performance.now() - algorithm_start_time,
                            solvedBoardObject: current_board_children[i],
                            maximumDepth: this.maximumDepth,
                            // visitedNodes: this.processedStates.size + this.openStates.queue.length,
                            // processedNodes: this.processedStates.size
                            visitedNodes: visitedNodesCount,
                            processedNodes: processedNodesCount
                        }
                    }
                    else {
                        this.openStates.enqueue(current_board_children[i], calculateDistance(current_board_children[i], this.solvedBoardArray));
                        visitedNodesCount++;
                    }
                }
            }
        }
    }
    
    calculateHammingDistance(boardObject, boardArrayB) {
        const flatA = boardObject.boardArray.flat();
        const flatB = boardArrayB.flat();
        let _error = 0;
        
        for(let i = 0; i < flatA.length; i++) {
            if(flatA[i] !== flatB[i] && flatA[i] !== 0)
                _error += 1
        }
        return _error + boardObject.path.length;
        
    }
    calculateManhattanDistance(boardObject, boardArrayB) {
        const flatA = boardObject.boardArray.flat();
        const flatB = boardArrayB.flat();
        let _error = 0;
        
        for(let i = 0; i < flatA.length; i++) {
            if(flatA[i] !== flatB[i] && flatA[i] !== 0) {
                const cc = (flatA[i] - 1) % boardObject.cols;
                const cr = (flatA[i] - 1) / boardObject.rows;
                const ic = i % boardObject.cols;
                const ir = i / boardObject.rows;
                _error += Math.abs(cc - ic) + Math.abs(cr - ir);
            }
        }
        return _error + boardObject.path.length;
    }

}

module.exports = { ASTRSolver }