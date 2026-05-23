import { useEffect, useState } from "react";
import api from "../services/api";
import AlbumCard from "../components/AlbumCard";


function Home() {

    const [albums, setAlbums] = useState([]);

    async function fetchAlbums() {

        try {

            const response = await api.get("/music/albums");

            setAlbums(response.data.albums);

        } catch (err) {

            console.log(err);

        }

    }

    useEffect(() => {

        fetchAlbums();

    }, []);

   return (

    <div style={{
        flex: 1,
        padding: "20px",
        color: "white"
    }}>

        <h1>Albums</h1>

        <div style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap"
        }}>

            {
                albums.map((album) => (
                    <AlbumCard
                        key={album._id}
                        album={album}
                    />
                ))
            }

        </div>

    </div>

)

}

export default Home;