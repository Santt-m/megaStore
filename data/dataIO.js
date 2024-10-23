import modal from '../src/js/modal.js'

// Exportar funciones para ser usadas en otras partes de la aplicación
module.exports = {
    loadDataList,               // return datalist.json
    getStoreData,               // return los datos de un store
    loadCompanyData,            // return company.json de un input store
    loadProducts,
    filterStoresByDescription,
    updateStoreData
};


const fs = require('fs').promises;

// Cargar todo el archivo dataList.json
async function loadDataList() {
    try {
        const data = await fs.readFile('./data/dataList.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al cargar dataList.json:', err);
        return null;
    }
}

// Obtener los datos de una tienda específica de dataList.json
async function getStoreData(storeName) {
    const dataList = await loadDataList();
    if (dataList) {
        const storeData = dataList.find(store => store.company === storeName);
        if (storeData) {
            return storeData;
        } else {
            console.error(`No se encontró la tienda: ${storeName}`);
        }
    }
    return null;
}

// Cargar el archivo company.json de una tienda específica
async function loadCompanyData(storeName) {
    const storeData = await getStoreData(storeName);
    if (storeData) {
        try {
            const data = await fs.readFile(storeData.url, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            console.error(`Error al cargar ${storeName}/company.json:`, err);
            return null;
        }
    } else {
        return null;
    }
}

// Cargar el archivo products.json de una tienda (si existe)
async function loadProducts(storeName) {
    const companyData = await loadCompanyData(storeName);
    if (companyData && companyData.store) {
        try {
            const data = await fs.readFile(companyData.store, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            console.error(`Error al cargar productos de ${storeName}:`, err);
            return null;
        }
    } else {
        console.log(`${storeName} no tiene productos asociados.`);
        return null;
    }
}

// Filtrar tiendas por descripción (por ejemplo, ecommerce de ropa)
async function filterStoresByDescription(description) {
    const dataList = await loadDataList();
    if (dataList) {
        return dataList.filter(store => store.description.includes(description));
    }
    return [];
}

// Actualizar los datos de company.json de una tienda
async function updateStoreData(storeName, newData) {
    const storeData = await getStoreData(storeName);
    if (storeData) {
        try {
            await fs.writeFile(storeData.url, JSON.stringify(newData, null, 2), 'utf-8');
            console.log('Datos actualizados correctamente.');
        } catch (err) {
            console.error(`Error al actualizar ${storeName}/company.json:`, err);
        }
    } else {
        console.error('No se encontró la tienda solicitada.');
    }
}

