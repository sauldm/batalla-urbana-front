import { useEffect, useState } from "react";
import getClassificationTable from "../services/api/classificationTableApi";
import { useNavigate } from "react-router-dom";

export const EndGameTable = () => {

    const [tableState, setTableState] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function getTable() {
            setTableState(await getClassificationTable());
        }
        getTable();
    }, [])

    if (!tableState) {
        return "cargando...";
    }
    return (
        <div className="min-h-screen flex flex-col items-center bg-game-back p-6">
            <h1 className="mb-6">Clasificación Global</h1>

            <table className="w-full max-w-xl border border-game-highlight/40 rounded-lg overflow-hidden">
                <thead className="bg-game-olive">
                    <tr>
                        <th className="px-4 py-2 text-left text-game-text-inverse">Posición</th>
                        <th className="px-4 py-2 text-left text-game-text-inverse">Jugador</th>
                        <th className="px-4 py-2 text-right text-game-text-inverse">Wins</th>
                    </tr>
                </thead>
                <tbody>
                    {tableState.map((player, index) => (
                        <tr
                            key={player.nickName}
                            className={index === 0 ? "bg-game-highlight font-bold" : "bg-game-board"}
                        >
                            <td className="px-4 py-2 text-game-text-main">{index + 1}</td>
                            <td className="px-4 py-2 text-game-text-main">{player.nickName}</td>
                            <td className="px-4 py-2 text-right text-game-text-main">{player.wins}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={() => navigate("/")} className="mt-8">
                Continuar
            </button>
        </div>
    )
}

export default EndGameTable;