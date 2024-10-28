// Importa las funciones de dataIO.js
import { fetchDataList } from '../../data/dataIO.js';

document.addEventListener("DOMContentLoaded", async () => {
    const examplesList = document.getElementById("examples-list");

    if (!examplesList) {
        console.error("No se encontró el elemento examples-list");
        return;
    }

    // Carga los datos desde dataList.json
    const dataList = await fetchDataList();

    // Genera una tarjeta para cada tienda en dataList
    dataList.forEach((item) => {
        const card = document.createElement("li");
        card.className = "store-card";
        
        // Genera el contenido HTML de la tarjeta
        card.innerHTML = `
            <h3>${item.company}</h3>
            <p>${item.description}</p>
            <a class="btn" href="../store.html?store=${item.company}" target="_blank">Ver tienda</a>
        `;

        // Agrega la tarjeta al contenedor examples-list
        examplesList.appendChild(card);
    });

// Parámetros de desplazamiento
const scrollSpeed = 2; // Ajusta este valor para controlar el avance automático
let scrollInterval;

function autoScroll() {
    // Incrementa la posición de desplazamiento sumando scrollSpeed a la posición actual
    examplesList.scrollLeft += scrollSpeed;

    // Reinicia al principio si llega al final
    if (examplesList.scrollLeft >= examplesList.scrollWidth - examplesList.clientWidth) {
        examplesList.scrollLeft = 0;
    }
}

// Inicia el desplazamiento automático
function startAutoScroll() {
    scrollInterval = setInterval(autoScroll, 100); // Ajusta el intervalo según prefieras
}

// Inicia el desplazamiento automático al cargar la página
startAutoScroll();


});
