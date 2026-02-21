import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeatmapGrid from './HeatmapGrid';
import Navbar from '../Navbar';
import Footer from '../Footer';
import FloatingNumbers from '../FloatingNumbers';
import { getAllActivity } from '../../db/activityDB';
import {
    buildYearGrid,
    processActivityData,
    calculateStreak,
    getEarnedBadges
} from '../../engine/streakUtils';
import './Heatmap.css';

const HeatmapContainer = () => {
    const navigate = useNavigate();
    const [activityList, setActivityList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "light");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllActivity();
                setActivityList(data);
            } catch (err) {
                console.error("Failed to fetch activity:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const activityMap = processActivityData(activityList);
    const weeks = buildYearGrid(selectedYear);
    const streak = calculateStreak(activityMap);
    const totalSolved = activityList.filter(e => e.solved).length;
    const badges = getEarnedBadges(activityMap, streak);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        if (newTheme) {
            document.body.classList.add("light-mode");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.remove("light-mode");
            localStorage.setItem("theme", "dark");
        }
    };

    if (loading) {
        return <div className="heatmap-loading">Loading Activity...</div>;
    }

    return (
        <motion.div
            className={`App ${isDarkMode ? "light-mode" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <FloatingNumbers />
            <Navbar
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
            />

            <div className="heatmap-page-wrapper">
                <header className="heatmap-header">
                    <h1 className="heatmap-title">Performance Heatmap</h1>

                    <div className="heatmap-stats">
                        <div className="heatmap-stat">
                            <span className="stat-icon">🔥</span>
                            <span className="stat-value">{streak}</span>
                            <span className="stat-label">Current Streak</span>
                        </div>
                        <div className="heatmap-stat">
                            <span className="stat-icon">✅</span>
                            <span className="stat-value">{totalSolved}</span>
                            <span className="stat-label">Total Solved</span>
                        </div>
                        <div className="heatmap-stat">
                            <span className="stat-icon">📅</span>
                            <span className="stat-value">{activityList.length}</span>
                            <span className="stat-label">Active Days</span>
                        </div>
                    </div>
                </header>

                <div className="heatmap-year-bar">
                    {[selectedYear - 1, selectedYear, selectedYear + 1].map(y => (
                        <button
                            key={y}
                            className={`year-btn ${selectedYear === y ? 'year-btn-active' : ''}`}
                            onClick={() => setSelectedYear(y)}
                        >
                            {y}
                        </button>
                    ))}
                </div>

                <div className="heatmap-card">
                    <div className="heatmap-scroll">
                        <HeatmapGrid weeks={weeks} activityMap={activityMap} />
                    </div>

                    <div className="heatmap-legend-row">
                        <span className="heatmap-legend-text">Less</span>
                        <div className="heatmap-legend">
                            <div className="legend-cell cell-0"></div>
                            <div className="legend-cell cell-1"></div>
                            <div className="legend-cell cell-2"></div>
                            <div className="legend-cell cell-3"></div>
                            <div className="legend-cell cell-4"></div>
                        </div>
                        <span className="heatmap-legend-text">More</span>
                    </div>

                    {badges.length > 0 && (
                        <div className="badges-container">
                            <h3 className="badges-title">Milestone Badges</h3>
                            <div className="badges-grid">
                                {badges.map(badge => (
                                    <div key={badge.id} className="badge-item" title={badge.desc}>
                                        <span className="badge-emoji">{badge.emoji}</span>
                                        <div className="badge-text">
                                            <span className="badge-label">{badge.label}</span>
                                            <span className="badge-desc">{badge.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </motion.div>
    );
};

export default HeatmapContainer;
