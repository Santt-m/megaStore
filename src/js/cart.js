import Modal from './modal.js'; // Importar Modal

let productsDataGlobal = []; // Variable global para almacenar los productos

// Inicializa el carrito desde localStorage
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('cart')) || {};
}

// Obtiene la cantidad de un producto específico en el carrito
export function obtenerCantidadEnCarrito(productId) {
    const cart = obtenerCarrito();
    return cart[productId] || 0; // Retorna la cantidad o 0 si no está en el carrito
}

// Agrega un producto al carrito
export function agregarAlCarrito(productId) {
    const cart = obtenerCarrito();
    cart[productId] = (cart[productId] || 0) + 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // Renderiza el carrito después de agregar
    resetProductsRenders(); // Actualiza las cantidades en todas las tarjetas de productos
    actualizarContadorCarrito(); // Actualiza el contador del carrito

    // Mostrar alerta
    const modal = new Modal({
        message: 'Producto agregado al carrito',
        buttonText: 'Cerrar',
        type: 'success'
    });
    modal.createAlert();
}

// Resta un producto del carrito
export function restarDelCarrito(productId) {
    const cart = obtenerCarrito();
    if (cart[productId]) {
        cart[productId] = Math.max(0, cart[productId] - 1);
        if (cart[productId] === 0) delete cart[productId];
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // Renderiza el carrito después de restar
    resetProductsRenders(); // Actualiza las cantidades en todas las tarjetas de productos
    actualizarContadorCarrito(); // Actualiza el contador del carrito

    // Mostrar alerta
    const modal = new Modal({
        message: 'Producto restado del carrito',
        buttonText: 'Cerrar',
        type: 'warning'
    });
    modal.createAlert();
}

// Elimina un producto del carrito
export function eliminarDelCarrito(productId) {
    const cart = obtenerCarrito();
    delete cart[productId];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // Renderiza el carrito después de eliminar
    resetProductsRenders(); // Actualiza las cantidades en todas las tarjetas de productos
    actualizarContadorCarrito(); // Actualiza el contador del carrito

    // Mostrar alerta
    const modal = new Modal({
        message: 'Producto eliminado del carrito',
        buttonText: 'Cerrar',
        type: 'error'
    });
    modal.createAlert();
}

// Vacía el carrito
export function vaciarCarrito() {
    localStorage.removeItem('cart'); // Elimina el carrito del localStorage
    renderCart(); // Renderiza el carrito después de vaciar
    resetProductsRenders(); // Actualiza las cantidades en todas las tarjetas de productos
    actualizarContadorCarrito(); // Actualiza el contador del carrito

    // Mostrar alerta
    const modal = new Modal({
        message: 'Carrito vaciado',
        buttonText: 'Cerrar',
        type: 'error'
    });
    modal.createAlert();
}

// Renderiza el carrito
export function renderCart() {
    const cart = obtenerCarrito();
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = ''; // Limpia el contenido anterior

    // Asegúrate de que productsDataGlobal sea un arreglo
    if (!Array.isArray(productsDataGlobal)) {
        console.error("productsDataGlobal no es un arreglo:", productsDataGlobal);
        return;
    }

    // Verifica que el carrito no esté vacío
    if (Object.keys(cart).length === 0) {
        cartList.innerHTML = '<li>No hay productos en el carrito.</li>'; // Mensaje si el carrito está vacío
        return;
    }

    Object.entries(cart).forEach(([productId, cantidad]) => {
        const product = productsDataGlobal.find(p => p.id == productId); // Asegúrate de comparar como string
        if (product) {
            const cartItem = document.createElement('li');
            cartItem.className = 'cart-item'; // Agrega una clase para estilos
            cartItem.innerHTML = `
                    <img data-src="${product.image}" alt="${product.name}" class="cart-item-image lazy-image" loading="lazy">
                    <div class="cart-item-details">
                        <p class="cart-item-name">${product.name}</p>
                        <p>Total: $${(product.price * cantidad).toFixed(2)}</p>
                    </div>
                    <div class="product-controls">
                        <button class="btn-restar" data-id="${productId}">-</button>
                        <span id="cantidad-producto-${productId}">${cantidad}</span>
                        <button class="btn-sumar" data-id="${productId}">+</button>
                    </div>
                    <button class="remove-item" data-id="${productId}">X</button>
            `;
            cartList.appendChild(cartItem); // Agrega el elemento a cartList
        } else {
            console.warn(`Producto no encontrado: ${productId}`); // Mensaje de advertencia si el producto no se encuentra
        }
    });

    // Agregar event listeners a los botones de eliminar
    cartList.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-id');
            eliminarDelCarrito(productId);
        });
    });

    // Agregar event listeners a los botones de sumar y restar
    cartList.querySelectorAll('.btn-sumar').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-id');
            agregarAlCarrito(productId);
        });
    });

    cartList.querySelectorAll('.btn-restar').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-id');
            restarDelCarrito(productId);
        });
    });

    // Actualiza el número total de items en el carrito
    actualizarContadorCarrito();
    initLazyLoading(); // Inicializa el lazy loading después de renderizar el carrito
}

// Función para inicializar el lazy loading de imágenes
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy-image');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
}

// Actualiza el contador del carrito
function actualizarContadorCarrito() {
    const cart = obtenerCarrito();
    const cartCount = Object.values(cart).reduce((total, count) => total + count, 0);
    const cartSpan = document.getElementById('cartCount');
    if (cartSpan) {
        cartSpan.textContent = cartCount; // Actualiza el número de productos en el carrito
    }
}

// Función para reiniciar el renderizado de las tarjetas de productos
export function resetProductsRenders() {
    const main = document.querySelector('main');
    const sections = main.querySelectorAll('.product-section');
    sections.forEach(section => {
        const productCards = section.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const productId = card.querySelector('.btn-sumar').getAttribute('data-id');
            const cantidadSpan = card.querySelector(`#cantidad-producto-${productId}`);
            if (cantidadSpan) {
                cantidadSpan.textContent = obtenerCarrito()[productId] || 0; // Actualiza el span con la cantidad en el carrito
            }
        });
    });
}

// Función para abrir/cerrar el carrito
export function toggleCart() {
    const cartMenu = document.getElementById('cartMenu');
    cartMenu.classList.toggle('show'); // Alterna la clase 'show'

    // Renderiza el carrito si está visible
    if (cartMenu.classList.contains('show')) {
        renderCart(); // Renderiza el carrito al abrir
    }
}

// Agregar el EventListener al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.addEventListener('click', toggleCart); // Maneja el clic en el botón del carrito

    // Agregar el EventListener para vaciar el carrito
    const clearCartBtn = document.querySelector('.btn-clear-cart');
    clearCartBtn.addEventListener('click', vaciarCarrito); // Maneja el clic en el botón para vaciar el carrito
});

// Función para inicializar el carrito
export function initCart(productsData) {
    productsDataGlobal = productsData; // Almacena los datos de productos en la variable global
    renderCart(); // Renderiza el carrito inicialmente
}