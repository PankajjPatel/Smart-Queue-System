// customer.js
// Page logic for the customer dashboard.

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

window.addEventListener('DOMContentLoaded', setCustomerGreeting);

const dataMap = {
    Hospital: {
        locations: ['City Hospital Main', 'North Wing OPD', 'Apollo Downtown', 'Specialized Care Unit'],
        services: ['General Consultation', 'Pediatrics', 'Pharmacy', 'Blood Test', 'X-Ray / MRI Checkup'],
    },
    Bank: {
        locations: ['State Bank Branch A', 'City Bank Central', 'Westside Branch', 'Remote Kiosk Location'],
        services: ['Cash Deposit', 'Cash Withdrawal', 'Loan Enquiry', 'Account Opening', 'Forex Desk'],
    },
    College: {
        locations: ['Engineering College Campus', 'Medical College block', 'Arts Faculty HQ'],
        services: ['Admissions Query', 'Fee Payment', 'Exam Department', 'Library Registration'],
    },
};

const sectorSel = document.getElementById('sectorSelect');
const locSel = document.getElementById('locationSelect');
const srvSel = document.getElementById('serviceSelect');
const estTimeText = document.getElementById('est-time');
const peopleText = document.getElementById('people-ahead');
const genBtn = document.getElementById('genTokenBtn');

let currentWaitTime = 0;
let currentPeople = 0;

function updateOptions(selectElement, options, placeholder) {
    selectElement.innerHTML = `<option value="">-- ${placeholder} --</option>`;
    options.forEach((optionValue) => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        selectElement.appendChild(option);
    });
}

function handleSectorChange() {
    const sector = sectorSel.value;
    locSel.value = '';
    srvSel.value = '';
    srvSel.disabled = true;
    locSel.disabled = true;

    resetGenerateButton();

    if (sector) {
        updateOptions(locSel, dataMap[sector].locations, 'Choose Location');
        locSel.disabled = false;
        locSel.classList.replace('bg-gray-100', 'bg-gray-50');
        locSel.classList.replace('text-gray-500', 'text-gray-900');
    } else {
        updateOptions(locSel, [], 'Waiting for Sector');
    }
}

function handleLocationChange() {
    const sector = sectorSel.value;
    const loc = locSel.value;

    srvSel.value = '';
    resetGenerateButton();

    if (loc && sector) {
        updateOptions(srvSel, dataMap[sector].services, 'Choose Service');
        srvSel.disabled = false;
        srvSel.classList.replace('bg-gray-100', 'bg-gray-50');
        srvSel.classList.replace('text-gray-500', 'text-gray-900');
    } else {
        updateOptions(srvSel, [], 'Waiting for Location');
    }
}

function handleServiceChange() {
    const selectedService = srvSel.value;
    if (!selectedService) {
        resetGenerateButton();
        return;
    }

    currentPeople = Math.floor(Math.random() * 15) + 1;
    const timePerPerson = Math.floor(Math.random() * 5) + 2;
    currentWaitTime = currentPeople * timePerPerson;

    estTimeText.innerText = `~${currentWaitTime} mins`;
    peopleText.innerText = `${currentPeople}`;
    enableGenerateButton();
}

function generateMockToken() {
    if (!srvSel.value) return;

    document.getElementById('empty-state').classList.add('hidden');
    const activeCard = document.getElementById('active-token-card');
    activeCard.classList.remove('hidden');

    const tokenNum = Math.floor(Math.random() * 300) + 100;
    document.getElementById('display-token-number').innerText = `Token #${tokenNum}`;
    document.getElementById('display-wait').innerText = currentWaitTime;
    document.getElementById('display-people').innerText = currentPeople;

    let serviceLabel = srvSel.value;
    if (serviceLabel.length > 20) {
        serviceLabel = `${serviceLabel.slice(0, 17)}...`;
    }
    document.getElementById('display-service').innerText = serviceLabel;
}

function quickSelect(sector, location, service) {
    sectorSel.value = sector;
    handleSectorChange();
    locSel.value = location;
    handleLocationChange();
    srvSel.value = service;
    handleServiceChange();
}

function resetGenerateButton() {
    genBtn.disabled = true;
    genBtn.classList.replace('bg-blue-600', 'bg-blue-300');
    genBtn.classList.replace('cursor-pointer', 'cursor-not-allowed');
    estTimeText.innerText = '-- mins';
    peopleText.innerText = '--';
}

function enableGenerateButton() {
    genBtn.disabled = false;
    genBtn.classList.replace('bg-blue-300', 'bg-blue-600');
    genBtn.classList.replace('cursor-not-allowed', 'cursor-pointer');
    genBtn.classList.add('hover:bg-blue-700', 'shadow-lg', 'shadow-blue-200', 'transform', 'hover:-translate-y-0.5');
}
