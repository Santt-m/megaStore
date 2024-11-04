import './src/app/header.js';
import './src/app/cart.js';
import Modal from './src/js/modal.js';
import { loadCompanyData, loadProducts, fetchDataList } from '../../../data/dataIO.js';
import { createCompanyHeader, updateCompanyHeader } from './src/app/company.js';
import { createStatusElement, updateStatus } from './src/app/status.js';
import { renderProducts } from './src/app/products.js';
import { renderIndexSection } from './src/app/index.js';

let companyWhatsApp = '';

export function getCompanyWhatsApp() {
    return companyWhatsApp;
}

// Función para obtener el parámetro "store" de la URL
export function getStoreFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('store');
}

// Función principal para cargar y renderizar la tienda o mostrar la búsqueda si no hay tienda especificada
async function loadApp() {
    const storeName = getStoreFromURL();
    const main = document.querySelector('main');

    // Limpia el contenido de main antes de cargar una nueva tienda
    main.innerHTML = '';

    if (!storeName) {
        renderIndexSection(main);
        return;
    }

    try {
        // Cargar datos de la compañía
        const companyDataArray = await loadCompanyData(storeName);
        const companyData = companyDataArray[0];

        if (!companyData) throw new Error(`No se encontraron datos para la tienda: ${storeName}`);

        companyWhatsApp = companyData.whatsapp; // Guardar el número de WhatsApp de la compañía

        // Crear y actualizar el estado del local
        const statusElement = createStatusElement();
        main.appendChild(statusElement);
        updateStatus(companyData);

        // Crear y actualizar el encabezado de la compañía
        const companyHeader = createCompanyHeader();
        main.appendChild(companyHeader);
        updateCompanyHeader(companyData); // Asegurarse de que los datos de horarios se pasen correctamente

        // Cargar productos
        const products = await loadProducts(storeName);
        if (products && Array.isArray(products) && products.length > 0) {
            renderProducts(products);
        } else {
            console.warn(`No hay productos disponibles para la tienda: ${storeName}`);
            // Mostrar una advertencia o un mensaje, en vez de lanzar el error y el modal
            const emptyProductsSection = document.createElement('section');
            emptyProductsSection.classList.add('product-section');
            emptyProductsSection.innerHTML = `<p>No hay productos disponibles para la tienda: ${storeName}</p>`;
            main.appendChild(emptyProductsSection);
        }
    } catch (error) {
        displayErrorModal(`Error al cargar la tienda: ${error.message}`);
    }
}

// Función para mostrar un modal de error
function displayErrorModal(message) {
    const modal = new Modal({
        title: 'Error',
        content: `<p>${message}</p>`,
        buttonText: 'Cerrar'
    });
    modal.createModal();
}

// Inicia la carga de la tienda al cargar el script
document.addEventListener('DOMContentLoaded', loadApp);
