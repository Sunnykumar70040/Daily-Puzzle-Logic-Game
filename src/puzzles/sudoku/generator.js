const isValid = (board, row, col, num) => {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }

    return true;
};

const solveSudoku = (board, rng) => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const nums = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

                for (let num of nums) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board, rng)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

export const generateSudokuPuzzle = (rng, difficulty = 'Easy') => {
    const fullBoard = Array(9).fill().map(() => Array(9).fill(0));
    solveSudoku(fullBoard, rng);

    const puzzle = fullBoard.map(row => [...row]);

    let cellsToRemove;
    switch (difficulty) {
        case 'Easy': cellsToRemove = 30; break;
        case 'Medium': cellsToRemove = 40; break;
        case 'Hard': cellsToRemove = 50; break;
        default: cellsToRemove = 30;
    }

    for (let i = 0; i < cellsToRemove; i++) {
        let row = rng.range(0, 8);
        let col = rng.range(0, 8);
        while (puzzle[row][col] === 0) {
            row = rng.range(0, 8);
            col = rng.range(0, 8);
        }
        puzzle[row][col] = 0;
    }

    const initialState = {
        grid: puzzle.map(row => row.map(cell => cell !== 0 ? cell : null)),
        notes: Array(9).fill().map(() => Array(9).fill([]))
    };

    return {
        type: 'sudoku',
        signature: 'v1-' + rng.random(),
        initialGrid: puzzle,
        solution: fullBoard,
        initialState,
        difficulty
    };
};
