// Importa las funciones de dataIO.js
import { loadCompanyData, loadProducts, fetchDataList } from '../../../data/dataIO.js';
import Modal from './modal.js'; // Asegúrate de que la ruta sea correcta

// Función para obtener el parámetro "store" de la URL
function getStoreFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('store');
}

// Función principal para cargar y renderizar la tienda o mostrar la búsqueda si no hay tienda especificada
async function loadStore() {
    const storeName = getStoreFromURL();
    const main = document.querySelector('main');

    // Limpia el contenido de main antes de cargar una nueva tienda
    main.innerHTML = '';

    if (!storeName) {
        renderSearchSection(main);
        return;
    }

    try {
        const companyDataArray = await loadCompanyData(storeName);
        const companyData = companyDataArray[0];
        if (!companyData) {
            throw new Error(`No se encontró la tienda: ${storeName}`);
        }

        // Renderiza la sección de la empresa
        renderCompanySection(companyData);

        const productsData = await loadProducts(storeName);
        if (productsData && productsData.length > 0) {
            renderProductSections(productsData);
        } else {
            throw new Error(`No hay productos disponibles para la tienda: ${storeName}`);
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

// Función para renderizar la sección de búsqueda con autocompletado
async function renderSearchSection(main) {
    const dataList = await fetchDataList();

    const secSearch = document.createElement('section');
    secSearch.id = 'secSearch';
    secSearch.innerHTML = `
        <h2>Buscar tienda</h2>
        <input type="text" id="searchInput" list="storeSuggestions" placeholder="Escribe el nombre de la tienda...">
        <datalist id="storeSuggestions"></datalist>
    `;

    main.appendChild(secSearch);

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
            window.location.href = `store.html?store=${foundStore.company}`;
        }
    });
}

// Función para renderizar la sección de la empresa
function renderCompanySection(companyData) {
    const main = document.querySelector('main');
    const secCompany = document.createElement('section');
    secCompany.id = 'secCompany';

    const companyLogo = companyData.image || './assets/img/placeholder.webp';
    const companyName = companyData.name || 'Nombre de la tienda no disponible';
    const companyDesc = companyData.description || 'Descripción no disponible';
    const companyAddress = companyData.address || 'Dirección no disponible';
    const companyWhatsapp = companyData.whatsapp || 'WhatsApp no disponible';
    const socialNetworks = companyData.socialNetworks || [];
    const horarios = companyData.horarios || [];

    secCompany.innerHTML = `
        <div class="companyDesc">
            <div class="companyLogoCont">
                <img id="companyLogo" src="${companyLogo}" alt="Logo de ${companyName}">
            </div>
            <div class="companyHeader">
                <h1>${companyName}</h1>
                <h2>${companyDesc}</h2>
            </div>
            <div class="companyInfo">
                <p>Dirección: ${companyAddress}</p>
                <p>WhatsApp: ${companyWhatsapp}</p>
            </div>
            <div class="companyActions">
                <button class="btn" id="btnHorarios">Ver Horarios</button>
                <button class="btn" id="btnRedesSociales">Ver Redes Sociales</button>
            </div>
        </div>
    `;

    main.appendChild(secCompany);

    // Agregar eventos a los botones para abrir los modales
    document.getElementById('btnHorarios').addEventListener('click', () => {
        renderHorariosModal(horarios);
    });
    document.getElementById('btnRedesSociales').addEventListener('click', () => {
        renderSocialNetworksModal(socialNetworks);
    });
}

// Función para renderizar la sección de productos
function renderProductSections(productsData) {
    const main = document.querySelector('main');
    const productsByType = agruparPor(productsData, 'type'); // Agrupar productos por tipo

    // Limpiar el contenedor principal antes de renderizar
    main.querySelectorAll('.product-section').forEach(section => section.remove());

    for (const [type, productsOfType] of Object.entries(productsByType)) {
        const secProducts = document.createElement('section');
        secProducts.classList.add('product-section');
        secProducts.id = `section-${type}`;

        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);

        const filterContainer = document.createElement('div');
        filterContainer.classList.add('filter-container');

        const searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'text');
        searchInput.setAttribute('placeholder', 'Buscar producto...');
        searchInput.oninput = () => buscarProducto(secProducts, productsOfType, searchInput.value);

        filterContainer.appendChild(searchInput);

        // Filtrar por tags
        const tagsUnicos = [...new Set(productsOfType.flatMap(producto => producto.tag))];
        tagsUnicos.forEach(tag => {
            const filterButton = document.createElement('button');
            filterButton.textContent = tag;
            filterButton.onclick = () => filtrarPorTag(secProducts, productsOfType, tag);
            filterContainer.appendChild(filterButton);
        });

        // Botón para ver todos los productos
        const verTodosButton = document.createElement('button');
        verTodosButton.textContent = 'Ver Todos';
        verTodosButton.onclick = () => mostrarTodosProductos(secProducts, productsOfType);
        filterContainer.appendChild(verTodosButton);

        secProducts.appendChild(sectionTitle);
        secProducts.appendChild(filterContainer);

        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');
        secProducts.appendChild(productContainer);

        mostrarProductos(productContainer, productsOfType);
        main.appendChild(secProducts);
    }

    // Renderizar el carrito al final de la carga de productos
    renderCart();
}

// Función para mostrar todos los productos sin filtros
function mostrarTodosProductos(section, productos) {
    const productContainer = section.querySelector('.product-container');
    productContainer.innerHTML = ''; // Limpiar la sección antes de renderizar
    mostrarProductos(productContainer, productos);
}

// Función para agrupar productos por una propiedad (en este caso 'type')
function agruparPor(array, propiedad) {
    return array.reduce((acc, obj) => {
        const key = obj[propiedad];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

// Función para mostrar todos los productos usando la estructura proporcionada
function mostrarProductos(container, productos) {
    container.innerHTML = ''; // Limpiar el contenedor antes de renderizar
    productos.forEach(producto => {
        const productCard = crearProductCard(producto);
        container.appendChild(productCard);
    });
}

// Función para filtrar productos por tag
function filtrarPorTag(section, productos, tag) {
    const productosFiltrados = productos.filter(producto => producto.tag.includes(tag));
    const productContainer = section.querySelector('.product-container');
    productContainer.innerHTML = ''; // Limpiar la sección antes de renderizar
    mostrarProductos(productContainer, productosFiltrados);
}

// Función para buscar productos por nombre
function buscarProducto(section, productos, query) {
    const productosFiltrados = productos.filter(producto =>
        producto.name.toLowerCase().includes(query.toLowerCase())
    );
    const productContainer = section.querySelector('.product-container');
    productContainer.innerHTML = ''; // Limpiar la sección antes de renderizar
    mostrarProductos(productContainer, productosFiltrados);
}

// Función para crear las tarjetas de productos usando la estructura proporcionada
function crearProductCard(producto) {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
        <img src="${producto.image}" alt="${producto.name}">
        <h3>${producto.name}</h3>
        <p>${producto.description}</p>
        <p>$ ${producto.price}</p>
        <div class="product-controls">
            <button class="btn-restar" data-id="${producto.id}">-</button>
            <span id="cantidad-producto-${producto.id}">${obtenerCantidadEnCarrito(producto.id)}</span>
            <button class="btn-sumar" data-id="${producto.id}">+</button>
        </div>
    `;

    // Eventos para sumar y restar productos en el carrito
    card.querySelector('.btn-sumar').addEventListener('click', () => {
        agregarAlCarrito(producto.id);
        actualizarCantidadEnSpan(producto.id); // Actualiza el span después de agregar
    });

    card.querySelector('.btn-restar').addEventListener('click', () => {
        restarDelCarrito(producto.id);
        actualizarCantidadEnSpan(producto.id); // Actualiza el span después de restar
    });

    return card;
}

// Función para obtener la cantidad de un producto en el carrito
function obtenerCantidadEnCarrito(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    return cart[productId] || 0; // Devuelve la cantidad o 0 si no está en el carrito
}

// Función para agregar un producto al carrito
function agregarAlCarrito(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    cart[productId] = (cart[productId] || 0) + 1; // Incrementa la cantidad del producto
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Función para restar un producto del carrito
function restarDelCarrito(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (cart[productId]) {
        cart[productId] = Math.max(0, cart[productId] - 1); // Decrementa la cantidad del producto
        if (cart[productId] === 0) delete cart[productId]; // Elimina el producto si la cantidad es 0
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Función para actualizar el span de cantidad del producto
function actualizarCantidadEnSpan(productId) {
    const cantidadSpan = document.getElementById(`cantidad-producto-${productId}`);
    if (cantidadSpan) {
        cantidadSpan.textContent = obtenerCantidadEnCarrito(productId); // Actualiza el contenido del span
    }
}

// Función para renderizar el carrito
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const cartCount = Object.values(cart).reduce((total, count) => total + count, 0);
    const cartSpan = document.getElementById('cartCount');
    if (cartSpan) {
        cartSpan.textContent = cartCount; // Actualiza el número de productos en el carrito
    }

    // Actualizar todos los spans de cantidad de productos en el carrito
    Object.keys(cart).forEach(productId => {
        actualizarCantidadEnSpan(productId);
    });
}

// Función para renderizar el modal de horarios
function renderHorariosModal(horarios) {
    const modalContent = document.createElement('div');
    modalContent.innerHTML = `
        <h2>Horarios</h2>
        <ul>
            ${horarios.map(horario => `<li>${horario}</li>`).join('')}
        </ul>
    `;
    const modal = new Modal({
        title: 'Horarios de atención',
        content: modalContent.innerHTML,
        buttonText: 'Cerrar'
    });
    modal.createModal();
}

// Función para renderizar el modal de redes sociales
function renderSocialNetworksModal(socialNetworks) {
    const modalContent = document.createElement('div');
    modalContent.innerHTML = `
        <h2>Redes Sociales</h2>
        <ul>
            ${socialNetworks.map(social => `<li><a href="${social.link}" target="_blank">${social.name}</a></li>`).join('')}
        </ul>
    `;
    const modal = new Modal({
        title: 'Redes Sociales',
        content: modalContent.innerHTML,
        buttonText: 'Cerrar'
    });
    modal.createModal();
}

// Inicia la carga de la tienda al cargar el script
document.addEventListener('DOMContentLoaded', loadStore);
