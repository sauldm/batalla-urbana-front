export default function TakeThree({ onExecute, onClose, districtId, gameId }) {


    return (
        <div className="space-y-4 text-center">
            <p className="text-game-highlight">Cambia 2 de oro por 3 cartas</p>
            <p>Aceptas?</p>
            <div className="flex flex-col gap-2">
                    <button
                        key={districtId}
                        onClick={() => {
                            onExecute({
                                gameId: gameId,
                                districtId: districtId
                            });

                            onClose();
                        }}
                    >
                        <p>Ejecutar</p>
                    </button>
            </div>
            <button onClick={() => onClose()}>x</button>

        </div>
    );
}
