import React from 'react';

const Footer = () => {
    const upcomingGames = [
        { name: "Crossword", status: "Coming Soon" },
        { name: "Kakuro", status: "Coming Soon" },
        { name: "Nonogram", status: "Coming Soon" }
    ];

    return (
        <footer className="app-footer glass-panel">
            <h3>More Games</h3>
            <div className="upcoming-games-list">
                {upcomingGames.map((game, index) => (
                    <div key={index} className="coming-soon-card">
                        <span className="game-name">{game.name}</span>
                        <span className="game-status">{game.status}</span>
                    </div>
                ))}
            </div>
        </footer>
    );
};

export default Footer;
