import React from 'react';
import Modal from './Modal';

const UpcomingGames = ({ isOpen, onClose, currentDate, onDateSelect }) => {
    // Generate next 7 days
    const upcomingDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upcoming Puzzles">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Select Date:</label>
                    <input
                        type="date"
                        value={currentDate}
                        onChange={(e) => {
                            onDateSelect(e.target.value);
                            onClose();
                        }}
                        style={{
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid var(--panel-border)',
                            background: 'var(--cell-bg)',
                            color: 'var(--text-primary)',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Next 7 Days</h3>
                {upcomingDates.map(date => (
                    <button
                        key={date}
                        onClick={() => {
                            onDateSelect(date);
                            onClose();
                        }}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid var(--panel-border)',
                            background: date === currentDate ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                            color: date === currentDate ? 'white' : 'var(--text-primary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'left'
                        }}
                    >
                        <span>{date}</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Sudoku</span>
                    </button>
                ))}
            </div>
        </Modal>
    );
};

export default UpcomingGames;
