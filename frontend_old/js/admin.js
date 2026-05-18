// admin.js
// Page logic for the admin dashboard.

window.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName') || 'Admin';
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) {
        adminNameElement.textContent = userName;
    }

    refreshDashboardValues();
    switchTab('overview');
    renderCharts();
});

function refreshDashboardValues() {
    const totalLocationsEl = document.querySelector('[data-metric="locations"]');
    const activeCountersEl = document.querySelector('[data-metric="counters"]');
    const totalTokensEl = document.querySelector('[data-metric="tokens"]');
    const avgWaitEl = document.querySelector('[data-metric="waittime"]');

    if (totalLocationsEl) totalLocationsEl.textContent = '12';
    if (activeCountersEl) activeCountersEl.textContent = '14';
    if (totalTokensEl) totalTokensEl.textContent = '1,200';
    if (avgWaitEl) avgWaitEl.textContent = '18m';
}

function openModal(modalId) {
    document.getElementById(modalId)?.classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.add('hidden');
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('block');
    });

    const selectedPane = document.getElementById(`tab-${tabId}`);
    if (selectedPane) {
        selectedPane.classList.remove('hidden');
        selectedPane.classList.add('block');
    }

    document.querySelectorAll('.nav-btn').forEach(el => {
        el.className = 'nav-btn block w-full text-left px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition';
    });

    const selectedNav = document.getElementById(`nav-${tabId}`);
    if (selectedNav) {
        selectedNav.className = 'nav-btn block w-full text-left px-4 py-3 bg-indigo-600 text-white rounded-lg transition';
    }
}

function renderCharts() {
    const trafficCtx = document.getElementById('trafficChart');
    const sectorCtx = document.getElementById('sectorChart');

    if (trafficCtx) {
        new Chart(trafficCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{
                    label: 'Daily Tokens',
                    data: [120, 190, 300, 250, 400, 350],
                    borderColor: '#6366f1',
                    tension: 0.3,
                    fill: true,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#cbd5e1' } }
                },
                scales: {
                    x: { ticks: { color: '#94a3b8' } },
                    y: { ticks: { color: '#94a3b8' } }
                }
            }
        });
    }

    if (sectorCtx) {
        new Chart(sectorCtx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Hospital', 'Bank', 'College'],
                datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: ['#ec4899', '#3b82f6', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#cbd5e1' } }
                }
            }
        });
    }
}

function openLogoutConfirmation() {
    const modal = document.getElementById('logoutConfirmModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function cancelLogout() {
    const modal = document.getElementById('logoutConfirmModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function performLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

function logout() {
    openLogoutConfirmation();
}
