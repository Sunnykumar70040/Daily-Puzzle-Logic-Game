import axios from "axios";
import { useState } from "react";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        console.log("Register button clicked ✅");

        if (!name || !email || !password) {
            alert("All fields are required");
            return;
        }

        try {
            const res = await axios.post("/register", {
                name,
                email,
                password,
            });

            console.log("Server response:", res.data);
            alert(res.data.message);

            // Clear fields after success
            setName("");
            setEmail("");
            setPassword("");

        } catch (err) {
            console.log("Registration error:", err);

            if (err.response) {
                alert(err.response.data.error);
            } else {
                alert("Server not responding ❌");
            }
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Register</h2>

            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br /><br />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br /><br />

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;