import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    function handleLogout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    }

    return (

        <div style={{
            height: "70px",
            background: "#121212",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 30px",
            borderBottom: "1px solid #282828"
        }}>

            <h1>
                MelodyHub 🎵
            </h1>

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