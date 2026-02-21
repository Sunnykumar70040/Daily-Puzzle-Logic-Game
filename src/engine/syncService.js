import { getUnsyncedActivity, markSynced } from '../db/activityDB';

const API_ENDPOINT = '/api/sync/daily-scores';

/**
 * Sync all unsynced activity entries to the server.
 * Silently no-ops if offline or unauthenticated.
 */
export async function syncPendingActivity(authToken = null) {
    if (!navigator.onLine) return { synced: 0, reason: 'offline' };
    if (!authToken) return { synced: 0, reason: 'unauthenticated' };

    try {
        const unsynced = await getUnsyncedActivity();
        if (!unsynced || unsynced.length === 0) return { synced: 0, reason: 'nothing_to_sync' };

        const payload = {
            entries: unsynced.map(e => ({
                date: e.date,
                score: e.score,
                timeTaken: e.timeTaken,
            })),
        };

        const res = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`Server responded ${res.status}`);

        // Mark all as synced locally
        await Promise.all(unsynced.map(e => markSynced(e.date)));

        return { synced: unsynced.length };
    } catch (err) {
        console.warn('[SyncService] sync failed:', err.message);
        return { synced: 0, reason: err.message };
    }
}

/**
 * Register online event listener to auto-sync when connection restores.
 */
export function registerOnlineSync(getAuthToken) {
    window.addEventListener('online', () => {
        const token = getAuthToken?.();
        syncPendingActivity(token);
    });
}
