// productsCard.js

// Función para renderizar las secciones de productos
export function renderProductSections(productsData) {
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
