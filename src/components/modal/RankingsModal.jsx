import { useEffect, useState } from "react";
import { getClassificationTable } from "../../services/api/classificationTableApi";

export default function RankingsModal({ isOpen, onClose }) {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    getClassificationTable()
      .then(setRankings)
      .catch(() => setError("No se pudieron cargar los rankings"))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <>
      <div className="fixed inset-0 z-[190] bg-black/80 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg rounded-2xl bg-game-modal border border-game-highlight/40 overflow-hidden"
          style={{ boxShadow: "0 0 60px rgba(0,0,0,0.9), inset 0 0 30px rgba(179,137,86,0.04)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.7), transparent)" }} />

          {/* Cabecera */}
          <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-game-highlight/20">
            <div>
              <h2 className="text-game-text-title text-2xl">Rankings</h2>
              <p className="text-game-accent text-xs tracking-widest uppercase mt-0.5">Clasificación global</p>
            </div>
            <button
              onClick={onClose}
              className="opacity-50 hover:opacity-100 text-lg leading-none"
              style={{ background: "transparent", border: "none", boxShadow: "none", padding: "4px 8px" }}
            >
              ✕
            </button>
          </div>

          {/* Contenido */}
          <div className="px-7 py-5 max-h-[60vh] overflow-y-auto">
            {loading && (
              <p className="text-center text-game-accent py-8 animate-pulse">Cargando rankings...</p>
            )}

            {error && (
              <p className="text-center text-red-400 py-8">{error}</p>
            )}

            {!loading && !error && rankings.length === 0 && (
              <p className="text-center text-game-text-secondary opacity-60 py-8">No hay rankings disponibles</p>
            )}

            {!loading && !error && rankings.length > 0 && (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-game-highlight/30">
                    <th className="pb-3 pr-4 text-game-accent text-xs uppercase tracking-widest font-normal">Pos.</th>
                    <th className="pb-3 pr-4 text-game-accent text-xs uppercase tracking-widest font-normal">Jugador</th>
                    <th className="pb-3 text-game-accent text-xs uppercase tracking-widest font-normal text-right">Victorias</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((player, i) => (
                    <tr
                      key={i}
                      className={`border-b border-game-highlight/10 transition-colors ${i === 0 ? "bg-game-highlight/[0.12]" : "hover:bg-game-highlight/[0.05]"}`}
                    >
                      <td className="py-3 pr-4 text-lg">
                        {i < 3 ? medals[i] : <span className="text-game-text-secondary text-sm">#{i + 1}</span>}
                      </td>
                      <td className={`py-3 pr-4 ${i === 0 ? "text-game-text-title font-bold" : "text-game-text-board"}`}>
                        {player.nickName}
                      </td>
                      <td className={`py-3 text-right ${i === 0 ? "text-game-highlight font-bold" : "text-game-text-secondary"}`}>
                        {player.wins ?? player.victorias ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.3), transparent)" }} />
        </div>
      </div>
    </>
  );
}
