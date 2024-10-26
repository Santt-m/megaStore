// ./data/dataIO.js

/**
 * Función para obtener el contenido de dataList.json
 * @returns {Promise<Array>} Lista de tiendas en JSON
 */
export async function fetchDataList() {
    try {
        const response = await fetch('./data/dataList.json');
        if (!response.ok) throw new Error("Error al cargar dataList.json");
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

/**
 * Función para obtener el contenido de un archivo JSON específico por URL
 * @param {string} url - Ruta del archivo JSON a cargar
 * @returns {Promise<Object>} Datos contenidos en el JSON
 */
export async function fetchDataFromUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al cargar el archivo JSON en ${url}`);
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

