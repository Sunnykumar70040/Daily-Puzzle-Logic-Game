import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import axios from "axios";
import "./App.css";

import GameBoard from "./components/GameBoard";
import Navbar from "./components/Navbar";
import FloatingNumbers from "./components/FloatingNumbers";
import Footer from "./components/Footer";

////////////////////////////////////////////////////////////
// 🔥 HOME PAGE
////////////////////////////////////////////////////////////

function Home() {
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];

    const [puzzleType] = useState("sudoku");
    const [difficulty, setDifficulty] = useState("Easy");
    const [timer, setTimer] = useState(0);
    const [isGameActive, setIsGameActive] = useState(true);
    const [mistakes, setMistakes] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [seed, setSeed] = useState(null);
    const [hmac, setHmac] = useState(null);

    const streakRef = useRef(null);

    ////////////////////////////////////////////////////////////
    // Backend Check
    ////////////////////////////////////////////////////////////

    useEffect(() => {
        axios.get("/check")
            .then(res => console.log("✅ Backend Connected:", res.data))
            .catch(err => console.error("❌ Backend Error:", err));
    }, []);

    ////////////////////////////////////////////////////////////
    // Fetch Seed
    ////////////////////////////////////////////////////////////

    useEffect(() => {
        fetchSeed();
    }, []);

    const fetchSeed = async () => {
        try {
            const res = await axios.get("/generate-seed");
            setSeed(res.data.seed);
            setHmac(res.data.hmac);
        } catch (err) {
            console.error("Seed error:", err);
        }
    };

    ////////////////////////////////////////////////////////////
    // Timer
    ////////////////////////////////////////////////////////////

    useEffect(() => {
        let interval;
        if (isGameActive) {
            interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isGameActive]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    ////////////////////////////////////////////////////////////
    // New Game
    ////////////////////////////////////////////////////////////

    const handleNewGame = () => {
        setTimer(0);
        setMistakes(0);
        setIsGameActive(true);
        fetchSeed();
    };

    ////////////////////////////////////////////////////////////
    // Download Streak
    ////////////////////////////////////////////////////////////

    const handleDownloadStreak = async () => {
        if (!streakRef.current) return;

        const canvas = await html2canvas(streakRef.current);
        const link = document.createElement("a");
        link.download = "sudoku-streak.png";
        link.href = canvas.toDataURL();
        link.click();
    };

    ////////////////////////////////////////////////////////////
    // UI
    ////////////////////////////////////////////////////////////

    return (
        <motion.div
            className={`App ${isDarkMode ? "light-mode" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <FloatingNumbers />

            <Navbar
                isDarkMode={isDarkMode}
                toggleTheme={() => setIsDarkMode(!isDarkMode)}
                onHeatmap={() => navigate("/heatmap")}
                onCalendar={() => navigate("/calendar")}
                onLeaderboard={() => navigate("/leaderboard")}
                onSettings={() => alert("Settings")}
            />

            <motion.div className="game-info glass-panel">
                <div>
                    <label style={{ marginRight: "0.5rem" }}>Diff:</label>
                    <select
                        value={difficulty}
                        onChange={(e) => {
                            setDifficulty(e.target.value);
                            handleNewGame();
                        }}
                    >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>

                <div style={{ color: mistakes >= 3 ? "red" : "inherit" }}>
                    Mistakes: {mistakes}/3
                </div>

                <div>{formatTime(timer)}</div>
            </motion.div>

            <GameBoard
                dateString={today}
                puzzleType={puzzleType}
                difficulty={difficulty}
                seed={seed}
                hmac={hmac}
            />

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button
                    onClick={() => navigate("/register")}
                    style={buttonStyle}
                >
                    Go to Register Page
                </button>
            </div>

            <div ref={streakRef} style={{ textAlign: "center", marginTop: "2rem" }}>
                <h3>🔥 7 Day Streak</h3>
                <p>Time: {formatTime(timer)}</p>
            </div>

            <button onClick={handleDownloadStreak} style={buttonStyle}>
                Download Streak
            </button>

            <Footer />
        </motion.div>
    );
}

////////////////////////////////////////////////////////////
// 🔥 SIMPLE PAGES
////////////////////////////////////////////////////////////

const Heatmap = () => <h2 style={pageStyle}>🔥 Heatmap Page</h2>;
const Calendar = () => <h2 style={pageStyle}>📅 Calendar Page</h2>;
const Leaderboard = () => <h2 style={pageStyle}>🏆 Leaderboard Page</h2>;
const Login = () => <h2 style={pageStyle}>👤 Login Page</h2>;
const Register = () => <h2 style={pageStyle}>➕ Register Page</h2>;

////////////////////////////////////////////////////////////
// 🔥 ROUTER
////////////////////////////////////////////////////////////

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/heatmap" element={<Heatmap />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}

////////////////////////////////////////////////////////////
// STYLES
////////////////////////////////////////////////////////////

const buttonStyle = {
    padding: "0.8rem 1.5rem",
    borderRadius: "10px",
    border: "none",
    background: "#4dabf7",
    color: "white",
    cursor: "pointer",
    marginTop: "1rem",
};

const pageStyle = {
    textAlign: "center",
    marginTop: "5rem",
    fontSize: "2rem",
};

export default App;