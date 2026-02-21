export const validateSudokuState = (currentState, puzzleData) => {
    const { grid } = currentState;
    const { solution } = puzzleData;
    const errors = [];



    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const userVal = grid[r][c];
            const solVal = solution[r][c];

            if (userVal !== null && userVal !== solVal) {
                errors.push({ row: r, col: c, type: 'incorrect' });
            }

            if (userVal === null) {
                errors.push({ row: r, col: c, type: 'incomplete' });
            }
        }
    }

    return { valid: errors.length === 0, errors };
};
