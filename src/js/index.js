// ./src/js/index.js

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
        const card = document.createElement("div");
        card.className = "card";
        
        // Genera el contenido HTML de la tarjeta
        card.innerHTML = `
            <h3>${item.company}</h3>
            <p>${item.description}</p>
            <a href="${item.url}" target="_blank">Ver tienda</a>
        `;

        // Agrega la tarjeta al contenedor examples-list
        examplesList.appendChild(card);
        console.log(card);
    });
});
