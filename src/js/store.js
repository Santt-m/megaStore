import { loadCompanyData, loadProducts } from '../../../data/dataIO.js'; // Aseguramos cargar las funciones correctas

// Función para obtener el parámetro "storeName" de la URL
function getStoreFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('storeName');
}

// Función principal que gestiona la carga de la tienda
async function loadStore() {
    console.log("loadStore fue llamado");  // <-- Confirmamos que la función se ejecuta
    const storeName = getStoreFromURL();
    if (!storeName) {
        displayError('Error en carga de store desde URL.');
        return;
    }
    console.log('load store', storeName);

    try {
        // Cargar los datos de la tienda y los productos
        const companyData = await loadCompanyData(storeName);
        console.log("Datos de la tienda cargados:", companyData); // <-- Comprobamos si se cargan los datos

        if (!companyData) {
            throw new Error(`No se encontró la tienda ${storeName}`);
        }

        renderCompanySection(companyData);

        try {
    try {
    const productsData = await loadProducts(storeName);
    if (!productsData || productsData.length === 0) {
        console.log(`No hay productos disponibles para la tienda ${storeName}.`);
    } else {
        console.log("Datos de productos cargados:", productsData); // Verificamos si se cargan los productos
        renderProductSection(productsData); // Esta función manejará la visualización de productos
    }
} catch (error) {
    console.error(error);
    displayError(`Error al cargar los productos de la tienda ${storeName}`);
}

} catch (error) {
    console.error(error);
    displayError(`Error al cargar los productos de la tienda ${storeName}`);
}

}

// Función para mostrar error en el main
function displayError(message) {
    const main = document.querySelector('main');
    main.innerHTML = `<p>${message}</p>`;
}

// Función para renderizar la sección de la empresa
function renderCompanySection(companyData) {
    const main = document.querySelector('main');
    const secCompany = document.createElement('section');
    secCompany.id = 'secCompany';

    // Desglose de los datos de la tienda
    const companyLogo = companyData.image || './assets/img/placeholder.webp';
    const companyName = companyData.name || 'Nombre de la tienda no disponible';
    const companyDesc = companyData.description || 'Descripción no disponible';
    const companyAddress = companyData.address || null;
    const companyWhatsapp = companyData.whatsapp || null;
    const socialNetworks = companyData.socialNetworks || [];
    const horarios = companyData.horarios || [];

    // Comenzamos a construir el contenido dinámico
    let companyInfoContent = '';
    if (companyAddress) {
        companyInfoContent += `<p>Dirección: ${companyAddress}</p>`;
    }
    if (companyWhatsapp) {
        companyInfoContent += `<p>WhatsApp: ${companyWhatsapp}</p>`;
    }

    secCompany.innerHTML = `
        <div class="companyDesc">
            <div class="companyLogoCont">
                <img id="companyLogo" src="${companyLogo}" alt="${companyName ? 'Logo de ' + companyName : 'Logo no disponible'}">
            </div>
            <div class="companyHeader">
                <h1>${companyName}</h1>
                <h2>${companyDesc}</h2>
            </div>
            <div class="companyInfo">
                ${companyInfoContent || '<p>Información no disponible</p>'}
            </div>
            <div class="companyActions">
                <ol id="companyHs">
                    ${horarios.length > 0 ? horarios.map(h => `<li>${h}</li>`).join('') : '<li>Horarios no disponibles</li>'}
                </ol>
                <ol id="companySocialNetworks">
                    ${socialNetworks.length > 0 ? socialNetworks.map(sn => `<li><a href="${sn.url}">${sn.name}</a></li>`).join('') : '<li>Redes sociales no disponibles</li>'}
                </ol>
            </div>
        </div>
    `;

    main.appendChild(secCompany);
}

// Inicializamos la función principal
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded"); // <-- Confirmamos que el DOM está listo
    loadStore(); // <-- Ejecutamos la función de carga de la tienda
});
