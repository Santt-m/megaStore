import { agregarAlCarrito, restarDelCarrito, obtenerCantidadEnCarrito } from './cart.js';

// Función para renderizar las tarjetas promocionales
export function renderPromoCards(promoData) {
    const promoSection = document.createElement('section');
    promoSection.classList.add('promo-section');

    promoData.forEach(promo => {
        const promoCard = crearPromoCard(promo);
        promoSection.appendChild(promoCard);
    });

    console.log("Sección de promociones creada:", promoSection); // Verifica la sección de promociones
    return promoSection;
}

// Función para crear una tarjeta promocional
function crearPromoCard(promo) {
    const card = document.createElement('div');
    card.classList.add('promo-card');
    card.style.backgroundImage = `url(${promo.image})`; // Establecer la imagen como fondo
    card.style.backgroundSize = 'cover'; // Ajustar el tamaño de la imagen
    card.style.backgroundPosition = 'center'; // Centrar la imagen

    card.innerHTML = `
        <div class="promo-content">
            <h3>${promo.name}</h3>
            <p>${promo.description}</p>
            <p>$ ${promo.price}</p>
            <div class="product-controls">
                <button class="btn-restar" data-id="${promo.id}">-</button>
                <span id="cantidad-promo-${promo.id}">${obtenerCantidadEnCarrito(promo.id)}</span>
                <button class="btn-sumar" data-id="${promo.id}">+</button>
            </div>
        </div>
    `;

    // Eventos para mostrar y ocultar el contenido promocional
    card.addEventListener('mouseenter', () => {
        card.querySelector('.promo-content').classList.add('show');
    });

    card.addEventListener('mouseleave', () => {
        card.querySelector('.promo-content').classList.remove('show');
    });

    // Eventos para sumar y restar productos en el carrito
    card.querySelector('.btn-sumar').addEventListener('click', () => {
        agregarAlCarrito(promo.id);
        actualizarCantidadEnSpan(promo.id);
    });

    card.querySelector('.btn-restar').addEventListener('click', () => {
        restarDelCarrito(promo.id);
        actualizarCantidadEnSpan(promo.id);
    });

    return card;
}

// Función para actualizar el span de cantidad del producto
function actualizarCantidadEnSpan(promoId) {
    const cantidadSpan = document.getElementById(`cantidad-promo-${promoId}`);
    if (cantidadSpan) {
        cantidadSpan.textContent = obtenerCantidadEnCarrito(promoId);
    }
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
