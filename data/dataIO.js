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
 * @returns {Promise<Object|null>} Datos contenidos en el JSON o null si no se encuentra
 */
export async function fetchDataFromUrl(url) {
    try {
        const response = await fetch(url);
        if (response.status === 404) throw new Error(`Archivo no encontrado en ${url}`);
        if (!response.ok) throw new Error(`Error al cargar el archivo JSON en ${url}`);
        return await response.json();
        
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

/**
 * Función para cargar los datos de la tienda desde company.json
 * @param {string} storeName - Nombre de la tienda para buscar en dataList.json
 * @returns {Promise<Object|null>} Datos de la tienda desde company.json o null si no existe
 */
const BASE_URL = './data/';

export async function loadCompanyData(storeName) {
    try {
        const dataList = await fetchDataList();
        const storeInfo = dataList.find(item => item.company === storeName);

        if (!storeInfo) throw new Error(`No se encontró la tienda ${storeName} en dataList.json`);
        
        // Usar BASE_URL para construir la ruta
        const companyUrl = `${BASE_URL}${storeInfo.url}/company.json`;
        return await fetchDataFromUrl(companyUrl);
        
    } catch (error) {
        console.error(`Error al cargar datos de la tienda ${storeName}:`, error);
        return null;
    }
}
/**
 * Función para cargar los productos de la tienda desde products.json
 * @param {string} storeName - Nombre de la tienda para construir la URL de products.json
 * @returns {Promise<Array|null>} Lista de productos o null si no existen
 */
export async function loadProducts(storeName) {
    try {
        const dataList = await fetchDataList();
        const storeInfo = dataList.find(item => item.company === storeName);

        if (!storeInfo) throw new Error(`No se encontró la tienda ${storeName} en dataList.json`);

        // Usar BASE_URL para construir la ruta
        const productsUrl = `${BASE_URL}${storeInfo.url}/products.json`;
        return await fetchDataFromUrl(productsUrl);
    } catch (error) {
        console.error(`Error al cargar los productos de la tienda ${storeName}:`, error);
        return null;
    }
}