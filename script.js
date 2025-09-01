// Dados de usuários e obras (simulando um banco de dados)
const USUARIOS = {
    // Usuário Engenheiro
    "joao@construtora.com": {
        role: "engenheiro",
        password: "password123"
    },
    // Usuário Cliente
    "carla@cliente.com": {
        role: "cliente",
        password: "password456"
    }
};

let projetos = [
    {
        id: "proj-001",
        nome: "Residência Família Menezes",
        cliente: { nome: "Carla Menezes", email: "carla@cliente.com" },
        status: "Em andamento",
        etapas: [
            {
                nome: "Fundação Concluída",
                comentario: "As sapatas e baldrames foram finalizados.",
                data: "2024-04-10",
                fotos: [
                    "https://placehold.co/150x110/0000FF/FFFFFF?text=Fundação+1",
                    "https://placehold.co/150x110/0000FF/FFFFFF?text=Fundação+2"
                ]
            },
            {
                nome: "Alvenaria do Térreo",
                comentario: "Levantamento das paredes do pavimento inferior.",
                data: "2024-05-20",
                fotos: [
                    "https://placehold.co/150x110/FF0000/FFFFFF?text=Alvenaria+1",
                    "https://placehold.co/150x110/FF0000/FFFFFF?text=Alvenaria+2"
                ]
            }
        ],
        avisos: []
    },
    {
        id: "proj-002",
        nome: "Edifício Alpha",
        cliente: { nome: "Empresa ABC", email: "empresa@abc.com" },
        status: "Em andamento",
        etapas: [],
        avisos: []
    }
];

// Funções para renderizar os painéis
function renderClientDashboard(projeto) {
    // Preenche as informações gerais da obra
    document.getElementById('obra-nome').textContent = projeto.nome;
    document.getElementById('cliente-nome').textContent = projeto.cliente.nome;
    document.getElementById('obra-status').textContent = projeto.status;

    // Preenche a linha do tempo das etapas
    const timelineList = document.getElementById('timeline-list');
    timelineList.innerHTML = ''; // Limpa o conteúdo anterior
    if (projeto.etapas.length === 0) {
        timelineList.innerHTML = '<p class="no-etapas">Nenhuma etapa cadastrada ainda.</p>';
    } else {
        projeto.etapas.forEach(etapa => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            
            const formattedDate = new Date(etapa.data).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric'
            });

            const formattedTime = new Date(etapa.data).toLocaleTimeString('pt-BR', {
                hour: '2-digit', minute: '2-digit'
            });

            let galleryHtml = '';
            if (etapa.fotos.length > 0) {
                galleryHtml = `<div class="gallery">
                    ${etapa.fotos.map(url => `<img src="${url}" alt="Foto da etapa ${etapa.nome}">`).join('')}
                </div>`;
            }

            item.innerHTML = `
                <div class="timeline-date">${formattedDate} - ${formattedTime}</div>
                <div class="timeline-content">
                    <h4>${etapa.nome}</h4>
                    <p>${etapa.comentario}</p>
                    ${galleryHtml}
                </div>
            `;
            timelineList.appendChild(item);
        });
    }

    // Preenche a lista de avisos
    const avisosList = document.getElementById('avisos-list');
    avisosList.innerHTML = '';
    if (projeto.avisos.length === 0) {
        avisosList.innerHTML = '<p class="no-avisos">Nenhum aviso no momento.</p>';
    } else {
        projeto.avisos.forEach(aviso => {
            const avisoItem = document.createElement('li');
            avisoItem.innerHTML = `
                <div class="aviso-header">
                    <span>${aviso.data}</span>
                </div>
                <p>${aviso.mensagem}</p>
            `;
            avisosList.appendChild(avisoItem);
        });
    }
}

function renderEngineerDashboard() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';
    
    projetos.forEach(projeto => {
        const item = document.createElement('div');
        item.className = 'project-card';
        item.innerHTML = `
            <h3>${projeto.nome}</h3>
            <p>Cliente: ${projeto.cliente.nome}</p>
            <p>Status: <span class="status">${projeto.status}</span></p>
            <button class="view-project-btn cta-button" data-id="${projeto.id}">Gerenciar</button>
        `;
        projectList.appendChild(item);
    });
}

function renderProjectHistory(projeto) {
    const historyContainer = document.getElementById('project-history');
    historyContainer.innerHTML = '';

    const historyItems = [...projeto.etapas, ...projeto.avisos];
    historyItems.sort((a, b) => new Date(b.data) - new Date(a.data));

    if (historyItems.length === 0) {
        historyContainer.innerHTML = '<p class="no-history">Nenhum histórico disponível para esta obra.</p>';
    } else {
        historyItems.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const formattedDate = new Date(item.data).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric'
            });

            const formattedTime = new Date(item.data).toLocaleTimeString('pt-BR', {
                hour: '2-digit', minute: '2-digit'
            });

            if (item.nome) { // É uma etapa
                let galleryHtml = '';
                if (item.fotos && item.fotos.length > 0) {
                    galleryHtml = `<div class="history-gallery">
                        ${item.fotos.map(foto => `<img src="${foto}" alt="Foto da etapa ${item.nome}">`).join('')}
                    </div>`;
                }
                historyItem.innerHTML = `
                    <h4>Etapa: ${item.nome}</h4>
                    <p>${item.comentario}</p>
                    <p class="history-date">Data: ${formattedDate} - ${formattedTime}</p>
                    ${galleryHtml}
                `;
            } else { // É um aviso
                historyItem.innerHTML = `
                    <h4>Aviso</h4>
                    <p>${item.mensagem}</p>
                    <p class="history-date">Data: ${formattedDate} - ${formattedTime}</p>
                `;
            }
            historyContainer.appendChild(historyItem);
        });
    }
}

function showDashboard(role, email) {
    document.getElementById('login-container').classList.add('hidden');
    
    if (role === 'engenheiro') {
        document.getElementById('engineer-dashboard').classList.remove('hidden');
        renderEngineerDashboard();
    } else if (role === 'cliente') {
        const projetoCliente = projetos.find(p => p.cliente.email === email);
        if (projetoCliente) {
            document.getElementById('client-dashboard').classList.remove('hidden');
            renderClientDashboard(projetoCliente);
        } else {
            document.getElementById('login-container').classList.remove('hidden');
            document.getElementById('message').textContent = 'Você não está associado a nenhuma obra.';
            document.getElementById('message').style.color = '#ef4444';
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const engineerDashboard = document.getElementById('engineer-dashboard');
    const clientDashboard = document.getElementById('client-dashboard');
    const messageDisplay = document.getElementById('message');
    const logoutBtnEngineer = document.getElementById('logout-btn-engineer');
    const logoutBtnClient = document.getElementById('logout-btn-client');
    const addProjectForm = document.getElementById('new-project-form');
    const addStageForm = document.getElementById('add-stage-form');
    const sendNoticeForm = document.getElementById('send-notice-form');
    const addProjectBtn = document.getElementById('add-project-btn');
    const addProjectModal = document.getElementById('add-project-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    let currentProjectId = null;

    function showLogin() {
        loginContainer.classList.remove('hidden');
        engineerDashboard.classList.add('hidden');
        clientDashboard.classList.add('hidden');
        messageDisplay.textContent = '';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = USUARIOS[email];

        if (user && user.password === password) {
            messageDisplay.textContent = 'Login bem-sucedido!';
            messageDisplay.style.color = '#22c55e';
            setTimeout(() => {
                showDashboard(user.role, email);
            }, 1000);
        } else {
            messageDisplay.textContent = 'Email ou senha incorretos.';
            messageDisplay.style.color = '#ef4444';
        }
    });

    logoutBtnEngineer.addEventListener('click', showLogin);
    logoutBtnClient.addEventListener('click', showLogin);

    addProjectBtn.addEventListener('click', () => {
        addProjectModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        addProjectModal.classList.add('hidden');
        addProjectForm.reset();
    });

    // Lógica do Dashboard do Engenheiro
    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('new-project-name').value;
        const clienteNome = document.getElementById('new-project-client-name').value;
        const clienteEmail = document.getElementById('new-project-client-email').value;

        const newProjectId = `proj-${Date.now()}`;
        const newProject = {
            id: newProjectId,
            nome,
            cliente: { nome: clienteNome, email: clienteEmail },
            status: "Em andamento",
            etapas: [],
            avisos: []
        };

        projetos.push(newProject);
        renderEngineerDashboard();
        addProjectModal.classList.add('hidden');
        addProjectForm.reset();
        alert('Obra cadastrada com sucesso!');
    });

    document.getElementById('project-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('view-project-btn')) {
            currentProjectId = e.target.dataset.id;
            const project = projetos.find(p => p.id === currentProjectId);
            
            // Renderiza o painel de gerenciamento de etapas para o projeto selecionado
            document.getElementById('manage-project-title').textContent = project.nome;
            document.getElementById('manage-project-section').classList.remove('hidden');
            document.getElementById('engineer-dashboard-list').classList.add('hidden');
            
            // Renderiza o histórico da obra
            renderProjectHistory(project);
        }
    });

    addStageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('stage-name').value;
        const comentario = document.getElementById('stage-comment').value;
        const fotosInput = document.getElementById('stage-photos');
        const fotos = [];
        
        // Simulação de upload de foto
        if (fotosInput.files && fotosInput.files.length > 0) {
            for (let i = 0; i < fotosInput.files.length; i++) {
                const file = fotosInput.files[i];
                const reader = new FileReader();
                reader.onload = (event) => {
                    fotos.push(event.target.result);
                    if (fotos.length === fotosInput.files.length) {
                        finalizeAddStage(nome, comentario, fotos);
                    }
                };
                reader.readAsDataURL(file);
            }
        } else {
            finalizeAddStage(nome, comentario, fotos);
        }
    });
    
    function finalizeAddStage(nome, comentario, fotos) {
        const projeto = projetos.find(p => p.id === currentProjectId);

        if (projeto) {
            const novaEtapa = {
                nome,
                comentario,
                fotos,
                data: new Date().toISOString()
            };
            projeto.etapas.push(novaEtapa);
            renderProjectHistory(projeto);
            document.getElementById('add-stage-form').reset();
            alert('Etapa adicionada com sucesso! Um e-mail de notificação foi enviado ao cliente.'); // Simulação de e-mail
        }
    }
    
    sendNoticeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const avisoMensagem = document.getElementById('notice-message').value;
        const projeto = projetos.find(p => p.id === currentProjectId);
        
        if (projeto) {
            projeto.avisos.push({
                mensagem: avisoMensagem,
                data: new Date().toISOString() // Atualiza para usar a data e hora atual
            });
            alert('Aviso enviado com sucesso!');
            renderProjectHistory(projeto);
            sendNoticeForm.reset();
        }
    });

    document.getElementById('back-to-list-btn').addEventListener('click', () => {
        document.getElementById('manage-project-section').classList.add('hidden');
        document.getElementById('engineer-dashboard-list').classList.remove('hidden');
    });
});
