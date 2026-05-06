import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SocketCtx = createContext(null);

/**
 * Proveedor de socket y STOMP para la aplicación.
 *
 * Inicializa un cliente SockJS + STOMP cuando existe un `nick` y expone una
 * API a través de contexto para publicar y suscribirse a tópicos, además de
 * gestionar el `nick` del usuario y el estado de la conexión.
 *
 * @component
 * @param {{children: import('react').ReactNode}} props - Elementos hijos envueltos por el provider.
 * @returns {JSX.Element} Provider que suministra la API del socket via contexto.
 */
export function SocketProvider({ children }) {
    const clientRef = useRef(null);

    const [nick, setNick] = useState(() => localStorage.getItem("nick") || "");
    const [connected, setConnected] = useState(false);
    const [stompReady, setStompReady] = useState(false);

    useEffect(() => {
        if (!nick) return;

        const socket = new SockJS("http://93.93.112.225:8080/ws");

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 4000,
            connectHeaders: { login: nick },

            onConnect: () => {
                setConnected(true);

                setTimeout(() => setStompReady(true), 0);
            },

            onDisconnect: () => {
                setConnected(false);
                setStompReady(false);
            },

            onStompError: (frame) => {
                console.error("STOMP error", frame);
            },
        });

        clientRef.current = client;
        client.activate();

        return () => {
            setStompReady(false);
            setConnected(false);
            client.deactivate();
            clientRef.current = null;
        };
    }, [nick]);

    const api = useMemo(() => {
        /**
         * Publica un mensaje en un destino STOMP.
         *
         * @param {string} destination - Tópico o endpoint STOMP donde publicar.
         * @param {any} [body] - Cuerpo que será convertido a JSON. Si se omite, se envía un objeto vacío.
         * @returns {void}
         */
        const publish = (destination, body) => {
            const c = clientRef.current;
            if (!c || !c.connected) return;
            c.publish({
                destination,
                body: JSON.stringify(body ?? {}),
            });
        };

        /**
         * Se suscribe a un destino STOMP.
         *
         * @param {string} destination - Tópico o endpoint STOMP a suscribirse.
         * @param {function} handler - Función que maneja los mensajes entrantes según la API de @stomp/stompjs.
         * @returns {any|null} Objeto de suscripción devuelto por el cliente STOMP, o `null` si no hay conexión.
         */
        const subscribe = (destination, handler) => {
            const c = clientRef.current;
            if (!c || !c.connected) return null;
            return c.subscribe(destination, handler);
        };

        /**
         * Establece el nick del usuario, lo persiste en `localStorage` y provoca la conexión.
         *
         * @param {string} value - Valor del nick proporcionado por el usuario.
         * @returns {void}
         */
        const setNickAndConnect = (value) => {
            const clean = (value ?? "").trim();
            if (!clean) return;
            localStorage.setItem("nick", clean);
            setNick(clean);
        };

        return {
            nick,
            connected,
            stompReady,
            publish,
            subscribe,
            setNickAndConnect,
        };
    }, [nick, connected, stompReady]);

    return (
        <SocketCtx.Provider value={api}>
            {children}
        </SocketCtx.Provider>
    );
}

/**
 * Hook para acceder a la API del socket provista por `SocketProvider`.
 *
 * Devuelve un objeto con la siguiente forma:
 * - `nick` (string)
 * - `connected` (boolean)
 * - `stompReady` (boolean)
 * - `publish(destination, body)` (function)
 * - `subscribe(destination, handler)` (function)
 * - `setNickAndConnect(value)` (function)
 *
 * @function useSocket
 * @returns {{nick: string, connected: boolean, stompReady: boolean, publish: function, subscribe: function, setNickAndConnect: function}}
 */
export const useSocket = () => useContext(SocketCtx);
