import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

function Player() {

    const { currentMusic } = useContext(PlayerContext);

    if (!currentMusic) return null;

    return (

        <div
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                background: "#181818",
                padding: "20px",
                borderTop: "1px solid gray"
            }}
        >

            <h3>{currentMusic.title}</h3>

            <audio
                src={currentMusic.uri}
                controls
                autoPlay
                style={{
                    width: "100%"
                }}
            />

        </div>

    )

}

export default Player;