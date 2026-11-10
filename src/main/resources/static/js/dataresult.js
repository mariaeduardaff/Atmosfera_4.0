const API_BASE_URL = 'http://localhost:8080/api';

const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

let dadosGlobais = {
    dispositivos: [],
    registros: [],
    atuadores: []
};

let chartInstances = {};
let todosDispositivos = [];
let todosRegistros = [];
let todosAtuadores = [];

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosIntegrados();
    setInterval(carregarDadosIntegrados, 5000);
});

async function carregarDadosIntegrados() {
    try {
        const [dispositivos, registros, atuadores] = await Promise.all([
            fetch(`${API_BASE_URL}/dispositivos`).then(res => res.ok ? res.json() : []),
            fetch(`${API_BASE_URL}/registros`).then(res => res.ok ? res.json() : []),
            fetch(`${API_BASE_URL}/atuadores`).then(res => res.ok ? res.json() : []).catch(() => [])
        ]);

        // Atualiza tanto dadosGlobais quanto as variáveis soltas
        todosDispositivos = Array.isArray(dispositivos) ? dispositivos : [];
        todosRegistros = Array.isArray(registros) ? registros : [];
        todosAtuadores = Array.isArray(atuadores) ? atuadores : [];

        dadosGlobais = {
            dispositivos: todosDispositivos,
            registros: todosRegistros,
            atuadores: todosAtuadores
        };

        atualizarFiltroSelect(todosDispositivos);
        aplicarFiltroDispositivo();

    } catch (error) {
        console.error('Erro ao conectar com a API Spring Boot Java:', error);
    }
}

function aplicarFiltroDispositivo() {
    const select = document.getElementById('deviceFilter') || document.getElementById('dispositivoSelect');
    const valorSelecionado = select ? select.value : '';

    let registrosFiltrados = todosRegistros;
    let dispositivosFiltrados = todosDispositivos;

    if (valorSelecionado && valorSelecionado !== 'todos' && valorSelecionado !== '') {
        const idProcurado = parseInt(valorSelecionado.replace(/\D/g, ''));

        dispositivosFiltrados = todosDispositivos.filter(d => {
            const idDev = parseInt(d.idDispositivo || d.id);
            return idDev === idProcurado;
        });

        registrosFiltrados = todosRegistros.filter(r => {
            const idDev = r.dispositivo ? (r.dispositivo.idDispositivo || r.dispositivo.id) : r.dispositivoId;
            return parseInt(idDev) === idProcurado;
        });
    }

    renderizarResumo(registrosFiltrados, dispositivosFiltrados);
    renderizarCardsEGraficos(dispositivosFiltrados, registrosFiltrados, todosAtuadores);
    renderizarTabelaLogs(registrosFiltrados);
}

function renderizarResumo(registros, dispositivos) {
    if (!registros || registros.length === 0) {
        if(document.getElementById('avg-temp')) document.getElementById('avg-temp').textContent = '-- °C';
        if(document.getElementById('avg-umid')) document.getElementById('avg-umid').textContent = '-- %';
        if(document.getElementById('avg-pres')) document.getElementById('avg-pres').textContent = '-- hPa';
        if(document.getElementById('active-count')) document.getElementById('active-count').textContent = '0 Exibido(s)';
        return;
    }

    const totalTemp = registros.reduce((acc, r) => acc + (r.temperatura || 0), 0);
    const totalUmid = registros.reduce((acc, r) => acc + (r.umidade || 0), 0);
    const totalPres = registros.reduce((acc, r) => acc + (r.pressao || 0), 0);

    if(document.getElementById('avg-temp')) document.getElementById('avg-temp').textContent = `${(totalTemp / registros.length).toFixed(1)} °C`;
    if(document.getElementById('avg-umid')) document.getElementById('avg-umid').textContent = `${(totalUmid / registros.length).toFixed(0)} %`;
    if(document.getElementById('avg-pres')) document.getElementById('avg-pres').textContent = `${(totalPres / registros.length).toFixed(0)} hPa`;
    if(document.getElementById('active-count')) document.getElementById('active-count').textContent = `${dispositivos.length} Exibido(s)`;
}

function renderizarCardsEGraficos(dispositivos, registros, atuadores) {
    const container = document.getElementById('devices-grid-container') || document.getElementById('devicesContainer') || document.querySelector('.devices-grid');
    if (!container) return;

    Object.keys(chartInstances).forEach(key => {
        if (chartInstances[key]) chartInstances[key].destroy();
    });
    chartInstances = {};

    container.innerHTML = '';

    const LIMITE_GRAFICOS = 4;
    const dispositivosExibir = dispositivos.slice(0, LIMITE_GRAFICOS);

    dispositivosExibir.forEach((dev) => {
        const idDevAtual = dev.idDispositivo || dev.id;

        const registrosDev = registros.filter(r => {
            const idDev = r.dispositivo ? (r.dispositivo.idDispositivo || r.dispositivo.id) : r.dispositivoId;
            return parseInt(idDev) === parseInt(idDevAtual);
        });

        const ultimoRegistro = registrosDev[registrosDev.length - 1] || {};

        const todosAtuadoresDev = atuadores.filter(a => {
            const idDev = a.dispositivo ? (a.dispositivo.idDispositivo || a.dispositivo.id) : a.dispositivoId;
            return parseInt(idDev) === parseInt(idDevAtual);
        });

        const atuadoresUnicosMap = new Map();
        todosAtuadoresDev.forEach(a => {
            if (!atuadoresUnicosMap.has(a.nomeAtuador)) {
                atuadoresUnicosMap.set(a.nomeAtuador, a);
            }
        });
        const atuadoresExibir = Array.from(atuadoresUnicosMap.values());

        const cardHtml = `
      <div class="device-card" id="device-card-${idDevAtual}">
        <div class="device-card-header">
          <div class="device-title">
            <i class="fa-solid fa-microchip"></i>
            <div>
              <h4>${dev.nomeDispositivo || 'Dispositivo'}</h4>
              <small>ID: DEV-${idDevAtual} | Local: ${dev.localizacao || 'SENAI'}</small>
            </div>
          </div>
          <span class="status-tag online">ONLINE</span>
        </div>

        <div class="device-readings">
          <div class="reading-item">
            <span class="label">Temp:</span>
            <span class="val">${ultimoRegistro.temperatura != null ? ultimoRegistro.temperatura + ' °C' : '--'}</span>
          </div>
          <div class="reading-item">
            <span class="label">Umid:</span>
            <span class="val">${ultimoRegistro.umidade != null ? ultimoRegistro.umidade + ' %' : '--'}</span>
          </div>
          <div class="reading-item">
            <span class="label">Lux:</span>
            <span class="val">${ultimoRegistro.lux != null ? ultimoRegistro.lux + ' lx' : '--'}</span>
          </div>
          <div class="reading-item">
            <span class="label">Pressão:</span>
            <span class="val">${ultimoRegistro.pressao != null ? ultimoRegistro.pressao + ' hPa' : '--'}</span>
          </div>
        </div>

        <div class="actuators-mini-status">
          <span class="mini-label">Atuadores:</span>
          <div class="mini-leds" style="display: flex; flex-wrap: wrap; gap: 4px; max-height: 60px; overflow-y: auto;">
            ${
            atuadoresExibir.length > 0
                ? atuadoresExibir.map(a => `<span class="mini-pill ${a.statusAtual ? 'on' : ''}">${a.nomeAtuador}</span>`).join('')
                : '<span class="mini-pill">Sem atuadores</span>'
        }
          </div>
        </div>

        <div class="chart-container" style="position: relative; height: 180px; width: 100%;">
          <canvas id="chart-dev-${idDevAtual}"></canvas>
        </div>
      </div>
    `;

        container.insertAdjacentHTML('beforeend', cardHtml);

        setTimeout(() => {
            desenharGrafico(idDevAtual, registrosDev);
        }, 50);
    });
}

function desenharGrafico(idDispositivo, registros) {
    const canvasId = `chart-dev-${idDispositivo}`;
    const canvasElem = document.getElementById(canvasId);
    if (!canvasElem) return;

    const ctx = canvasElem.getContext('2d');
    const ultimosRegistros = registros.slice(-15);

    const labels = ultimosRegistros.map(r => {
        if (!r.dataHora) return '--:--';
        const date = new Date(r.dataHora);
        return isNaN(date.getTime())
            ? '--:--'
            : date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    });

    const dadosTemperatura = ultimosRegistros.map(r => r.temperatura || 0);

    const paletaCores = [
        { linha: '#e30613', gradienteInicio: 'rgba(227, 6, 19, 0.35)', gradienteFim: 'rgba(227, 6, 19, 0.0)' },
        { linha: '#22c55e', gradienteInicio: 'rgba(34, 197, 94, 0.35)', gradienteFim: 'rgba(34, 197, 94, 0.0)' },
        { linha: '#3b82f6', gradienteInicio: 'rgba(59, 130, 246, 0.35)', gradienteFim: 'rgba(59, 130, 246, 0.0)' },
        { linha: '#a855f7', gradienteInicio: 'rgba(168, 85, 247, 0.35)', gradienteFim: 'rgba(168, 85, 247, 0.0)' }
    ];

    const cor = paletaCores[(idDispositivo - 1) % paletaCores.length] || paletaCores[0];

    const gradient = ctx.createLinearGradient(0, 0, 0, 180);
    gradient.addColorStop(0, cor.gradienteInicio);
    gradient.addColorStop(1, cor.gradienteFim);

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.length > 0 ? labels : ['Sem Registos'],
            datasets: [{
                label: 'Temperatura (°C)',
                data: dadosTemperatura.length > 0 ? dadosTemperatura : [0],
                borderColor: cor.linha,
                borderWidth: 2.5,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: cor.linha,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    titleFont: { size: 12, weight: 'bold' },
                    bodyFont: { size: 13 },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return ` Temp: ${context.parsed.y.toFixed(1)} °C`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: { display: false },
                    ticks: {
                        color: '#64748b',
                        font: { size: 10, weight: '500' }
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(226, 232, 240, 0.6)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: { size: 10 },
                        callback: function(val) {
                            return val + ' °C';
                        }
                    }
                }
            }
        }
    });
}

function renderizarTabelaLogs(registros) {
    const tbody = document.getElementById('table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    registros.forEach(r => {
        const dataFormatada = r.dataHora ? new Date(r.dataHora).toLocaleString('pt-BR') : '--';
        const idDev = r.dispositivo ? (r.dispositivo.idDispositivo || r.dispositivo.id) : r.dispositivoId;
        const nomeDev = r.dispositivo ? r.dispositivo.nomeDispositivo : (r.nomeDispositivo || 'DEV-' + idDev);

        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${dataFormatada}</td>
      <td><span class="device-badge">${nomeDev}</span></td>
      <td><strong>${r.temperatura != null ? r.temperatura + ' °C' : '--'}</strong></td>
      <td>${r.umidade != null ? r.umidade + ' %' : '--'}</td>
      <td>${r.pressao != null ? r.pressao + ' hPa' : '--'}</td>
      <td>${r.lux != null ? r.lux + ' lx' : '--'}</td>
      <td>${r.qualidadeArPercentual != null ? r.qualidadeArPercentual + ' %' : '--'}</td>
      <td>${r.wifiPercentual != null ? r.wifiPercentual + ' %' : '--'}</td>
    `;
        tbody.appendChild(row);
    });
}

function atualizarFiltroSelect(dispositivos) {
    const select = document.getElementById('deviceFilter') || document.getElementById('dispositivoSelect');
    if (!select || !dispositivos) return;

    if (select.children.length > 1) return;

    dispositivos.forEach(dev => {
        const idDev = dev.idDispositivo || dev.id;
        const opt = document.createElement('option');
        opt.value = idDev;
        opt.textContent = `${dev.nomeDispositivo} (ID: ${idDev})`;
        select.appendChild(opt);
    });
}