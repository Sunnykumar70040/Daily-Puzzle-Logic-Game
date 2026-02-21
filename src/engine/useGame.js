import { useState, useEffect, useCallback, useRef } from "react";
import { generatePuzzle } from "./generator";
import { saveProgress, loadProgress } from "./storage";
import { validatePuzzle } from "./validator";
import { saveActivity } from "../db/activityDB";
import { computeScore } from "./streakUtils";

// ✅ FIXED PARAMETER ORDER
export const useGame = (
    puzzleType,
    dateString,
    difficulty = "Easy",
    timer = 0,
    mistakes = 0
) => {
    const [gameState, setGameState] = useState(null);
    const [puzzleData, setPuzzleData] = useState(null);
    const [isSolved, setIsSolved] = useState(false);
    const [loading, setLoading] = useState(true);
    const activitySaved = useRef(false);

    ////////////////////////////////////////////////////////////
    // 🔥 Generate / Load Puzzle
    ////////////////////////////////////////////////////////////

    useEffect(() => {
        if (!puzzleType) return;

        setLoading(true);
        activitySaved.current = false;

        const saved = loadProgress(dateString, puzzleType);

        try {
            const generated = generatePuzzle(
                puzzleType,
                dateString,
                difficulty
            );

            setPuzzleData(generated);

            if (
                saved &&
                saved.puzzleDataSignature === generated.signature
            ) {
                setGameState(saved.gameState);
                setIsSolved(saved.isSolved || false);
            } else {
                setGameState(generated.initialState || {});
                setIsSolved(false);
            }
        } catch (e) {
            console.error("Error generating puzzle:", e);
            setPuzzleData(null);
            setGameState(null);
        } finally {
            setLoading(false);
        }
    }, [puzzleType, dateString, difficulty]);

    ////////////////////////////////////////////////////////////
    // 💾 Save Progress (localStorage)
    ////////////////////////////////////////////////////////////

    useEffect(() => {
        if (gameState && puzzleData) {
            saveProgress(dateString, puzzleType, {
                gameState,
                isSolved,
                puzzleDataSignature: puzzleData.signature,
            });
        }
    }, [gameState, isSolved, dateString, puzzleType, puzzleData]);

    ////////////////////////////////////////////////////////////
    // 🏆 Save Daily Activity (IndexedDB)
    ////////////////////////////////////////////////////////////

    useEffect(() => {
        if (isSolved && !activitySaved.current) {
            activitySaved.current = true;

            const score = computeScore({
                mistakes,
                timeTaken: timer,
                difficulty,
            });

            saveActivity({
                date: dateString,
                solved: true,
                score,
                timeTaken: timer,
                difficulty,
                synced: false,
            }).catch((err) =>
                console.warn("[useGame] Failed to save activity:", err)
            );
        }
    }, [isSolved, dateString, difficulty, timer, mistakes]);

    ////////////////////////////////////////////////////////////
    // 🎮 Handle Move
    ////////////////////////////////////////////////////////////

    const onMove = useCallback(
        (newState) => {
            if (isSolved) return;
            setGameState(newState);
        },
        [isSolved]
    );

    ////////////////////////////////////////////////////////////
    // ✅ Check Puzzle
    ////////////////////////////////////////////////////////////

    const onCheck = useCallback(() => {
        if (!puzzleData || !gameState) return;

        const result = validatePuzzle(
            puzzleType,
            gameState,
            puzzleData
        );

        if (result.valid) {
            setIsSolved(true);
        }

        return result;
    }, [puzzleType, gameState, puzzleData]);

    return {
        gameState,
        puzzleData,
        loading,
        isSolved,
        onMove,
        onCheck,
    };
};