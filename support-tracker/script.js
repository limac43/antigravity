/* ============================================================
   SUPPORT TRACKER — SCRIPT v2.0
   Smart Timer, localStorage persistence, history, dashboard,
   toast notifications, sound alerts, CSV export.
   ============================================================ */

// ── Constants ──
const STORAGE_KEY = 'supportTracker_records';
const ANALYST_KEY = 'supportTracker_analyst';
const THRESHOLD_30 = 30 * 60; // 30 minutes in seconds
const THRESHOLD_45 = 45 * 60; // 45 minutes in seconds
const MAX_SLA_SECONDS = 45 * 60; // Bar fills over 45 min
const RING_CIRCUMFERENCE = 2 * Math.PI * 100; // ≈628.318

// ── DOM Cache ──
const $ = (id) => document.getElementById(id);

const dom = {
    // Timer
    timerDisplay: $('timer-display'),
    timerPhase:   $('timer-phase'),
    timerStatus:  $('timer-status'),
    ringProgress: $('ring-progress'),
    slaFill:      $('sla-fill'),
    btnPlay:      $('btn-play'),
    btnPause:     $('btn-pause'),
    btnStop:      $('btn-stop'),
    btnReset:     $('btn-reset'),
    alert30m:     $('alert-30m'),
    alert45m:     $('alert-45m'),
    checkGroup:   $('check-group'),
    checkLeader:  $('check-leader'),

    // Form
    formPanel:      $('form-panel'),
    formOverlay:    $('form-lock-overlay'),
    ticketForm:     $('ticket-form'),
    gapBlock:       $('gap-block'),
    delayReason:    $('delay-reason'),
    knowledgeDeficit: $('knowledge-deficit'),
    btnSubmit:      $('btn-submit'),
    diffSelector:   $('difficulty-selector'),
    diffInput:      $('difficulty'),

    // Stats
    statToday:     $('stat-today'),
    statAvgTime:   $('stat-avg-time'),
    statEscalated: $('stat-escalated'),
    statCritical:  $('stat-critical'),

    // Nav
    navTracker:   $('nav-tracker'),
    navHistory:   $('nav-history'),
    navDashboard: $('nav-dashboard'),
    pageTitle:    $('page-title'),
    pageSubtitle: $('page-subtitle'),

    // Views
    viewTracker:   $('view-tracker'),
    viewHistory:   $('view-history'),
    viewDashboard: $('view-dashboard'),

    // History
    historyBody:  $('history-body'),
    emptyHistory: $('empty-history'),
    btnExportCSV: $('btn-export-csv'),
    btnClearHistory: $('btn-clear-history'),

    // Dashboard
    chartGaps:    $('chart-gaps'),
    chartTime:    $('chart-time'),
    chartModules: $('chart-modules'),
    summaryStats: $('summary-stats'),
    emptyGaps:    $('empty-gaps'),
    emptyTime:    $('empty-time'),
    emptyModules: $('empty-modules'),
    emptySummary: $('empty-summary'),

    // Top bar
    btnSoundToggle: $('btn-sound-toggle'),
    btnFullscreen:  $('btn-fullscreen'),
    hamburger:      $('hamburger'),
    sidebar:        $('sidebar'),

    // Modal
    modalAnalyst:     $('modal-analyst'),
    analystNameInput: $('analyst-name-input'),
    btnSaveName:      $('btn-save-name'),
    analystAvatar:    $('analyst-avatar'),
    analystNameDisplay: $('analyst-name-display'),

    // Toast
    toastContainer: $('toast-container'),
};

// ── State ──
let timerInterval = null;
let elapsed = 0;
let isRunning = false;
let isStopped = false;
let soundEnabled = true;
let alertTriggered30 = false;
let alertTriggered45 = false;
let analystName = '';

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initAnalyst();
    updateStats();
    bindEvents();
});

function initAnalyst() {
    analystName = localStorage.getItem(ANALYST_KEY) || '';
    if (!analystName) {
        dom.modalAnalyst.classList.remove('hidden');
    } else {
        applyAnalystName(analystName);
    }
}

function applyAnalystName(name) {
    analystName = name;
    dom.analystAvatar.textContent = name.charAt(0).toUpperCase();
    dom.analystNameDisplay.textContent = name;
}

// ============================================================
//  EVENT BINDINGS
// ============================================================
function bindEvents() {
    // Analyst modal
    dom.btnSaveName.addEventListener('click', () => {
        const name = dom.analystNameInput.value.trim();
        if (!name) { toast('Insira seu nome para continuar.', 'warning'); return; }
        localStorage.setItem(ANALYST_KEY, name);
        applyAnalystName(name);
        dom.modalAnalyst.classList.add('hidden');
        toast(`Bem-vindo(a), ${name}! 🚀`, 'success');
    });
    dom.analystNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') dom.btnSaveName.click();
    });

    // Timer
    dom.btnPlay.addEventListener('click', startTimer);
    dom.btnPause.addEventListener('click', pauseTimer);
    dom.btnStop.addEventListener('click', stopTimer);
    dom.btnReset.addEventListener('click', resetTimer);

    // Difficulty selector
    dom.diffSelector.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            dom.diffSelector.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            dom.diffInput.value = btn.dataset.val;
        });
    });

    // Form submit
    dom.ticketForm.addEventListener('submit', handleSubmit);

    // Navigation
    dom.navTracker.addEventListener('click',   () => switchView('tracker'));
    dom.navHistory.addEventListener('click',    () => switchView('history'));
    dom.navDashboard.addEventListener('click',  () => switchView('dashboard'));

    // History actions
    dom.btnExportCSV.addEventListener('click', exportCSV);
    dom.btnClearHistory.addEventListener('click', clearHistory);

    // Top bar
    dom.btnSoundToggle.addEventListener('click', toggleSound);
    dom.btnFullscreen.addEventListener('click', toggleFullscreen);
    dom.hamburger.addEventListener('click', () => {
        dom.sidebar.classList.toggle('mobile-open');
    });
}

// ============================================================
//  NAVIGATION
// ============================================================
function switchView(view) {
    const views = { tracker: dom.viewTracker, history: dom.viewHistory, dashboard: dom.viewDashboard };
    const titles = {
        tracker:   ['Tracker de Análise', 'Gerencie o tempo e registre os dados do chamado.'],
        history:   ['Histórico', 'Visualize todos os registros anteriores.'],
        dashboard: ['Dashboard', 'Análise dos gaps de conhecimento e métricas.']
    };

    Object.values(views).forEach(v => v.classList.remove('active'));
    views[view].classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    dom.pageTitle.textContent = titles[view][0];
    dom.pageSubtitle.textContent = titles[view][1];

    if (view === 'history') renderHistory();
    if (view === 'dashboard') renderDashboard();
}

// ============================================================
//  TIMER LOGIC
// ============================================================
function startTimer() {
    if (isRunning || isStopped) return;
    isRunning = true;
    dom.btnPlay.disabled = true;
    dom.btnPause.disabled = false;
    dom.btnStop.disabled = false;
    dom.btnReset.disabled = true;

    updateTimerUI();

    timerInterval = setInterval(() => {
        elapsed++;
        updateTimerUI();
        checkSLA();
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
    dom.btnPlay.disabled = false;
    dom.btnPause.disabled = true;
    dom.timerPhase.textContent = 'Pausado';
}

function stopTimer() {
    if (isStopped) return;
    isRunning = false;
    isStopped = true;
    clearInterval(timerInterval);

    dom.btnPlay.disabled = true;
    dom.btnPause.disabled = true;
    dom.btnStop.disabled = true;
    dom.btnReset.disabled = false;

    dom.timerPhase.textContent = 'Finalizado — preencha o registro';
    unlockForm();
    toast('Cronômetro finalizado. Preencha o registro do chamado.', 'info');
}

function resetTimer() {
    elapsed = 0;
    isRunning = false;
    isStopped = false;
    alertTriggered30 = false;
    alertTriggered45 = false;

    clearInterval(timerInterval);

    dom.btnPlay.disabled = false;
    dom.btnPause.disabled = true;
    dom.btnStop.disabled = true;
    dom.btnReset.disabled = true;

    dom.timerDisplay.textContent = '00:00';
    dom.timerPhase.textContent = 'Pronto para iniciar';
    dom.timerStatus.className = 'status-pill status-idle';
    dom.timerStatus.innerHTML = '<span class="pill-dot"></span>Aguardando';

    dom.ringProgress.style.strokeDashoffset = RING_CIRCUMFERENCE;
    dom.ringProgress.style.stroke = 'var(--green)';
    dom.ringProgress.style.filter = 'drop-shadow(0 0 6px var(--green))';
    dom.slaFill.style.width = '0%';

    dom.alert30m.classList.add('hidden');
    dom.alert45m.classList.add('hidden');
    dom.checkGroup.checked = false;
    dom.checkLeader.checked = false;

    lockForm();
    dom.ticketForm.reset();
    dom.diffSelector.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
    dom.gapBlock.classList.add('hidden');
}

function updateTimerUI() {
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    dom.timerDisplay.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;

    // Ring progress — fills over 45 min
    const pct = Math.min(elapsed / MAX_SLA_SECONDS, 1);
    const offset = RING_CIRCUMFERENCE * (1 - pct);
    dom.ringProgress.style.strokeDashoffset = offset;

    // SLA bar
    dom.slaFill.style.width = `${pct * 100}%`;

    // Color transitions
    if (elapsed >= THRESHOLD_45) {
        setTimerColor('red');
        dom.timerPhase.textContent = 'Acione o LÍDER';
        dom.timerStatus.className = 'status-pill status-red';
        dom.timerStatus.innerHTML = '<span class="pill-dot"></span>Tempo Crítico';
    } else if (elapsed >= THRESHOLD_30) {
        setTimerColor('yellow');
        dom.timerPhase.textContent = 'Acione o GRUPO';
        dom.timerStatus.className = 'status-pill status-yellow';
        dom.timerStatus.innerHTML = '<span class="pill-dot"></span>Tempo Limite';
    } else {
        setTimerColor('green');
        dom.timerPhase.textContent = 'Análise individual';
        dom.timerStatus.className = 'status-pill status-green';
        dom.timerStatus.innerHTML = '<span class="pill-dot"></span>Dentro do SLA';
    }
}

function setTimerColor(color) {
    const colors = {
        green:  { stroke: 'var(--green)',  shadow: 'var(--green)',  text: 'var(--green)' },
        yellow: { stroke: 'var(--yellow)', shadow: 'var(--yellow)', text: 'var(--yellow)' },
        red:    { stroke: 'var(--red)',    shadow: 'var(--red)',    text: 'var(--red)' }
    };
    const c = colors[color];
    dom.ringProgress.style.stroke = c.stroke;
    dom.ringProgress.style.filter = `drop-shadow(0 0 8px ${c.shadow})`;
    dom.timerDisplay.style.color = c.text;
}

function checkSLA() {
    if (elapsed === THRESHOLD_30 && !alertTriggered30) {
        alertTriggered30 = true;
        dom.alert30m.classList.remove('hidden');
        playAlertSound();
        toast('⚠️ 30 minutos atingidos! Acione o grupo de suporte.', 'warning');
    }
    if (elapsed === THRESHOLD_45 && !alertTriggered45) {
        alertTriggered45 = true;
        dom.alert30m.classList.add('hidden');
        dom.alert45m.classList.remove('hidden');
        playAlertSound();
        toast('🚨 45 minutos atingidos! Acione o líder direto AGORA.', 'error');
    }
}

// ============================================================
//  FORM LOGIC
// ============================================================
function unlockForm() {
    dom.ticketForm.classList.remove('locked');
    dom.ticketForm.classList.add('unlocked');
    dom.formOverlay.classList.add('unlocked');

    // Show gap block if past 30 min
    if (elapsed >= THRESHOLD_30) {
        dom.gapBlock.classList.remove('hidden');
        dom.delayReason.required = true;
        dom.knowledgeDeficit.required = true;
    } else {
        dom.gapBlock.classList.add('hidden');
        dom.delayReason.required = false;
        dom.knowledgeDeficit.required = false;
    }

    // Scroll to form on mobile
    dom.formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function lockForm() {
    dom.ticketForm.classList.add('locked');
    dom.ticketForm.classList.remove('unlocked');
    dom.formOverlay.classList.remove('unlocked');
}

function handleSubmit(e) {
    e.preventDefault();

    // Validations
    if (!dom.diffInput.value) {
        toast('Selecione o nível de dificuldade.', 'warning');
        return;
    }

    if (elapsed >= THRESHOLD_30 && !dom.checkGroup.checked) {
        toast('Confirme que acionou o grupo de suporte antes de salvar.', 'warning');
        return;
    }
    if (elapsed >= THRESHOLD_45 && !dom.checkLeader.checked) {
        toast('Confirme que acionou o líder direto antes de salvar.', 'warning');
        return;
    }

    if (elapsed >= THRESHOLD_30) {
        if (!dom.delayReason.value) { toast('Selecione o motivo do atraso.', 'warning'); return; }
        if (!dom.knowledgeDeficit.value.trim()) { toast('Descreva o déficit de conhecimento.', 'warning'); return; }
    }

    // Build record
    const record = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        analyst: analystName,
        ticketId: $('ticket-id').value.trim(),
        client: $('client').value.trim(),
        module: $('module').value,
        type: $('ticket-type').value,
        priority: $('priority').value,
        difficulty: parseInt(dom.diffInput.value),
        resolution: $('resolution').value,
        notes: $('notes').value.trim(),
        timeSeconds: elapsed,
        formattedTime: dom.timerDisplay.textContent,
        escalatedGroup: elapsed >= THRESHOLD_30,
        escalatedLeader: elapsed >= THRESHOLD_45,
        gapReason: dom.delayReason.value || null,
        knowledgeDeficit: dom.knowledgeDeficit.value.trim() || null
    };

    saveRecord(record);
    updateStats();
    toast('✅ Registro salvo com sucesso!', 'success');
    
    // Animate submit button
    dom.btnSubmit.innerHTML = '<i class="ri-check-double-line"></i> Salvo!';
    dom.btnSubmit.style.pointerEvents = 'none';
}

// ============================================================
//  STORAGE
// ============================================================
function getRecords() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
}

function saveRecord(record) {
    const records = getRecords();
    records.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function clearHistory() {
    if (!confirm('Tem certeza que deseja limpar todo o histórico?')) return;
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
    updateStats();
    toast('Histórico limpo.', 'info');
}

// ============================================================
//  STATS (Top Cards)
// ============================================================
function updateStats() {
    const records = getRecords();
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.timestamp.startsWith(today));

    dom.statToday.textContent = todayRecords.length;

    if (todayRecords.length > 0) {
        const avgSec = Math.round(todayRecords.reduce((sum, r) => sum + r.timeSeconds, 0) / todayRecords.length);
        const m = Math.floor(avgSec / 60);
        const s = avgSec % 60;
        dom.statAvgTime.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    } else {
        dom.statAvgTime.textContent = '00:00';
    }

    dom.statEscalated.textContent = todayRecords.filter(r => r.escalatedGroup).length;
    dom.statCritical.textContent = todayRecords.filter(r => r.escalatedLeader).length;
}

// ============================================================
//  HISTORY VIEW
// ============================================================
function renderHistory() {
    const records = getRecords();
    dom.historyBody.innerHTML = '';

    if (records.length === 0) {
        dom.emptyHistory.classList.remove('hidden');
        return;
    }
    dom.emptyHistory.classList.add('hidden');

    records.forEach(r => {
        const tr = document.createElement('tr');
        const date = new Date(r.timestamp);
        const dateStr = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const typeBadge = getTypeBadge(r.type);
        const diffBadge = getDifficultyBadge(r.difficulty);
        const statusBadge = getStatusBadge(r.resolution);

        tr.innerHTML = `
            <td>${dateStr}</td>
            <td style="color:var(--accent);font-weight:600">${r.ticketId || '—'}</td>
            <td>${r.client || '—'}</td>
            <td>${r.module || '—'}</td>
            <td>${typeBadge}</td>
            <td>${diffBadge}</td>
            <td style="font-family:var(--font-mono);font-weight:600">${r.formattedTime}</td>
            <td>${statusBadge}</td>
            <td>${r.gapReason ? `<span class="badge badge-yellow" title="${r.gapReason}">Sim</span>` : '<span class="badge badge-neutral">Não</span>'}</td>
        `;
        dom.historyBody.appendChild(tr);
    });
}

function getTypeBadge(type) {
    const map = { Duvida: 'badge-blue', Bug: 'badge-red', Config: 'badge-yellow', Acesso: 'badge-neutral', Melhoria: 'badge-green' };
    const labels = { Duvida: 'Dúvida', Bug: 'Bug', Config: 'Config', Acesso: 'Acesso', Melhoria: 'Melhoria' };
    return `<span class="badge ${map[type] || 'badge-neutral'}">${labels[type] || type || '—'}</span>`;
}

function getDifficultyBadge(diff) {
    if (!diff) return '—';
    const colors = { 1: 'badge-green', 2: 'badge-green', 3: 'badge-yellow', 4: 'badge-red', 5: 'badge-red' };
    return `<span class="badge ${colors[diff]}">${diff}/5</span>`;
}

function getStatusBadge(status) {
    if (!status) return '—';
    const map = { 'Resolvido': 'badge-green', 'Escalado': 'badge-yellow', 'Pendente Cliente': 'badge-blue', 'Pendente Interno': 'badge-neutral' };
    return `<span class="badge ${map[status] || 'badge-neutral'}">${status}</span>`;
}

// ============================================================
//  CSV EXPORT
// ============================================================
function exportCSV() {
    const records = getRecords();
    if (records.length === 0) { toast('Nenhum registro para exportar.', 'warning'); return; }

    const headers = ['Data','Analista','Ticket','Cliente','Módulo','Tipo','Prioridade','Dificuldade','Tempo','Status','Gap Motivo','Déficit de Conhecimento','Notas'];
    const rows = records.map(r => [
        new Date(r.timestamp).toLocaleString('pt-BR'),
        r.analyst, r.ticketId, r.client, r.module, r.type, r.priority,
        r.difficulty, r.formattedTime, r.resolution,
        r.gapReason || '', r.knowledgeDeficit || '', r.notes || ''
    ]);

    let csv = '\uFEFF'; // BOM for Excel
    csv += headers.join(';') + '\n';
    rows.forEach(row => { csv += row.map(v => `"${(v||'').toString().replace(/"/g, '""')}"`).join(';') + '\n'; });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `support_tracker_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('CSV exportado com sucesso!', 'success');
}

// ============================================================
//  DASHBOARD
// ============================================================
function renderDashboard() {
    const records = getRecords();
    renderGapsChart(records);
    renderTimeChart(records);
    renderModulesChart(records);
    renderSummary(records);
}

function renderGapsChart(records) {
    const gapped = records.filter(r => r.gapReason);
    dom.chartGaps.innerHTML = '';
    if (gapped.length === 0) {
        dom.chartGaps.appendChild(dom.emptyGaps);
        dom.emptyGaps.classList.remove('hidden');
        return;
    }
    dom.emptyGaps.classList.add('hidden');

    const counts = {};
    gapped.forEach(r => { counts[r.gapReason] = (counts[r.gapReason] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    const max = sorted[0][1];

    sorted.forEach(([label, count]) => {
        const pct = Math.round((count / max) * 100);
        const row = document.createElement('div');
        row.className = 'bar-row';
        row.innerHTML = `
            <span class="bar-label" title="${label}">${label}</span>
            <div class="bar-track"><div class="bar-fill fill-yellow" style="width:${pct}%">${count}</div></div>
        `;
        dom.chartGaps.appendChild(row);
    });
}

function renderTimeChart(records) {
    dom.chartTime.innerHTML = '';
    if (records.length === 0) {
        dom.chartTime.appendChild(dom.emptyTime);
        dom.emptyTime.classList.remove('hidden');
        return;
    }
    dom.emptyTime.classList.add('hidden');

    const buckets = { '< 10 min': 0, '10–20 min': 0, '20–30 min': 0, '30–45 min': 0, '> 45 min': 0 };
    records.forEach(r => {
        const m = r.timeSeconds / 60;
        if (m < 10) buckets['< 10 min']++;
        else if (m < 20) buckets['10–20 min']++;
        else if (m < 30) buckets['20–30 min']++;
        else if (m < 45) buckets['30–45 min']++;
        else buckets['> 45 min']++;
    });
    const max = Math.max(...Object.values(buckets), 1);
    const fills = ['fill-green', 'fill-green', 'fill-blue', 'fill-yellow', 'fill-red'];

    Object.entries(buckets).forEach(([label, count], i) => {
        const pct = Math.round((count / max) * 100);
        const row = document.createElement('div');
        row.className = 'bar-row';
        row.innerHTML = `
            <span class="bar-label">${label}</span>
            <div class="bar-track"><div class="bar-fill ${fills[i]}" style="width:${pct}%">${count}</div></div>
        `;
        dom.chartTime.appendChild(row);
    });
}

function renderModulesChart(records) {
    dom.chartModules.innerHTML = '';
    if (records.length === 0) {
        dom.chartModules.appendChild(dom.emptyModules);
        dom.emptyModules.classList.remove('hidden');
        return;
    }
    dom.emptyModules.classList.add('hidden');

    const counts = {};
    records.forEach(r => { if (r.module) counts[r.module] = (counts[r.module] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    const max = sorted.length > 0 ? sorted[0][1] : 1;
    const fills = ['fill-accent', 'fill-blue', 'fill-green', 'fill-yellow', 'fill-red'];

    sorted.forEach(([label, count], i) => {
        const pct = Math.round((count / max) * 100);
        const row = document.createElement('div');
        row.className = 'bar-row';
        row.innerHTML = `
            <span class="bar-label">${label}</span>
            <div class="bar-track"><div class="bar-fill ${fills[i % fills.length]}" style="width:${pct}%">${count}</div></div>
        `;
        dom.chartModules.appendChild(row);
    });
}

function renderSummary(records) {
    dom.summaryStats.innerHTML = '';
    if (records.length === 0) {
        dom.summaryStats.appendChild(dom.emptySummary);
        dom.emptySummary.classList.remove('hidden');
        return;
    }
    dom.emptySummary.classList.add('hidden');

    const total = records.length;
    const avgDiff = (records.reduce((s, r) => s + (r.difficulty || 0), 0) / total).toFixed(1);
    const gapRate = Math.round((records.filter(r => r.gapReason).length / total) * 100);
    const resolved = Math.round((records.filter(r => r.resolution === 'Resolvido').length / total) * 100);

    const items = [
        { value: total, label: 'Total Registros', color: 'var(--accent)' },
        { value: avgDiff, label: 'Dificuldade Média', color: 'var(--yellow)' },
        { value: `${gapRate}%`, label: 'Taxa de Gap', color: 'var(--red)' },
        { value: `${resolved}%`, label: 'Taxa de Resolução', color: 'var(--green)' },
    ];

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `<span class="summary-big" style="color:${item.color}">${item.value}</span><span class="summary-label">${item.label}</span>`;
        dom.summaryStats.appendChild(div);
    });
}

// ============================================================
//  TOAST NOTIFICATIONS
// ============================================================
function toast(message, type = 'info') {
    const icons = { success: 'ri-check-line', error: 'ri-close-circle-line', warning: 'ri-error-warning-line', info: 'ri-information-line' };
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
        <span class="toast-icon"><i class="${icons[type]}"></i></span>
        <span class="toast-msg">${message}</span>
        <button class="toast-close"><i class="ri-close-line"></i></button>
    `;
    dom.toastContainer.appendChild(el);
    el.querySelector('.toast-close').addEventListener('click', () => removeToast(el));
    setTimeout(() => removeToast(el), 5000);
}

function removeToast(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('removing');
    setTimeout(() => el.remove(), 300);
}

// ============================================================
//  SOUND ALERT
// ============================================================
function playAlertSound() {
    if (!soundEnabled) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    } catch { /* Audio API not supported */ }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const icon = dom.btnSoundToggle.querySelector('i');
    icon.className = soundEnabled ? 'ri-volume-up-line' : 'ri-volume-mute-line';
    dom.btnSoundToggle.classList.toggle('muted', !soundEnabled);
    toast(soundEnabled ? 'Som de alerta ativado.' : 'Som de alerta desativado.', 'info');
}

// ============================================================
//  FULLSCREEN
// ============================================================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// ============================================================
//  UTILITIES
// ============================================================
function formatTimeFromSeconds(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
