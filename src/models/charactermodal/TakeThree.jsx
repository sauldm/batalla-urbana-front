export default function TakeThree({ onExecute, onClose, districtId, gameId, cardName, cardDescription }) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div
                className="relative w-full max-w-sm rounded-2xl bg-game-modal overflow-hidden space-y-5 p-7"
                style={{ border: "1px solid rgba(192,132,252,0.4)", boxShadow: "0 0 50px rgba(0,0,0,0.9), inset 0 0 30px rgba(192,132,252,0.05)" }}
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(to right, transparent, rgba(192,132,252,0.7), transparent)" }}
                />

                <div className="text-center space-y-2">
                    {cardName && <h3 className="text-xl" style={{ color: "#c084fc" }}>{cardName}</h3>}
                    {cardDescription && (
                        <p className="text-game-text-secondary text-sm opacity-80">{cardDescription}</p>
                    )}
                </div>

                <div className="flex gap-3 pt-1">
                    <button
                        onClick={() => { onExecute({ gameId, districtId }); onClose(); }}
                        className="flex-1"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "1px solid rgba(168,85,247,0.5)", boxShadow: "0 0 14px rgba(168,85,247,0.4)" }}
                    >
                        Ejecutar
                    </button>
                    <button
                        onClick={onClose}
                        style={{ background: "transparent", border: "1px solid rgba(179,137,86,0.25)", boxShadow: "none" }}
                        className="flex-1 opacity-60 hover:opacity-100"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
