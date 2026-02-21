const express = require("express");
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// ===============================
// ✅ Environment Setup
// ===============================
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    console.error("❌ SECRET_KEY is missing in .env file");
    process.exit(1);
}

// ===============================
// 🔐 Utility Functions
// ===============================

function generateHMAC(data) {
    return crypto
        .createHmac("sha256", SECRET_KEY)
        .update(data)
        .digest("hex");
}

function hashPassword(password) {
    return crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
}

// ===============================
// ✅ Root Route
// ===============================
app.get("/", (req, res) => {
    res.send("Sudoku Server with DB + Auth + Leaderboard 🚀");
});

// ===============================
// 🔐 Register User
// ===============================
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields required" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword(password),
                totalScore: 0
            }
        });

        res.json({
            message: "User registered successfully ✅",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                totalScore: newUser.totalScore
            }
        });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
});

// ===============================
// 🔐 Login User
// ===============================
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || user.password !== hashPassword(password)) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        res.json({
            message: "Login successful ✅",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                totalScore: user.totalScore
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

// ===============================
// 🏆 Update Score (When Puzzle Solved)
// ===============================
app.post("/add-score", async (req, res) => {
    try {
        const { userId, points } = req.body;

        if (!userId || !points) {
            return res.status(400).json({ error: "Missing data" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                totalScore: {
                    increment: points
                }
            }
        });

        res.json({
            message: "Score updated ✅",
            totalScore: updatedUser.totalScore
        });

    } catch (error) {
        console.error("Score update error:", error);
        res.status(500).json({ error: "Score update failed" });
    }
});

// ===============================
// 🏆 Leaderboard Route (FINAL FIXED)
// ===============================
app.get("/leaderboard", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                totalScore: "desc"
            },
            select: {
                id: true,
                name: true,
                totalScore: true
            }
        });

        res.json(users);

    } catch (error) {
        console.error("🔥 Leaderboard Error:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

// ===============================
// 🎲 Generate Seed + HMAC
// ===============================
app.get("/generate-seed", (req, res) => {
    const seed = Date.now().toString();
    const hmac = generateHMAC(seed);
    res.json({ seed, hmac });
});

// ===============================
// 🚀 Start Server
// ===============================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// ===============================
// 🛑 Graceful Shutdown
// ===============================
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("🛑 Prisma disconnected");
    process.exit(0);
});