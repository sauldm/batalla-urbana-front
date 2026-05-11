import { useEffect, useRef, useState } from "react";
import { useSocket } from "../services/webSocket/socketProvider";
import fondo from "../utils/images/fondo.jpg";
import divitia from "../utils/images/divitia.png";
import cartaAtras from "../utils/images/carta-atras.png";
import Card from "../models/Card";
import GameEventManager from "../services/GameEventManager";
import { useGame } from "../providers/GameProvider";
import CharacterHabilityManager from "../services/CharacterHabilityManager";
import ScrollableCardRow from "../components/ScrollableCardRow";
import CharacterCardStack from "../components/CharacterCardStack";
import { useNavigate } from "react-router-dom";

/**
 * Componente principal de la vista del juego.
 *
 * Utiliza los providers de juego y socket para renderizar el tablero,
 * la información de jugador/enemigo y los controles relacionados. Mantiene
 * estado UI local para mostrar habilidades, modo construcción y pantalla
 * de fin de partida.
 *
 * @component
 * @returns {JSX.Element} Interfaz completa del juego
 */
const Game = () => {
    const {
        gameState,
        events,
        privateInfo,
        chooseCoin,
        chooseCard,
        nextStep,
        executeCharacterHability,
        buildDistrict,
        executeDistrictHability
    } = useGame();

    const { nick } = useSocket();

    const [enemy, setEnemy] = useState(null);
    const [player, setPlayer] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [showCharacterHability, setShowCharacterHability] = useState(false);
    const [canBuild, setCanBuild] = useState(false);
    const [characterTurn, setCharacterTurn] = useState(null);
    const builtAreaRef = useRef(null);
    const [gameEnded, setGameEnded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!gameState?.playerCommonInfoDTOS || !nick) return;

        setEnemy(
            gameState.playerCommonInfoDTOS.find(p => p.nickName !== nick) ?? null
        );

        setPlayer(
            gameState.playerCommonInfoDTOS.find(p => p.nickName === nick) ?? null
        );
    }, [gameState, nick]);

    useEffect(() => {
        if (!privateInfo || !gameState) return;

        setIsPlayerTurn(
            privateInfo.characterCards.some(
                c => c.id === gameState.characterTurnId
            )
        );
        const characterTurn =
            player?.characterCardsPlayed?.find(
                c => c.id === gameState.characterTurnId
            ) ??
            enemy?.characterCardsPlayed?.find(
                c => c.id === gameState.characterTurnId
            ) ??
            null;

        setCharacterTurn(characterTurn);

    }, [privateInfo, gameState]);


    console.log(gameState)
    console.log(events)
    console.log(privateInfo?.districtsCardsGained)


    const mustChoose = isPlayerTurn && !gameState?.turnCompleted;

    const canUseCharacterHability = isPlayerTurn && !gameState?.characterHabilityUsed;

    useEffect(() => {
        /**
         * Cierra la UI de construcción cuando se hace clic fuera del área
         * de construcción.
         *
         * @param {MouseEvent} e - Evento de ratón del listener del documento.
         * @returns {void}
         */
        const handleClickOutside = (e) => {
            if (
                canBuild &&
                builtAreaRef.current &&
                !builtAreaRef.current.contains(e.target)
            ) {
                setCanBuild(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [canBuild]);

    const getEnemyDistrictsInHand = () => {
        const count = Math.max(0, Number(enemy?.numberDistrictsInHand) || 0);

        return (
            <ScrollableCardRow>
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-[3/4] w-[98px] shrink-0 overflow-hidden">
                        <img
                            src={cartaAtras}
                            alt={`Distrito ${i + 1}`}
                            className="card card-invisible w-full h-full object-cover block"
                        />
                    </div>
                ))}
            </ScrollableCardRow>
        );
    };

    if (gameEnded) {
        return (
            <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
                <h1 className="text-3xl font-bold mb-6">Clasificación Final</h1>

                <table className="w-full max-w-xl border border-gray-700 rounded-lg overflow-hidden">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left">Posición</th>
                            <th className="px-4 py-2 text-left">Jugador</th>
                            <th className="px-4 py-2 text-right">Puntos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...gameState.playerCommonInfoDTOS]
                            .sort((a, b) => b.points - a.points)
                            .map((player, index) => (
                                <tr
                                    key={player.nickName}
                                    className={index === 0 ? "bg-yellow-700 font-bold" : "bg-gray-800"}
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{player.nickName}</td>
                                    <td className="px-4 py-2 text-right">{player.points}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <button
                    onClick={() => navigate("/ranking")}
                    className="mt-8 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                    Continuar
                </button>
            </div>
        )
    }
    if (!gameState || !privateInfo || !player || !enemy) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-game-bg">
                Cargando tablero...
            </div>
        );
    }

    return (
        <div className="w-screen h-screen bg-game-bg overflow-hidden parent-perspective">
            <div className="w-full h-dvh px-4 pt-4 pb-6 md:px-6 md:pt-6 md:pb-8 flex flex-col">

                <GameEventManager
                    events={events}
                    onChooseCoin={chooseCoin}
                    onChooseCard={chooseCard}
                    mustChoose={mustChoose}
                    privateInfo={privateInfo}
                    isPlayerTurn={isPlayerTurn}
                    setGameEnded={setGameEnded}
                />

                {showCharacterHability && (
                    <CharacterHabilityManager
                        onClose={() => setShowCharacterHability(false)}
                        executeCharacterHability={executeCharacterHability}
                        gameId={gameState.id}
                        characterId={gameState.characterTurnId}
                        deckCardsBuilt={enemy.districtsBuilt}
                        enemy={enemy}
                    />
                )}
                <div className="grid grid-cols-1 tablet:grid-cols-3 items-center gap-2">
                    <h2 className="text-white text-left flex items-center gap-2">
                        <img src={divitia} alt="oro" className="w-8 h-8" />
                        <span className="text-xl font-black leading-none">{player.gold}</span>
                    </h2>

                    <h3 className="text-white text-center">
                        {player.nickName}
                    </h3>

                    <h3 className="text-white text-right">
                        {characterTurn?.name}
                    </h3>
                </div>




                <div
                    className="w-full flex-1 rounded-xl shadow-2xl overflow-hidden bg-no-repeat bg-center bg-cover"
                    style={{ backgroundImage: `url(${fondo})` }}
                >
                    <div className="tablero">

                        {/* Fila 1 */}
                        <div className="celda flex flex-col items-center justify-center gap-3">
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-white/50 text-xs uppercase tracking-widest">Nombre</span>
                                <span className="text-white font-bold text-sm truncate max-w-full px-1">{enemy.nickName}</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-white/50 text-xs uppercase tracking-widest">Oro</span>
                                <div className="flex items-center gap-2">
                                    <img src={divitia} alt="oro" className="w-10 h-10" style={{ filter: "drop-shadow(0 0 6px rgba(251,191,36,0.8))" }} />
                                    <span className="text-yellow-300 text-2xl font-black leading-none">{enemy.gold}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-white/50 text-xs uppercase tracking-widest">Cartas</span>
                                <span className="text-white text-xl font-black">{enemy.numberDistrictsInHand}</span>
                            </div>
                        </div>
                        <div className="celda">{getEnemyDistrictsInHand()}</div>
                        <div className="celda">
                            <div className="flex items-center justify-center h-full">
                                <CharacterCardStack
                                    cards={enemy.characterCardsPlayed}
                                    characterTurnId={gameState.characterTurnId}
                                    label="Cartas jugadas por el enemigo"
                                />
                            </div>
                        </div>

                        {/* Fila 2: distritos comprados enemigo — ancho completo */}
                        <div className="celda" style={{ gridColumn: "1 / -1" }}>
                            <ScrollableCardRow>
                                {enemy?.districtsBuilt.map(d => (
                                    <Card key={d.id} card={d} small />
                                ))}
                            </ScrollableCardRow>
                        </div>

                        {/* Fila 3: distritos comprados jugador — ancho completo */}
                        <div className="celda" style={{ gridColumn: "1 / -1" }}>
                            <ScrollableCardRow>
                                {player.districtsBuilt.map(d => (
                                    <Card
                                        key={d.id}
                                        card={d}
                                        small
                                        isBuilt
                                        executeDistrictHability={executeDistrictHability}
                                        gameId={gameState.id}
                                        districtHabilityUsed={gameState.districtHabilityUsed}
                                        isPlayerTurn={isPlayerTurn}
                                    />
                                ))}
                            </ScrollableCardRow>
                        </div>

                        {/* Fila 4 */}
                        <div className="celda">
                            <div className="flex items-center justify-center h-full">
                                <CharacterCardStack
                                    cards={privateInfo.characterCards}
                                    characterTurnId={gameState.characterTurnId}
                                />
                            </div>
                        </div>
                        <div className="celda">
                            <ScrollableCardRow>
                                {privateInfo.districtsInHand.map(d => (
                                    <Card
                                        key={d.id}
                                        card={d}
                                        small
                                        canBuild={canBuild}
                                        className="card"
                                        onBuild={() => {
                                            buildDistrict({
                                                gameId: gameState.id,
                                                districtId: d.id,
                                                characterId: gameState.characterTurnId,
                                            });
                                            setCanBuild(false);
                                        }}
                                    />
                                ))}
                            </ScrollableCardRow>
                        </div>
                        <div className="celda">
                            <div className="grid grid-cols-1 gap-3 controls">
                                <button
                                    disabled={!isPlayerTurn}
                                    onClick={() => setCanBuild(!canBuild)}
                                    className="btn-action"
                                >
                                    Comprar distrito
                                </button>
                                <button
                                    disabled={!canUseCharacterHability}
                                    onClick={() => setShowCharacterHability(true)}
                                    className="btn-action"
                                >
                                    Habilidad personaje
                                </button>
                                <button
                                    disabled={!isPlayerTurn}
                                    onClick={nextStep}
                                    className="btn-action"
                                >
                                    Terminar turno
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;
