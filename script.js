// ---------- ACESSO DE ADMINISTRADOR ----------
function loginAdmin() {
    // Altere a senha aqui se desejar
    const senhaCorreta = "admin123";
    const senha = prompt("Digite a senha de administrador para liberar o cadastro de veículos:");
    
    if (senha === senhaCorreta) {
        // Mostra o botão da aba de cadastro e o botão de logout
        document.getElementById('btn-tab-cadastro').style.display = 'inline-block';
        document.getElementById('btn-logout-admin').style.display = 'inline-block';
        
        // Esconde o botão de login
        document.getElementById('btn-login-admin').style.display = 'none';
        
        // Abre a aba de cadastro automaticamente
        openTab('cadastro');
    } else if (senha !== null) {
        alert("Senha incorreta. Acesso negado!");
    }
}

function logoutAdmin() {
    // Volta para a aba de inspeção
    openTab('inspecao');
    
    // Esconde a aba de cadastro e o botão de logout
    document.getElementById('btn-tab-cadastro').style.display = 'none';
    document.getElementById('btn-logout-admin').style.display = 'none';
    
    // Mostra o botão de login novamente
    document.getElementById('btn-login-admin').style.display = 'inline-block';
    
    // Limpa os dados do cadastro por segurança
    limparCadastro();
    
    alert("Você saiu do modo administrador.");
}


// ---------- NAVEGAÇÃO DE ABAS ----------
function openTab(tabName) {
    // Esconde todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    // Remove classe ativa de todos os botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostra a aba clicada
    document.getElementById(tabName).classList.add('active');
    document.getElementById('btn-tab-' + tabName).classList.add('active');
    
    // Se sair da aba de inspeção, para a câmera por segurança
    if(tabName === 'cadastro' && isScanning) {
        stopScanner();
    }
}


// ---------- GERAÇÃO DE QR CODE (ABA CADASTRO) ----------
function gerarQRCode() {
    const placa = document.getElementById('cad-placa').value.trim();
    const marca = document.getElementById('cad-marca').value.trim();
    const modelo = document.getElementById('cad-modelo').value.trim();
    const ano = document.getElementById('cad-ano').value.trim();
    const cor = document.getElementById('cad-cor').value.trim();
    const km = document.getElementById('cad-km').value.trim();

    if (!placa || !modelo) {
        alert("Por favor, preencha pelo menos a Placa e o Modelo para gerar o QR Code.");
        return;
    }

    const veiculo = {
        placa: placa,
        marca: marca,
        modelo: modelo,
        ano: ano ? parseInt(ano) : "",
        cor: cor,
        km: km ? parseInt(km) : ""
    };

    const jsonString = JSON.stringify(veiculo);
    
    const qrcodeBox = document.getElementById("qrcode-box");
    qrcodeBox.innerHTML = "";
    
    new QRCode(qrcodeBox, {
        text: jsonString,
        width: 200,
        height: 200,
        colorDark : "#0f2b3d",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });

    document.getElementById('qr-output-area').style.display = 'block';
}

function limparCadastro() {
    document.getElementById('cad-placa').value = '';
    document.getElementById('cad-marca').value = '';
    document.getElementById('cad-modelo').value = '';
    document.getElementById('cad-ano').value = '';
    document.getElementById('cad-cor').value = '';
    document.getElementById('cad-km').value = '';
    document.getElementById('qr-output-area').style.display = 'none';
}


// ---------- ESTRUTURA DO CHECKLIST ----------
const checklistSections = [
    { title: "1. DOCUMENTAÇÃO OBRIGATÓRIA", items: ["CRLV dentro da validade", "Seguro obrigatório (DPVAT/apólice atual)", "Laudo de inspeção veicular (se aplicável)", "Manual do proprietário presente", "Licenciamento afixado no para-brisa"] },
    { title: "2. EXTERIOR (LATARIA, VIDROS, ILUMINAÇÃO)", items: ["Faróis (alto, baixo, milha, neblina)", "Lanternas (freio, ré, posição)", "Piscas dianteiros e traseiros", "Setas laterais funcionando", "Para-choques sem trincas", "Lataria sem amassados ou ferrugem", "Vidros inteiros (sem trincas)", "Limpadores e lavadores funcionando", "Espelhos retrovisores intactos", "Maçanetas e travas externas"] },
    { title: "3. PNEUS E RODAS", items: ["Pressão dos pneus (incluindo estepe)", "Profundidade dos sulcos >1,6mm", "Desgaste irregular (alinhamento/cambagem)", "Pneus sem bolhas, cortes ou deformações", "Calotas intactas", "Parafusos da roda apertados", "Macaco, chave de roda e triângulo", "Estepe calibrado e em bom estado"] },
    { title: "4. INTERIOR E CONFORTO", items: ["Bancos e cintos de segurança (retenção)", "Cintos de segurança (todos com trava)", "Painel sem luzes de advertência acesas", "Velocímetro e hodômetro funcionando", "Travas e vidros elétricos (se houver)", "Ar-condicionado / ventilação", "Sistema de som / navegação (se houver)", "Encostos de cabeça instalados", "Tapetes não interferem nos pedais", "Extintor de incêndio dentro da validade"] },
    { title: "5. MOTOR E SISTEMA MECÂNICO", items: ["Nível do óleo do motor", "Nível do líquido de arrefecimento", "Nível do fluido de freio", "Nível do fluido da direção hidráulica", "Correias sem trincas ou folgas", "Mangueiras sem vazamentos", "Bateria (terminais limpos e carga)", "Funcionamento da partida (sem ruídos)", "Marcha lenta estável", "Filtro de ar limpo"] },
    { title: "6. SISTEMA DE FREIOS", items: ["Pedal de freio firme (não vai ao fundo)", "Freio de estacionamento (aciona e segura)", "Pastilhas / lonas com espessura mínima", "Discos / tambores sem sulcos profundos", "Comportamento do freio ABS (se houver)", "Sem ruídos (chiado ou rangido) ao frear"] },
    { title: "7. SISTEMA DE SUSPENSÃO E DIREÇÃO", items: ["Amortecedores (sem vazamento de óleo)", "Bandagens e buchas (sem folgas)", "Alinhamento e balanceamento", "Volante sem folga ou vibrações", "Caixa de direção sem vazamentos"] },
    { title: "8. ITENS DE SEGURANÇA E EMERGÊNCIA", items: ["Triângulo de sinalização (em bom estado)", "Chave de roda e macaco", "Luvas de procedimento", "Kit primeiros socorros (ver validade)", "Lanterna portátil (opcional)"] },
    { title: "9. TESTE DE FUNCIONAMENTO (OPERAÇÃO)", items: ["Partida a frio sem dificuldade", "Aceleração progressiva sem falhas", "Embreagem (patinação / ponto alto) – manual", "Câmbio com trocas suaves", "Freio motor eficiente", "Sem vazamentos no chão após o teste"] }
];

function renderChecklist() {
    const container = document.getElementById('checklistContainer');
    if (!container) return;
    container.innerHTML = '';
    checklistSections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'checklist-section';
        const titleH4 = document.createElement('h4');
        titleH4.innerText = section.title;
        sectionDiv.appendChild(titleH4);
        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'checklist-items';
        section.items.forEach(itemText => {
            const label = document.createElement('label');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'check-item';
            label.appendChild(cb);
            label.appendChild(document.createTextNode(' ' + itemText));
            itemsDiv.appendChild(label);
        });
        sectionDiv.appendChild(itemsDiv);
        container.appendChild(sectionDiv);
    });
}

function resetAllCheckboxes() {
    const allChecks = document.querySelectorAll('.check-item');
    allChecks.forEach(cb => cb.checked = false);
}


// ---------- LEITURA DE DADOS DO VEÍCULO ----------
function fillVehicleData(dataObj) {
    if (dataObj.placa) document.getElementById('placa').value = dataObj.placa;
    if (dataObj.marca) document.getElementById('marca').value = dataObj.marca;
    if (dataObj.modelo) document.getElementById('modelo').value = dataObj.modelo;
    if (dataObj.ano) document.getElementById('ano').value = dataObj.ano;
    if (dataObj.cor) document.getElementById('cor').value = dataObj.cor;
    if (dataObj.km) document.getElementById('km').value = dataObj.km;
    if (dataObj.obs) document.getElementById('obsVeiculo').value = dataObj.obs;
}

function clearVehicleFields() {
    document.getElementById('placa').value = '';
    document.getElementById('marca').value = '';
    document.getElementById('modelo').value = '';
    document.getElementById('ano').value = '';
    document.getElementById('cor').value = '';
    document.getElementById('km').value = '';
    document.getElementById('obsVeiculo').value = '';
}

function parseQRContent(qrString) {
    let result = {};
    try {
        const jsonParsed = JSON.parse(qrString);
        if (typeof jsonParsed === 'object' && jsonParsed !== null) {
            const mapping = { placa: 'placa', modelo: 'modelo', marca: 'marca', ano: 'ano', cor: 'cor', km: 'km', obs: 'obs' };
            for (let key in mapping) {
                if (jsonParsed[key] !== undefined) result[mapping[key]] = jsonParsed[key];
                else if (jsonParsed[key.toUpperCase()] !== undefined) result[mapping[key]] = jsonParsed[key.toUpperCase()];
            }
            if (jsonParsed.plate !== undefined && !result.placa) result.placa = jsonParsed.plate;
            if (jsonParsed.model !== undefined && !result.modelo) result.modelo = jsonParsed.model;
            if (jsonParsed.year !== undefined && !result.ano) result.ano = jsonParsed.year;
            if (jsonParsed.color !== undefined && !result.cor) result.cor = jsonParsed.color;
            if (jsonParsed.mileage !== undefined && !result.km) result.km = jsonParsed.mileage;
            return result;
        }
    } catch(e) {} 
    
    const patterns = [
        { regex: /placa\s*[:=]\s*([^;,\n]+)/i, field: 'placa' },
        { regex: /marca\s*[:=]\s*([^;,\n]+)/i, field: 'marca' },
        { regex: /modelo\s*[:=]\s*([^;,\n]+)/i, field: 'modelo' },
        { regex: /ano\s*[:=]\s*([^;,\n]+)/i, field: 'ano' },
        { regex: /cor\s*[:=]\s*([^;,\n]+)/i, field: 'cor' },
        { regex: /km\s*[:=]\s*([^;,\n]+)/i, field: 'km' },
        { regex: /placa\s+([A-Z0-9-]+)/i, field: 'placa' }
    ];
    patterns.forEach(p => {
        const match = qrString.match(p.regex);
        if (match && match[1]) {
            let val = match[1].trim();
            if (p.field === 'ano' && isNaN(Number(val))) {} else result[p.field] = val;
        }
    });
    if (!result.placa) {
        const plateMatch = qrString.match(/\b([A-Z]{3}[ -]?[0-9]{4}|[A-Z]{3}[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2})\b/i);
        if (plateMatch) result.placa = plateMatch[1];
    }
    return result;
}


// ---------- CÂMERA E SCANNER ----------
let html5QrCode = null;
let isScanning = false;

function onQRCodeSuccess(decodedText) {
    const statusDiv = document.getElementById('scanStatus');
    statusDiv.innerHTML = `✅ QR lido com sucesso!<br>🔍 Texto: "${decodedText.substring(0, 100)}"`;
    
    const parsedData = parseQRContent(decodedText);
    if (Object.keys(parsedData).length === 0) {
        statusDiv.innerHTML += `<br>⚠️ Nenhum campo reconhecido.`;
    } else {
        fillVehicleData(parsedData);
        statusDiv.innerHTML += `<br>📝 Dados do veículo atualizados!`;
    }
    
    if (html5QrCode && isScanning) {
        html5QrCode.stop().then(() => {
            isScanning = false;
            statusDiv.innerHTML += `<br>📷 Câmera pausada.`;
        }).catch(err => console.warn("Erro ao parar câmera:", err));
    }
}

function onQRCodeError(err) { /* Ignora erros de frame vazio */ }

async function startScanner() {
    const statusDiv = document.getElementById('scanStatus');
    if (isScanning) {
        statusDiv.innerHTML = "⚠️ Scanner já está ativo.";
        return;
    }
    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("qr-reader");
    }
    try {
        statusDiv.innerHTML = "📷 Solicitando permissão da câmera...";
        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
            onQRCodeSuccess,
            onQRCodeError
        );
        isScanning = true;
        statusDiv.innerHTML = "📸 Câmera ativa. Posicione o QR Code na área de leitura.";
    } catch (err) {
        console.error("Erro ao iniciar câmera: ", err);
        statusDiv.innerHTML = "❌ Não foi possível acessar a câmera. Verifique as permissões.";
    }
}

async function stopScanner() {
    if (html5QrCode && isScanning) {
        try {
            await html5QrCode.stop();
            isScanning = false;
            document.getElementById('scanStatus').innerHTML = "⏸️ Câmera desligada.";
        } catch (err) {
            console.warn("erro ao parar: ", err);
        }
    }
}

function printChecklist() {
    window.print();
}

// ---------- INICIALIZAÇÃO ----------
document.addEventListener('DOMContentLoaded', () => {
    renderChecklist();
    
    document.getElementById('startScannerBtn').addEventListener('click', startScanner);
    document.getElementById('stopScannerBtn').addEventListener('click', stopScanner);
    document.getElementById('limparCamposBtn').addEventListener('click', clearVehicleFields);
    document.getElementById('imprimirBtn').addEventListener('click', printChecklist);
    document.getElementById('resetChecklistBtn').addEventListener('click', resetAllCheckboxes);
    
    window.addEventListener('beforeunload', () => {
        if (html5QrCode && isScanning) {
            html5QrCode.stop().catch(e=>console.log);
        }
    });
});