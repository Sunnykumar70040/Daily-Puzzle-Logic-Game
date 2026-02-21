import dayjs from 'dayjs';

/**
 * Convert an array of activity entries into a date-keyed map.
 * @param {Array} activityList
 * @returns {{ [dateStr]: activityEntry }}
 */
export function processActivityData(activityList) {
    const map = {};
    for (const entry of activityList) {
        map[entry.date] = entry;
    }
    return map;
}

/**
 * Calculate current consecutive streak (days solved up to today).
 * @param {{ [dateStr]: activityEntry }} activityMap
 * @returns {number} streak count
 */
export function calculateStreak(activityMap) {
    let streak = 0;
    let current = dayjs();

    while (true) {
        const dateStr = current.format('YYYY-MM-DD');
        const entry = activityMap[dateStr];
        if (entry?.solved) {
            streak++;
            current = current.subtract(1, 'day');
        } else {
            // Allow today to be unsolved (don't break streak)
            if (streak === 0 && dateStr === dayjs().format('YYYY-MM-DD')) {
                current = current.subtract(1, 'day');
                // check yesterday
                const yest = activityMap[current.format('YYYY-MM-DD')];
                if (yest?.solved) {
                    // streak continues from yesterday
                    continue;
                }
            }
            break;
        }
    }

    return streak;
}

/**
 * Get intensity level 0-4 for a given activity entry.
 * 0 = not played, 1 = easy solved, 2 = medium, 3 = hard, 4 = perfect (score >= 900)
 * @param {Object|undefined} entry
 * @returns {number} 0-4
 */
export function getIntensityLevel(entry) {
    if (!entry || !entry.solved) return 0;

    if (entry.score >= 900) return 4;

    switch (entry.difficulty) {
        case 'Hard': return 3;
        case 'Medium': return 2;
        case 'Easy': return 1;
        default: return 1;
    }
}

/**
 * Build the full 365/366-day grid for the current year.
 * Returns weeks as columns (array of 7-element arrays).
 * @param {number} [year] - defaults to current year
 * @returns {Array<Array<dayjs | null>>} weeks × days
 */
export function buildYearGrid(year) {
    const targetYear = year || dayjs().year();
    const startOfYear = dayjs(`${targetYear}-01-01`);
    const endOfYear = dayjs(`${targetYear}-12-31`);

    // Pad start so first week column starts on Sunday (0)
    const startDayOfWeek = startOfYear.day(); // 0=Sun,6=Sat
    const days = [];

    // Add null padding for days before Jan 1
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
    }

    // Add every day of the year
    let cursor = startOfYear;
    while (cursor.isBefore(endOfYear) || cursor.isSame(endOfYear, 'day')) {
        days.push(cursor);
        cursor = cursor.add(1, 'day');
    }

    // Pad end to complete last week
    while (days.length % 7 !== 0) {
        days.push(null);
    }

    // Split into week columns (7 rows each)
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    return weeks;
}

/**
 * Compute score from game stats.
 * @param {{ mistakes: number, timeTaken: number, difficulty: string }} stats
 * @returns {number} 0-1000
 */
export function computeScore({ mistakes = 0, timeTaken = 0, difficulty = 'Easy' }) {
    const diffBonus = { Easy: 0, Medium: 100, Hard: 200 };
    const base = 1000 + (diffBonus[difficulty] || 0);
    const penaltyMistakes = mistakes * 80;
    const penaltyTime = Math.floor(timeTaken / 2);
    return Math.max(0, base - penaltyMistakes - penaltyTime);
}

/**
 * Check which milestone badges are earned.
 *
 * Streak milestones  : 3, 7, 14, 30, 50, 100, 365 days
 * Solved milestones  : 10, 50, 100, 200, 365 days solved
 * Special            : Perfect Month
 *
 * @param {{ [dateStr]: activityEntry }} activityMap
 * @param {number} streak – current consecutive-day streak
 * @returns {Array<{id:string, label:string, emoji:string, desc:string}>}
 */
export function getEarnedBadges(activityMap, streak) {
    const badges = [];
    const totalSolved = Object.values(activityMap).filter(e => e?.solved).length;

    // ── Streak badges ──────────────────────────────────────────────
    const streakMilestones = [
        { days: 3, id: 'streak3', emoji: '🌱', label: 'First Spark', desc: '3-day streak' },
        { days: 7, id: 'streak7', emoji: '🔥', label: 'On Fire', desc: '7-day streak' },
        { days: 14, id: 'streak14', emoji: '💥', label: 'Hot Streak', desc: '14-day streak' },
        { days: 30, id: 'streak30', emoji: '💫', label: 'Habit Formed', desc: '30-day streak' },
        { days: 50, id: 'streak50', emoji: '🎯', label: 'Sharpshooter', desc: '50-day streak' },
        { days: 100, id: 'streak100', emoji: '⚡', label: 'Centurion', desc: '100-day streak' },
        { days: 365, id: 'streak365', emoji: '👑', label: 'Unstoppable', desc: '365-day streak' },
    ];

    for (const m of streakMilestones) {
        if (streak >= m.days) {
            badges.push({ id: m.id, emoji: m.emoji, label: m.label, desc: m.desc });
        }
    }

    // ── Total-solved badges ────────────────────────────────────────
    const solvedMilestones = [
        { count: 10, id: 'solved10', emoji: '🐣', label: 'Getting Started', desc: '10 days solved' },
        { count: 50, id: 'solved50', emoji: '🎖️', label: 'Dedicated', desc: '50 days solved' },
        { count: 100, id: 'solved100', emoji: '🏆', label: 'Century Club', desc: '100 days solved' },
        { count: 200, id: 'solved200', emoji: '💎', label: 'Elite Solver', desc: '200 days solved' },
        { count: 365, id: 'solved365', emoji: '🌟', label: 'Year Warrior', desc: '365 days solved' },
    ];

    for (const m of solvedMilestones) {
        if (totalSolved >= m.count) {
            badges.push({ id: m.id, emoji: m.emoji, label: m.label, desc: m.desc });
        }
    }

    // ── Perfect Month ──────────────────────────────────────────────
    const today = dayjs();
    for (let mo = 0; mo < today.month(); mo++) {
        const monthStart = dayjs().month(mo).startOf('month');
        const daysInMonth = monthStart.daysInMonth();
        let allSolved = true;
        for (let d = 0; d < daysInMonth; d++) {
            const date = monthStart.add(d, 'day').format('YYYY-MM-DD');
            if (!activityMap[date]?.solved) { allSolved = false; break; }
        }
        if (allSolved) {
            badges.push({ id: 'perfectMonth', emoji: '⭐', label: 'Perfect Month', desc: 'Solved every day of a month' });
            break;
        }
    }

    return badges;
}
