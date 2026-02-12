import { useState, useEffect, useCallback } from 'react';
import { generatePuzzle } from './generator';
import { saveProgress, loadProgress } from './storage';
import { validatePuzzle } from './validator';

export const useGame = (dateString, puzzleType) => {
    const [gameState, setGameState] = useState(null);
    const [puzzleData, setPuzzleData] = useState(null);
    const [isSolved, setIsSolved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const saved = loadProgress(dateString, puzzleType);

        try {
            const generated = generatePuzzle(puzzleType, dateString);
            setPuzzleData(generated);

            if (saved && saved.puzzleDataSignature === generated.signature) {
                setGameState(saved.gameState);
                setIsSolved(saved.isSolved || false);
            } else {
                setGameState(generated.initialState || {});
                setIsSolved(false);
            }
        } catch (e) {
            console.error("Error generating puzzle", e);
        } finally {
            setLoading(false);
        }

    }, [dateString, puzzleType]);

    useEffect(() => {
        if (gameState && puzzleData) {
            saveProgress(dateString, puzzleType, {
                gameState,
                isSolved,
                puzzleDataSignature: puzzleData.signature
            });
        }
    }, [gameState, isSolved, dateString, puzzleType, puzzleData]);

    const onMove = useCallback((newState) => {
        if (isSolved) return;
        setGameState(newState);
    }, [isSolved]);

    const onCheck = useCallback(() => {
        if (!puzzleData || !gameState) return;

        const result = validatePuzzle(puzzleType, gameState, puzzleData);
        if (result.valid) {
            setIsSolved(true);
            if (result.valid) {
                setIsSolved(true);
            }
        }
        return result;
    }, [puzzleType, gameState, puzzleData]);

    return {
        gameState,
        puzzleData,
        loading,
        isSolved,
        onMove,
        onCheck
    };
};
