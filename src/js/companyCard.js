import Modal from './modal.js';
import { getIconUrl } from '../icon/icons.js';

/**
 * Función para renderizar la sección de la compañía
 * @param {Object} companyData - Datos de la compañía obtenidos desde company.json
 * @returns {HTMLElement} - Elemento HTML con la sección de la compañía
 */
export function renderCompanySection(companyData) {
    const secCompany = document.createElement('section');
    secCompany.id = 'secCompany';

    // Crear la lista de redes sociales en la parte superior
    const socialNetworksList = document.createElement('ul');
    socialNetworksList.className = 'socialNetworksList';

    if (companyData.socialNetworks?.length) {
        companyData.socialNetworks.forEach(social => {
            const socialItem = document.createElement('li');
            const socialLink = document.createElement('a');
            socialLink.href = social.link.startsWith('http') ? social.link : `https://${social.link}`;
            socialLink.target = '_blank';

            // Obtener el icono de la red social y añadirlo al enlace
            const iconUrl = getIconUrl(social.name.toLowerCase());
            const socialIcon = document.createElement('img');
            socialIcon.src = iconUrl;
            socialIcon.alt = `${social.name} icon`;
            socialIcon.className = 'socialIcon';

            socialLink.appendChild(socialIcon);
            socialItem.appendChild(socialLink);
            socialNetworksList.appendChild(socialItem);
        });
    }

    // Insertar socialNetworksList antes de secCompany
    secCompany.appendChild(socialNetworksList);

    // Estructura principal de la sección de la compañía
    secCompany.innerHTML += `
        <div class="companyDesc">
            <img class="companyLogo" id="companyLogo" src="${companyData.image || './assets/img/placeholder.webp'}" alt="${companyData.name ? `Logo de ${companyData.name}` : 'Logo de la empresa'}">
            <div class="companyHeader">
                ${companyData.name ? `<h1>${companyData.name}</h1>` : ''}
                ${companyData.description ? `<h2>${companyData.description}</h2>` : ''}
            </div>
            <div class="companyInfo">
                ${companyData.address ? `<p>Dirección: ${companyData.address}</p>` : ''}
                ${companyData.whatsapp ? `<p><a class="btn" href="https://wa.me/${companyData.whatsapp}" target="_blank"><img class="icon" src="./src/icon/whatsapp.svg" alt="whatsapp icon"></a></p>` : ''}
            </div>
            <div id="company"></div>
            <div class="companyActions">
                ${companyData.horarios?.length ? `<button class="btn" id="btnHorarios" aria-label="Ver horarios de atención">Ver Horarios</button>` : ''}
                ${companyData.envios?.length ? `<button class="btn" id="btnEnvios" aria-label="Ver horarios de envíos">Ver Envíos</button>` : ''}
                ${companyData.socialNetworks?.length ? `<button class="btn" id="btnRedesSociales" aria-label="Ver redes sociales">Ver Redes Sociales</button>` : ''}
            </div>
        </div>
    `;

    // Aplicar fondo a companyDesc si heroBackgroundImage está presente
    const companyDesc = secCompany.querySelector('.companyDesc');
    if (companyData.heroBackgroundImage) {
        companyDesc.style.backgroundImage = `url(${companyData.heroBackgroundImage})`;
        companyDesc.style.backgroundSize = 'cover';
        companyDesc.style.backgroundPosition = 'center';
    }

    // Eventos para abrir los modales solo si los datos existen
    if (companyData.horarios?.length) {
        secCompany.querySelector('#btnHorarios').addEventListener('click', () => {
            renderHorariosModal(companyData.horarios);
        });
    }
    if (companyData.envios?.length) {
        secCompany.querySelector('#btnEnvios').addEventListener('click', () => {
            renderEnviosModal(companyData.envios);
        });
    }
    if (companyData.socialNetworks?.length) {
        secCompany.querySelector('#btnRedesSociales').addEventListener('click', () => {
            renderSocialNetworksModal(companyData.socialNetworks);
        });
    }

    return secCompany;
}

// Modal en formato tabla para horarios
function renderHorariosModal(horarios) {
    const modalContent = `
        <table class="horariosTable">
            <thead>
                <tr>
                    <th>Día</th>
                    <th>Horario</th>
                </tr>
            </thead>
            <tbody>
                ${horarios.map(horario => `
                    <tr>
                        <td>${horario.day}</td>
                        <td>${horario.hours}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    new Modal({
        title: 'Horarios de atención',
        content: modalContent,
        buttonText: 'Cerrar'
    }).createModal();
}

// Modal en formato tabla para envíos
function renderEnviosModal(envios) {
    const modalContent = `
        <table class="enviosTable">
            <thead>
                <tr>
                    <th>Día</th>
                    <th>Horario de Envíos</th>
                </tr>
            </thead>
            <tbody>
                ${envios.map(envio => `
                    <tr>
                        <td>${envio.day}</td>
                        <td>${envio.hours}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    new Modal({
        title: 'Horarios de Envíos',
        content: modalContent,
        buttonText: 'Cerrar'
    }).createModal();
}

// Modal para mostrar redes sociales
function renderSocialNetworksModal(socialNetworks) {
    const modalContent = `
        <table class="socialNetworksTable">
            <thead>
                <tr>
                    <th>Red Social</th>
                    <th>Enlace</th>
                </tr>
            </thead>
            <tbody>
                ${socialNetworks.map(social => `
                    <tr>
                        <td>${social.name}</td>
                        <td><a href="${social.link.startsWith('http') ? social.link : 'https://' + social.link}" target="_blank">Visitar</a></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    new Modal({
        title: 'Redes Sociales',
        content: modalContent,
        buttonText: 'Cerrar'
    }).createModal();
}
