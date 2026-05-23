import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");

    async function handleRegister(e) {

        e.preventDefault();

        try {

            const response = await api.post(
                "/auth/register",
                {
                    username,
                    email,
                    password,
                    role
                }
            );

            console.log(response.data);

            alert("Register successful");

            navigate("/login");

        } catch (err) {

            console.log(err);

            alert("Register failed");

        }

    }

    return (

        <div
            style={{
                background: "black",
                minHeight: "100vh",
                color: "white",
                padding: "30px"
            }}
        >

            <h1>Register</h1>

            <form onSubmit={handleRegister}>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <br />
                <br />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br />
                <br />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >

                    <option value="user">
                        User
                    </option>

                    <option value="artist">
                        Artist
                    </option>

                </select>

                <br />
                <br />

                <button type="submit">
                    Register
                </button>

            </form>

        </div>

    )

}

export default Register;