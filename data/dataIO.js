// Función para cargar el archivo dataList.json que contiene la lista de clientes
export async function loadDataList() {
    try {
        const response = await fetch('../../data/dataList.json');
        if (!response.ok) {
            throw new Error('Error al cargar la lista de tiendas');
        }
        const data = await response.json();
        return data;  // Devuelve el array con la lista de tiendas
    } catch (error) {
        console.error('Error en loadDataList:', error);
        throw error;
    }
}

/**
 * loadDataList:
 * - Descripción: Carga el archivo `dataList.json` y devuelve la lista de clientes.
 * - Uso: `const stores = await loadDataList();`
 * - Retorna: Un array con los datos de los clientes (nombre, descripción, URL del JSON de cada tienda).
 */


// Función para cargar el archivo company.json de un cliente específico
export async function loadCompanyData(storeName) {
    try {
        const response = await fetch(`../../data/clientData/${storeName}/company.json`);
        if (!response.ok) {
            throw new Error(`Error al cargar los datos de la tienda ${storeName}`);
        }
        const data = await response.json();
        return data;  // Devuelve los datos de la tienda (nombre, descripción, horarios, redes, etc.)
    } catch (error) {
        console.error(`Error en loadCompanyData(${storeName}):`, error);
        throw error;
    }
}

/**
 * loadCompanyData:
 * - Descripción: Carga los datos de la empresa desde el archivo `company.json` de un cliente específico.
 * - Uso: `const companyData = await loadCompanyData('ClothesStore');`
 * - Parámetros: `storeName` (string) - El nombre de la tienda.
 * - Retorna: Un objeto con los datos de la tienda (nombre, descripción, horarios, etc.).
 */


// Función para cargar el archivo products.json de un cliente específico
export async function loadProducts(storeName) {
    try {
        const response = await fetch(`../../data/clientData/${storeName}/products.json`);
        if (!response.ok) {
            console.warn(`Advertencia: No se pudo cargar el archivo products.json para la tienda ${storeName}. Puede que no exista.`);
            return [];  // Retornar un array vacío si el archivo no existe
        }

        const textData = await response.text(); // Leer como texto primero
        if (!textData || textData.trim() === "") {
            console.warn(`Advertencia: El archivo products.json de la tienda ${storeName} está vacío.`);
            return [];  // Retornar un array vacío si el archivo está vacío
        }

        const data = JSON.parse(textData); // Convertir el texto a JSON
        return data;  // Devuelve el array con la lista de productos

    } catch (error) {
        console.error(`Error en loadProducts(${storeName}):`, error);
        return [];  // Retornar un array vacío en caso de error para que no falle la app
    }
}

/**
 * loadProducts:
 * - Descripción: Carga los productos desde el archivo `products.json` de un cliente específico.
 * - Uso: `const products = await loadProducts('ClothesStore');`
 * - Parámetros: `storeName` (string) - El nombre de la tienda.
 * - Retorna: Un array con los productos (nombre, descripción, precio, etc.).
 */

