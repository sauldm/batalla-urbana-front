import inquisidorImg from "../utils/images/inquisidor.jpeg";
import { CARD_TEXT_COLORS } from "../store/CardColors";
import TakeThree from "./charactermodal/TakeThree";
import { useState } from "react";

export const Card = ({ card, canBuild, onBuild, isBuilt, executeDistrictHability, gameId, districtHabilityUsed, isPlayerTurn, className = '' }) => {
    const textColor = CARD_TEXT_COLORS[card.color] ?? "text-game-text-main";

    const [showDistrictHability, setShowDistrictHability] = useState(false);


    const interactiveClasses = canBuild
        ? `
        cursor-pointer
        border-2 border-yellow-400
        shadow-[0_0_15px_rgba(250,204,21,0.6)]
        hover:scale-105
        hover:-translate-y-1
        hover:animate-card-shake
        transition-all duration-200
      `
        : `
        border border-transparent
        opacity-90
      `;

      if (showDistrictHability) {
        return (
            <TakeThree
                onExecute={() => {
                    executeDistrictHability({
                        gameId: gameId,
                        districtId: card.id
                    });
                }}
                onClose={() => setShowDistrictHability(false)}
                districtId={card.id}
                gameId={gameId}
            />
        );
      }

    return (
        <div
            className={`card-component ${className} ${interactiveClasses}`}
            onClick={(e) => {
                e.stopPropagation();
                if (canBuild) onBuild?.();
            }}        >
            {card.name === "Bishop" && (
                <img
                    src={inquisidorImg}
                    alt="Bishop"
                    className="w-20 h-28 tablet:w-24 tablet:h-32 object-contain" />
            )}

            <p className={`${textColor} font-semibold text-center text-sm tablet:text-base`}>
                {card.name}
            </p>

            <p className="text-white opacity-80 text-xs tablet:text-sm text-center">
                {card.description}
            </p>

            {card.gold > 0 && (
                <p className="text-yellow-400 font-bold">
                    {card.gold} 🪙
                </p>
            )}

            {card.color === 5 && isBuilt && isPlayerTurn && (
                <button disabled={districtHabilityUsed} onClick={() => setShowDistrictHability(true)} className="mt-1 text-sm">
                    Habilidad
                </button>
            )}
        </div>
    );
};

export default Card;
