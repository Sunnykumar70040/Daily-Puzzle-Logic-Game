import { openDB } from 'idb';

const DB_NAME = 'PuzzleActivityDB';
const DB_VERSION = 1;
const STORE_NAME = 'dailyActivity';

let dbPromise;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'date' });
                    store.createIndex('synced', 'synced', { unique: false });
                }
            },
        });
    }
    return dbPromise;
}

/**
 * Save or update a daily activity entry.
 * @param {Object} entry - { date: "YYYY-MM-DD", solved, score, timeTaken, difficulty, synced }
 */
export async function saveActivity(entry) {
    const db = await getDB();
    return db.put(STORE_NAME, {
        date: entry.date,
        solved: entry.solved ?? false,
        score: entry.score ?? 0,
        timeTaken: entry.timeTaken ?? 0,
        difficulty: entry.difficulty ?? 'Easy',
        synced: entry.synced ?? false,
    });
}

/**
 * Get a single day's activity.
 * @param {string} date - "YYYY-MM-DD"
 */
export async function getActivity(date) {
    const db = await getDB();
    return db.get(STORE_NAME, date);
}

/**
 * Get all activity entries (used to build heatmap).
 * @returns {Array} list of activity objects
 */
export async function getAllActivity() {
    const db = await getDB();
    return db.getAll(STORE_NAME);
}

/**
 * Get all unsynced entries for server sync.
 */
export async function getUnsyncedActivity() {
    const db = await getDB();
    return db.getAllFromIndex(STORE_NAME, 'synced', false);
}

/**
 * Mark a date as synced after successful server push.
 * @param {string} date - "YYYY-MM-DD"
 */
export async function markSynced(date) {
    const db = await getDB();
    const entry = await db.get(STORE_NAME, date);
    if (entry) {
        entry.synced = true;
        return db.put(STORE_NAME, entry);
    }
}

/**
 * Seed test data for a range of past days (dev/demo only).
 * @param {number} count - number of days back to seed
 */
export async function seedTestData(count = 30) {
    const dayjs = (await import('dayjs')).default;
    const difficulties = ['Easy', 'Medium', 'Hard'];
    for (let i = 0; i < count; i++) {
        const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
        const solved = Math.random() > 0.2;
        if (solved) {
            const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            await saveActivity({
                date,
                solved: true,
                score: Math.floor(Math.random() * 900) + 100,
                timeTaken: Math.floor(Math.random() * 600) + 30,
                difficulty,
                synced: false,
            });
        }
    }
}
