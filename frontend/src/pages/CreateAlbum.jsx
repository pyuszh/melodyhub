import { useEffect, useState } from "react";

import api from "../services/api";

function CreateAlbum() {

    const [title, setTitle] = useState("");

    const [musics, setMusics] = useState([]);

    const [selectedMusics, setSelectedMusics] = useState([]);

    async function fetchMusics() {

        try {

            const response = await api.get("/music");

            console.log(response.data);

            setMusics(response.data.musics);

        } catch (err) {

            console.log(err);

        }

    }

    useEffect(() => {

        fetchMusics();

    }, []);

    async function handleCreateAlbum(e) {

        e.preventDefault();

        try {

            const response = await api.post(
                "/music/album",
                {
                    title,
                    musics: selectedMusics
                }
            );

            console.log(response.data);

            alert("Album created successfully");

        } catch (err) {

            console.log(err);

            alert("Album creation failed");

        }

    }

    function handleMusicSelect(musicId) {

        if (selectedMusics.includes(musicId)) {

            setSelectedMusics(
                selectedMusics.filter((id) => id !== musicId)
            );

        } else {

            setSelectedMusics([
                ...selectedMusics,
                musicId
            ]);

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

            <h1>Create Album</h1>

            <form onSubmit={handleCreateAlbum}>

                <input
                    type="text"
                    placeholder="Album title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <br />
                <br />

                <h2>Select Songs</h2>

                {
                    musics.map((music) => (

                        <div
                            key={music._id}
                            style={{
                                marginBottom: "10px"
                            }}
                        >

                            <input
                                type="checkbox"
                                onChange={() => handleMusicSelect(music._id)}
                            />

                            <span
                                style={{
                                    marginLeft: "10px"
                                }}
                            >
                                {music.title}
                            </span>

                        </div>

                    ))
                }

                <br />

                <button type="submit">
                    Create Album
                </button>

            </form>

        </div>

    )

}

export default CreateAlbum;