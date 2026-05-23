import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import api from "../services/api";
import { PlayerContext } from "../context/PlayerContext";

function Album() {

    const { albumId } = useParams();

    const { setCurrentMusic } = useContext(PlayerContext);

    const [album, setAlbum] = useState(null);

    async function fetchAlbum() {

        try {

            const response = await api.get(`/music/albums/${albumId}`);

            console.log(response.data);

            setAlbum(response.data.album);

        } catch (err) {

            console.log(err);

        }

    }

    useEffect(() => {

        fetchAlbum();

    }, []);

    if (!album) {

        return <h1>Loading...</h1>

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

            <img
                src="https://placehold.co/300x300"
                alt="album"
                style={{
                    borderRadius: "10px",
                    marginBottom: "20px"
                }}
            />

            <h1
                style={{
                    fontSize: "60px",
                    marginBottom: "10px"
                }}
            >
                {album.title}
            </h1>

            <p
                style={{
                    color: "gray",
                    marginBottom: "40px"
                }}
            >
                {album.artist.username}
            </p>

            {
                album.musics.map((music) => (

                    <div
                        key={music._id}

                        onClick={() => setCurrentMusic(music)}

                        style={{
                            background: "#181818",
                            padding: "20px",
                            borderRadius: "10px",
                            marginBottom: "20px",
                            cursor: "pointer"
                        }}
                    >

                        <h2>{music.title}</h2>

                    </div>

                ))
            }

        </div>

    )

}

export default Album;