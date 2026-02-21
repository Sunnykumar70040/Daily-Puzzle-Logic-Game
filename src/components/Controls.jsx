import React from 'react';

const Controls = ({ onNewGame, onCheck, onHint, onSolve }) => {
    return (
        <div className="controls-panel" style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="action-btn btn-primary" onClick={onNewGame}>New Game</button>
            <button className="action-btn btn-secondary" onClick={onCheck}>Check</button>
            <button className="action-btn btn-accent" onClick={onHint}>Hint</button>
            <button className="action-btn btn-secondary" style={{ backgroundColor: 'var(--error-color)' }} onClick={onSolve}>Solve</button>
        </div>
    );
};

export default Controls;
