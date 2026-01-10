import { createContext, useContext, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGameSocket } from "../services/webSocket/useGameSocket";
import { useGamePrivateSocket } from "../services/webSocket/UseGamePRivateSocket";

const GameContext = createContext(null);

export function GameProvider({ children }) {
    const { id: gameId } = useParams();

    const [uiEvents, setUiEvents] = useState([]);

    const addLocalEvent = (event) => {
        setUiEvents((prev) => [...prev, event]);
    };

    const game = useGameSocket(gameId);
    const privateGame = useGamePrivateSocket(gameId);

    const allEvents = useMemo(() => {
        console.log(game.backendEvents)

        return [...uiEvents, ...(game.backendEvents ?? [])];

    }, [uiEvents, game.backendEvents]);


    const value = {
        ...game,
        ...privateGame,
        events: allEvents,
        addLocalEvent,
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const ctx = useContext(GameContext);
    if (!ctx) {
        throw new Error("useGame must be used inside GameProvider");
    }
    return ctx;
}
