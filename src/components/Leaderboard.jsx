import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

const Leaderboard = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    ////////////////////////////////////////////////////////////
    // 🔥 Fetch Leaderboard Data
    ////////////////////////////////////////////////////////////

    useEffect(() => {
        if (!isOpen) return;

        const fetchLeaderboard = async () => {
            try {
                setLoading(true);

                const res = await axios.get("/leaderboard");

                // 🔥 Sort users by score (highest first)
                const sortedUsers = [...res.data].sort(
                    (a, b) => b.totalScore - a.totalScore
                );

                setUsers(sortedUsers);
            } catch (error) {
                console.error("Leaderboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [isOpen]);

    ////////////////////////////////////////////////////////////

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Leaderboard">
            <div style={{ width: "100%" }}>

                {/* Header */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "0.5fr 2fr 1fr",
                        padding: "0.5rem",
                        borderBottom: "1px solid var(--panel-border)",
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        marginBottom: "0.5rem"
                    }}
                >
                    <span>Rank</span>
                    <span>Player</span>
                    <span>Score</span>
                </div>

                {/* Loading */}
                {loading && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "2rem",
                            color: "var(--text-secondary)"
                        }}
                    >
                        Loading...
                    </div>
                )}

                {/* No Users */}
                {!loading && users.length === 0 && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "2rem",
                            color: "var(--text-secondary)"
                        }}
                    >
                        No users yet
                    </div>
                )}

                {/* Users List */}
                {!loading &&
                    users.map((user, index) => (
                        <div
                            key={user.id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "0.5fr 2fr 1fr",
                                padding: "0.6rem",
                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                                fontWeight: index === 0 ? "600" : "normal"
                            }}
                        >
                            <span>#{index + 1}</span>
                            <span>{user.name}</span>
                            <span>{user.totalScore}</span>
                        </div>
                    ))}
            </div>
        </Modal>
    );
};

export default Leaderboard;