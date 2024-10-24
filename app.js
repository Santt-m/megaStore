import "./src/components/header/header.js"
import modal from "./src/js/modal.js"

// Función para detectar qué página está activa y cargar el script correspondiente
function loadPageScript() {
    const currentPage = window.location.pathname;

    if (currentPage.includes('index.html')) {
        import('./src/js/index.js').then(module => {
            console.log('Script de Index cargado');
        });
    } else if (currentPage.includes('store.html')) {
        import('./src/js/store.js').then(module => {
            console.log('Script de Store cargado');
        });
    } else if (currentPage.includes('menu.html')) {
        import('./src/js/menu.js').then(module => {
            console.log('Script de Menu cargado');
        });
    }
}


// Inicia la app 
document.addEventListener('DOMContentLoaded', loadPageScript);



