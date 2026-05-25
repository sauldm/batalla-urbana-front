import { useEffect, useState } from "react";
import getClassificationTable from "../services/api/classificationTableApi";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";

export const EndGameTable = () => {
    const [rankings, setRankings] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getClassificationTable().then(setRankings).catch(() => setRankings([]));
    }, []);

    const medals = ["🥇", "🥈", "🥉"];

    return (
        <Layout>
            {/* Hero */}
            <section className="text-center pt-10 pb-8 px-4">
                <p className="text-game-accent text-sm tracking-[0.25em] uppercase mb-2">Partida finalizada</p>
                <h1 className="text-5xl md:text-6xl text-game-text-title mb-3">Clasificación</h1>
            </section>

            {/* Separador decorativo */}
            <div className="flex items-center gap-4 max-w-md mx-auto px-6 mb-10">
                <div className="flex-1 h-px bg-game-highlight/30" />
                <div className="w-1.5 h-1.5 rotate-45 bg-game-highlight/60" />
                <div className="flex-1 h-px bg-game-highlight/30" />
            </div>

            <section className="max-w-lg mx-auto px-4 pb-12 space-y-6">
                <div
                    className="relative rounded-2xl bg-game-panel border border-game-highlight/35 overflow-hidden"
                    style={{ boxShadow: "inset 0 0 30px rgba(179,137,86,0.06), 0 4px 24px rgba(0,0,0,0.4)" }}
                >
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.6), transparent)" }} />

                    {!rankings ? (
                        <p className="text-center text-game-accent py-12 animate-pulse">Cargando...</p>
                    ) : rankings.length === 0 ? (
                        <p className="text-center text-game-text-secondary opacity-60 py-12">Sin datos disponibles</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-game-highlight/30">
                                    <th className="px-6 py-4 text-game-accent text-xs uppercase tracking-widest font-normal">Pos.</th>
                                    <th className="px-4 py-4 text-game-accent text-xs uppercase tracking-widest font-normal">Jugador</th>
                                    <th className="px-6 py-4 text-game-accent text-xs uppercase tracking-widest font-normal text-right">Victorias</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankings.map((player, i) => (
                                    <tr
                                        key={player.nickName}
                                        className={`border-b border-game-highlight/10 transition-colors ${i === 0 ? "bg-game-highlight/[0.12]" : "hover:bg-game-highlight/[0.05]"}`}
                                    >
                                        <td className="px-6 py-4 text-xl">
                                            {i < 3 ? medals[i] : <span className="text-game-text-secondary text-sm">#{i + 1}</span>}
                                        </td>
                                        <td className={`px-4 py-4 ${i === 0 ? "text-game-text-title font-bold" : "text-game-text-board"}`}>
                                            {player.nickName}
                                        </td>
                                        <td className={`px-6 py-4 text-right ${i === 0 ? "text-game-highlight font-bold" : "text-game-text-secondary"}`}>
                                            {player.wins ?? 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.3), transparent)" }} />
                </div>

                <button onClick={() => navigate("/")} className="w-full">
                    Volver al inicio
                </button>
            </section>
        </Layout>
    );
};

export default EndGameTable;
