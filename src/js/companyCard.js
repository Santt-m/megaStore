// ./modules/companyCard.js
import Modal from './modal.js'; // Asegúrate de la ruta correcta

export function renderCompanySection(companyData) {
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

    // Eventos para abrir modales
    secCompany.querySelector('#btnHorarios').addEventListener('click', () => {
        renderHorariosModal(horarios);
    });
    secCompany.querySelector('#btnRedesSociales').addEventListener('click', () => {
        renderSocialNetworksModal(socialNetworks);
    });

    return secCompany;
}

function renderHorariosModal(horarios) {
    const modalContent = `
        <h2>Horarios</h2>
        <ul>${horarios.map(horario => `<li>${horario}</li>`).join('')}</ul>
    `;
    new Modal({ title: 'Horarios de atención', content: modalContent, buttonText: 'Cerrar' }).createModal();
}

function renderSocialNetworksModal(socialNetworks) {
    const modalContent = `
        <h2>Redes Sociales</h2>
        <ul>${socialNetworks.map(social => `<li><a href="${social.link}" target="_blank">${social.name}</a></li>`).join('')}</ul>
    `;
    new Modal({ title: 'Redes Sociales', content: modalContent, buttonText: 'Cerrar' }).createModal();
}
