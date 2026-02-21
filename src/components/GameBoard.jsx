import React, { useEffect, useState } from "react";
import { useGame } from "../engine/useGame";
import SudokuComponent from "../puzzles/sudoku/component";
import "./GameBoard.css";

const GameBoard = ({
    dateString,
    puzzleType = "sudoku",
    difficulty,
    onMistake,
    onGameStart,
    onGameEnd,
    timer = 0,
    mistakes = 0
}) => {

    ////////////////////////////////////////////////////////////
    // 🔥 useGame Hook
    ////////////////////////////////////////////////////////////

    const {
        gameState,
        puzzleData,
        loading,
        isSolved,
        onMove,
        onCheck
    } = useGame(
        puzzleType,
        dateString,
        difficulty,
        timer,
        mistakes
    );

    const [checkResult, setCheckResult] = useState(null);
    const [showCongrats, setShowCongrats] = useState(false);

    ////////////////////////////////////////////////////////////
    // 🎯 When Puzzle Solved
    ////////////////////////////////////////////////////////////

    useEffect(() => {
        if (isSolved) {
            setShowCongrats(true);

            if (onGameEnd) {
                onGameEnd(true);
            }
        }
    }, [isSolved, onGameEnd]);

    ////////////////////////////////////////////////////////////
    // ⏳ Loading
    ////////////////////////////////////////////////////////////

    if (loading) {
        return (
            <div className="loading glass-panel">
                Generating Puzzle...
            </div>
        );
    }

    ////////////////////////////////////////////////////////////
    // ❌ Error
    ////////////////////////////////////////////////////////////

    if (!gameState || !puzzleData) {
        return (
            <div className="error glass-panel">
                Failed to load puzzle.
            </div>
        );
    }

    ////////////////////////////////////////////////////////////
    // 🎮 Handle Move
    ////////////////////////////////////////////////////////////

    const handleMove = (newState, row, col, val) => {
        if (checkResult) setCheckResult(null);

        if (puzzleData.initialGrid[row][col] !== 0) return;

        if (val !== 0 && val !== null) {
            if (
                puzzleData.solution &&
                puzzleData.solution[row][col] !== val
            ) {
                if (onMistake) onMistake();
            }
        }

        const newGrid = newState.grid.map(r => [...r]);
        newGrid[row][col] = val;

        onMove({ ...gameState, grid: newGrid });
    };

    ////////////////////////////////////////////////////////////
    // ✅ Check Solution
    ////////////////////////////////////////////////////////////

    const handleCheck = () => {
        const result = onCheck();
        setCheckResult(result);
    };

    ////////////////////////////////////////////////////////////
    // 🧩 Render Puzzle
    ////////////////////////////////////////////////////////////

    const renderPuzzle = () => {
        if (!puzzleType) return <div>Invalid puzzle type</div>;

        switch (puzzleType) {
            case "sudoku":
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
                return (
                    <div>
                        Puzzle type "{puzzleType}" not implemented.
                    </div>
                );
        }
    };

    ////////////////////////////////////////////////////////////
    // 🎨 UI
    ////////////////////////////////////////////////////////////

    return (
        <div className="game-board-container">

            {renderPuzzle()}

            <div className="controls">
                <button
                    onClick={handleCheck}
                    disabled={isSolved}
                    className="action-btn btn-primary"
                >
                    Check Solution
                </button>
            </div>


            {showCongrats && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>🎉 Congratulations!</h2>
                        <p>You have solved the puzzle!</p>

                        <button
                            className="action-btn btn-accent"
                            onClick={() => setShowCongrats(false)}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameBoard;