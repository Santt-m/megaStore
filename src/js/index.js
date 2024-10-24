import { loadDataList } from '../../data/dataIO.js';  // Importamos dataIO

// Función para renderizar las tarjetas en el <ol> con id "examples-list"
async function renderStoreCards() {
    try {
        const stores = await loadDataList();  // Cargar los datos de la lista

        const examplesList = document.getElementById('examples-list');
        examplesList.innerHTML = '';  // Limpiamos cualquier contenido previo

        if (stores && stores.length > 0) {
            stores.forEach(store => {
                const card = document.createElement('li');
                card.classList.add('store-card');  // Clase para estilizar la tarjeta
                
                card.innerHTML = `
                        <h3>${store.company}</h3>
                        <p>${store.description}</p>
                        <a href="store.html?storeName=${store.company}" class="btn">Ver más</a>
                `;
                examplesList.appendChild(card);
            });
        } else {
            examplesList.innerHTML = '<li>No se encontraron tiendas disponibles.</li>';
        }
    } catch (error) {
        console.error("Error cargando las tiendas: ", error);
        document.getElementById('examples-list').innerHTML = '<li>Error cargando tiendas.</li>';
    }
}

// Cuando el DOM está cargado, renderizamos las tarjetas
document.addEventListener('DOMContentLoaded', renderStoreCards);
