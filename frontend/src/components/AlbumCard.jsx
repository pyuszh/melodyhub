import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

function AlbumCard({ album }) {

    return (

        <Link
            to={`/albums/${album._id}`}
            style={{
                textDecoration: "none",
                color: "white"
            }}
        >

            <div
                style={{
                    background: "#181818",
                    padding: "15px",
                    borderRadius: "10px",
                    width: "220px",
                    transition: "0.3s",
                    cursor: "pointer",
                    position: "relative"
                }}

                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#282828";
                    e.currentTarget.style.transform = "scale(1.03)";
                }}

                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#181818";
                    e.currentTarget.style.transform = "scale(1)";
                }}
            >

                <img
                    src="https://placehold.co/300x300"
                    alt="album"
                    style={{
                        width: "100%",
                        borderRadius: "10px"
                    }}
                />

                <button
                    style={{
                        position: "absolute",
                        right: "25px",
                        bottom: "80px",
                        background: "#1db954",
                        border: "none",
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "18px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
                    }}
                >

                    <FaPlay />

                </button>

                <h2>{album.title}</h2>

                <p style={{
                    color: "gray"
                }}>
                    {album.artist.username}
                </p>

            </div>

        </Link>

    )

}

export default AlbumCard;