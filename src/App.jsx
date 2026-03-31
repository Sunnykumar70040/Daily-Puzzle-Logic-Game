import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./App.css";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

import GameBoard from "./components/GameBoard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeatmapContainer from "./components/heatmap/HeatmapContainer";
import FloatingNumbers from "./components/FloatingNumbers";

////////////////////////////////////////////////////////////
// LOGIN PAGE
////////////////////////////////////////////////////////////

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/login", { email, password });
      alert("Login successful ✅");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={authContainer}>
      <div style={authCard}>
        <h2>Welcome Back 👋</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            style={inputStyle} />
          <input type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            style={inputStyle} />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
        <p style={linkStyle} onClick={() => navigate("/register")}>
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////
// REGISTER PAGE
////////////////////////////////////////////////////////////

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/register", { name, email, password });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={authContainer}>
      <div style={authCard}>
        <h2>Create Account 🚀</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name"
            value={name} onChange={(e) => setName(e.target.value)}
            style={inputStyle} />
          <input type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            style={inputStyle} />
          <input type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            style={inputStyle} />
          <button type="submit" style={buttonStyle}>Register</button>
        </form>
        <p style={linkStyle} onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////
// CALENDAR PAGE (UNCHANGED)
////////////////////////////////////////////////////////////

function CalendarPage({ setSelectedDate }) {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handlePrevYear = () => setYear(year - 1);
  const handleNextYear = () => setYear(year + 1);

  const handleSelectDate = (day) => {
    const date = new Date(year, month, day);
    // Adjust for timezone to get correct YYYY-MM-DD
    const dateString = date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, '0') + "-" +
      String(date.getDate()).padStart(2, '0');

    setSelectedDate(dateString);
    navigate("/");
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        📅 Select Date
      </h2>

      <div style={yearControlStyle}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={buttonStyle} onClick={handlePrevYear}>⏪</button>
          <button style={buttonStyle} onClick={handlePrevMonth}>⬅</button>
        </div>
        <h3 style={{ minWidth: "180px", textAlign: "center", margin: 0 }}>
          {months[month]} {year}
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={buttonStyle} onClick={handleNextMonth}>➡</button>
          <button style={buttonStyle} onClick={handleNextYear}>⏩</button>
        </div>
      </div>

      <div style={monthCardStyle}>
        <div style={monthGridStyle}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} style={{ ...calendarCellStyle, background: "transparent", cursor: "default", color: "#888", fontSize: "0.8rem" }}>
              {d}
            </div>
          ))}
          {[...Array(firstDayOfMonth)].map((_, i) => (
            <div key={`empty-${i}`} style={{ ...calendarCellStyle, background: "transparent", cursor: "default" }} />
          ))}
          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const isToday =
              today.getFullYear() === year &&
              today.getMonth() === month &&
              today.getDate() === day;

            return (
              <div
                key={day}
                style={{
                  ...calendarCellStyle,
                  outline: isToday ? "2px solid #4dabf7" : "none",
                  background: isToday ? "rgba(77, 171, 247, 0.2)" : calendarCellStyle.background
                }}
                onClick={() => handleSelectDate(day)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////
// 🔥 UPDATED LEADERBOARD (ONLY CHANGE)
////////////////////////////////////////////////////////////

// function LeaderboardPage() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get("/leaderboard")
//       .then(res => {
//         const sorted = res.data.sort((a, b) => b.totalScore - a.totalScore);
//         setUsers(sorted);
//         setLoading(false);
//       })
//       .catch(() => {
//         setLoading(false);
//         console.log("Leaderboard error");
//       });
//   }, []);

// return (
//   <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
//     <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
//       🏆 Leaderboard
//     </h2>

//     {loading ? (
//       <p style={{ textAlign: "center" }}>Loading...</p>
//     ) : users.length === 0 ? (
//       <p style={{ textAlign: "center" }}>No users yet.</p>
//     ) : (
//       users.map((user, index) => (
//         <div
//           key={user.id || index}
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             padding: "12px 20px",
//             marginBottom: "10px",
//             borderRadius: "10px",
//             background: "rgba(255,255,255,0.08)"
//           }}
//           >
//             <div>
//               <strong>#{index + 1}</strong> {user.name}
//             </div>
//             <div>{user.totalScore} pts</div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/leaderboard")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Leaderboard error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div style={pageStyle}>
      <h2>🏆 Leaderboard</h2>

      {loading && <p>Loading...</p>}

      {!loading && users.length === 0 && (
        <p>No users yet.</p>
      )}

      {!loading &&
        users.map((user, index) => (
          <div key={user.id} style={{ margin: "10px 0" }}>
            #{index + 1} {user.name} — {user.totalScore}
          </div>
        ))}
    </div>
  );
}

////////////////////////////////////////////////////////////
// HOME PAGE
////////////////////////////////////////////////////////////

const GameTimer = ({ isGameActive }) => {
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    let interval;
    if (isGameActive) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return <div className="timer">{formatTime(timer)}</div>;
};

function Home({ selectedDate }) {
  const [difficulty, setDifficulty] = useState("Easy");
  const [isGameActive, setIsGameActive] = useState(true);
  const [mistakes, setMistakes] = useState(0);
  const [seed, setSeed] = useState(null);
  const [hmac, setHmac] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "light"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    axios.get("/generate-seed").then((res) => {
      setSeed(res.data.seed);
      setHmac(res.data.hmac);
    });
  }, [selectedDate]);

  return (
    <motion.div className="App">
      <FloatingNumbers />
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <div className="game-info glass-panel">
        <div>
          <label>Diff:</label>
          <select value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div className="mistakes">Mistakes: {mistakes}/3</div>
        <GameTimer isGameActive={isGameActive} />
      </div>

      {seed && (
        <GameBoard
          dateString={selectedDate}
          puzzleType="sudoku"
          difficulty={difficulty}
          seed={seed}
          hmac={hmac}
        />
      )}

      <Footer />
    </motion.div>
  );
}

////////////////////////////////////////////////////////////
// ROUTER
////////////////////////////////////////////////////////////

function App() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  return (
    <Routes>
      <Route path="/" element={<Home selectedDate={selectedDate} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/heatmap" element={<HeatmapContainer />} />
      <Route path="/calendar"
        element={<CalendarPage setSelectedDate={setSelectedDate} />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
    </Routes>
  );
}

////////////////////////////////////////////////////////////
// STYLES (UNCHANGED)
////////////////////////////////////////////////////////////

const authContainer = { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg,#141e30,#243b55)" };
const authCard = { width: "350px", padding: "2.5rem", borderRadius: "20px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(15px)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", color: "white", textAlign: "center" };
const inputStyle = { width: "100%", padding: "0.9rem", marginBottom: "1rem", borderRadius: "10px", border: "none", outline: "none" };
const buttonStyle = { padding: "0.6rem 1rem", borderRadius: "8px", border: "none", background: "#4dabf7", color: "white", cursor: "pointer" };
const linkStyle = { marginTop: "1rem", cursor: "pointer", color: "#4dabf7" };
const pageStyle = { textAlign: "center", marginTop: "6rem", fontSize: "1.5rem" };

const yearControlStyle = { display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: "2rem" };
const yearGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "20px" };
const monthCardStyle = { background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "12px" };
const monthGridStyle = { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "6px", marginTop: "10px" };
const calendarCellStyle = { padding: "8px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", cursor: "pointer", fontWeight: "600", textAlign: "center" };

export default App;