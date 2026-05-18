import { useEffect, useState } from "react";
import { getClassificationTable } from "../../services/api/classificationTableApi";

/**
 * Modal que muestra la tabla de rankings/clasificación del juego.
 *
 * @component
 * @param {boolean} isOpen - Indica si el modal está abierto
 * @param {function} onClose - Función para cerrar el modal
 * @returns {JSX.Element} Modal con la tabla de rankings
 */
export default function RankingsModal({ isOpen, onClose }) {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getClassificationTable();
        setRankings(data);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar los rankings");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-game-modal border-2 border-game-highlight/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-game-modal border-b border-game-highlight/40 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Rankings</h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none opacity-70 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <p className="opacity-70">Cargando rankings...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && rankings.length === 0 && (
            <div className="text-center py-8">
              <p className="opacity-70">No hay rankings disponibles</p>
            </div>
          )}

          {!loading && !error && rankings.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-game-highlight/30 text-game-text-title opacity-80">
                    <th className="pb-3 pr-4 font-semibold">Posición</th>
                    <th className="pb-3 pr-4 font-semibold">Nick</th>
                    <th className="pb-3 pr-4 font-semibold">Victorias</th>
                    <th className="pb-3 font-semibold">Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((player, index) => (
                    <tr key={index} className={`border-b border-game-highlight/20 transition-colors ${index === 0 ? "bg-game-highlight/20 font-bold" : "hover:bg-game-panel/60"}`}>
                      <td className="py-3 pr-4 font-semibold text-lg">
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                        {index > 2 && `#${index + 1}`}
                      </td>
                      <td className="py-3 pr-4">{player.nickName}</td>
                      <td className="py-3 pr-4">{player.wins || player.victorias || 0}</td>
                      <td className="py-3">{player.points || player.puntos || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
