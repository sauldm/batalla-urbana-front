import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useSocket } from "../services/webSocket/socketProvider";
import { createGameHttp } from "../services/api/lobbyApi";
import { useLobby } from "../providers/LobbyProvider";

/**
 * Componente de la sala (lobby) donde los jugadores esperan antes de iniciar la partida.
 *
 * Muestra el ID del lobby, la lista de jugadores conectados y permite al host
 * iniciar la partida cuando hay suficientes jugadores.
 *
 * @component
 * @returns {JSX.Element} Interfaz del lobby
 */
const Lobby = () => {
    const { id } = useParams();
    const { nick } = useSocket();
    const navigate = useNavigate();

    const { connected, players, unjoinLobby, setLobbyId, lobbyId, game } = useLobby();


    const lobbyIdRef = useRef(id);
    const nickRef = useRef(nick);

    useEffect(() => {
        setLobbyId(id);
    }, [id, setLobbyId]);


    /**
     * Intenta crear una partida en el backend para el lobby actual.
     *
     * Comprueba condiciones preclara (conexión, existencia de lobbyId,
     * número de jugadores y que no exista ya una partida) antes de llamar
     * a la API `createGameHttp`.
     *
     * @async
     * @returns {Promise<void>} Resuelve cuando la petición finaliza.
     */
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



    return (
        <Layout>
            <section>
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <h2>
                        Construye tu ciudad y domina
                        el reino
                    </h2>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16">
                <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                    <h3>JUGADORES EN EL LOBBY</h3>
                    <p>ID del lobby: {lobbyId}</p>
                    <p>Estado: {connected ? "Conectado" : "Desconectado"}</p>

                    {players.length === 0 ? (
                        <span>No hay jugadores</span>
                    ) : (
                        <div>
                            {players.map((p) => (
                                <p key={p}>{p}</p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <button
                        disabled={players.length < 2 || game}
                        onClick={handleCreateGame}
                    >
                        {game ? "Creando partida..." : "Empezar partida"}
                    </button>
                </div>
            </section>
            <button
                onClick={() => unjoinLobby({ id: lobbyId, nickName: nick }, navigate("/"))}
            >
                Salir del lobby
            </button>

        </Layout>

    );
};

export default Lobby;
