export function renderCompanySection(companyData, main) {
    const secCompany = document.createElement('section');
    secCompany.id = 'secCompany';
    const companyLogo = companyData.image || './assets/img/placeholder.webp';

    secCompany.innerHTML = `
        <div class="companyDesc">
            <div class="companyLogoCont">
                <img id="companyLogo" src="${companyLogo}" alt="Logo de ${companyData.name}">
            </div>
            <div class="companyHeader">
                <h1>${companyData.name || 'Nombre de la tienda no disponible'}</h1>
                <h2>${companyData.description || 'Descripción no disponible'}</h2>
            </div>
            <div class="companyInfo">
                <p>Dirección: ${companyData.address || 'Dirección no disponible'}</p>
                <p>WhatsApp: ${companyData.whatsapp || 'WhatsApp no disponible'}</p>
            </div>
            <div class="companyActions">
                <button class="btn" id="btnHorarios">Ver Horarios</button>
                <button class="btn" id="btnRedesSociales">Ver Redes Sociales</button>
            </div>
        </div>
    `;

    main.appendChild(secCompany);

    // Eventos de botones
    document.getElementById('btnHorarios').addEventListener('click', () => {
        renderHorariosModal(companyData.horarios || []);
    });
    document.getElementById('btnRedesSociales').addEventListener('click', () => {
        renderSocialNetworksModal(companyData.socialNetworks || []);
    });
}

function renderHorariosModal(horarios) {
    const modal = new Modal({
        title: 'Horarios de atención',
        content: `<ul>${horarios.map(h => `<li>${h}</li>`).join('')}</ul>`,
        buttonText: 'Cerrar'
    });
    modal.createModal();
}

function renderSocialNetworksModal(socialNetworks) {
    const modal = new Modal({
        title: 'Redes Sociales',
        content: `<ul>${socialNetworks.map(s => `<li><a href="${s.link}" target="_blank">${s.name}</a></li>`).join('')}</ul>`,
        buttonText: 'Cerrar'
    });
    modal.createModal();
}
