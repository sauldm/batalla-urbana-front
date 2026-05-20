import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useSocket } from "../services/webSocket/socketProvider";
import { createGameHttp } from "../services/api/lobbyApi";
import { useLobby } from "../providers/LobbyProvider";

const Lobby = () => {
    const { id } = useParams();
    const { nick } = useSocket();
    const navigate = useNavigate();

    const { connected, players, unjoinLobby, setLobbyId, lobbyId, game } = useLobby();

    const lobbyIdRef = useRef(id);
    const nickRef = useRef(nick);

    useEffect(() => { setLobbyId(id); }, [id, setLobbyId]);

    const handleCreateGame = async () => {
        if (!connected || !lobbyId || players.length !== 2 || game) return;
        try {
            await createGameHttp(id, players);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (game == null) return;
        navigate(`/game/${lobbyId}`);
    }, [lobbyId, navigate, game]);

    useEffect(() => {
        lobbyIdRef.current = lobbyId;
        nickRef.current = nick;
    }, [lobbyId, nick]);

    const canStart = connected && players.length === 2 && !game;

    return (
        <Layout>
            {/* Hero */}
            <section className="text-center pt-10 pb-8 px-4">
                <p className="text-game-text-secondary text-sm tracking-[0.25em] uppercase mb-2">
                    Sala de espera
                </p>
                <h1 className="text-5xl md:text-6xl text-game-text-title mb-3">
                    Batalla Urbana
                </h1>
                <p className="text-game-text-secondary text-base opacity-70">
                    Construye tu ciudad y domina el reino
                </p>
            </section>

            {/* Separador decorativo */}
            <div className="flex items-center gap-4 max-w-md mx-auto px-6 mb-10">
                <div className="flex-1 h-px bg-game-highlight/30" />
                <div className="w-1.5 h-1.5 rotate-45 bg-game-highlight/60" />
                <div className="flex-1 h-px bg-game-highlight/30" />
            </div>

            <section className="max-w-lg mx-auto px-4 pb-12 space-y-6">

                {/* Panel del lobby */}
                <div
                    className="relative rounded-2xl bg-game-panel border border-game-highlight/35 p-7 space-y-6 overflow-hidden"
                    style={{ boxShadow: "inset 0 0 30px rgba(179,137,86,0.06), 0 4px 24px rgba(0,0,0,0.4)" }}
                >
                    <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.6), transparent)" }}
                    />

                    {/* ID del lobby */}
                    <div className="text-center">
                        <p className="text-xs tracking-widest uppercase text-game-accent mb-1">
                            Código de sala
                        </p>
                        <p
                            className="font-mono text-lg tracking-widest text-game-text-title px-4 py-2 rounded-lg inline-block bg-black/30 border border-game-highlight/25"
                        >
                            {lobbyId}
                        </p>
                    </div>

                    {/* Separador interno */}
                    <div className="h-px bg-game-highlight/15" />

                    {/* Lista de jugadores */}
                    <div className="space-y-3">
                        <p className="text-xs tracking-widest uppercase text-game-text-secondary opacity-60">
                            Jugadores ({players.length}/2)
                        </p>

                        {[0, 1].map((slot) => {
                            const player = players[slot];
                            const isMe = player === nick;
                            return (
                                <div
                                    key={slot}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-3 border ${player ? "bg-game-highlight/[0.08] border-game-highlight/30" : "bg-black/20 border-game-highlight/10"}`}
                                >
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ background: player ? "#0BEAA3" : "rgba(255,255,255,0.15)", boxShadow: player ? "0 0 6px #0BEAA3" : "none" }}
                                    />
                                    <span className={`text-sm flex-1 ${player ? "text-game-text-board" : "opacity-30"}`}>
                                        {player ?? "Esperando jugador..."}
                                    </span>
                                    {isMe && (
                                        <span className="text-xs text-game-accent tracking-wider">
                                            tú
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Estado de espera */}
                    {players.length < 2 && (
                        <p className="text-center text-sm text-game-accent opacity-70 animate-pulse">
                            Esperando a que se una otro jugador...
                        </p>
                    )}
                </div>

                {/* Botones */}
                <button
                    onClick={handleCreateGame}
                    disabled={!canStart}
                    className="w-full"
                >
                    {game ? "Iniciando partida..." : "Iniciar partida"}
                </button>

                <div className="text-center">
                    <button
                        onClick={() => unjoinLobby({ id: lobbyId, nickName: nick }, navigate("/"))}
                        className="opacity-60 hover:opacity-100 border border-game-highlight/30"
                        style={{ background: "transparent", boxShadow: "none" }}
                    >
                        Abandonar sala
                    </button>
                </div>
            </section>
        </Layout>
    );
};

export default Lobby;
