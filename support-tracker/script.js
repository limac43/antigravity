// Constantes Globais
const STORAGE_KEY = 'supportTracker_azure_v1';
const THRESHOLD_30 = 30 * 60; // 30m em seg
const THRESHOLD_45 = 45 * 60; // 45m em seg
const MAX_BAR = 45 * 60;

// Estado
let timerInterval = null;
let elapsed = 0; // segundos
let isRunning = false;
let isStopped = false;

// Helpers
const $ = id => document.getElementById(id);
const formatTime = sec => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
};

// Navegação de Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        let targetBtn = e.target.closest('.tab-btn');
        if (!targetBtn || !targetBtn.dataset.target) return;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        targetBtn.classList.add('active');
        
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        $(targetBtn.dataset.target).classList.add('active');

        if (targetBtn.dataset.target === 'view-performance') renderPerformance();
        if (targetBtn.dataset.target === 'view-history') renderHistory();
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderPerformance();
    bindTimer();
    bindForm();
    bindLogAnalyzer();
});

// ==========================================
// TRACKER: TIMER LOGIC
// ==========================================
function bindTimer() {
    $('btn-play').addEventListener('click', startTimer);
    $('btn-pause').addEventListener('click', pauseTimer);
    $('btn-stop').addEventListener('click', stopTimer);
    $('btn-reset').addEventListener('click', resetTimer);
}

function startTimer() {
    if (isRunning || isStopped) return;
    isRunning = true;
    $('btn-play').disabled = true;
    $('btn-pause').disabled = false;
    $('btn-stop').disabled = false;
    $('btn-reset').disabled = true;

    timerInterval = setInterval(() => {
        elapsed++;
        updateTimerUI();
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
    $('btn-play').disabled = false;
    $('btn-pause').disabled = true;
}

function stopTimer() {
    if (isStopped) return;
    isRunning = false;
    isStopped = true;
    clearInterval(timerInterval);
    
    $('btn-play').disabled = true;
    $('btn-pause').disabled = true;
    $('btn-stop').disabled = true;
    $('btn-reset').disabled = false;

    // Destravar form
    $('form-overlay').classList.add('hidden');
    $('ticket-form').classList.remove('locked-form');
    
    if (elapsed >= THRESHOLD_30) {
        $('gap-block').classList.remove('hidden');
        $('delay-reason').required = true;
        $('knowledge-deficit').required = true;
    }
}

function resetTimer() {
    elapsed = 0;
    isRunning = false;
    isStopped = false;
    clearInterval(timerInterval);

    $('btn-play').disabled = false;
    $('btn-pause').disabled = true;
    $('btn-stop').disabled = true;
    $('btn-reset').disabled = true;
    
    $('timer-display').textContent = '00:00:00';
    $('timer-status').className = 'timer-status badge badge-green';
    $('timer-status').textContent = 'Dentro do SLA';
    $('sla-fill').style.width = '0%';
    $('sla-fill').style.backgroundColor = 'var(--success)';
    
    $('alert-30m').classList.add('hidden');
    $('alert-45m').classList.add('hidden');
    
    $('ticket-form').reset();
    $('form-overlay').classList.remove('hidden');
    $('ticket-form').classList.add('locked-form');
    $('gap-block').classList.add('hidden');
    
    document.querySelectorAll('.diff-selector button').forEach(b => b.classList.remove('selected'));
    $('difficulty').value = '';
}

function updateTimerUI() {
    $('timer-display').textContent = formatTime(elapsed);
    
    const pct = Math.min((elapsed / MAX_BAR) * 100, 100);
    $('sla-fill').style.width = `${pct}%`;

    if (elapsed >= THRESHOLD_45) {
        $('timer-status').className = 'timer-status badge badge-red';
        $('timer-status').textContent = 'Crítico (>45m)';
        $('sla-fill').style.backgroundColor = 'var(--danger)';
        $('alert-30m').classList.add('hidden');
        $('alert-45m').classList.remove('hidden');
    } else if (elapsed >= THRESHOLD_30) {
        $('timer-status').className = 'timer-status badge badge-yellow';
        $('timer-status').textContent = 'Alerta (>30m)';
        $('sla-fill').style.backgroundColor = 'var(--warning)';
        $('alert-30m').classList.remove('hidden');
    }
}

// ==========================================
// TRACKER: FORM LOGIC
// ==========================================
function bindForm() {
    document.querySelectorAll('.diff-selector button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.diff-selector button').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            $('difficulty').value = e.target.dataset.val;
        });
    });

    $('ticket-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (elapsed >= THRESHOLD_30 && !$('check-group').checked) {
            showToast('Marque o checkbox de escalonamento para o grupo (N1).', 'warning'); return;
        }
        if (elapsed >= THRESHOLD_45 && !$('check-leader').checked) {
            showToast('Marque o checkbox de escalonamento para a liderança.', 'warning'); return;
        }
        if (!$('difficulty').value) {
            showToast('Selecione o nível de dificuldade.', 'warning'); return;
        }

        const data = {
            id: Date.now(),
            date: new Date().toISOString(),
            ticketId: $('ticket-id').value,
            client: $('client').value,
            module: $('module').value,
            type: $('ticket-type').value,
            difficulty: parseInt($('difficulty').value),
            resolution: $('resolution').value,
            timeSeconds: elapsed,
            gapReason: $('delay-reason').value || null,
            deficit: $('knowledge-deficit').value || null
        };

        const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        records.push(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        
        showToast('Ticket registrado com sucesso!', 'success');
        resetTimer();
        renderPerformance();
    });
}

// ==========================================
// PERFORMANCE (AUTOANÁLISE)
// ==========================================
function renderPerformance() {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    if (records.length === 0) {
        $('last-ticket-panel').innerHTML = '<div class="empty-state">Nenhum chamado registrado na sessão atual. Volte aqui após concluir o primeiro ticket.</div>';
        return; 
    }

    const total = records.length;
    $('kpi-total').textContent = total;
    
    const avgSec = records.reduce((acc, r) => acc + r.timeSeconds, 0) / total;
    $('kpi-tma').textContent = Math.round(avgSec / 60) + 'm';
    
    const critical = records.filter(r => r.timeSeconds >= THRESHOLD_30).length;
    $('kpi-critical').textContent = critical;

    const resolved = records.filter(r => r.resolution === 'Resolvido').length;
    $('kpi-resolution-rate').textContent = Math.round((resolved / total) * 100) + '%';

    const avgDiff = records.reduce((acc, r) => acc + r.difficulty, 0) / total;
    $('kpi-avg-diff').textContent = avgDiff.toFixed(1) + '/5';

    const escalated = records.filter(r => r.timeSeconds >= THRESHOLD_30).length;
    $('kpi-escalation-rate').textContent = Math.round((escalated / total) * 100) + '%';

    const modCount = {}, reasonCount = {};
    let hasGaps = false;
    records.forEach(r => {
        if (r.gapReason) {
            hasGaps = true;
            modCount[r.module] = (modCount[r.module] || 0) + 1;
            reasonCount[r.gapReason] = (reasonCount[r.gapReason] || 0) + 1;
        }
    });

    if (hasGaps) {
        $('kpi-worst-module').textContent = Object.keys(modCount).sort((a,b) => modCount[b] - modCount[a])[0];
        $('kpi-worst-reason').textContent = Object.keys(reasonCount).sort((a,b) => reasonCount[b] - reasonCount[a])[0];
    } else {
        $('kpi-worst-module').textContent = 'Nenhum';
        $('kpi-worst-reason').textContent = 'Nenhum';
    }

    renderLastTicket(records[records.length - 1], avgSec, avgDiff);
    renderChartTime(records);
    renderChartGaps(records);
}

function renderLastTicket(last, avgSec, avgDiff) {
    const panel = $('last-ticket-panel');
    const timeMin = Math.round(last.timeSeconds / 60);
    const avgMin = Math.round(avgSec / 60);
    
    let timeClass = 'neutral';
    let timeText = `Na média global (${avgMin}m)`;
    if (timeMin < avgMin - 2) { timeClass = 'good'; timeText = `${avgMin - timeMin}m abaixo da sua média!`; }
    else if (timeMin > avgMin + 2) { timeClass = 'bad'; timeText = `${timeMin - avgMin}m acima da sua média.`; }

    let diffClass = 'neutral';
    let diffText = `Próximo à sua média (${avgDiff.toFixed(1)})`;
    if (last.difficulty < avgDiff) { diffClass = 'good'; diffText = `Mais fácil que a média.`; }
    else if (last.difficulty > avgDiff) { diffClass = 'bad'; diffText = `Mais difícil que a média.`; }

    let gapHtml = '';
    if (last.gapReason) {
        gapHtml = `
        <div class="feedback-card bad">
            <h4>Ponto de Atenção (Gap)</h4>
            <span class="main-val">${last.gapReason}</span>
            <span class="compare-text">Módulo: ${last.module} | Treine este fluxo!</span>
        </div>`;
    } else {
        gapHtml = `
        <div class="feedback-card good">
            <h4>Análise de Conhecimento</h4>
            <span class="main-val">Sem Gaps</span>
            <span class="compare-text">Atendimento fluido, bom trabalho.</span>
        </div>`;
    }

    panel.innerHTML = `
        <div class="feedback-card ${timeClass}">
            <h4>Tempo do Último Ticket</h4>
            <span class="main-val">${timeMin}m</span>
            <span class="compare-text">${timeText}</span>
        </div>
        <div class="feedback-card ${diffClass}">
            <h4>Dificuldade Percebida</h4>
            <span class="main-val">${last.difficulty}/5</span>
            <span class="compare-text">${diffText}</span>
        </div>
        ${gapHtml}
    `;
}

function renderChartTime(records) {
    const chart = $('chart-time');
    chart.innerHTML = '';
    const buckets = { '< 10m': 0, '10-30m': 0, '30-45m': 0, '> 45m': 0 };
    records.forEach(r => {
        const m = r.timeSeconds / 60;
        if (m < 10) buckets['< 10m']++;
        else if (m < 30) buckets['10-30m']++;
        else if (m < 45) buckets['30-45m']++;
        else buckets['> 45m']++;
    });

    const max = Math.max(...Object.values(buckets), 1);
    const colors = ['green', 'blue', 'yellow', 'red'];
    
    Object.entries(buckets).forEach(([label, count], i) => {
        const pct = (count / max) * 100;
        chart.innerHTML += `
            <div class="css-bar-row">
                <span class="css-bar-label">${label}</span>
                <div class="css-bar-track">
                    <div class="css-bar-fill ${colors[i]}" style="width: ${pct}%">${count > 0 ? count : ''}</div>
                </div>
            </div>
        `;
    });
}

function renderChartGaps(records) {
    const chart = $('chart-gaps');
    chart.innerHTML = '';
    const counts = {};
    records.forEach(r => counts[r.module] = (counts[r.module] || 0) + 1);
    if (Object.keys(counts).length === 0) {
        chart.innerHTML = '<div class="empty-state">Sem dados suficientes.</div>';
        return;
    }
    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    const max = sorted[0][1];
    sorted.forEach(([label, count]) => {
        const pct = (count / max) * 100;
        chart.innerHTML += `
            <div class="css-bar-row">
                <span class="css-bar-label" title="${label}">${label}</span>
                <div class="css-bar-track">
                    <div class="css-bar-fill purple" style="width: ${pct}%">${count}</div>
                </div>
            </div>
        `;
    });
}

// ==========================================
// HISTORY
// ==========================================
function renderHistory(filter = '') {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const tbody = $('history-body');
    tbody.innerHTML = '';

    const filtered = records.filter(r => r.ticketId.includes(filter));
    if (filtered.length === 0) {
        $('empty-history').classList.remove('hidden');
        return;
    }
    $('empty-history').classList.add('hidden');

    filtered.sort((a,b) => b.id - a.id).forEach(r => {
        const d = new Date(r.date);
        const timeStr = `${d.toLocaleDateString()} ${d.toLocaleTimeString().slice(0,5)}`;
        
        let typeBadge = 'bg-gray';
        if (r.type === 'Bug') typeBadge = 'bg-red';
        if (r.type === 'Duvida') typeBadge = 'bg-blue';
        if (r.type === 'Config') typeBadge = 'bg-yellow';

        let resBadge = 'bg-gray';
        if (r.resolution === 'Resolvido') resBadge = 'bg-green';
        if (r.resolution === 'Escalado') resBadge = 'bg-yellow';

        tbody.innerHTML += `
            <tr>
                <td>${timeStr}</td>
                <td><strong>#${r.ticketId}</strong></td>
                <td>${r.module}</td>
                <td><span class="badge-table ${typeBadge}">${r.type}</span></td>
                <td>${r.difficulty}/5</td>
                <td style="font-family: var(--font-mono)">${formatTime(r.timeSeconds)}</td>
                <td><span class="badge-table ${resBadge}">${r.resolution}</span></td>
                <td>${r.gapReason ? `<span class="badge-table bg-yellow">Sim</span>` : `<span class="badge-table bg-gray">Não</span>`}</td>
            </tr>
        `;
    });
}

$('history-filter').addEventListener('input', (e) => {
    renderHistory(e.target.value);
});

$('btn-clear-history').addEventListener('click', () => {
    if(confirm('Limpar todo o histórico de autoanálise?')) {
        localStorage.removeItem(STORAGE_KEY);
        renderHistory();
        renderPerformance();
        showToast('Histórico limpo.', 'info');
    }
});

// ==========================================
// LOG ANALYZER (OCR + PARSER)
// ==========================================
let imageFile = null;
let parsedLogs = [];

function bindLogAnalyzer() {
    const dropZone = $('drop-zone');
    const imgInput = $('image-input');

    // Botões
    $('btn-parse-text').addEventListener('click', parseTextLogs);
    $('btn-scan-image').addEventListener('click', triggerImageProcess);

    // Filtros
    $('btn-filter-all').addEventListener('click', () => filterLogs('all'));
    $('btn-filter-warning').addEventListener('click', () => filterLogs('warning'));

    // Arrastar e soltar
    dropZone.addEventListener('click', () => imgInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleImageSelect(e.dataTransfer.files[0]);
        }
    });

    imgInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleImageSelect(e.target.files[0]);
        }
    });

    // Colar Imagem (Ctrl+V)
    document.addEventListener('paste', (e) => {
        // Só tenta ler imagem se estiver na aba do Log Analyzer
        if (!$('view-logs').classList.contains('active')) return;
        
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                handleImageSelect(file);
                triggerImageProcess();
            }
        }
    });
}

function handleImageSelect(file) {
    imageFile = file;
    $('upload-icon').className = "ri-image-fill";
    $('upload-icon').style.color = "var(--azure-blue)";
    $('upload-text').innerText = `Imagem carregada: ${(file.size/1024).toFixed(1)} KB`;
}

async function triggerImageProcess() {
    if (!imageFile) {
        showToast("Por favor, selecione ou arraste uma imagem (ou dê Ctrl+V).", "error");
        return;
    }

    const statusDiv = $('ocr-status');
    const phaseSpan = $('ocr-phase');
    const percentSpan = $('ocr-percent');
    const barDiv = $('ocr-bar');

    statusDiv.classList.remove('hidden');
    phaseSpan.innerText = "Carregando motor OCR...";
    percentSpan.innerText = "0%";
    barDiv.style.width = "0%";

    try {
        const worker = await Tesseract.createWorker('por+eng');
        
        worker.logger = (m) => {
            if (m.status === 'recognizing text') {
                phaseSpan.innerText = "Lendo texto da imagem...";
                const progress = Math.round(m.progress * 100);
                percentSpan.innerText = `${progress}%`;
                barDiv.style.width = `${progress}%`;
            }
        };

        const ret = await worker.recognize(imageFile);
        await worker.terminate();

        $('raw-logs').value = ret.data.text;
        statusDiv.classList.add('hidden');
        showToast("Texto extraído da imagem! Processando fluxo...", "success");
        parseTextLogs();

    } catch (err) {
        console.error(err);
        showToast("Erro ao processar imagem: " + err.message, "error");
        statusDiv.classList.add('hidden');
    }
}

function parseTextLogs() {
    const rawText = $('raw-logs').value;
    if (!rawText.trim()) {
        showToast("Sem dados para processar.", "warning");
        return;
    }

    const lines = rawText.split('\n');
    parsedLogs = [];

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Extrai ID numérico no começo (5 a 15 dígitos)
        const idMatch = trimmed.match(/^(\d{5,15})/);
        const id = idMatch ? idMatch[1] : '';
        
        // Tenta pegar timestamp (13/07/2026 22:32:36:192)
        const dateMatches = trimmed.match(/(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}[:\.]\d{3})/g);
        
        let timeDisp = '';
        if (dateMatches) {
            timeDisp = dateMatches[0];
        }

        // Limpa mensagem
        let msg = trimmed;
        if (id) msg = msg.replace(id, '');
        if (dateMatches) {
            dateMatches.forEach(d => { msg = msg.replace(d, ''); });
        }
        msg = msg.replace(/^[^a-zA-Zá-úÁ-Ú]+/, '').replace(/[^a-zA-Zá-úÁ-Ú0-9!\.\s\-\/:]+$/, '').trim();

        // Determina tipo (warning/danger/info/success)
        let type = 'success';
        const lowerMsg = msg.toLowerCase();
        
        if (lowerMsg.includes('expirou') || lowerMsg.includes('alerta') || lowerMsg.includes('warning') || lowerMsg.includes('não') || lowerMsg.includes('sem utilizar')) {
            type = 'warning';
        } else if (lowerMsg.includes('erro') || lowerMsg.includes('falhou') || lowerMsg.includes('error') || lowerMsg.includes('fail') || lowerMsg.includes('crítico')) {
            type = 'danger';
        } else if (lowerMsg.includes('iniciando') || lowerMsg.includes('executando') || lowerMsg.includes('buscando')) {
            type = 'info';
        }

        if (msg.length > 3) {
            parsedLogs.push({ id, message: msg, timeDisp, type });
        }
    });

    if (parsedLogs.length === 0) {
        showToast("Não conseguimos processar o formato deste log.", "error");
        return;
    }

    renderLogDashboardAndTimeline();
}

function calculateDelta(time1Str, time2Str) {
    if (!time1Str || !time2Str) return 0;
    try {
        const parseTime = (str) => {
            const parts = str.split(' ');
            const dateParts = parts[0].split('/');
            const timeWithMs = parts[1].split(/[:\.]/);
            return new Date(
                dateParts[2], dateParts[1] - 1, dateParts[0],
                timeWithMs[0], timeWithMs[1], timeWithMs[2], timeWithMs[3] || 0
            ).getTime();
        };
        return parseTime(time2Str) - parseTime(time1Str);
    } catch (e) {
        return 0;
    }
}

function formatDelta(ms) {
    if (ms < 0) return '';
    if (ms < 1000) return `+${ms}ms`;
    return `+${(ms/1000).toFixed(2)}s`;
}

function renderLogDashboardAndTimeline() {
    const container = $('timeline-container');
    container.innerHTML = '';

    let warnings = 0;
    let errors = 0;

    parsedLogs.forEach((log, index) => {
        let deltaStr = '';
        if (index > 0) {
            const deltaMs = calculateDelta(parsedLogs[index - 1].timeDisp, log.timeDisp);
            deltaStr = formatDelta(deltaMs);
        }

        if (log.type === 'warning') warnings++;
        if (log.type === 'danger') errors++;

        // Azure Theme Mappings for Timeline
        let iconClass = 'ri-check-line';
        let circleClass = 'success';
        let cardClass = '';
        let badgeStyle = 'color: var(--success); border-color: var(--success)';
        
        if (log.type === 'warning') {
            iconClass = 'ri-error-warning-fill';
            circleClass = 'warning';
            cardClass = 'warning';
            badgeStyle = 'color: var(--warning); border-color: var(--warning)';
        } else if (log.type === 'danger') {
            iconClass = 'ri-close-circle-fill';
            circleClass = 'danger';
            cardClass = 'danger';
            badgeStyle = 'color: var(--danger); border-color: var(--danger)';
        } else if (log.type === 'info') {
            iconClass = 'ri-loader-4-line ri-spin';
            circleClass = 'info';
            badgeStyle = 'color: var(--azure-blue); border-color: var(--azure-blue)';
        }

        const timeOnly = log.timeDisp ? log.timeDisp.split(' ')[1] : '';

        const itemHtml = `
            <div class="timeline-item" data-type="${log.type}">
                <div class="timeline-icon ${circleClass}">
                    <i class="${iconClass}"></i>
                </div>
                
                <div class="timeline-card ${cardClass}">
                    <div>
                        <div style="display:flex; align-items:center; gap: 8px;">
                            <span class="id-text">#${log.id}</span>
                            ${deltaStr ? `<span class="delta-badge">${deltaStr}</span>` : ''}
                        </div>
                        <h4>${log.message}</h4>
                    </div>
                    
                    <div style="text-align: right">
                        <span class="time-text"><i class="ri-time-line"></i> ${timeOnly}</span>
                        <span class="status-badge" style="${badgeStyle}">${log.type}</span>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHtml);
    });

    $('log-stat-total').innerText = parsedLogs.length;
    $('log-stat-warnings').innerText = warnings;
    $('log-stat-errors').innerText = errors;

    if (parsedLogs.length > 1) {
        const totalMs = calculateDelta(parsedLogs[0].timeDisp, parsedLogs[parsedLogs.length - 1].timeDisp);
        $('log-stat-time').innerText = formatDelta(totalMs).replace('+', '');
    } else {
        $('log-stat-time').innerText = "0s";
    }

    $('log-dashboard').classList.remove('hidden');
    $('log-output').classList.remove('hidden');
}

function filterLogs(type) {
    const items = document.querySelectorAll('.timeline-item');
    $('btn-filter-all').classList.remove('active');
    $('btn-filter-warning').classList.remove('active');
    
    if (type === 'all') {
        $('btn-filter-all').classList.add('active');
        items.forEach(item => item.classList.remove('hidden'));
    } else if (type === 'warning') {
        $('btn-filter-warning').classList.add('active');
        items.forEach(item => {
            const t = item.getAttribute('data-type');
            if (t === 'warning' || t === 'danger') {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }
}

// UTILS
function showToast(msg, type='info') {
    const icons = { success: 'ri-check-line', error: 'ri-close-line', warning: 'ri-error-warning-line', info: 'ri-information-line' };
    const div = document.createElement('div');
    div.className = `toast ${type}`;
    div.innerHTML = `<i class="${icons[type]}"></i> <span>${msg}</span>`;
    $('toast-container').appendChild(div);
    setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 300); }, 3000);
}
