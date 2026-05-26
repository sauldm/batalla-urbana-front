import { useEffect, useRef, useState } from "react";
import Card from "../../models/Card";
import divitia from "../../utils/images/divitia.png";
import distritoImg from "../../utils/images/distrito.png";

function DraggablePanel({ children }) {
  const [pos, setPos] = useState(null);
  const panelRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      setPos({ x: cx - offset.current.x, y: cy - offset.current.y });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const startDrag = (e) => {
    dragging.current = true;
    const rect = panelRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    offset.current = { x: cx - rect.left, y: cy - rect.top };
  };

  const posStyle = pos
    ? { position: "fixed", left: pos.x, top: pos.y, zIndex: 50 }
    : { position: "fixed", bottom: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 50 };

  return (
    <div ref={panelRef} style={{ ...posStyle, width: "100%", maxWidth: "28rem", padding: "0 1rem" }}>
      <div
        className="relative w-full rounded-2xl bg-game-modal overflow-hidden"
        style={{ border: "1px solid rgba(179,137,86,0.4)", boxShadow: "0 0 60px rgba(0,0,0,0.9), inset 0 0 40px rgba(179,137,86,0.04)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.7), transparent)" }}
        />
        {/* Handle de arrastre */}
        <div
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="w-8 h-1 rounded-full opacity-40" style={{ background: "rgba(179,137,86,0.8)" }} />
        </div>
        <div className="px-6 pb-6 space-y-5">{children}</div>
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.3), transparent)" }}
        />
      </div>
    </div>
  );
}

const ModalPanel = ({ children, maxW = "max-w-md", overlay = true }) => (
  <>
    {overlay && <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm" />}
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4`}>
      <div
        className={`relative w-full ${maxW} rounded-2xl bg-game-modal overflow-hidden`}
        style={{ border: "1px solid rgba(179,137,86,0.4)", boxShadow: "0 0 60px rgba(0,0,0,0.9), inset 0 0 40px rgba(179,137,86,0.04)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.7), transparent)" }}
        />
        <div className="p-6 space-y-5">{children}</div>
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.3), transparent)" }}
        />
      </div>
    </div>
  </>
);

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
    if (event && event.events !== "ARCHITECT" && event.events !== "PRIVATE") {
      timer = setTimeout(onClose, 2500);
    }
    if (event?.events === "GAME_ENDED") setGameEnded(true);
    return () => { if (timer) clearTimeout(timer); };
  }, [event, mustChoose, onClose, setGameEnded]);

  if (!event && !mustChoose) return null;

  return (
    <>
      {/* Cartas del Forjador */}
      {event?.events === "ARCHITECT" && isPlayerTurn && (
        <ModalPanel maxW="max-w-fit">
          <h3 className="text-game-text-title text-center text-xl">Cartas obtenidas</h3>
          <div className="flex gap-4 justify-center flex-wrap pt-1">
            {privateInfo.districtsCardsGained.map(d => (
              <Card key={d.id} card={d} />
            ))}
          </div>
        </ModalPanel>
      )}

      {/* Cartas iniciales */}
      {event?.events === "PRIVATE" && (
        <ModalPanel maxW="max-w-fit">
          <h3 className="text-game-text-title text-center text-xl">Cartas iniciales</h3>
          <div className="flex gap-4 justify-center flex-wrap pt-1">
            {privateInfo.districtsCardsGained.map(d => (
              <Card key={d.id} card={d} />
            ))}
          </div>
          <div className="text-center pt-1">
            <button onClick={onClose}>Comenzar</button>
          </div>
        </ModalPanel>
      )}

      {/* Toast de evento */}
      {event && event.events !== "ARCHITECT" && event.events !== "PRIVATE" && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-toast-in">
          <div
            className="rounded-xl px-6 py-3 backdrop-blur-md"
            style={{ background: "rgba(42,30,21,0.95)", border: "1px solid rgba(179,137,86,0.4)", boxShadow: "0 4px 24px rgba(0,0,0,0.6)" }}
          >
            <p className="text-game-text-title text-base text-center whitespace-nowrap">
              {event.message}
            </p>
          </div>
        </div>
      )}

      {/* Elección de recompensa */}
      {mustChoose && (
        <DraggablePanel>
          <div className="text-center space-y-1">
            <h2 className="text-game-text-title text-2xl">Recompensa</h2>
            <p className="text-game-text-secondary text-sm opacity-70">Elige cómo cobrar tu turno</p>
          </div>

          <div className="flex gap-4 pt-2">
            <button onClick={onChooseCoin} className="flex-1 flex flex-col items-center gap-2 py-4">
              <img src={divitia} alt="monedas" className="w-10 h-10 object-contain" draggable={false} />
              <span>Monedas</span>
            </button>
            <button onClick={onChooseCard} className="flex-1 flex flex-col items-center gap-2 py-4">
              <img src={distritoImg} alt="carta" className="w-10 h-10 object-cover rounded-lg" draggable={false} style={{ border: "1px solid rgba(179,137,86,0.5)", boxShadow: "0 0 8px rgba(179,137,86,0.3)" }} />
              <span>Cartas</span>
            </button>
          </div>
        </DraggablePanel>
      )}
    </>
  );
}
