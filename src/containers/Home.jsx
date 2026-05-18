// src/pages/Home.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useSocket } from "../services/webSocket/socketProvider";
import { createLobbyHttp, joinLobbyHttp } from "../services/api/lobbyApi";
import { useLobbySocket } from "../services/webSocket/useLobbySocket";
import RankingsModal from "../components/modal/RankingsModal";

/**
 * Página principal de la aplicación donde el usuario puede crear o unirse a lobbies.
 *
 * Muestra el estado del socket, lista de lobbies disponibles y botones para
 * crear o unirse a partidas.
 *
 * @component
 * @returns {JSX.Element} Interfaz de la página de inicio
 */
export default function Home() {
  const navigate = useNavigate();
  const { nick, connected: wsConnected } = useSocket();

  const { lobbies } = useLobbySocket(null);

  const [selected, setSelected] = useState("");
  const [showRankings, setShowRankings] = useState(false);
  const canJoin = useMemo(() => Boolean(selected), [selected]);

  /**
   * Crea un nuevo lobby en el backend y une al usuario a él.
   *
   * - Comprueba que el socket esté conectado y que exista `nick`.
   * - Llama a `createLobbyHttp` para obtener un `lobbyId`.
   * - Llama a `joinLobbyHttp` para unir al usuario al lobby y navega a la ruta del lobby.
   *
   * @async
   * @returns {Promise<void>} Resuelve cuando la creación y unión han finalizado.
   */
  const handleCreate = async () => {
    if (!wsConnected || !nick) return;

    try {
      const lobbyId = await createLobbyHttp();
      await joinLobbyHttp(lobbyId, nick);
      navigate(`/lobby/${lobbyId}`);
    } catch (e) {
      console.error(e);
      alert("No se pudo crear el lobby");
    }
  };

  /**
   * Une al usuario al lobby seleccionado.
   *
   * - Comprueba que hay un `selected` válido y que existe `nick`.
   * - Llama a `joinLobbyHttp` y navega a la ruta del lobby.
   *
   * @async
   * @returns {Promise<void>} Resuelve cuando la unión ha finalizado.
   */
  const handleJoin = async () => {
    if (!selected || !nick) return;

    try {
      await joinLobbyHttp(selected, nick);
      navigate(`/lobby/${selected}`);
    } catch (e) {
      console.error(e);
      alert("No se pudo unir al lobby");
    }
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-base md:text-lg opacity-80">
              Bienvenido, <span className="font-semibold">{nick}</span>. Crea una partida o únete a una existente.
            </p>
            <div className="text-sm opacity-70">
              Estado: {wsConnected ? "Conectado" : "Conectando..."}
            </div>
            <button
              onClick={() => setShowRankings(true)}
              className="mt-4"
            >
              Ver Rankings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-game-highlight/40 bg-game-panel p-6 md:p-8 space-y-4 shadow-sm">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Crear partida</h2>
                <p className="text-sm opacity-80">
                  Genera un lobby nuevo y entra automáticamente.
                </p>
              </div>

              <button
                onClick={handleCreate}
                disabled={!wsConnected}
                className="w-full"
              >
                Crear y unirme
              </button>
            </div>

            <div className="rounded-2xl border border-game-highlight/40 bg-game-panel p-6 md:p-8 space-y-4 shadow-sm">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Unirse a partida</h2>
                <p className="text-sm opacity-80">
                  Selecciona un lobby disponible y entra.
                </p>
              </div>

              {lobbies.length === 0 ? (
                <div className="rounded-xl border border-game-highlight/30 bg-game-bg/60 p-4 text-sm opacity-80">
                  {wsConnected ? "No hay lobbies disponibles." : "Cargando lobbies..."}
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-sm opacity-80">Lobbies disponibles</label>
                  <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="w-full"
                  >
                    <option value="">Selecciona un lobby</option>
                    {lobbies.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleJoin}
                    disabled={!wsConnected || !canJoin}
                    className="w-full"
                  >
                    Unirse
                  </button>

                  <div className="text-xs opacity-70">
                    Mostrando {lobbies.length} lobby{lobbies.length === 1 ? "" : "s"}.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <RankingsModal isOpen={showRankings} onClose={() => setShowRankings(false)} />
    </Layout>
  );
}
