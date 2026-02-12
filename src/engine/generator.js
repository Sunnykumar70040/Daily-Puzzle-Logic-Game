import { generateSudokuPuzzle } from '../puzzles/sudoku/generator';

class SeededRNG {
    constructor(seed) {
        this.seed = seed;
    }

    random() {
        let t = (this.seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    range(min, max) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }

    shuffle(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(this.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}

function getSeedFromDate(dateString) {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        const char = dateString.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash);
}

export const generatePuzzle = (type, dateString) => {
    const seed = getSeedFromDate(dateString);
    const rng = new SeededRNG(seed);

    switch (type) {
        case 'sudoku':
            return generateSudokuPuzzle(rng);
        case 'sequence':
            return generateSequence(rng);
        case 'pattern':
            return generatePattern(rng);
        case 'connections':
            return generateConnections(rng);
        case 'equations':
            return generateEquations(rng);
        default:
            throw new Error(`Unknown puzzle type: ${type}`);
    }
};




const generateSequence = (rng) => ({
    type: 'sequence',
    sequence: [rng.range(1, 10), rng.range(11, 20), rng.range(21, 30)],
    missingIndex: 1,
    solution: 'mock-solution'
});

const generatePattern = (rng) => ({
    type: 'pattern',
    items: ['A', 'B', 'C'].sort(() => rng.random() - 0.5),
    solution: 'mock-solution'
});

const generateConnections = (rng) => ({
    type: 'connections',
    nodes: [],
    solution: 'mock-solution'
});

const generateEquations = (rng) => ({
    type: 'equations',
    equation: '1 + ? = 3',
    solution: 2
});

export { SeededRNG, getSeedFromDate };
