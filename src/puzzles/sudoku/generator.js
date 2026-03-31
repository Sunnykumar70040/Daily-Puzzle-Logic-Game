const isValid = (board, row, col, num) => {
    // Check row and column
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }

    return true;
};

// Fills board randomly using rng to create a valid full sudoku board
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

// Counts the number of valid solutions for a given board (early exit if > 1)
const countSolutions = (board) => {
    let count = 0;
    
    // Fast in-place solver for counting
    const solve = () => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            solve();
                            board[row][col] = 0;
                            if (count > 1) return; // Optimization: we only care if it's strictly 1
                        }
                    }
                    return;
                }
            }
        }
        count++;
    };
    
    solve();
    return count;
};

export const generateSudokuPuzzle = (rng, difficulty = 'Easy') => {
    // 1. Generate full completed board
    const fullBoard = Array(9).fill().map(() => Array(9).fill(0));
    solveSudoku(fullBoard, rng);

    // 2. Clone it for the puzzle
    const puzzle = fullBoard.map(row => [...row]);

    // 3. Determine how many cells to remove based on difficulty
    let targetEmptyCells;
    switch (difficulty) {
        case 'Easy': targetEmptyCells = 35; break;
        case 'Medium': targetEmptyCells = 45; break;
        case 'Hard': targetEmptyCells = 55; break;
        default: targetEmptyCells = 35;
    }

    // 4. Create a list of all positions and shuffle them
    const positions = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            positions.push({ r, c });
        }
    }
    const shuffledPositions = rng.shuffle(positions);

    // 5. Try to remove cells one by one while guaranteeing unique solution
    let removed = 0;
    for (let i = 0; i < shuffledPositions.length; i++) {
        if (removed >= targetEmptyCells) break;

        const { r, c } = shuffledPositions[i];
        const backup = puzzle[r][c];
        
        // Temporarily remove
        puzzle[r][c] = 0;
        
        // Check if removing this cell creates multiple solutions
        // We must clone the grid because countSolutions modifies the board during tracking
        const copyBoard = puzzle.map(row => [...row]);
        
        if (countSolutions(copyBoard) !== 1) {
            // Revert removal if solution is no longer unique
            puzzle[r][c] = backup;
        } else {
            removed++;
        }
    }

    const initialState = {
        grid: puzzle.map(row => row.map(cell => cell !== 0 ? cell : null)),
        notes: Array(9).fill().map(() => Array(9).fill([]))
    };

    return {
        type: 'sudoku',
        signature: 'v2-' + rng.random(),
        initialGrid: puzzle,
        solution: fullBoard,
        initialState,
        difficulty
    };
};
