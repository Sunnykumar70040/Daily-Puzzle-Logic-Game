import React from 'react';
import { useGame } from '../engine/useGame';
import SudokuComponent from '../puzzles/sudoku/component';
import './GameBoard.css';

const GameBoard = ({ dateString, puzzleType }) => {
    const {
        gameState,
        puzzleData,
        loading,
        isSolved,
        onMove,
        onCheck
    } = useGame(dateString, puzzleType);

    const [checkResult, setCheckResult] = React.useState(null);

    if (loading) {
        return <div className="loading">Generating Puzzle...</div>;
    }

    if (!gameState || !puzzleData) {
        return <div className="error">Failed to load puzzle.</div>;
    }

    const handleMove = (newState, row, col, val) => {
        if (checkResult) setCheckResult(null);

        if (puzzleData.initialGrid[row][col] !== 0) {
            return;
        }

        const newGrid = newState.grid;
        newGrid[row][col] = val;

        onMove({ ...gameState, grid: newGrid });
    };

    const handleCheck = () => {
        const result = onCheck();
        setCheckResult(result);
    };

    const renderPuzzle = () => {
        switch (puzzleType) {
            case 'sudoku':
            case 'sudoku':
                return (
                    <SudokuComponent
                        gameState={gameState}
                        initialGrid={puzzleData.initialGrid}
                        onMove={handleMove}
                        isSolved={isSolved}
                        checkResult={checkResult}
                    />
                );
            default:
                return <div>Puzzle type {puzzleType} not implemented yet.</div>;
        }
    };

    return (
        <div className="game-board-container">
            <div className="header">
                <h2>{puzzleType.toUpperCase()} - {dateString}</h2>
                {isSolved && <div className="success-badge">SOLVED!</div>}
                {!isSolved && checkResult && !checkResult.valid && (
                    <div className="error-badge">
                        {checkResult.errors.find(e => e.type === 'incorrect') ? 'Incorrect cells found!' : 'Puzzle incomplete!'}
                    </div>
                )}
            </div>

            {renderPuzzle()}

            <div className="controls">
                <button onClick={handleCheck} disabled={isSolved}>
                    Check Solution
                </button>
            </div>
        </div>
    );
};

export default GameBoard;
