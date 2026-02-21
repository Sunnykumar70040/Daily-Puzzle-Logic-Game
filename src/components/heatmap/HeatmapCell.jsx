import React, { memo } from 'react';

const INTENSITY_CLASSES = {
    0: 'cell-0',
    1: 'cell-1',
    2: 'cell-2',
    3: 'cell-3',
    4: 'cell-4',
};

const HeatmapCell = memo(function HeatmapCell({ day, level, isToday, onHover, onLeave }) {
    if (!day) {
        return <div className="heatmap-cell cell-empty" />;
    }

    const className = [
        'heatmap-cell',
        INTENSITY_CLASSES[level] || 'cell-0',
        isToday ? 'cell-today' : '',
        isToday && level > 0 ? 'cell-pulse' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={className}
            onMouseEnter={(e) => onHover && onHover(day, level, e)}
            onMouseLeave={onLeave}
            role="gridcell"
            aria-label={day.format('YYYY-MM-DD')}
        />
    );
});

export default HeatmapCell;
