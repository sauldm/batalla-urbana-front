import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../models/Card";
import CharacterCardStack from "../components/CharacterCardStack";
import BuiltDistrictsGrid from "../components/BuiltDistrictsGrid";
import ScrollableCardRow from "../components/ScrollableCardRow";
import divitia from "../utils/images/divitia.png";
import cartaAtras from "../utils/images/carta-atras.png";
import fondo from "../utils/images/fondo.jpg";

// ── Mock data ─────────────────────────────────────────────────────────────
const ENEMY = {
    nickName: "Rival",
    gold: 5,
    numberDistrictsInHand: 3,
    characterCardsPlayed: [
        { id: 3, color: 5, name: "Ilusionista" },
        { id: 6, color: 4, name: "Mercader" },
    ],
    districtsBuilt: [
        { id: 301, color: 3, name: "Templo", gold: "1" },
        { id: 302, color: 1, name: "Mansión", gold: "3" },
        { id: 303, color: 4, name: "Puerto", gold: "4" },
        { id: 304, color: 2, name: "Prisión", gold: "2" },
    ],
};

const PLAYER_DISTRICTS_BUILT = [
    { id: 201, color: 4, name: "Taberna", gold: "1" },
    { id: 202, color: 1, name: "Torre", gold: "2" },
    { id: 203, color: 2, name: "Cuartel", gold: "3" },
];

const PLAYER_HAND = [
    { id: 101, color: 1, name: "Palacio", gold: "5" },
    { id: 102, color: 2, name: "Fortaleza", gold: "3" },
    { id: 103, color: 3, name: "Catedral", gold: "4" },
    { id: 104, color: 4, name: "Mercado", gold: "2" },
];

const PLAYER_CHARACTER_CARDS = [
    { id: 1, color: 2, name: "Verdugo" },
    { id: 4, color: 1, name: "Gobernador" },
    { id: 7, color: 5, name: "Forjador" },
];

// ── Steps ─────────────────────────────────────────────────────────────────
const STEPS = [
    {
        title: "¡Bienvenido al tutorial!",
        text: "Este es el tablero de Batalla Urbana. El primero en construir 7 distritos gana. Te guiaré por cada parte del tablero paso a paso.",
        area: null,
        side: "center",
    },
    {
        title: "Estadísticas del rival",
        text: "Aquí ves los datos de tu rival: su nombre, cuántas monedas de oro tiene y cuántas cartas lleva en mano. Controla su oro para anticipar qué puede construir.",
        area: "enemy-stats",
        side: "right",
    },
    {
        title: "Mano del rival",
        text: "Las cartas boca abajo son los distritos en mano de tu rival. No puedes verlas, pero sabes cuántas tiene. Cuantas más cartas, más opciones de construcción.",
        area: "enemy-hand",
        side: "bottom",
    },
    {
        title: "Personajes jugados",
        text: "Aquí aparecen los personajes que tu rival ha jugado esta partida. Cada ronda ambos elegís un personaje en secreto. Conocer los suyos te ayuda a predecir su estrategia.",
        area: "enemy-chars",
        side: "left",
    },
    {
        title: "Ciudad del rival",
        text: "Los distritos que tu rival ya ha construido. Si llega a 7 antes que tú, gana. Pasa el ratón sobre las cartas apiladas para verlas individualmente.",
        area: "enemy-built",
        side: "bottom",
    },
    {
        title: "Tu ciudad",
        text: "Aquí van tus distritos construidos. Tu objetivo es llegar a 7. Intenta construir distritos de distintos colores: al final de la partida obtendrás puntos extra por variedad.",
        area: "player-built",
        side: "top",
    },
    {
        title: "Tus personajes",
        text: "Al inicio de cada ronda eliges uno en secreto. Cada personaje tiene un color (que te da puntos si construyes distritos de ese color) y una habilidad única.",
        area: "player-chars",
        side: "right",
    },
    {
        title: "Tu mano",
        text: "Tus cartas de distrito disponibles para construir. El número en la esquina es su coste en monedas. Planifica bien cuál construir según tu oro disponible.",
        area: "player-hand",
        side: "top",
    },
    {
        title: "Controles del turno",
        text: "Aquí están todas tus acciones. Cada turno sigue este orden: cobra tu recompensa → opcionalmente construye un distrito → opcionalmente usa tu habilidad → termina el turno.",
        area: "controls",
        side: "left",
    },
    {
        title: "Cobrar recompensa",
        text: "Al inicio de tu turno siempre debes elegir: tomar 2 monedas de oro para construir antes, o robar 2 cartas del mazo y quedarte 1. Las monedas dan certeza; las cartas, variedad.",
        area: "btn-reward",
        side: "left",
    },
    {
        title: "Comprar distrito",
        text: "Paga el coste en oro de una carta de tu mano para construirla en tu ciudad. Solo puedes construir UNA vez por turno. Elige bien: prioriza distritos del color de tu personaje.",
        area: "btn-build",
        side: "left",
    },
    {
        title: "Habilidad del personaje",
        text: "Usa la habilidad especial de tu personaje una vez por turno. El Verdugo elimina a alguien, el Saqueador roba oro, el Ilusionista intercambia cartas, el Conquistador destruye distritos...",
        area: "btn-hability",
        side: "left",
    },
    {
        title: "Terminar turno",
        text: "Cuando hayas realizado tus acciones, pasa al siguiente personaje de la ronda. Los personajes actúan en orden del 1 al 8 hasta que todos juegan, y comienza una nueva ronda.",
        area: "btn-end",
        side: "left",
    },
    {
        title: "¡Ya estás listo para jugar!",
        text: "Recuerda: elige personaje → cobra recompensa → construye → usa habilidad → termina turno. Construye 7 distritos antes que tu rival para ganar. ¡Buena suerte!",
        area: null,
        side: "center",
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────
const PAD = 14;
const BUBBLE_W = 300;

function isMobile() { return window.innerWidth < 640; }

function getBubbleStyle(rect, side) {
    // Móvil: siempre panel anclado abajo
    if (isMobile()) {
        return { bottom: 0, left: 0, right: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 };
    }
    // Centro (sin área)
    if (!rect || side === "center") {
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: BUBBLE_W };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clampX = (x) => Math.max(PAD, Math.min(x, vw - BUBBLE_W - PAD));
    const clampY = (y) => Math.max(PAD, Math.min(y, vh - 260));

    switch (side) {
        case "right": {
            const left = rect.right + PAD;
            // Si no cabe a la derecha, va abajo
            if (left + BUBBLE_W > vw - PAD)
                return { top: clampY(rect.bottom + PAD), left: clampX(cx - BUBBLE_W / 2), width: BUBBLE_W };
            return { top: clampY(cy - 110), left, width: BUBBLE_W };
        }
        case "left": {
            const right = vw - rect.left + PAD;
            // Si no cabe a la izquierda, va abajo
            if (rect.left - PAD - BUBBLE_W < PAD)
                return { top: clampY(rect.bottom + PAD), left: clampX(cx - BUBBLE_W / 2), width: BUBBLE_W };
            return { top: clampY(cy - 110), right, width: BUBBLE_W };
        }
        case "bottom":
            return { top: clampY(rect.bottom + PAD), left: clampX(cx - BUBBLE_W / 2), width: BUBBLE_W };
        case "top":
            return { bottom: Math.max(PAD, vh - rect.top + PAD), left: clampX(cx - BUBBLE_W / 2), width: BUBBLE_W };
        default:
            return { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: BUBBLE_W };
    }
}

function getArrowStyle(rect, side) {
    if (isMobile() || !rect || !side || side === "center") return null;
    const vw = window.innerWidth;
    const base = { position: "absolute", width: 0, height: 0 };
    const gold = "#B38956";
    // Recalculamos si el side fue redirigido a "bottom"
    const cx = rect.left + rect.width / 2;
    switch (side) {
        case "right":
            if (rect.right + PAD + BUBBLE_W > vw - PAD) return { ...base, top: -13, left: "50%", marginLeft: -9, borderBottom: `13px solid ${gold}`, borderLeft: "9px solid transparent", borderRight: "9px solid transparent" };
            return { ...base, left: -13, top: "50%", marginTop: -9, borderRight: `13px solid ${gold}`, borderTop: "9px solid transparent", borderBottom: "9px solid transparent" };
        case "left":
            if (rect.left - PAD - BUBBLE_W < PAD) return { ...base, top: -13, left: "50%", marginLeft: -9, borderBottom: `13px solid ${gold}`, borderLeft: "9px solid transparent", borderRight: "9px solid transparent" };
            return { ...base, right: -13, top: "50%", marginTop: -9, borderLeft: `13px solid ${gold}`, borderTop: "9px solid transparent", borderBottom: "9px solid transparent" };
        case "bottom":
            return { ...base, top: -13, left: "50%", marginLeft: -9, borderBottom: `13px solid ${gold}`, borderLeft: "9px solid transparent", borderRight: "9px solid transparent" };
        case "top":
            return { ...base, bottom: -13, left: "50%", marginLeft: -9, borderTop: `13px solid ${gold}`, borderLeft: "9px solid transparent", borderRight: "9px solid transparent" };
        default: return null;
    }
}

// ── Component ─────────────────────────────────────────────────────────────
export default function Tutorial() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [rect, setRect] = useState(null);

    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    useEffect(() => {
        if (!current.area) { setRect(null); return; }
        const update = () => {
            const el = document.getElementById(`t-${current.area}`);
            if (el) setRect(el.getBoundingClientRect());
        };
        update();
        const timer = setTimeout(update, 50);
        window.addEventListener("resize", update);
        return () => { clearTimeout(timer); window.removeEventListener("resize", update); };
    }, [step, current.area]);

    const next = () => isLast ? navigate("/") : setStep(s => s + 1);
    const prev = () => step > 0 && setStep(s => s - 1);

    const bubbleStyle = getBubbleStyle(rect, current.side);
    const arrowStyle = rect ? getArrowStyle(rect, current.side) : null;

    return (
        <div className="w-screen h-screen flex flex-col bg-game-bg overflow-hidden">

            {/* Barra superior mock */}
            <div className="flex items-center justify-between gap-1 tablet:grid tablet:grid-cols-3 tablet:gap-2 py-1 px-3 shrink-0"
                style={{ background: "rgba(42,30,21,0.9)", borderBottom: "1px solid rgba(179,137,86,0.2)" }}>
                <h2 className="text-white flex items-center gap-1 shrink-0">
                    <img src={divitia} alt="oro" className="w-5 h-5 tablet:w-8 tablet:h-8" />
                    <span className="text-base tablet:text-xl font-black leading-none">4</span>
                </h2>
                <h3 className="text-white text-center text-sm tablet:text-base flex-1 truncate px-1">Tú</h3>
                <h3 className="text-white text-right text-sm tablet:text-base truncate shrink-0">Verdugo</h3>
            </div>

            {/* Tablero mock */}
            <div className="flex-1 rounded-xl overflow-hidden bg-no-repeat bg-center bg-cover min-h-0"
                style={{ backgroundImage: `url(${fondo})` }}>
                <div className="tablero h-full">

                    {/* Fila 1: rival */}
                    <div id="t-enemy-stats" className="celda flex flex-col items-center justify-center gap-1 tablet:gap-3">
                        <div className="flex flex-col items-center">
                            <span className="text-game-accent text-[10px] tablet:text-xs uppercase tracking-widest">Nombre</span>
                            <span className="text-white font-bold text-xs tablet:text-sm">{ENEMY.nickName}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-game-accent text-[10px] tablet:text-xs uppercase tracking-widest">Oro</span>
                            <div className="flex items-center gap-1">
                                <img src={divitia} alt="oro" className="w-5 h-5 tablet:w-10 tablet:h-10" />
                                <span className="text-yellow-300 text-base tablet:text-2xl font-black leading-none">{ENEMY.gold}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-game-accent text-[10px] tablet:text-xs uppercase tracking-widest">Cartas</span>
                            <span className="text-white text-base tablet:text-xl font-black">{ENEMY.numberDistrictsInHand}</span>
                        </div>
                    </div>

                    <div id="t-enemy-hand" className="celda">
                        <ScrollableCardRow>
                            {Array.from({ length: ENEMY.numberDistrictsInHand }).map((_, i) => (
                                <div key={i} className="aspect-[3/4] w-[68px] tablet:w-[98px] shrink-0 overflow-hidden">
                                    <img src={cartaAtras} alt="carta" className="w-full h-full object-cover block" />
                                </div>
                            ))}
                        </ScrollableCardRow>
                    </div>

                    <div id="t-enemy-chars" className="celda">
                        <div className="character-stack flex items-center justify-center h-full">
                            <CharacterCardStack cards={ENEMY.characterCardsPlayed} characterTurnId={3} label="Cartas jugadas" />
                        </div>
                    </div>

                    {/* Fila 2: distritos rival */}
                    <div id="t-enemy-built" className="celda" style={{ gridColumn: "1 / -1" }}>
                        <BuiltDistrictsGrid>
                            {ENEMY.districtsBuilt.map(d => <Card key={d.id} card={d} small isEnemy />)}
                        </BuiltDistrictsGrid>
                    </div>

                    {/* Fila 3: distritos jugador */}
                    <div id="t-player-built" className="celda" style={{ gridColumn: "1 / -1" }}>
                        <BuiltDistrictsGrid>
                            {PLAYER_DISTRICTS_BUILT.map(d => <Card key={d.id} card={d} small isBuilt />)}
                        </BuiltDistrictsGrid>
                    </div>

                    {/* Fila 4: jugador */}
                    <div id="t-player-chars" className="celda">
                        <div className="character-stack flex items-center justify-center h-full">
                            <CharacterCardStack cards={PLAYER_CHARACTER_CARDS} characterTurnId={1} />
                        </div>
                    </div>

                    <div id="t-player-hand" className="celda">
                        <ScrollableCardRow>
                            {PLAYER_HAND.map(d => <Card key={d.id} card={d} small />)}
                        </ScrollableCardRow>
                    </div>

                    <div id="t-controls" className="celda">
                        <div className="grid grid-cols-1 gap-2 controls">
                            <div id="t-btn-reward" className="grid grid-cols-2 gap-1">
                                <button disabled className="text-xs py-1.5 px-1 opacity-60">💰 Monedas</button>
                                <button disabled className="text-xs py-1.5 px-1 opacity-60">🃏 Cartas</button>
                            </div>
                            <button id="t-btn-build" disabled className="text-xs opacity-60">Comprar distrito</button>
                            <button id="t-btn-hability" disabled className="text-xs opacity-60">Habilidad personaje</button>
                            <button id="t-btn-end" disabled className="text-xs opacity-60">Terminar turno</button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Capa bloqueadora de clics */}
            <div className="fixed inset-0 z-[180]" />

            {/* Spotlight */}
            {rect ? (
                <div
                    className="fixed pointer-events-none z-[181]"
                    style={{
                        top: rect.top - 6,
                        left: rect.left - 6,
                        width: rect.width + 12,
                        height: rect.height + 12,
                        borderRadius: 10,
                        boxShadow: "0 0 0 4000px rgba(0,0,0,0.72), 0 0 0 2px rgba(179,137,86,0.85), 0 0 24px rgba(179,137,86,0.45)",
                    }}
                />
            ) : (
                <div className="fixed inset-0 pointer-events-none z-[181]" style={{ background: "rgba(0,0,0,0.6)" }} />
            )}

            {/* Bocadillo */}
            <div className="fixed z-[190] pointer-events-auto" style={bubbleStyle}>
                <div
                    className="relative rounded-2xl bg-game-modal border border-game-highlight/40 p-4 sm:p-5 max-h-[55vh] overflow-y-auto"
                    style={{ boxShadow: "0 0 40px rgba(0,0,0,0.9), inset 0 0 20px rgba(179,137,86,0.04)" }}
                >
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.7), transparent)" }} />

                    {arrowStyle && <div style={arrowStyle} />}

                    <div className="flex items-center justify-between mb-1">
                        <p className="text-game-accent text-[10px] tracking-widest uppercase">
                            Paso {step + 1} / {STEPS.length}
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="text-[10px] opacity-40 hover:opacity-80"
                            style={{ background: "transparent", border: "none", boxShadow: "none", padding: "2px 4px" }}
                        >
                            ✕ Salir
                        </button>
                    </div>

                    <h3 className="text-game-text-title text-sm sm:text-base mb-1.5">{current.title}</h3>
                    <p className="text-game-text-secondary text-xs sm:text-sm leading-relaxed mb-3">{current.text}</p>

                    {/* Barra de progreso */}
                    <div className="flex gap-0.5 mb-3">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 h-0.5 rounded-full transition-all"
                                style={{ background: i <= step ? "rgba(179,137,86,0.8)" : "rgba(179,137,86,0.15)" }}
                            />
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {step > 0 && (
                            <button
                                onClick={prev}
                                className="flex-1 text-xs sm:text-sm border border-game-highlight/30"
                                style={{ background: "transparent", boxShadow: "none" }}
                            >
                                ← Anterior
                            </button>
                        )}
                        <button onClick={next} className={`text-xs sm:text-sm ${step === 0 ? "w-full" : "flex-1"}`}>
                            {isLast ? "¡Jugar ahora!" : "Siguiente →"}
                        </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(179,137,86,0.3), transparent)" }} />
                </div>
            </div>

            {/* Botón salir */}
            <button
                onClick={() => navigate("/")}
                className="fixed top-3 right-3 z-[191] text-xs opacity-50 hover:opacity-100 border border-game-highlight/30"
                style={{ background: "rgba(42,30,21,0.9)", boxShadow: "none", padding: "4px 10px" }}
            >
                Salir
            </button>

        </div>
    );
}
