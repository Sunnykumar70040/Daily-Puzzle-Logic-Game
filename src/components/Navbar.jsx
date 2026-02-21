import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ isDarkMode, toggleTheme }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="app-header glass-panel">

            {/* Logo */}
            <h1
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
            >
                Sudoku
            </h1>

            {/* Icons */}
            <div className="header-icons">

                {/* Dark / Light Mode */}
                <button
                    className={`icon-btn ${isActive("/") ? "active-icon" : ""}`}
                    onClick={toggleTheme}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? "☀️" : "🌙"}
                </button>

                {/* Heatmap */}
                <button
                    className={`icon-btn ${isActive("/heatmap") ? "active-icon" : ""}`}
                    onClick={() => navigate("/heatmap")}
                    title="Activity Heatmap"
                >
                    🔥
                </button>

                {/* Calendar */}
                <button
                    className={`icon-btn ${isActive("/calendar") ? "active-icon" : ""}`}
                    onClick={() => navigate("/calendar")}
                    title="Calendar"
                >
                    📅
                </button>

                {/* Leaderboard */}
                <button
                    className={`icon-btn ${isActive("/leaderboard") ? "active-icon" : ""}`}
                    onClick={() => navigate("/leaderboard")}
                    title="Leaderboard"
                >
                    🏆
                </button>

                {/* Login */}
                <button
                    className={`icon-btn ${isActive("/login") ? "active-icon" : ""}`}
                    onClick={() => navigate("/login")}
                    title="Login"
                >
                    👤
                </button>

                {/* Register */}
                <button
                    className={`icon-btn ${isActive("/register") ? "active-icon" : ""}`}
                    onClick={() => navigate("/register")}
                    title="Register"
                >
                    ➕
                </button>

            </div>
        </header>
    );
};

export default Navbar;