import { useState } from "react";
import Card from "../models/Card";

export default function CharacterCardStack({ cards, characterTurnId, label = "Tus personajes" }) {
  const [open, setOpen] = useState(false);

  if (!cards?.length) return null;

  const sorted = [...cards].sort((a, b) =>
    a.id === characterTurnId ? -1 : b.id === characterTurnId ? 1 : 0
  );
  const [first, second] = sorted;

  return (
    <>
      {/* Mazo apilado — segunda carta girada detrás, primera delante */}
      <div
        className="relative cursor-pointer select-none"
        style={{ width: 138, height: 182 }}
      >
        {second && (
          <div className="absolute" style={{ top: 12, left: 16, transform: "rotate(8deg)", zIndex: 1 }}>
            <Card card={second} isCurrentTurn={second.id === characterTurnId} />
          </div>
        )}
        <div className="absolute" style={{ top: 0, left: 0, zIndex: 2 }}>
          <Card card={first} isCurrentTurn={first.id === characterTurnId} />
        </div>
        {/* Capa transparente por encima de las cartas para capturar el click */}
        <div className="absolute inset-0" style={{ zIndex: 10 }} onClick={() => setOpen(true)} />
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/5"
            onClick={e => e.stopPropagation()}
          >
            <span className="text-game-accent text-xs uppercase tracking-widest">
              {label}
            </span>
            <div className="flex gap-10 items-center justify-center">
              {cards.map(c => (
                <div
                  key={c.id}
                  style={{ width: 168, height: 246, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <div style={{ transform: "scale(1.5)", transformOrigin: "center center" }}>
                    <Card card={c} isCurrentTurn={c.id === characterTurnId} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
