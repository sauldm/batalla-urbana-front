import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "../components/layout/Layout";
import { useSocket } from "../services/webSocket/socketProvider";
import { createLobbyHttp, joinLobbyHttp } from "../services/api/lobbyApi";
import { useLobbySocket } from "../services/webSocket/useLobbySocket";
import RankingsModal from "../components/modal/RankingsModal";

export default function Home() {
  const navigate = useNavigate();
  const { nick, connected: wsConnected } = useSocket();
  const { lobbies } = useLobbySocket(null);

  const [selected, setSelected] = useState("");
  const [showRankings, setShowRankings] = useState(false);
  const canJoin = useMemo(() => Boolean(selected), [selected]);

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
      <Helmet>
        <title>Batalla Urbana — Juego de estrategia medieval online gratis</title>
        <meta name="description" content="Juego de estrategia por turnos para 2 jugadores. Personajes con habilidades únicas, construye distritos y derrota a tu rival. Sin descarga, directamente desde el navegador." />
        <meta name="keywords" content="juego de cartas online sin descarga, juego de estrategia multijugador navegador, juego de mesa online sin instalar, juego medieval por turnos gratis, juego de estrategia 2 jugadores navegador" />
        <link rel="canonical" href="https://batallaurbana.com/" />
      </Helmet>

      {/* Hero */}
      <section className="text-center pt-10 pb-8 px-4">
        <p className="text-game-text-secondary text-sm tracking-[0.25em] uppercase mb-2">
          Bienvenido de nuevo
        </p>
        <h1 className="text-5xl md:text-6xl text-game-text-title mb-3">
          {nick}
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: wsConnected ? "#0BEAA3" : "#888", boxShadow: wsConnected ? "0 0 6px #0BEAA3" : "none" }}
          />
          <span className="text-game-accent text-xs">{wsConnected ? "Conectado" : "Conectando..."}</span>
        </div>
      </section>

      {/* Separador decorativo */}
      <div className="flex items-center gap-4 max-w-md mx-auto px-6 mb-10">
        <div className="flex-1 h-px bg-game-highlight/30" />
        <div className="w-1.5 h-1.5 rotate-45 bg-game-highlight/60" />
        <div className="flex-1 h-px bg-game-highlight/30" />
      </div>

      {/* Paneles de acción */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Crear partida */}
          <div
            className="relative rounded-2xl bg-game-panel border border-game-highlight/35 p-7 space-y-5 overflow-hidden"
            style={{ boxShadow: "inset 0 0 30px rgba(179,137,86,0.06), 0 4px 24px rgba(0,0,0,0.4)" }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.6), transparent)" }}
            />
            <div>
              <h2 className="text-game-text-title text-xl mb-1">Crear partida</h2>
              <p className="text-sm text-game-text-secondary">
                Abre una sala nueva y espera a un rival.
              </p>
            </div>
            <button onClick={handleCreate} disabled={!wsConnected} className="w-full">
              Crear partida
            </button>
          </div>

          {/* Unirse a partida */}
          <div
            className="relative rounded-2xl bg-game-panel border border-game-highlight/35 p-7 space-y-5 overflow-hidden"
            style={{ boxShadow: "inset 0 0 30px rgba(179,137,86,0.06), 0 4px 24px rgba(0,0,0,0.4)" }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.6), transparent)" }}
            />
            <div>
              <h2 className="text-game-text-title text-xl mb-1">Unirse a partida</h2>
              <p className="text-sm text-game-text-secondary">
                Elige una sala disponible y entra.
              </p>
            </div>

            {lobbies.length === 0 ? (
              <div
                className="rounded-lg px-4 py-3 text-sm text-center opacity-60 bg-black/20 border border-game-highlight/20"
              >
                {wsConnected ? "No hay partidas disponibles" : "Buscando partidas..."}
              </div>
            ) : (
              <div className="space-y-3">
                <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full">
                  <option value="">— Selecciona una sala —</option>
                  {lobbies.map((id) => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
                <button onClick={handleJoin} disabled={!wsConnected || !canJoin} className="w-full">
                  Unirse
                </button>
                <p className="text-xs text-center text-game-accent">
                  {lobbies.length} sala{lobbies.length !== 1 ? "s" : ""} disponible{lobbies.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Secundarios */}
        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          <button
            onClick={() => navigate("/tutorial")}
            className="opacity-70 hover:opacity-100 border border-game-highlight/30"
            style={{ background: "transparent", boxShadow: "none" }}
          >
            Cómo jugar
          </button>
          <button
            onClick={() => setShowRankings(true)}
            className="opacity-70 hover:opacity-100 border border-game-highlight/30"
            style={{ background: "transparent", boxShadow: "none" }}
          >
            Ver Rankings
          </button>
        </div>
      </section>

      <RankingsModal isOpen={showRankings} onClose={() => setShowRankings(false)} />
    </Layout>
  );
}
