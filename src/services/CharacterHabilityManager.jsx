import AssassinHability from "../models/charactermodal/AssassinHability";
import MagicianHability from "../models/charactermodal/MagicianHability";
import MilitarHability from "../models/charactermodal/MilitarHability";
import ThiefHability from "../models/charactermodal/ThiefHability";


/**
 * Componente modal que renderiza la UI de la habilidad de personaje correspondiente.
 *
 * Selecciona el componente específico según `characterId` y le pasa las props
 * necesarias para ejecutar la habilidad.
 *
 * @param {{
 *   characterId: number,
 *   executeCharacterHability: function,
 *   onClose: function,
 *   gameId: string|number,
 *   deckCardsBuilt?: Array<any>,
 *   enemy?: any
 * }} props - Props del componente.
 * @returns {JSX.Element} Modal con la UI de la habilidad correspondiente.
 */
export function CharacterHabilityManager({
    characterId,
    executeCharacterHability,
    onClose,
    gameId,
    deckCardsBuilt,
    enemy
}) {

    const renderHability = () => {
        switch (characterId) {

            case 1:
                return (
                    <AssassinHability
                        onExecute={executeCharacterHability}
                        onClose={onClose}
                        gameId={gameId}
                        characterId={characterId}
                    />
                );

            case 2:
                return (
                    <ThiefHability
                        onExecute={executeCharacterHability}
                        onClose={onClose}
                        gameId={gameId}
                        characterId={characterId}

                    />
                );

            case 3:
                return (
                    <MagicianHability
                        onExecute={executeCharacterHability}
                        onClose={onClose}
                        gameId={gameId}
                        characterId={characterId}
                        enemy={enemy}
                    />
                );

            case 8:
                return (
                    <MilitarHability
                        onExecute={executeCharacterHability}
                        onClose={onClose}
                        gameId={gameId}
                        characterId={characterId}
                        deckCardsBuilt={deckCardsBuilt}
                    />
                );

            default:
                return (
                    onClose()
                );
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="relative w-full max-w-sm rounded-2xl bg-game-modal overflow-hidden p-7"
                    style={{ border: "1px solid rgba(179,137,86,0.4)", boxShadow: "0 0 60px rgba(0,0,0,0.9), inset 0 0 30px rgba(179,137,86,0.04)" }}
                >
                    <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.7), transparent)" }}
                    />
                    {renderHability()}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-px"
                        style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.3), transparent)" }}
                    />
                </div>
            </div>
        </>
    );
}

export default CharacterHabilityManager;
