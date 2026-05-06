import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import GameEventModal from "../components/modal/GameEventModal";
import { loadShownEvents, saveShownEvents } from "../hooks/loadShownEvents";

export default function GameEventManager({
    events,
    onChooseCoin,
    onChooseCard,
    mustChoose,
    privateInfo,
    isPlayerTurn,
    setGameEnded
}) {
    const [queue, setQueue] = useState([]);
    const [current, setCurrent] = useState(null);

    const processedIds = useRef(loadShownEvents());

    useEffect(() => {
        if (!events || events.length === 0) return;

        const newEvents = events.filter(e => {
            if (!e?.id) return false;
            if (processedIds.current.has(e.id)) return false;

            processedIds.current.add(e.id);
            return true;
        });

        if (newEvents.length > 0) {
            saveShownEvents(processedIds.current);
            setQueue(q => [...q, ...newEvents]);
        }
    }, [events]);

    useEffect(() => {
        if (!current && queue.length > 0) {
            setCurrent(queue[0]);
            setQueue(q => q.slice(1));
        }
    }, [queue, current]);

    const close = useCallback(() => setCurrent(null), []);

    useEffect(() => {
        let timer;

        if (current && current.events !== "ARCHITECT" && current.events !== "PRIVATE") {
            timer = setTimeout(close, 2000);
        }

        if (current?.events === "GAME_ENDED") {
            setGameEnded(true);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [current, close, setGameEnded]);

    if (!current && !mustChoose) return null;

    return (
        <>
            <GameEventModal
                event={current}
                onClose={close}
                onChooseCoin={() => {
                    onChooseCoin();
                    close();
                }}
                onChooseCard={() => {
                    onChooseCard();
                    close();
                }}
                mustChoose={mustChoose}
                privateInfo={privateInfo}
                isPlayerTurn={isPlayerTurn}
                setGameEnded={setGameEnded}
            />
            {current && !mustChoose && current.events !== "ARCHITECT" && current.events !== "PRIVATE" && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-toast-in">
                    <div className="bg-game-back border border-game-board rounded-xl shadow-xl px-6 py-3 backdrop-blur-md">
                        <p className="text-game-text-secondary text-lg text-center">
                            {current.message}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
