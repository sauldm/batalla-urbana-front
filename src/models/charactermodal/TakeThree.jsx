export default function TakeThree({ onExecute, onClose, districtId, gameId }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-gray-900 border border-purple-500/40 shadow-[0_0_30px_rgba(192,132,252,0.3)]"
                onClick={e => e.stopPropagation()}
            >
                <p className="text-purple-300 text-lg font-bold tracking-wide">Habilidad especial</p>
                <p className="text-white text-base text-center">
                    ¿Cambias <span className="text-yellow-300 font-black">2 💰</span> por <span className="text-green-300 font-black">3 cartas</span>?
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => { onExecute({ gameId, districtId }); onClose(); }}
                        className="px-6 py-2 rounded-xl font-bold text-white"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 12px rgba(168,85,247,0.5)" }}
                    >
                        Ejecutar
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
