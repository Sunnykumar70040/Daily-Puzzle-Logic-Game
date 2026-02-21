import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("/login", {
                email,
                password,
            });

            alert("Login Successful ✅");
            navigate("/"); // go home
        } catch (err) {
            alert(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <form onSubmit={handleLogin} style={{ width: "300px" }}>
                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />

                <button type="submit">Login</button>

                <p
                    style={{ cursor: "pointer", marginTop: "10px" }}
                    onClick={() => navigate("/register")}
                >
                    Create account
                </p>
            </form>
        </div>
    );
}

export default LoginPage;