import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {

        e.preventDefault();

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });

            console.log(response.data);

            localStorage.setItem("role", response.data.user.role);

            navigate("/");

        } catch (err) {

            console.log(err);

            alert("Invalid credentials");

        }

    }

    return (

        <div style={{
            background: "black",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white"
        }}>

            <form
                onSubmit={handleLogin}
                style={{
                    width: "350px",
                    background: "#181818",
                    padding: "30px",
                    borderRadius: "10px"
                }}
            >

                <h1 style={{
                    marginBottom: "30px"
                }}>
                    Login
                </h1>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "20px",
                        borderRadius: "5px",
                        border: "none"
                    }}
                />

                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "20px",
                        borderRadius: "5px",
                        border: "none"
                    }}
                />

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#1DB954",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Login
                </button>

                <p style={{
                    marginTop: "20px"
                }}>
                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        style={{
                            color: "#1DB954"
                        }}
                    >
                        Register
                    </Link>

                </p>

            </form>

        </div>

    )

}

export default Login;