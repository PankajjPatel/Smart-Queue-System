// admin.js
// Page logic for the admin dashboard connected to the Spring Boot REST API.

const API_URL = 'http://localhost:9999/api';
let trafficChartInstance = null;
let sectorChartInstance = null;

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'ADMIN') {
        window.location.href = 'index.html';
        return;
    }

    const userName = localStorage.getItem('userName') || 'Admin';
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) {
        adminNameElement.textContent = userName;
    }

    // Load Overview tab data immediately
    refreshOverviewTab();
    switchTab('overview');
});

// Tab Switcher
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

    // Trigger specific tab loading
    if (tabId === 'overview') {
        refreshOverviewTab();
    } else if (tabId === 'locations') {
        loadLocationsTab();
    } else if (tabId === 'staff') {
        loadStaffTab();
    } else if (tabId === 'reports') {
        loadReportsTab();
    }
}

// ------------------------------------
// 1. OVERVIEW TAB
// ------------------------------------
async function refreshOverviewTab() {
    try {
        // Fetch Metrics
        const metricRes = await fetch(`${API_URL}/admin/dashboard/metrics`, { headers: getAuthHeaders() });
        const metricData = await metricRes.json();
        
        if (metricRes.ok && metricData.success) {
            const metrics = metricData.data;
            document.querySelector('[data-metric="locations"]').textContent = metrics.totalLocations;
            document.querySelector('[data-metric="counters"]').textContent = metrics.activeCounters;
            document.querySelector('[data-metric="tokens"]').textContent = metrics.totalTokensToday;
            document.querySelector('[data-metric="waittime"]').textContent = `${metrics.avgWaitTime}m`;
        }

        // Fetch Counters Table
        const counterRes = await fetch(`${API_URL}/admin/counters`, { headers: getAuthHeaders() });
        const counterData = await counterRes.json();

        if (counterRes.ok && counterData.success) {
            const tbody = document.querySelector('#tab-overview tbody');
            tbody.innerHTML = '';
            
            if (counterData.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-slate-500">No counters available</td></tr>';
            }

            counterData.data.forEach(c => {
                const statusClass = c.status === 'Serving' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500';
                const tr = document.createElement('tr');
                tr.className = 'border-b border-slate-700/50 hover:bg-slate-700/30 transition';
                tr.innerHTML = `
                    <td class="px-6 py-4 font-medium text-white">${c.location}</td>
                    <td class="px-6 py-4">${c.name}</td>
                    <td class="px-6 py-4">${c.assignedStaff}</td>
                    <td class="px-6 py-4"><span class="${statusClass} px-2 py-1 rounded text-xs">${c.status}</span></td>
                    <td class="px-6 py-4"><span class="text-slate-500 italic text-xs">Active</span></td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        console.error('Error loading Overview tab', err);
    }
}

// ------------------------------------
// 2. LOCATIONS TAB
// ------------------------------------
async function loadLocationsTab() {
    try {
        const res = await fetch(`${API_URL}/admin/locations`, { headers: getAuthHeaders() });
        const resData = await res.json();

        if (res.ok && resData.success) {
            const tbody = document.querySelector('#tab-locations tbody');
            tbody.innerHTML = '';
            
            if (resData.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-slate-500">No locations available</td></tr>';
            }

            resData.data.forEach(loc => {
                const tr = document.createElement('tr');
                tr.className = 'border-b border-slate-700/50';
                tr.innerHTML = `
                    <td class="px-6 py-4 text-slate-500">#LOC-${loc.id}</td>
                    <td class="px-6 py-4 uppercase text-xs tracking-wider">${loc.sectorName}</td>
                    <td class="px-6 py-4 font-medium text-white">${loc.name}</td>
                    <td class="px-6 py-4">${loc.activeCounters}</td>
                    <td class="px-6 py-4"><span class="text-slate-500 italic text-xs">-</span></td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        console.error('Error loading Locations tab', err);
    }
}

// ------------------------------------
// 3. STAFF TAB
// ------------------------------------
async function loadStaffTab() {
    try {
        const res = await fetch(`${API_URL}/admin/staff`, { headers: getAuthHeaders() });
        const resData = await res.json();

        if (res.ok && resData.success) {
            const tbody = document.querySelector('#tab-staff tbody');
            tbody.innerHTML = '';
            
            if (resData.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-slate-500">No staff onboarded</td></tr>';
            }

            resData.data.forEach(staff => {
                const isAssigned = staff.assignedCounterName !== 'Unassigned';
                const statusClass = isAssigned ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400';
                const tr = document.createElement('tr');
                tr.className = 'border-b border-slate-700/50';
                tr.innerHTML = `
                    <td class="px-6 py-4 font-medium text-white">${staff.name}</td>
                    <td class="px-6 py-4">${staff.email}</td>
                    <td class="px-6 py-4 ${!isAssigned ? 'text-slate-500' : ''}">${staff.assignedCounterName}</td>
                    <td class="px-6 py-4"><span class="${statusClass} px-2 py-1 rounded text-xs">${isAssigned ? 'Active' : 'Idle'}</span></td>
                    <td class="px-6 py-4"><span class="text-slate-500 italic text-xs">-</span></td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        console.error('Error loading Staff tab', err);
    }
}

// ------------------------------------
// 4. SYSTEM REPORTS TAB
// ------------------------------------
async function loadReportsTab() {
    try {
        const res = await fetch(`${API_URL}/admin/reports`, { headers: getAuthHeaders() });
        const resData = await res.json();

        if (res.ok && resData.success) {
            const reports = resData.data;

            // Render Daily Executive Summary text
            const summaryEl = document.querySelector('#tab-reports p');
            if (summaryEl) {
                summaryEl.textContent = reports.summaryText;
            }

            // Prep traffic chart data
            const trafficLabels = reports.traffic.map(t => t.label);
            const trafficCounts = reports.traffic.map(t => t.count);
            
            // Prep sector chart data
            const sectorLabels = reports.sectorDistribution.map(s => s.sector);
            const sectorCounts = reports.sectorDistribution.map(s => s.tokens);

            renderCharts(trafficLabels, trafficCounts, sectorLabels, sectorCounts);
        }
    } catch (err) {
        console.error('Error loading Reports tab', err);
    }
}

function renderCharts(trafficLabels, trafficData, sectorLabels, sectorData) {
    const trafficCtx = document.getElementById('trafficChart');
    const sectorCtx = document.getElementById('sectorChart');

    if (trafficChartInstance) {
        trafficChartInstance.destroy();
    }
    if (sectorChartInstance) {
        sectorChartInstance.destroy();
    }

    if (trafficCtx) {
        trafficChartInstance = new Chart(trafficCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: trafficLabels,
                datasets: [{
                    label: 'Daily Tokens Generated',
                    data: trafficData,
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
        sectorChartInstance = new Chart(sectorCtx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: sectorLabels,
                datasets: [{
                    data: sectorData,
                    backgroundColor: ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
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

// ------------------------------------
// 5. MODAL POPULATION & SUBMISSIONS
// ------------------------------------
async function openModal(modalId) {
    document.getElementById(modalId)?.classList.remove('hidden');

    if (modalId === 'counterModal') {
        await populateLocationsDropdown('newCounterLocation');
        await populateStaffDropdown('newCounterStaff');
    } else if (modalId === 'staffModal') {
        await populateLocationsDropdown('newStaffLocation');
    }
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.add('hidden');
}

async function populateLocationsDropdown(selectId) {
    try {
        const res = await fetch(`${API_URL}/admin/locations`, { headers: getAuthHeaders() });
        const resData = await res.json();
        
        const select = document.getElementById(selectId);
        if (select && res.ok && resData.success) {
            select.innerHTML = '<option value="">-- Select Location --</option>';
            resData.data.forEach(loc => {
                const opt = document.createElement('option');
                opt.value = loc.id;
                opt.textContent = `${loc.name} (${loc.sectorName})`;
                select.appendChild(opt);
            });
        }
    } catch (err) {
        console.error('Error populating locations select', err);
    }
}

async function populateStaffDropdown(selectId) {
    try {
        const res = await fetch(`${API_URL}/admin/staff`, { headers: getAuthHeaders() });
        const resData = await res.json();
        
        const select = document.getElementById(selectId);
        if (select && res.ok && resData.success) {
            select.innerHTML = '<option value="">-- Leave Unassigned --</option>';
            resData.data.forEach(staff => {
                const opt = document.createElement('option');
                opt.value = staff.id;
                opt.textContent = staff.name;
                select.appendChild(opt);
            });
        }
    } catch (err) {
        console.error('Error populating staff select', err);
    }
}

async function submitLocation() {
    const name = document.getElementById('newLocationName').value.trim();
    const sectorName = document.getElementById('newLocationSector').value;

    if (!name || !sectorName) return;

    try {
        const response = await fetch(`${API_URL}/admin/locations`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name, sectorName })
        });
        const data = await response.json();

        if (response.ok && data.success) {
            closeModal('locationModal');
            loadLocationsTab();
            document.getElementById('locationForm').reset();
        } else {
            alert(data.message || 'Failed to create location.');
        }
    } catch (err) {
        console.error('Error submitting location', err);
    }
}

async function submitStaff() {
    const name = document.getElementById('newStaffName').value.trim();
    const email = document.getElementById('newStaffEmail').value.trim();
    const locationId = document.getElementById('newStaffLocation').value;

    if (!name || !email) return;

    try {
        const payload = { name, email };
        if (locationId) payload.locationId = parseInt(locationId);

        const response = await fetch(`${API_URL}/admin/staff`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (response.ok && data.success) {
            closeModal('staffModal');
            loadStaffTab();
            document.getElementById('staffForm').reset();
            alert('Staff successfully onboarded! Temporary password is staff123');
        } else {
            alert(data.message || 'Failed to onboard staff.');
        }
    } catch (err) {
        console.error('Error onboarding staff', err);
    }
}

async function submitCounter() {
    const name = document.getElementById('newCounterName').value.trim();
    const locationId = document.getElementById('newCounterLocation').value;
    const userId = document.getElementById('newCounterStaff').value;

    if (!name || !locationId) return;

    try {
        const payload = {
            name,
            locationId: parseInt(locationId)
        };
        if (userId) payload.userId = parseInt(userId);

        const response = await fetch(`${API_URL}/admin/counters`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (response.ok && data.success) {
            closeModal('counterModal');
            refreshOverviewTab();
            document.getElementById('counterForm').reset();
        } else {
            alert(data.message || 'Failed to create counter.');
        }
    } catch (err) {
        console.error('Error submitting counter', err);
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

function downloadCSV() {
    alert("Exporting CSV report data...");
}
