const PANEL_STYLE = {
    background: "rgba(179,137,86,0.07)",
    border: "1px solid rgba(179,137,86,0.25)",
};

export default function ThiefHability({ onExecute, onClose, characterId, gameId }) {
    const targets = [
        { id: 3, name: "Ilusionista" },
        { id: 4, name: "Gobernador" },
        { id: 5, name: "Inquisidor" },
        { id: 6, name: "Mercader" },
        { id: 7, name: "Forjador" },
        { id: 8, name: "Conquistador" },
    ];

    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <h3 className="text-game-text-title text-xl">Saqueador</h3>
                <p className="text-game-text-secondary text-sm opacity-70">Elige a quién robar el oro</p>
            </div>

            <div className="space-y-2">
                {targets.map(t => (
                    <button
                        key={t.id}
                        className="w-full text-left"
                        style={PANEL_STYLE}
                        onClick={() => { onExecute({ characterId, gameId, targetId: t.id }); onClose(); }}
                    >
                        {t.name}
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
