import React, { useState, useEffect, useCallback } from 'react';
import './Sudoku.css';

const SudokuComponent = ({ gameState, initialGrid, onMove, isSolved, checkResult }) => {
    const { grid: userGrid } = gameState || { grid: [] };
    const [selectedCell, setSelectedCell] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedCell) return;
            const { row, col } = selectedCell;

            if (initialGrid && initialGrid[row][col] !== 0) {
                return;
            }

            if (e.key >= '1' && e.key <= '9') {
                const num = parseInt(e.key);
                updateCell(row, col, num);
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                updateCell(row, col, null);
            } else if (e.key.startsWith('Arrow')) {
                moveSelection(e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCell, userGrid, initialGrid]);

    const updateCell = (row, col, value) => {
        if (initialGrid && initialGrid[row][col] !== 0) {
            return;
        }

        const newGrid = userGrid.map(r => [...r]);
        newGrid[row][col] = value;

        if (onMove) {
            onMove({ ...gameState, grid: newGrid }, row, col, value);
        }
    };

    const moveSelection = (key) => {
        if (!selectedCell) return;
        let { row, col } = selectedCell;
        if (key === 'ArrowUp') row = Math.max(0, row - 1);
        if (key === 'ArrowDown') row = Math.min(8, row + 1);
        if (key === 'ArrowLeft') col = Math.max(0, col - 1);
        if (key === 'ArrowRight') col = Math.min(8, col + 1);
        setSelectedCell({ row, col });
    };

    const getError = (r, c) => {
        if (!checkResult || !checkResult.errors) return null;
        return checkResult.errors.find(e => e.row === r && e.col === c);
    };

    if (!userGrid || userGrid.length === 0) return <div>Loading...</div>;

    return (
        <div className="sudoku-container">
            <div className={`sudoku-board ${isSolved ? 'solved' : ''}`}>
                {userGrid.map((row, rIndex) => (
                    row.map((cellValue, cIndex) => {
                        const isSelected = selectedCell?.row === rIndex && selectedCell?.col === cIndex;
                        const isInitial = initialGrid && initialGrid[rIndex][cIndex] !== 0;
                        const error = getError(rIndex, cIndex);
                        const isIncorrect = error && error.type === 'incorrect';

                        return (
                            <div
                                key={`${rIndex}-${cIndex}`}
                                className={`sudoku-cell 
                                    ${isSelected ? 'selected' : ''} 
                                    ${isInitial ? 'initial' : 'user-input'}
                                    ${isIncorrect ? 'error' : ''}
                                    ${(cIndex + 1) % 3 === 0 && cIndex !== 8 ? 'border-right' : ''}
                                    ${(rIndex + 1) % 3 === 0 && rIndex !== 8 ? 'border-bottom' : ''}
                                `}
                                onClick={() => setSelectedCell({ row: rIndex, col: cIndex })}
                            >
                                {cellValue === 0 ? '' : cellValue}
                            </div>
                        );
                    })
                ))}
            </div>

            <div className="numpad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        className="num-btn"
                        onClick={() => {
                            if (selectedCell) {
                                updateCell(selectedCell.row, selectedCell.col, num);
                            }
                        }}
                    >
                        {num}
                    </button>
                ))}
                <button
                    className="num-btn clear-btn"
                    onClick={() => {
                        if (selectedCell) {
                            updateCell(selectedCell.row, selectedCell.col, null);
                        }
                    }}
                >
                    X
                </button>
            </div>

            <div className="controls-hint">
                Select a cell and use the number pad or keyboard to input values.
            </div>
        </div>
    );
};

export default SudokuComponent;
