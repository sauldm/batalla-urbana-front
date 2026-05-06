/**
 * Crea un nuevo lobby en el backend.
 *
 * Realiza una petición POST a `/api/lobbies` y devuelve el JSON de la respuesta
 * cuando la petición es exitosa.
 *
 * @async
 * @function createLobbyHttp
 * @returns {Promise<any>} Resolución con los datos del lobby creado.
 * @throws {Error} Si la respuesta HTTP no es `ok`.
 */
export async function createLobbyHttp() {
    const res = await fetch("http://93.93.112.225:8080/api/lobbies", {
        method: "POST",
    });

    if (!res.ok) {
        throw new Error("Error creando lobby");
    }

    return await res.json();
}

/**
 * Intenta unir un jugador a un lobby existente.
 *
 * Envía `id` y `nickName` al endpoint `/api/joinLobby`. Devuelve el JSON
 * de la respuesta si el backend responde con `application/json`, o `null`
 * si no hay cuerpo JSON.
 *
 * @async
 * @function joinLobbyHttp
 * @param {string} id - Identificador del lobby al que unirse.
 * @param {string} nickName - Nick del jugador que se une.
 * @returns {Promise<any|null>} JSON de respuesta o `null` si no hay JSON.
 * @throws {Error} Si la respuesta HTTP no es `ok`.
 */
export async function joinLobbyHttp( id, nickName ) {
    const res = await fetch("http://93.93.112.225:8080/api/joinLobby", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, nickName }),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Error al unirse al lobby");
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return await res.json();
    }
    return null;
}

/**
 * Solicita al backend la creación de una partida para el lobby dado.
 *
 * Envía `id` y `players` al endpoint `/api/createGame` y devuelve el JSON
 * de la respuesta si la creación es exitosa.
 *
 * @async
 * @function createGameHttp
 * @param {string} id - Identificador del lobby donde crear la partida.
 * @param {Array<string>} players - Lista de nicks de jugadores.
 * @returns {Promise<any>} Resolución con los datos de la partida creada.
 * @throws {Error} Si la respuesta HTTP no es `ok`.
 */
export async function createGameHttp(id, players) {
    const res = await fetch("http://93.93.112.225:8080/api/createGame", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, players }),
    });

    if (!res.ok) {
        throw new Error("Error creando game");
    }

    return await res.json();
}
export default { createLobbyHttp, joinLobbyHttp, createGameHttp }
