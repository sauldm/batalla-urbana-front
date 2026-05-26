export default function MilitarHability({ onExecute, onClose, characterId, gameId, deckCardsBuilt }) {
    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <h3 className="text-game-text-title text-xl">Conquistador</h3>
                <p className="text-game-text-secondary text-sm opacity-70">Elige el distrito enemigo a destruir</p>
            </div>

            <div className="space-y-2">
                {deckCardsBuilt.map(c => (
                    <button
                        key={c.id}
                        disabled={c.undestructible}
                        className="w-full flex items-center justify-between border border-game-highlight/25"
                        style={{ background: "rgba(179,137,86,0.07)", opacity: c.undestructible ? 0.4 : 1 }}
                        onClick={() => { onExecute({ characterId, gameId, targetId: c.id }); onClose(); }}
                    >
                        <span>{c.name}</span>
                        <span className="text-xs opacity-50">
                            {c.undestructible ? "Indestructible" : `Coste: ${parseInt(c.gold) - 1} 💰`}
                        </span>
                    </button>
                ))}
            </div>

            <button
                onClick={onClose}
                className="w-full opacity-60 hover:opacity-100 border border-game-highlight/25"
                style={{ background: "transparent", boxShadow: "none" }}
            >
                Cancelar
            </button>
        </div>
    );
}
