// Importamos las funciones de dataIO.js
import * as dataIO from '../../data/dataIO.js';

// Función para renderizar las tarjetas en el <ol> con id "examples-list"
async function renderStoreCards() {
    // Cargamos los datos de las tiendas desde dataList.json
    const stores = await dataIO.loadDataList();
    console.log('Stores:', stores); // Verificar los datos cargados

    // Obtenemos el elemento <ol> donde se renderizarán las tarjetas
    const examplesList = document.getElementById('examples-list');
    console.log('Examples List Element:', examplesList); // Verificar el elemento

    if (stores && stores.length > 0) {
        // Recorremos cada tienda en stores y generamos las tarjetas
        stores.forEach(store => {
            console.log('Store Data:', store); // Verificar cada tienda

            // Crear un elemento <li> para la tarjeta
            const card = document.createElement('li');
            card.classList.add('store-card'); // Clase para estilizar la tarjeta
            
            // Plantilla HTML para el contenido de la tarjeta
            card.innerHTML = `
                <div class="card">
                    <h3>${store.company}</h3>
                    <p>${store.description}</p>
                    <a href="${store.url}" class="btn">Ver más</a>
                </div>
            `;

            // Añadir la tarjeta al <ol> con id "examples-list"
            examplesList.appendChild(card);
        });
    } else {
        // Si no se encontraron tiendas, mostramos un mensaje
        examplesList.innerHTML = '<li>No se encontraron tiendas disponibles.</li>';
    }
}

// Llamamos a la función para renderizar las tarjetas
document.addEventListener('DOMContentLoaded', renderStoreCards);
