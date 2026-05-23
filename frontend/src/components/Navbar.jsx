import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    async function handleLogout() {

        try {

            await api.post("/auth/logout");

            localStorage.removeItem("role");

            navigate("/login");

        } catch (err) {

            console.log(err);

        }

    }

    return (

        <div style={{
            height: "70px",
            background: "#121212",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 30px",
            fontSize: "25px",
            fontWeight: "bold",
            borderBottom: "1px solid #282828"
        }}>

            <div>
                MelodyHub 🎵
            </div>

            <button
                onClick={handleLogout}
                style={{
                    background: "#1DB954",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "20px",
                    cursor: "pointer"
                }}
            >
                Logout
            </button>

        </div>

    )

}

export default Navbar;