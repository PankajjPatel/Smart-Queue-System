// customer.js
// Page logic for the customer dashboard integrating with Spring Boot Backend REST APIs.

const API_URL = 'http://localhost:9999/api';

const sectorSel = document.getElementById('sectorSelect');
const locSel = document.getElementById('locationSelect');
const srvSel = document.getElementById('serviceSelect');
const estTimeText = document.getElementById('est-time');
const peopleText = document.getElementById('people-ahead');
const genBtn = document.getElementById('genTokenBtn');

let activeTokenInterval = null;
let currentTokenId = null;

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

function setCustomerGreeting() {
    const savedName = localStorage.getItem('userName');
    const firstName = savedName ? savedName.trim().split(/\s+/)[0] : 'Customer';
    const nameElement = document.getElementById('customerName');
    if (nameElement) {
        nameElement.textContent = firstName || 'Customer';
    }
}

function confirmLogout() {
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

// Check auth
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'CUSTOMER') {
        window.location.href = 'index.html';
        return;
    }

    setCustomerGreeting();
    loadSectors();
    checkActiveToken();
    
    // Start active token status polling
    activeTokenInterval = setInterval(checkActiveToken, 5000);
});

// Clean interval on leave
window.addEventListener('beforeunload', () => {
    if (activeTokenInterval) {
        clearInterval(activeTokenInterval);
    }
});

async function loadSectors() {
    try {
        const response = await fetch(`${API_URL}/public/sectors`);
        const sectors = await response.json();
        
        sectorSel.innerHTML = '<option value="">-- Choose Sector --</option>';
        sectors.forEach(sec => {
            const opt = document.createElement('option');
            opt.value = sec.id;
            opt.textContent = sec.name;
            sectorSel.appendChild(opt);
        });
    } catch (err) {
        console.error('Failed to load sectors', err);
    }
}

async function handleSectorChange() {
    const sectorId = sectorSel.value;
    locSel.value = '';
    srvSel.value = '';
    srvSel.disabled = true;
    locSel.disabled = true;
    
    // Reset background styling back to disabled defaults
    locSel.className = "w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-gray-100 border text-gray-500 outline-none cursor-pointer";
    srvSel.className = "w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-gray-100 border text-gray-500 outline-none cursor-pointer";

    resetGenerateButton();

    if (sectorId) {
        try {
            // Load Locations
            const locRes = await fetch(`${API_URL}/public/locations?sectorId=${sectorId}`);
            const locations = await locRes.json();
            
            locSel.innerHTML = '<option value="">-- Choose Location --</option>';
            locations.forEach(loc => {
                const opt = document.createElement('option');
                opt.value = loc.id;
                opt.textContent = loc.name;
                locSel.appendChild(opt);
            });
            locSel.disabled = false;
            locSel.className = "w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-gray-50 border text-gray-900 outline-none cursor-pointer";

            // Load Services
            const srvRes = await fetch(`${API_URL}/public/services?sectorId=${sectorId}`);
            const services = await srvRes.json();
            
            srvSel.innerHTML = '<option value="">-- Choose Service --</option>';
            services.forEach(srv => {
                const opt = document.createElement('option');
                opt.value = srv.id;
                opt.textContent = srv.name;
                srvSel.appendChild(opt);
            });
            srvSel.disabled = false;
            srvSel.className = "w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-gray-50 border text-gray-900 outline-none cursor-pointer";
            
        } catch (err) {
            console.error('Error fetching locations/services', err);
        }
    } else {
        locSel.innerHTML = '<option value="">-- Waiting for Sector --</option>';
        srvSel.innerHTML = '<option value="">-- Waiting for Sector --</option>';
    }
}

function handleLocationChange() {
    updateQueueEstimation();
}

function handleServiceChange() {
    updateQueueEstimation();
}

async function updateQueueEstimation() {
    const locId = locSel.value;
    const srvId = srvSel.value;

    if (!locId || !srvId) {
        resetGenerateButton();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/public/queue/info?locationId=${locId}&serviceId=${srvId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            estTimeText.innerText = `~${data.data.estimatedWaitTimeMins} mins`;
            peopleText.innerText = `${data.data.personsAhead}`;
            enableGenerateButton();
        } else {
            resetGenerateButton();
        }
    } catch (err) {
        console.error('Error fetching queue info', err);
        resetGenerateButton();
    }
}

async function generateToken() {
    const locId = locSel.value;
    const srvId = srvSel.value;

    if (!locId || !srvId) return;

    try {
        const response = await fetch(`${API_URL}/v1/tokens/generate`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                locationId: parseInt(locId),
                serviceId: parseInt(srvId)
            })
        });

        const resData = await response.json();

        if (response.ok && resData.success) {
            displayActiveToken(resData.data);
            checkActiveToken();
        } else {
            alert(resData.message || 'Failed to generate token. Try again.');
        }
    } catch (err) {
        console.error('Error generating token', err);
        alert('Could not connect to queue server.');
    }
}

// Override button onclick to use generateToken instead of generateMockToken
document.getElementById('genTokenBtn').onclick = generateToken;

async function checkActiveToken() {
    try {
        const response = await fetch(`${API_URL}/v1/tokens/active`, {
            headers: getAuthHeaders()
        });
        const resData = await response.json();

        if (response.ok && resData.success && resData.data) {
            displayActiveToken(resData.data);
        } else {
            hideActiveToken();
        }
    } catch (err) {
        // Suppress console spam during periodic polling if backend is temporarily down
    }
}

function displayActiveToken(token) {
    currentTokenId = token.id;
    document.getElementById('empty-state').classList.add('hidden');
    
    const activeCard = document.getElementById('active-token-card');
    activeCard.classList.remove('hidden');

    document.getElementById('display-token-number').innerText = `Token #${token.tokenNumber}`;
    document.getElementById('display-wait').innerText = token.estimatedWaitTimeMins;
    document.getElementById('display-people').innerText = token.personsAhead;
    
    let serviceLabel = token.serviceName || 'Service';
    if (serviceLabel.length > 20) {
        serviceLabel = `${serviceLabel.slice(0, 17)}...`;
    }
    document.getElementById('display-service').innerText = `${token.counterName || ''} - ${serviceLabel}`;

    // Apply color pulses based on status
    if (token.status === 'CALLED' || token.status === 'IN_PROGRESS') {
        activeCard.className = "bg-gradient-to-br from-green-600 to-emerald-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden transition-all duration-500 animate-pulse";
        document.getElementById('display-token-number').className = "bg-green-500/50 px-3 py-1 text-xs font-semibold rounded-full border border-green-400";
    } else {
        activeCard.className = "bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden transition-all duration-500";
        document.getElementById('display-token-number').className = "bg-blue-500/50 px-3 py-1 text-xs font-semibold rounded-full border border-blue-400";
    }
}

function hideActiveToken() {
    currentTokenId = null;
    document.getElementById('empty-state').classList.remove('hidden');
    document.getElementById('active-token-card').classList.add('hidden');
}

function resetGenerateButton() {
    genBtn.disabled = true;
    genBtn.className = "bg-blue-300 text-white font-medium py-3 px-6 rounded-xl transition-all cursor-not-allowed";
    estTimeText.innerText = '-- mins';
    peopleText.innerText = '--';
}

function enableGenerateButton() {
    genBtn.disabled = false;
    genBtn.className = "bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 cursor-pointer";
}

async function quickSelect(sectorName, locationName, serviceName) {
    // Find sector dropdown option matching sectorName
    const sectorOption = Array.from(sectorSel.options).find(o => o.text === sectorName);
    if (!sectorOption) return;

    sectorSel.value = sectorOption.value;
    await handleSectorChange();

    const locOption = Array.from(locSel.options).find(o => o.text === locationName);
    if (locOption) {
        locSel.value = locOption.value;
        handleLocationChange();
    }

    const srvOption = Array.from(srvSel.options).find(o => o.text === serviceName);
    if (srvOption) {
        srvSel.value = srvOption.value;
        handleServiceChange();
    }
}
