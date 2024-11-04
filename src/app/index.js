import { fetchDataList } from '../../../../data/dataIO.js';

// Función para renderizar la sección de índice con autocompletado
export async function renderIndexSection(main) {
    const dataList = await fetchDataList();

    const secIndex = document.createElement('section');
    secIndex.id = 'secIndex';
    secIndex.innerHTML = `
        <h2>Buscar tienda</h2>
        <input type="text" id="searchInput" list="storeSuggestions" placeholder="Escribe el nombre de la tienda...">
        <datalist id="storeSuggestions"></datalist>
    `;

    main.appendChild(secIndex);

    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('storeSuggestions');

    // Llenar el datalist con las tiendas disponibles
    dataList.forEach(store => {
        const option = document.createElement('option');
        option.value = store.company;
        suggestions.appendChild(option);
    });

    // Evento de selección de sugerencia para redirigir a la tienda seleccionada
    searchInput.addEventListener('change', () => {
        const selectedStore = searchInput.value;
        const foundStore = dataList.find(store => store.company === selectedStore);
        if (foundStore) {
            window.location.href = `app.html?store=${foundStore.company}`;
        }
    });
}
