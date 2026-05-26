import TakeThree from "./charactermodal/TakeThree";
import { useState } from "react";
import { createPortal } from "react-dom";
import divitia from "../utils/images/divitia.png";
import distritoImg    from "../utils/images/distrito.png";
import edificioGobImg  from "../utils/images/edificioGob.png";
import edificioConqImg from "../utils/images/edificioConq.png";
import edificioInqImg  from "../utils/images/edificioInq.png";
import edificioMercImg from "../utils/images/edificioMerc.png";
import especialImg     from "../utils/images/especial.png";

// ── Imágenes de personaje ──────────────────────────────────────────────────
import asesinoImg     from "../utils/images/verdugo.png";
import ladronImg      from "../utils/images/ladron.png";
import ilusionistaImg from "../utils/images/ilusionista.png";
import gobernadorImg  from "../utils/images/gobernador.png";
import inquisidorImg  from "../utils/images/inquisidor.png";
import mercaderImg    from "../utils/images/mercader.png";
import forjadorImg    from "../utils/images/forjador.png";
import conquistadorImg from "../utils/images/conquistador.png";

// Mapa id de personaje → imagen
const CHARACTER_IMAGES = {
  1: asesinoImg,      // Verdugo
  2: ladronImg,       // Ladrón
  3: ilusionistaImg,  // Mago / Ilusionista
  4: gobernadorImg,   // Rey / Gobernador
  5: inquisidorImg,   // Inquisidor
  6: mercaderImg,     // Mercader
  7: forjadorImg,     // Arquitecto
  8: conquistadorImg, // Militar
};


// ── Paleta por color de distrito ──────────────────────────────────────────
const CARD_THEMES = {
  0: { bg: "from-slate-700 via-slate-600 to-slate-800",      border: "#94a3b8", glow: "rgba(148,163,184,0.4)", icon: "🏛️", label: "Neutral",   pattern: "stone"     },
  1: { bg: "from-yellow-800 via-amber-700 to-yellow-900",    border: "#fbbf24", glow: "rgba(251,191,36,0.5)",  icon: "👑", label: "Nobleza",   pattern: "noble"     },
  2: { bg: "from-red-900 via-red-800 to-rose-900",           border: "#f87171", glow: "rgba(248,113,113,0.5)", icon: "⚔️", label: "Militar",   pattern: "military"  },
  3: { bg: "from-blue-900 via-blue-800 to-indigo-900",       border: "#60a5fa", glow: "rgba(96,165,250,0.5)",  icon: "✝️", label: "Religioso", pattern: "religious" },
  4: { bg: "from-emerald-900 via-green-800 to-teal-900",     border: "#34d399", glow: "rgba(52,211,153,0.5)",  icon: "💰", label: "Comercial", pattern: "trade"     },
  5: { bg: "from-purple-900 via-violet-800 to-fuchsia-900",  border: "#c084fc", glow: "rgba(192,132,252,0.6)", icon: "✨", label: "Especial",  pattern: "magic"     },
};

// Imagen de fondo según color del distrito
const DISTRICT_IMAGES = {
  0: distritoImg,
  1: edificioGobImg,
  2: edificioConqImg,
  3: edificioInqImg,
  4: edificioMercImg,
  5: especialImg,
};

// Título (personaje/s) que aparece en la franja superior de la carta
const DISTRICT_TITLES = {
  0: "Neutral",
  1: "Gobernador",
  2: "Conquistador",
  3: "Inquisidor",
  4: "Mercader",
  5: "Especial",
};

// ── Patrones SVG decorativos ───────────────────────────────────────────────
const PatternSVG = ({ pattern }) => {
  const defs = {
    stone:     <pattern id={`p-${pattern}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0"  y="0"  width="10" height="10" fill="none" stroke="white" strokeWidth="0.5"/><rect x="10" y="10" width="10" height="10" fill="none" stroke="white" strokeWidth="0.5"/></pattern>,
    noble:     <pattern id={`p-${pattern}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M12 2 L14 9 L22 9 L16 14 L18 22 L12 17 L6 22 L8 14 L2 9 L10 9 Z" fill="none" stroke="gold" strokeWidth="0.6"/></pattern>,
    military:  <pattern id={`p-${pattern}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><line x1="0" y1="10" x2="20" y2="10" stroke="white" strokeWidth="0.5"/><line x1="10" y1="0" x2="10" y2="20" stroke="white" strokeWidth="0.5"/></pattern>,
    religious: <pattern id={`p-${pattern}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="8" fill="none" stroke="white" strokeWidth="0.5"/><line x1="15" y1="7" x2="15" y2="23" stroke="white" strokeWidth="0.5"/><line x1="11" y1="11" x2="19" y2="11" stroke="white" strokeWidth="0.5"/></pattern>,
    trade:     <pattern id={`p-${pattern}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="4" fill="none" stroke="white" strokeWidth="0.5"/><line x1="0" y1="0" x2="20" y2="20" stroke="white" strokeWidth="0.3"/></pattern>,
    magic:     <pattern id={`p-${pattern}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><polygon points="15,3 17,11 25,11 19,16 21,24 15,19 9,24 11,16 5,11 13,11" fill="none" stroke="white" strokeWidth="0.5"/></pattern>,
  };
  if (!defs[pattern]) return null;
  return (
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <defs>{defs[pattern]}</defs>
      <rect width="100%" height="100%" fill={`url(#p-${pattern})`} />
    </svg>
  );
};


// ── Tamaño compartido ──────────────────────────────────────────────────────
const SIZE_CLASSES       = "w-[96px] h-[140px] tablet:w-[130px] tablet:h-[190px] desktop:w-[150px] desktop:h-[220px]";
const SIZE_CLASSES_SMALL = "w-[80px] h-[117px] tablet:w-[112px] tablet:h-[164px] desktop:w-[130px] desktop:h-[190px]";
const SIZE_CLASSES_FLUID = "w-full h-full";
const HOVER_CLASSES = "transition-transform duration-200 hover:scale-105 hover:-translate-y-1";

// Franja de color por tipo de personaje (color de la carta)
const CHARACTER_COLOR_STRIP = {
  0: { color: "#94a3b8", label: "Neutral"   },
  1: { color: "#fbbf24", label: "Nobleza"   },
  2: { color: "#f87171", label: "Militar"   },
  3: { color: "#60a5fa", label: "Religioso" },
  4: { color: "#34d399", label: "Comercial" },
  5: { color: "#c084fc", label: "Especial"  },
};

// ── Carta de PERSONAJE — imagen a pantalla completa ────────────────────────
function CharacterCardView({ card, theme, canBuild, onBuild, isCurrentTurn, small, fluid, className }) {
  const img = CHARACTER_IMAGES[card.id];
  const strip = CHARACTER_COLOR_STRIP[card.color] ?? CHARACTER_COLOR_STRIP[0];

  return (
    <div
      onClick={(e) => { e.stopPropagation(); if (canBuild) onBuild?.(); }}
      className={`
        card-visual relative flex-shrink-0 rounded-xl overflow-hidden select-none
        ${fluid ? SIZE_CLASSES_FLUID : small ? SIZE_CLASSES_SMALL : SIZE_CLASSES} ${HOVER_CLASSES}
        ${canBuild
          ? "cursor-pointer ring-2 ring-yellow-400 shadow-[0_0_18px_rgba(250,204,21,0.55)]"
          : "cursor-default"
        }
        ${isCurrentTurn ? "ring-2 ring-white shadow-[0_0_14px_rgba(255,255,255,0.6)]" : ""}
        ${className}
      `}
    >
      {/* Retrato */}
      {img
        ? <img src={img} alt={card.name} className="absolute inset-0 w-full h-full object-cover object-top" draggable={false} />
        : <div className={`absolute inset-0 bg-gradient-to-b ${theme.bg}`} />
      }

      {/* Viñeta suave */}
      {img && <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.3) 100%)" }} />}

      {/* Marco de color del tipo */}
      <div
        className="absolute inset-0 pointer-events-none z-10 rounded-xl"
        style={{ boxShadow: `inset 0 0 0 1.5px ${strip.color}99, inset 0 0 18px 4px ${strip.color}44` }}
      />

      {/* Pulso dorado cuando es construible */}
      {canBuild && (
        <div
          className="absolute inset-0 pointer-events-none animate-pulse"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(250,204,21,0.18) 0%, transparent 70%)" }}
        />
      )}
    </div>
  );
}

// ── Carta de DISTRITO — diseño con gradiente e icono ───────────────────────
function DistrictCardView({ card, theme, canBuild, onBuild, isBuilt, executeDistrictHability, gameId, districtHabilityUsed, isPlayerTurn, isEnemy, small, fluid, className, onModalOpen }) {
  const [showHability, setShowHability] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
    {showHability && createPortal(
      <TakeThree
        onExecute={() => { executeDistrictHability({ gameId, districtId: card.id }); }}
        onClose={() => setShowHability(false)}
        districtId={card.id}
        gameId={gameId}
        cardName={card.name}
        cardDescription={card.description}
      />,
      document.body
    )}
    {showInfo && createPortal(
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={() => setShowInfo(false)}
      >
        <div
          className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-gray-900 border border-purple-500/40 shadow-[0_0_30px_rgba(192,132,252,0.3)] max-w-xs text-center"
          onClick={e => e.stopPropagation()}
        >
          <p className="text-purple-300 text-lg font-bold tracking-wide">{card.name}</p>
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-60 text-white">{theme.label}</p>
          {card.description && (
            <p className="text-white text-sm leading-relaxed">{card.description}</p>
          )}
          <button
            onClick={() => setShowInfo(false)}
            className="px-6 py-2 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20"
          >
            Cerrar
          </button>
        </div>
      </div>,
      document.body
    )}
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (canBuild) { onBuild?.(); return; }
        if (card.color == 5 && isEnemy) { onModalOpen?.(); setShowInfo(true); }
      }}
      className={`
        card-visual relative flex-shrink-0 rounded-xl overflow-hidden select-none
        ${fluid ? SIZE_CLASSES_FLUID : small ? SIZE_CLASSES_SMALL : SIZE_CLASSES}
        ${canBuild
          ? `cursor-pointer ring-2 ring-yellow-400 shadow-[0_0_18px_rgba(250,204,21,0.55)] ${HOVER_CLASSES}`
          : card.color == 5 && isEnemy ? "cursor-pointer" : "cursor-default"
        }
        ${className}
      `}
    >
      {/* Imagen a pantalla completa */}
      <img src={DISTRICT_IMAGES[card.color] ?? distritoImg} alt="distrito" className="absolute inset-0 w-full h-full object-cover object-top" draggable={false} />

      {/* Viñeta central suave para dar profundidad */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.35) 100%)" }} />

      {/* Degradado inferior para legibilidad del nombre */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.85) 100%)" }} />

      {/* Marco interior de color */}
      <div
        className="absolute inset-0 pointer-events-none z-10 rounded-xl"
        style={{ boxShadow: `inset 0 0 0 1.5px ${theme.border}99, inset 0 0 18px 4px ${theme.border}44` }}
      />

      {/* Franja superior: tipo de personaje */}
      <div
        className="absolute top-0 left-0 right-0 z-30 px-1.5 py-[3px] text-center"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.45))`,
          borderBottom: `1px solid ${theme.border}55`,
        }}
      >
        <p
          className="font-bold uppercase tracking-widest leading-tight"
          style={{ fontSize: "clamp(5px, 1.3vw, 8px)", color: theme.border }}
        >
          {DISTRICT_TITLES[card.color] ?? ""}
        </p>
      </div>

      {/* Icono indestructible — esquina superior izquierda */}
      {card.undestructible && (
        <div className="absolute top-5 left-1 z-30">
          <span
            className="text-[10px] leading-none px-1 py-0.5 rounded flex items-center"
            style={{ background: "rgba(0,0,0,0.75)", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.4)" }}
            title="Indestructible"
          >
            🛡️
          </span>
        </div>
      )}

      {/* Precio — esquina superior derecha, debajo de la franja */}
      {card.gold > 0 && (
        <div className="absolute top-5 right-1 z-30">
          <span
            className="text-[10px] font-black leading-none px-1 py-0.5 rounded flex items-center gap-0.5"
            style={{ background: "rgba(0,0,0,0.75)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.5)" }}
          >
            <img src={divitia} alt="oro" className="inline w-2.5 h-2.5" />{card.gold}
          </span>
        </div>
      )}

      {/* Placa de nombre */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 px-1.5 pb-1.5 pt-1"
        style={{
          background: `linear-gradient(to top, rgba(5,3,1,0.95) 60%, transparent)`,
          borderTop: `1px solid ${theme.border}33`,
        }}
      >
        <p
          className="font-bold text-center leading-tight"
          style={{
            fontSize: "clamp(8px, 1.8vw, 11px)",
            color: "#f5e6cc",
            textShadow: `0 0 8px ${theme.border}88, 0 1px 3px rgba(0,0,0,1)`,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {card.name}
        </p>
      </div>


      {/* Botón habilidad distritos especiales */}
      {card.color == 5 && isBuilt && isPlayerTurn && (
        <div className="absolute bottom-7 left-0 right-0 z-30 px-1.5">
          <button
            disabled={districtHabilityUsed}
            onClick={(e) => { e.stopPropagation(); if (!districtHabilityUsed) { onModalOpen?.(); setShowHability(true); } }}
            className="w-full text-[9px] py-0.5 rounded font-bold tracking-wide"
            style={{
              background: districtHabilityUsed ? "rgba(60,60,60,0.7)" : `linear-gradient(135deg, ${theme.border}99, ${theme.border}44)`,
              border: `1px solid ${districtHabilityUsed ? "rgba(255,255,255,0.1)" : theme.border + "88"}`,
              color: districtHabilityUsed ? "rgba(255,255,255,0.3)" : "white",
              pointerEvents: districtHabilityUsed ? "none" : "auto",
              cursor: districtHabilityUsed ? "not-allowed" : "pointer",
            }}
          >
            {districtHabilityUsed ? "✦ Usada" : "✦ Habilidad"}
          </button>
        </div>
      )}

      {canBuild && (
        <div
          className="absolute inset-0 pointer-events-none animate-pulse"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(250,204,21,0.15) 0%, transparent 70%)" }}
        />
      )}
    </div>
    </>
  );
}

// ── Componente público — decide qué variante renderizar ────────────────────
export const Card = (props) => {
  const { card } = props;
  const theme = CARD_THEMES[card.color] ?? CARD_THEMES[0];

  // Si el id del personaje tiene imagen asignada → variante con foto
  if (card.id in CHARACTER_IMAGES) {
    return <CharacterCardView {...props} theme={theme} />;
  }

  return <DistrictCardView {...props} theme={theme} />;
};

export default Card;