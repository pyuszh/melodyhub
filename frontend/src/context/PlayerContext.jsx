import { createContext, useState } from "react";

export const PlayerContext = createContext();

function PlayerProvider({ children }) {

    const [currentMusic, setCurrentMusic] = useState(null);

    return (

        <PlayerContext.Provider
            value={{
                currentMusic,
                setCurrentMusic
            }}
        >

            {children}

        </PlayerContext.Provider>

    )

}

export default PlayerProvider;