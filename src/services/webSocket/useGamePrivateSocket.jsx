import { useEffect, useState } from "react";
import { useSocket } from "./socketProvider";

/**
 * Hook que se conecta al canal privado de un juego y expone información privada.
 *
 * - Se suscribe a `/user/queue/game/{gameId}` para recibir actualizaciones
 *   privadas del juego (por usuario).
 * - Publica en `/app/game/{gameId}/private` para solicitar la información privada
 *   si el socket está listo.
 *
 * @param {string} gameId - Identificador de la partida.
 * @returns {{ privateInfo: any }} Objeto con la información privada recibida del servidor.
 */
export function useGamePrivateSocket(gameId) {
    const { connected, stompReady, subscribe, publish } = useSocket();

    const [privateInfo, setPrivateInfo] = useState(null);

    useEffect(() => {
        if (!connected || !stompReady || !gameId) return;

        const sub = subscribe(
            `/user/queue/game/${gameId}`,
            (message) => {
                setPrivateInfo(JSON.parse(message.body));
                console.log(JSON.parse(message.body))
            }
        );
        publish(`/app/game/${gameId}/private`, {});


        return () => sub?.unsubscribe?.();
    }, [connected, stompReady, gameId]);


    return { privateInfo };
}
