import React from 'react';

function Badges({ badges }) {
    if (!badges || badges.length === 0) return null;

    return (
        <div className="badges-container">
            <div className="badges-title">🏅 Achievements</div>
            <div className="badges-grid">
                {badges.map(badge => (
                    <div key={badge.id} className="badge-item" title={badge.desc || badge.label}>
                        <span className="badge-emoji">{badge.emoji}</span>
                        <div className="badge-text">
                            <span className="badge-label">{badge.label}</span>
                            {badge.desc && (
                                <span className="badge-desc">{badge.desc}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Badges;
