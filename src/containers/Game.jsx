import { useEffect, useRef, useState } from "react";
import { useSocket } from "../services/webSocket/socketProvider";
import mazo from "../utils/images/mazo.png";
import fondo from "../utils/images/fondo.jpg";
import cartaAtras from "../utils/images/carta-atras.png";
import Card from "../models/Card";
import GameEventManager from "../services/GameEventManager";
import { useGame } from "../providers/GameProvider";
import CharacterHabilityManager from "../services/CharacterHabilityManager";
import ScrollableCardRow from "../components/ScrollableCardRow";
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
                        className=" aspect-[3/4] w-[140px] shrink-0 overflow-hidden">
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
                    <h2 className="text-white text-left">
                        {player.gold} 🪙
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
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div key={index} className="celda">

                                {index === 1 && getEnemyDistrictsInHand()}

                                {index === 2 && (
                                    <div className="flex gap-2 justify-center items-center card-row">
                                        {enemy.characterCardsPlayed.map(c => (
                                            <Card key={c.id} card={c} />
                                        ))}
                                    </div>
                                )}

                                {index === 4 && (
                                    <ScrollableCardRow>
                                        {enemy?.districtsBuilt.map(d => (
                                            <Card key={d.id} card={d} />
                                        ))}
                                    </ScrollableCardRow>

                                )}

                                {index === 3 && (
                                    <img src={mazo} alt="Mazo" className="imagen-centro" />
                                )}

                                {index === 7 && (
                                    <ScrollableCardRow>
                                        {player.districtsBuilt.map(d => (
                                            <Card
                                                key={d.id}
                                                card={d}
                                                isBuilt
                                                executeDistrictHability={executeDistrictHability}
                                                gameId={gameState.id}
                                                districtHabilityUsed={gameState.districtHabilityUsed}
                                                isPlayerTurn={isPlayerTurn}
                                            />
                                        ))}
                                    </ScrollableCardRow>
                                )}



                                {index === 9 && (
                                    <div className="flex gap-4 flex-wrap justify-center card-row">
                                        {privateInfo.characterCards.map(c => (
                                            <Card key={c.id} card={c} className="card" />
                                        ))}
                                    </div>
                                )}

                                {index === 10 && (
                                    <ScrollableCardRow>
                                        {privateInfo.districtsInHand.map(d => (
                                            <Card
                                                key={d.id}
                                                card={d}
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
                                )}


                                {index === 11 && (

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
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;
