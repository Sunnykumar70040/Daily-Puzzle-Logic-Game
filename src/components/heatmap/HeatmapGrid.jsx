import React, { useState } from 'react';
import dayjs from 'dayjs';
import HeatmapCell from './HeatmapCell';
import HeatmapTooltip from './HeatmapTooltip';
import { getIntensityLevel } from '../../engine/streakUtils';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── sizing constants (must match CSS) ────────────────────────────────────
const CELL_SIZE = 16;   // px  ← increased from 13
const CELL_GAP = 3;    // px  ← gap between cells
const CELL_STEP = CELL_SIZE + CELL_GAP;   // 19 px per column
const DAY_LABEL_W = 32;   // px  for the Mon/Wed/Fri label column

/**
 * For each calendar month, find the week-column index where that month
 * first appears and return { label, col }.
 */
function getMonthPositions(weeks) {
    const positions = [];
    let lastMonth = -1;
    weeks.forEach((week, colIdx) => {
        const firstReal = week.find(d => d !== null);
        if (firstReal) {
            const m = firstReal.month();
            if (m !== lastMonth) {
                positions.push({ label: MONTH_LABELS[m], col: colIdx });
                lastMonth = m;
            }
        }
    });
    return positions;
}

function HeatmapGrid({ weeks, activityMap }) {
    const today = dayjs();
    const [tooltip, setTooltip] = useState(null);

    const monthPositions = getMonthPositions(weeks);

    return (
        <div className="heatmap-wrapper">

            {/* ── Month label row ── */}
            {/*
                paddingLeft = DAY_LABEL_W so labels start aligned at column 0 of the grid.
                Each label is absolutely positioned at col * CELL_STEP within that padded area.
            */}
            <div
                className="heatmap-month-row"
                style={{
                    position: 'relative',
                    height: 20,
                    marginBottom: 6,
                    paddingLeft: DAY_LABEL_W,
                    boxSizing: 'border-box',
                }}
            >
                {monthPositions.map(({ label, col }) => (
                    <span
                        key={label + col}
                        className="heatmap-month-label"
                        style={{
                            position: 'absolute',
                            left: col * CELL_STEP,   // exact pixel offset within the padded area
                        }}
                    >
                        {label}
                    </span>
                ))}
            </div>

            {/* ── Body: day-labels + grid ── */}
            <div className="heatmap-body">

                {/* Day label column — Mon / Wed / Fri only */}
                <div
                    className="heatmap-day-labels"
                    style={{ width: DAY_LABEL_W, flexShrink: 0 }}
                >
                    {DAY_LABELS.map((d, i) => (
                        <span
                            key={d}
                            className="heatmap-day-label"
                            style={{
                                height: CELL_SIZE,
                                lineHeight: `${CELL_SIZE}px`,
                                marginBottom: CELL_GAP,
                            }}
                        >
                            {(i === 1 || i === 3 || i === 5) ? d : ''}
                        </span>
                    ))}
                </div>

                {/* Week columns */}
                <div className="heatmap-grid" role="grid">
                    {weeks.map((week, wIdx) => (
                        <div key={wIdx} className="heatmap-column" role="row">
                            {week.map((day, dIdx) => {
                                const dateStr = day ? day.format('YYYY-MM-DD') : null;
                                const entry = dateStr ? activityMap[dateStr] : null;
                                const level = getIntensityLevel(entry);
                                const isToday = day ? day.isSame(today, 'day') : false;

                                return (
                                    <HeatmapCell
                                        key={dIdx}
                                        day={day}
                                        level={level}
                                        isToday={isToday}
                                        onHover={(d, lv, e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setTooltip({
                                                day: d,
                                                level: lv,
                                                entry,
                                                x: rect.right,
                                                y: rect.top + rect.height / 2,
                                            });
                                        }}
                                        onLeave={() => setTooltip(null)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <HeatmapTooltip tooltip={tooltip} />
        </div>
    );
}

export default HeatmapGrid;
