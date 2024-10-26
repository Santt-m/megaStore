// Importa componentes y modales comunes que se usan en todas las páginas
import "./src/components/header/header.js";
import modal from "./src/js/modal.js";

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  try {
    if (path.includes("index.html")) {
      // Carga el módulo para la página de inicio
      await import("./src/js/index.js");
      console.log("index.js cargado correctamente");
    } else if (path.includes("store.html")) {
      // Carga el módulo para la página de tienda
      await import("./src/js/store.js");
      console.log("store.js cargado correctamente");
    } else if (path.includes("menu.html")) {
      // Carga el módulo para la página de menú
      await import("./src/js/menu.js");
      console.log("menu.js cargado correctamente");
    }
    // Puedes añadir más condiciones para cargar otros scripts según la página
  } catch (error) {
    console.error("Error al cargar el script de la página:", error);
  }
});
