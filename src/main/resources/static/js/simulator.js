let intervalId = null;
let isRunning = false;

const API_REGISTROS_URL = 'http://localhost:8080/api/registros';

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        if (html.classList.contains('dark')) {
            themeIcon.className = 'fa-solid fa-sun';
            themeIcon.style.color = '#f59e0b';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeIcon.style.color = '';
        }
    });
}

function sortearMedia(minId, maxId) {
    const minVal = parseFloat(document.getElementById(minId)?.value);
    const maxVal = parseFloat(document.getElementById(maxId)?.value);

    if (!isNaN(minVal) && !isNaN(maxVal) && minVal <= maxVal) {
        // CORRIGIDO: Operador de subtração (-)
        const sorteado = Math.random() * (maxVal - minVal) + minVal;
        return parseFloat(sorteado.toFixed(1));
    } else if (!isNaN(minVal)) {
        return minVal;
    }
    return 0;
}

function obterEstadoAtuadores() {
    return {
        led1: document.getElementById('led1-toggle')?.checked || false,
        led2: document.getElementById('led2-toggle')?.checked || false,
        led3: document.getElementById('led3-toggle')?.checked || false,
        led4: document.getElementById('led4-toggle')?.checked || false
    };
}

function atualizarExibicaoLEDs(atuadores) {
    for (let i = 1; i <= 4; i++) {
        const isChecked = atuadores[`led${i}`];
        const pill = document.getElementById(`display-led${i}`);

        if (pill) {
            if (isChecked) {
                pill.textContent = `LED ${i}: ON`;
                pill.classList.add('on');
            } else {
                pill.textContent = `LED ${i}: OFF`;
                pill.classList.remove('on');
            }
        }
    }
}

function alternarSimulacao() {
    const btnToggle = document.getElementById('btn-toggle-sim');
    const statusBadge = document.getElementById('status-badge');

    if (!isRunning) {
        isRunning = true;
        if(btnToggle) {
            btnToggle.innerHTML = '<i class="fa-solid fa-pause"></i> Parar Simulação';
            btnToggle.className = 'btn-action btn-stop';
        }

        if(statusBadge) {
            statusBadge.textContent = 'ONLINE';
            statusBadge.className = 'status-tag online';
        }

        executarEnvio();

        const segundos = parseInt(document.getElementById('time-simulator')?.value) || 2;
        // CORRIGIDO: Multiplicação (*) por 1000
        intervalId = setInterval(executarEnvio, segundos * 1000);

    } else {
        pararSimulacao();
    }
}

function pararSimulacao() {
    isRunning = false;
    clearInterval(intervalId);

    const btnToggle = document.getElementById('btn-toggle-sim');
    const statusBadge = document.getElementById('status-badge');

    if(btnToggle) {
        btnToggle.innerHTML = '<i class="fa-solid fa-play"></i> Continuar Simulação';
        btnToggle.className = 'btn-action btn-start';
    }

    if(statusBadge) {
        statusBadge.textContent = 'OFFLINE';
        statusBadge.className = 'status-tag offline';
    }
}

async function executarEnvio() {
    const atuadores = obterEstadoAtuadores();
    const selectElem = document.getElementById('dispositivoSelect');
    const dispositivoSelecionado = parseInt(selectElem ? selectElem.value : 1) || 1;

    const dadosDTO = {
        dispositivo: {
            idDispositivo: dispositivoSelecionado,
            id: dispositivoSelecionado
        },
        dispositivoId: dispositivoSelecionado,
        idDispositivo: dispositivoSelecionado,
        temperatura: sortearMedia('temp-min', 'temp-max'),
        umidade: sortearMedia('umid-min', 'umid-max'),
        pressao: sortearMedia('pres-min', 'pres-max'),
        altitude: sortearMedia('alt-min', 'alt-max'),
        velocidadeVento: sortearMedia('vel-min', 'vel-max'),
        lux: sortearMedia('lum-min', 'lum-max'),
        luminosidade: sortearMedia('lum-min', 'lum-max'),
        dataHora: new Date().toISOString()
    };

    if(document.getElementById('val-temp')) document.getElementById('val-temp').textContent = `${dadosDTO.temperatura} °C`;
    if(document.getElementById('val-umid')) document.getElementById('val-umid').textContent = `${dadosDTO.umidade} %`;
    if(document.getElementById('val-pres')) document.getElementById('val-pres').textContent = `${dadosDTO.pressao} hPa`;
    if(document.getElementById('val-alt')) document.getElementById('val-alt').textContent = `${dadosDTO.altitude} m`;
    if(document.getElementById('val-vel')) document.getElementById('val-vel').textContent = `${dadosDTO.velocidadeVento} km/h`;
    if(document.getElementById('val-lum')) document.getElementById('val-lum').textContent = `${dadosDTO.lux} lx`;

    const elTimestamp = document.getElementById('timestamp-display');
    if (elTimestamp) {
        elTimestamp.textContent = new Date().toLocaleString('pt-BR');
    }

    atualizarExibicaoLEDs(atuadores);

    // 1. ENVIO DOS DADOS DE TELEMETRIA (REGISTROS)
    try {
        const response = await fetch(API_REGISTROS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosDTO)
        });

        const logStatus = document.getElementById('log-status');
        if (response.ok) {
            if (logStatus) {
                logStatus.textContent = `[HTTP 201] Telemetria enviada para DEV-00${dispositivoSelecionado}`;
            }
        } else {
            if (logStatus) {
                logStatus.textContent = `[Erro HTTP ${response.status}] Falha ao registrar telemetria.`;
            }
        }
    } catch (error) {
        console.error('Erro de conexão com o Spring Boot:', error);
        const logStatus = document.getElementById('log-status');
        if (logStatus) {
            logStatus.textContent = `[Erro de Rede] Não foi possível conectar a ${API_REGISTROS_URL}`;
        }
    }

    const listaAtuadores = [
        { nomeAtuador: 'LED 1', statusAtual: atuadores.led1, dispositivo: { idDispositivo: dispositivoSelecionado } },
        { nomeAtuador: 'LED 2', statusAtual: atuadores.led2, dispositivo: { idDispositivo: dispositivoSelecionado } },
        { nomeAtuador: 'LED 3', statusAtual: atuadores.led3, dispositivo: { idDispositivo: dispositivoSelecionado } },
        { nomeAtuador: 'LED 4', statusAtual: atuadores.led4, dispositivo: { idDispositivo: dispositivoSelecionado } }
    ];

    listaAtuadores.forEach(async (atuador) => {
        try {
            await fetch('http://localhost:8080/api/atuadores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(atuador)
            });
        } catch (err) {
            console.error('Erro ao enviar estado dos atuadores:', err);
        }
    });
}

document.querySelectorAll('.switch input').forEach(input => {
    input.addEventListener('change', () => {
        atualizarExibicaoLEDs(obterEstadoAtuadores());
    });
});

function resetarSimulacao() {
    pararSimulacao();

    const nameInput = document.getElementById('name-device-input');
    if(nameInput) nameInput.value = '';

    document.querySelectorAll('.parameters-input').forEach(input => input.value = '');
    document.querySelectorAll('.switch input').forEach(input => input.checked = false);

    if(document.getElementById('val-temp')) document.getElementById('val-temp').textContent = '-- °C';
    if(document.getElementById('val-umid')) document.getElementById('val-umid').textContent = '-- %';
    if(document.getElementById('val-pres')) document.getElementById('val-pres').textContent = '-- hPa';
    if(document.getElementById('val-alt')) document.getElementById('val-alt').textContent = '-- m';
    if(document.getElementById('val-vel')) document.getElementById('val-vel').textContent = '-- km/h';
    if(document.getElementById('val-lum')) document.getElementById('val-lum').textContent = '-- lux';
    if(document.getElementById('timestamp-display')) document.getElementById('timestamp-display').textContent = '--/--/---- --:--:--';

    atualizarExibicaoLEDs(obterEstadoAtuadores());
    const logStatus = document.getElementById('log-status');
    if (logStatus) {
        logStatus.textContent = 'Simulação e atuadores resetados.';
    }
}