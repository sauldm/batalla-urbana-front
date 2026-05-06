/**
 * Obtiene la tabla de clasificación desde el backend.
 *
 * Realiza una petición `fetch` a la ruta `/getClassificationTable` y devuelve
 * el JSON parseado si la respuesta es correcta.
 *
 * @async
 * @function getClassificationTable
 * @returns {Promise<any>} Resolución con el objeto JSON de la tabla de clasificación.
 * @throws {Error} Cuando la respuesta HTTP no es `ok`.
 */
export async function getClassificationTable() {
    const res = await fetch("http://93.93.112.225:8080/getClassificationTable");
    if (!res.ok) {
        throw new Error("Error creando lobby");
    }
    return await res.json();
}

export default getClassificationTable;