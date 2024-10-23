// dataIO.js

// Cargar todo el archivo dataList.json
async function loadDataList() {
    try {
        const response = await fetch('./data/dataList.json'); // Cambiamos fs por fetch
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data; // Retorna el contenido de dataList.json como un objeto JavaScript
    } catch (err) {
        console.error('Error al cargar dataList.json:', err);
        return null; // Retorna null en caso de error
    }
}

// Obtener los datos de una tienda específica de dataList.json
async function getStoreData(storeName) {
    const dataList = await loadDataList();
    if (dataList) {
        const storeData = dataList.find(store => store.company === storeName);
        if (storeData) {
            return storeData; // Retorna un objeto con los datos de la tienda
        } else {
            console.error(`No se encontró la tienda: ${storeName}`);
        }
    }
    return null; // Retorna null si no se encuentra la tienda
}

// Cargar el archivo company.json de una tienda específica
async function loadCompanyData(storeName) {
    const storeData = await getStoreData(storeName);
    if (storeData) {
        try {
            const response = await fetch(storeData.url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data; // Retorna el contenido de company.json como un objeto JavaScript
        } catch (err) {
            console.error(`Error al cargar ${storeName}/company.json:`, err);
            return null; // Retorna null en caso de error
        }
    } else {
        return null; // Retorna null si no se encuentra la tienda
    }
}

// Cargar el archivo products.json de una tienda (si existe)
async function loadProducts(storeName) {
    const companyData = await loadCompanyData(storeName);
    if (companyData && companyData.store) {
        try {
            const response = await fetch(companyData.store);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data; // Retorna el contenido de products.json como un objeto JavaScript
        } catch (err) {
            console.error(`Error al cargar productos de ${storeName}:`, err);
            return null; // Retorna null en caso de error
        }
    } else {
        console.log(`${storeName} no tiene productos asociados.`);
        return null; // Retorna null si no hay productos asociados
    }
}

// Filtrar tiendas por descripción (por ejemplo, ecommerce de ropa)
async function filterStoresByDescription(description) {
    const dataList = await loadDataList();
    if (dataList) {
        return dataList.filter(store => store.description.includes(description)); // Retorna un array de tiendas que coinciden con la descripción
    }
    return []; // Retorna un array vacío si no hay coincidencias
}

// Exportar funciones para ser usadas en otras partes de la aplicación
// Agregar estas funciones al objeto global para poder accederlas desde otros scripts
window.dataIO = {
    loadDataList,
    getStoreData,
    loadCompanyData,
    loadProducts,
    filterStoresByDescription,
};
