import { useState } from "react";
import api from "../services/api";

function UploadMusic() {

    const [title, setTitle] = useState("");
    const [music, setMusic] = useState(null);

    async function handleUpload(e) {

        e.preventDefault();

        const formData = new FormData();

        formData.append("title", title);
        formData.append("music", music);

        try {

            const response = await api.post(
                "/music/upload",
                formData
            );

            console.log(response.data);

            alert("Music uploaded successfully");

        } catch (err) {

            console.log(err);

            alert("Upload failed");

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

            <h1>Upload Music</h1>

            <form onSubmit={handleUpload}>

                <input
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <br />
                <br />

                <input
                    type="file"
                    onChange={(e) => setMusic(e.target.files[0])}
                />

                <br />
                <br />

                <button type="submit">
                    Upload
                </button>

            </form>

        </div>

    )

}

export default UploadMusic;