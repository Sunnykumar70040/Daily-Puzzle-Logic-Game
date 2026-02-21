import React from 'react';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function HeatmapTooltip({ tooltip }) {
    if (!tooltip) return null;

    const { day, level, x, y, entry } = tooltip;

    const levelLabel = ['No activity', 'Easy solved', 'Medium solved', 'Hard solved', 'Perfect score!'][level] || '';
    const dateStr = day.format('ddd, MMM D, YYYY');

    return (
        <div
            className="heatmap-tooltip"
            style={{ top: y, left: x + 8, transform: 'translateY(-50%)' }}
        >
            <div className="tooltip-date">{dateStr}</div>
            <div className="tooltip-level">{levelLabel}</div>
            {entry && entry.solved && (
                <>
                    <div className="tooltip-row">
                        <span>Score</span><span className="tooltip-val">{entry.score}</span>
                    </div>
                    <div className="tooltip-row">
                        <span>Time</span>
                        <span className="tooltip-val">
                            {Math.floor(entry.timeTaken / 60)}m {entry.timeTaken % 60}s
                        </span>
                    </div>
                    <div className="tooltip-row">
                        <span>Difficulty</span><span className="tooltip-val">{entry.difficulty}</span>
                    </div>
                </>
            )}
        </div>
    );
}

export default HeatmapTooltip;
