class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.boardArray = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
        this.path = "";
        this.possibleMovements = undefined;
    }

    findPositionOf0() {
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                if (this.boardArray[i][j] === 0) {
                    return [i, j];
                }
            }
        }
    }
    updatePossibleMovements(order) {
        this.possibleMovements = order.map((it) => {return it;})
        const [row_0, col_0] = this.findPositionOf0();
        if(col_0 === this.cols - 1)
            this.possibleMovements.splice(this.possibleMovements.indexOf('R'), 1);
        if(col_0 === 0)
            this.possibleMovements.splice(this.possibleMovements.indexOf('L'), 1);
        if(row_0 === this.rows - 1)
            this.possibleMovements.splice(this.possibleMovements.indexOf('D'), 1);
        if(row_0 === 0)
            this.possibleMovements.splice(this.possibleMovements.indexOf('U'), 1);

    }
    getChildren(order) {
        const [row_0, col_0] = this.findPositionOf0();
        this.updatePossibleMovements(order);
        let children = [];
        for(let i = 0; i < this.possibleMovements.length; i++) {
            const new_child = new Board(rows=this.rows, cols=this.cols);
            new_child.path = this.path;
            let new_board = JSON.parse(JSON.stringify(this.boardArray));
            switch(this.possibleMovements[i]) {
                case "U":
                    new_board[row_0][col_0] = new_board[row_0 - 1][col_0];
                    new_board[row_0 - 1][col_0] = 0;
                    new_child.path += "U";
                    break;
                case "D":
                    new_board[row_0][col_0] = new_board[row_0 + 1][col_0];
                    new_board[row_0 + 1][col_0] = 0;
                    new_child.path += "D";
                    break;
                case "L":
                    new_board[row_0][col_0] = new_board[row_0][col_0 - 1];
                    new_board[row_0][col_0 - 1] = 0;
                    new_child.path += "L";
                    break;
                case "R":
                    new_board[row_0][col_0] = new_board[row_0][col_0 + 1];
                    new_board[row_0][col_0 + 1] = 0;
                    new_child.path += "R";
                    break;
            }
            new_child.boardArray = new_board;
            children.push(new_child);
        }
        return children;
    }

}

module.exports = { Board };