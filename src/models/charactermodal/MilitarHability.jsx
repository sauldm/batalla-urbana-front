const PANEL_STYLE = {
    background: "rgba(179,137,86,0.07)",
    border: "1px solid rgba(179,137,86,0.25)",
};

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
                        className="w-full flex items-center justify-between"
                        style={PANEL_STYLE}
                        onClick={() => { onExecute({ characterId, gameId, targetId: c.id }); onClose(); }}
                    >
                        <span>{c.name}</span>
                        <span className="text-xs opacity-50">
                            Coste: {parseInt(c.gold) - 1} 💰
                        </span>
                    </button>
                ))}
            </div>

            <button
                onClick={onClose}
                style={{ background: "transparent", border: "1px solid rgba(179,137,86,0.25)", boxShadow: "none" }}
                className="w-full opacity-60 hover:opacity-100"
            >
                Cancelar
            </button>
        </div>
    );
}
