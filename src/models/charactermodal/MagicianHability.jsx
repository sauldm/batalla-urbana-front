export default function MagicianHability({ onExecute, onClose, characterId, gameId, enemy }) {
    const targets = [
        { id: 0,         name: "Mazo",           desc: "Descarta tu mano y roba tantas cartas" },
        { id: enemy?.id, name: enemy?.nickName,   desc: "Intercambia tu mano con la del rival" },
    ];

    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <h3 className="text-game-text-title text-xl">Ilusionista</h3>
                <p className="text-game-text-secondary text-sm opacity-70">Elige con quién intercambiar cartas</p>
            </div>

            <div className="space-y-2">
                {targets.map(t => (
                    <button
                        key={t.id}
                        className="w-full text-left flex flex-col gap-0.5 border border-game-highlight/25"
                        style={{ background: "rgba(179,137,86,0.07)" }}
                        onClick={() => { onExecute({ characterId, gameId, targetId: t.id }); onClose(); }}
                    >
                        <span>{t.name}</span>
                        <span className="text-xs opacity-50 font-normal">{t.desc}</span>
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
