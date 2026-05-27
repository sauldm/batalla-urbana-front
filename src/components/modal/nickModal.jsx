import { useState } from "react";
import { useSocket } from "../../services/webSocket/socketProvider";
import { register, login, nickExists } from "../../services/auth/authService";

const inputClass = "w-full rounded-lg px-4 py-3 text-game-text-board placeholder:opacity-30 outline-none bg-black/30 border border-game-highlight/30";

export default function NickModal() {
    const { setNickAndConnect } = useSocket();
    const [tab, setTab] = useState("login");
    const [nick, setNick] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    const reset = () => { setNick(""); setPassword(""); setConfirm(""); setError(""); };

    const switchTab = (t) => { setTab(t); reset(); };

    const handleSubmit = () => {
        setError("");
        try {
            if (tab === "register") {
                if (!nick.trim() || !password || !confirm) {
                    setError("Rellena todos los campos"); return;
                }
                if (password !== confirm) {
                    setError("Las contraseñas no coinciden"); return;
                }
                if (password.length < 8) {
                    setError("La contraseña debe tener al menos 8 caracteres"); return;
                }
                if (!passwordRegex.test(password)) {
                    setError("La contraseña debe tener mayúsculas, minúsculas y números"); return;
                }
                
                if (nickExists(nick.trim())) {
                    setError("Ese nick ya está en uso"); return;
                }
                const resolvedNick = register(nick.trim(), password);
                setNickAndConnect(resolvedNick);
            } else {
                if (!nick.trim() || !password) {
                    setError("Rellena todos los campos"); return;
                }
                const resolvedNick = login(nick.trim(), password);
                setNickAndConnect(resolvedNick);
            }
        } catch (e) {
            setError(e.message);
        }
    };

    const onKey = (e) => { if (e.key === "Enter") handleSubmit(); };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm p-4">
            <div
                className="w-full max-w-sm rounded-2xl bg-game-modal border border-game-highlight/40 relative overflow-hidden"
                style={{ boxShadow: "0 0 60px rgba(0,0,0,0.9), inset 0 0 30px rgba(179,137,86,0.04)" }}
            >
                <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.7), transparent)" }}
                />

                {/* Título */}
                <div className="text-center pt-8 pb-5 px-8">
                    <h2 className="text-game-text-title text-3xl mb-1">Batalla Urbana</h2>
                    <p className="text-game-text-secondary text-sm opacity-60">Construye tu ciudad y domina el reino</p>
                </div>

                {/* Pestañas */}
                <div className="flex mx-6 mb-5 rounded-lg overflow-hidden border border-game-highlight/25">
                    {["login", "register"].map(t => (
                        <button
                            key={t}
                            onClick={() => switchTab(t)}
                            className="flex-1 py-2 text-sm transition-all"
                            style={{
                                background: tab === t ? "rgba(179,137,86,0.18)" : "transparent",
                                border: "none",
                                boxShadow: "none",
                                borderRadius: 0,
                                color: tab === t ? "#DEC290" : "rgba(245,235,215,0.45)",
                                borderBottom: tab === t ? "2px solid rgba(179,137,86,0.7)" : "2px solid transparent",
                            }}
                        >
                            {t === "login" ? "Iniciar sesión" : "Registrarse"}
                        </button>
                    ))}
                </div>

                {/* Formulario */}
                <div className="px-8 pb-8 space-y-3">
                    <input
                        value={nick}
                        onChange={e => setNick(e.target.value)}
                        onKeyDown={onKey}
                        placeholder="Nick"
                        autoFocus
                        className={inputClass}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={onKey}
                        placeholder="Contraseña"
                        className={inputClass}
                    />
                    {tab === "register" && (
                        <input
                            type="password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            onKeyDown={onKey}
                            placeholder="Confirmar contraseña"
                            className={inputClass}
                        />
                    )}

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button onClick={handleSubmit} className="w-full mt-1">
                        {tab === "login" ? "Entrar" : "Crear cuenta"}
                    </button>
                </div>

                <div
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.3), transparent)" }}
                />
            </div>
        </div>
    );
}
