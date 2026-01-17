import { useEffect } from "react";
import Card from "../../models/Card";

export default function GameEventModal({
  event,
  onClose,
  onChooseCoin,
  onChooseCard,
  mustChoose,
  privateInfo,
  isPlayerTurn,
  setGameEnded
}) {

  useEffect(() => {
    let timer;

    if (
      event &&
      event.events !== "ARCHITECT" &&
      event.events !== "PRIVATE" &&
      !mustChoose
    ) {
      timer = setTimeout(onClose, 2000);
    }

    if (event?.events === "GAME_ENDED") {
      setGameEnded(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [event, mustChoose, onClose, setGameEnded]);

  if (!event && !mustChoose) return null;

  return (
    <>

    {event?.events === "ARCHITECT" && isPlayerTurn && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-game-back border-2 border-game-board rounded-2xl shadow-2xl p-6">
              <h3 className="text-game-highlight text-center mb-4">
                Cartas obtenidas
              </h3>
              <div className="flex gap-4">
                {privateInfo.districtsCardsGained.map(d => (
                  <Card key={d.id} card={d} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      
      {event && !mustChoose && event.events !== "ARCHITECT" && event.events !== "PRIVATE" && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-toast-in">
          <div className="bg-game-back border border-game-board rounded-xl shadow-xl px-6 py-3 backdrop-blur-md">
            <p className="text-game-text-secondary text-lg text-center">
              {event.message}
            </p>
          </div>
        </div>
      )}

      {mustChoose && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-game-back border-2 border-game-board rounded-2xl shadow-2xl px-8 py-6 text-center space-y-6">
              <h2 className="text-xl font-bold text-game-highlight">
                Elige tu recompensa
              </h2>

              <div className="flex gap-6 justify-center">
                <button
                  onClick={onChooseCoin}
                  className="px-6 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 transition"
                >
                  💰 Monedas
                </button>
                <button
                  onClick={onChooseCard}
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
                >
                  🃏 Cartas
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      

      {event?.events === "PRIVATE" && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-game-back border-2 border-game-board rounded-2xl shadow-2xl p-6 space-y-4">
              <h3 className="text-game-highlight text-center">
                Cartas iniciales
              </h3>

              <div className="flex gap-4 justify-center">
                {privateInfo.districtsCardsGained.map(d => (
                  <Card key={d.id} card={d} />
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-1 rounded-lg bg-red-600 hover:bg-red-500 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
