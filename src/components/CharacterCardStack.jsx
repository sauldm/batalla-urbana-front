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
      {/* Contenedor fluido: ocupa la altura de la celda y mantiene proporción 2:3 */}
      <div className="relative cursor-pointer select-none h-full" style={{ aspectRatio: "2/3", maxWidth: "100%" }}>
        {second && (
          <div className="absolute inset-0" style={{ transform: "translate(8px, 6px) rotate(8deg)", zIndex: 1 }}>
            <Card card={second} fluid isCurrentTurn={second.id === characterTurnId} />
          </div>
        )}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <Card card={first} fluid isCurrentTurn={first.id === characterTurnId} />
        </div>
        <div className="absolute inset-0" style={{ zIndex: 10 }} onClick={() => setOpen(true)} />
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex flex-col items-center gap-6 p-6 rounded-2xl bg-white/5 max-w-[90vw] max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <span className="text-game-accent text-xs uppercase tracking-widest">
              {label}
            </span>
            <div className="flex flex-wrap gap-6 items-center justify-center">
              {cards.map(c => (
                <div key={c.id} className="w-[120px] h-[175px] tablet:w-[150px] tablet:h-[219px] desktop:w-[165px] desktop:h-[241px] shrink-0">
                  <Card card={c} fluid isCurrentTurn={c.id === characterTurnId} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
