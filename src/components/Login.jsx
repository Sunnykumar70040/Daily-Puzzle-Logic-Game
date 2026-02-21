import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal";

const Login = ({ isOpen, onClose, onRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post("/login", {
                email,
                password,
            });

            console.log("✅ Login Success:", res.data);
            alert("Login successful ✅");

            setEmail("");
            setPassword("");
            onClose();
        } catch (err) {
            console.error("❌ Login error:", err);
            alert(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Welcome Back 👋">
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.2rem",
                    marginTop: "1rem",
                }}
            >
                {/* Email Field */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={labelStyle}>Email</label>
                    <input
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* Password Field */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={labelStyle}>Password</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        ...buttonStyle,
                        opacity: loading ? 0.6 : 1,
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* Register Link */}
                <div
                    style={{
                        textAlign: "center",
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                    }}
                >
                    Don't have an account?{" "}
                    <span
                        style={{
                            color: "#4dabf7",
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
                        onClick={onRegister}
                    >
                        Register
                    </span>
                </div>
            </form>
        </Modal>
    );
};

//////////////////////////////////////////////////////
// 🔥 Styles (inside same file)
//////////////////////////////////////////////////////

const labelStyle = {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
};

const inputStyle = {
    padding: "0.9rem",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
    transition: "0.3s",
};

const buttonStyle = {
    padding: "0.9rem",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #4dabf7, #339af0)",
    color: "white",
    fontWeight: "600",
    transition: "0.3s",
};

export default Login;