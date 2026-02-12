const STORAGE_KEY_PREFIX = 'daily_puzzle_';

export const saveProgress = (dateString, puzzleType, state) => {
    try {
        const key = `${STORAGE_KEY_PREFIX}${dateString}_${puzzleType}`;
        const data = JSON.stringify(state);
        localStorage.setItem(key, data);
        return true;
    } catch (error) {
        console.error('Failed to save progress:', error);
        return false;
    }
};

export const loadProgress = (dateString, puzzleType) => {
    try {
        const key = `${STORAGE_KEY_PREFIX}${dateString}_${puzzleType}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to load progress:', error);
        return null;
    }
};

export const clearProgress = (dateString, puzzleType) => {
    try {
        const key = `${STORAGE_KEY_PREFIX}${dateString}_${puzzleType}`;
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Failed to clear progress:', error);
    }
};
