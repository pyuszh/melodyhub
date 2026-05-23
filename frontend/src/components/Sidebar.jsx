import { Link } from "react-router-dom";

function Sidebar() {

    const role = localStorage.getItem("role");

    return (

        <div style={{
            width: "250px",
            background: "#121212",
            color: "white",
            minHeight: "100vh",
            padding: "20px"
        }}>

            <h2>Library</h2>

            <br />

            <Link
                to="/"
                style={{
                    color: "white",
                    textDecoration: "none",
                    display: "block",
                    marginBottom: "30px"
                }}
            >
                🏠 Home
            </Link>

            <Link
                to="/"
                style={{
                    color: "white",
                    textDecoration: "none",
                    display: "block",
                    marginBottom: "30px"
                }}
            >
                🎵 Albums
            </Link>

            

            {
                role === "artist" && (

                    <>

                        <Link
                            to="/upload"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                display: "block",
                                marginBottom: "30px"
                            }}
                        >
                            ⬆ Upload Music
                        </Link>

                        <Link
                            to="/create-album"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                display: "block",
                                marginBottom: "30px"
                            }}
                        >
                            💿 Create Album
                        </Link>

                    </>

                )
            }

        </div>

    )

}

export default Sidebar;