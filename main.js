const fs = require('fs');
const { Board } = require('./Board');
const { ASTRSolver } = require('./ASTRSolver');
const { BFSSolver } = require('./BFSSolver');
const { DFSSolver } = require('./DFSSolver');



//Parsing command line arguments
const input_parameters = {
    algorithm_strategy: process.argv[2],
    strategy_additional_parameter: process.argv[3],
    input_filepath: process.argv[4],
    sol_filepath: process.argv[5],
    stats_filepath: process.argv[6]
}
//Setting other parameters
const initial_board = extractInitialBoardFromFile( __dirname + "/413ukladow/" + input_parameters.input_filepath);
const solved_board_array = createSolvedBoard(initial_board.rows, initial_board.cols);
let result = input_parameters.algorithm_strategy === 'astr'
    ? new ASTRSolver(input_parameters.strategy_additional_parameter, initial_board, solved_board_array).solve()
    : input_parameters.algorithm_strategy === 'bfs'
        ? new BFSSolver(input_parameters.strategy_additional_parameter, initial_board, solved_board_array).solve()
        : input_parameters.algorithm_strategy === 'dfs'
            ? new DFSSolver(input_parameters.strategy_additional_parameter, initial_board, solved_board_array).solve()
            : (() => {throw Error("Wrong strategy option")})();
createResultFiles(result, __dirname + "/413ukladow/" + input_parameters.sol_filepath, __dirname + "/413ukladow/" + input_parameters.stats_filepath);


//FUNCTION DEFINITIONS

function extractInitialBoardFromFile(filepath) {
    let file = fs.readFileSync(filepath, 'utf-8').replace(/\n/gi, '');
    const lines = file.split('\r');
    const result_object = new Board(rows=parseInt(lines[0][0]), cols=parseInt(lines[0][2]));
    for(let i = 0; i < rows; i++) {
        let _tmp_this_line = lines[i + 1].split(' ');
        for(let j = 0; j < cols; j++) {
            result_object.boardArray[i][j] = parseInt(_tmp_this_line[j])
        }
    }
    return result_object;
}
function createSolvedBoard(rows, cols) {
    const result_array = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
    let k = 1;
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < rows; j++) {
            result_array[i][j] = k++;
        }
    }
    result_array[rows-1][cols-1] = 0;
    return result_array;
}
function createResultFiles(result, solFilepath, statsFilepath) {
    if (result !== null) {
        fs.writeFileSync(
            solFilepath, 
                result.solvedBoardObject.path.length + 
                '\n'+
                result.solvedBoardObject.path)
        fs.writeFileSync(
            statsFilepath, 
                result.solvedBoardObject.path.length + 
                '\n' +
                result.visitedNodes +
                '\n' + 
                result.processedNodes + 
                '\n' + 
                result.maximumDepth + 
                '\n' +
                result.solvingDuration)
    }
    else {
        fs.writeFileSync(
            solFilepath, 
                "-1")
        fs.writeFileSync(
            statsFilepath, 
                "-1" + 
                '\n' +
                result.visitedNodes +
                '\n' + 
                result.processedNodes + 
                '\n' + 
                result.maximumDepth + 
                '\n' +
                result.solvingDuration)
    }
}