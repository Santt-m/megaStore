import { loadCompanyData, loadProducts } from '../../data/dataIO.js';  // Importamos dataIO

// Obtener parámetros de la URL
function getStoreNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('storeName');
}

// Cargar y mostrar los datos del menú
async function renderMenu() {
    try {
        const storeName = getStoreNameFromURL();
        const companyData = await loadCompanyData(storeName);
        const products = await loadProducts(storeName);

        const menuTitle = document.getElementById('menu-title');
        const menuInfo = document.getElementById('menu-info');
        const menuItems = document.getElementById('menu-items');

        // Mostrar datos del restaurante
        menuTitle.textContent = companyData.name;
        menuInfo.innerHTML = `
            <p>${companyData.description}</p>
            <p>Dirección: ${companyData.address}</p>
            <p>WhatsApp: ${companyData.whatsapp}</p>
            <p>Horarios: ${companyData.horarios.map(h => `<p>${h.day}: ${h.hours}</p>`).join('')}</p>
        `;

        // Mostrar menú
        if (products && products.length > 0) {
            const productItems = products.map(product => `
                <div class="menu-item">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <p>Precio: ${product.price}</p>
                </div>
            `).join('');
            menuItems.innerHTML = productItems;
        } else {
            menuItems.innerHTML = '<p>No hay items de menú disponibles.</p>';
        }
    } catch (error) {
        console.error("Error cargando el menú: ", error);
        document.getElementById('menu-info').innerHTML = '<p>Error cargando el menú.</p>';
    }
}

document.addEventListener('DOMContentLoaded', renderMenu);
