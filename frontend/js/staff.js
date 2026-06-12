// staff.js
// Page logic for the staff dashboard connected to the Spring Boot REST API.

const API_URL = 'http://localhost:9999/api';
let currentServingTokenId = null;

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
    if (!token || role !== 'STAFF') {
        window.location.href = 'index.html';
        return;
    }

    refreshStaffDashboard();
    
    // Auto refresh every 5 seconds to keep queue count and status updated
    setInterval(refreshStaffDashboard, 5000);
});

async function refreshStaffDashboard() {
    try {
        const response = await fetch(`${API_URL}/staff/counter`, {
            headers: getAuthHeaders()
        });
        const resData = await response.json();

        if (response.ok && resData.success && resData.data) {
            const data = resData.data;

            // 1. Update Navbar Counter assignment
            const counterSubInfo = document.querySelector('nav .text-xs.text-gray-500');
            if (counterSubInfo) {
                counterSubInfo.textContent = `${data.locationName} - ${data.counterName}`;
            }

            // 2. Update Stats
            const stats = document.querySelectorAll('.stats-grid h3');
            if (stats.length >= 3) {
                stats[0].textContent = data.waitingCount;
                stats[1].innerHTML = `${data.averageWaitTime}<span class="text-sm text-gray-500 font-normal ml-1">mins</span>`;
                stats[2].textContent = data.completedCount;
            }

            // 3. Update Currently Serving
            const currentTokenEl = document.getElementById('current-token');
            const skipBtn = document.querySelector('button[onclick="skipToken()"]');
            const completeBtn = document.querySelector('button[onclick="completeToken()"]');

            if (data.currentlyServing) {
                currentServingTokenId = data.currentlyServing.id;
                if (currentTokenEl) currentTokenEl.textContent = `#${data.currentlyServing.tokenNumber}`;
                
                if (skipBtn) skipBtn.disabled = false;
                if (skipBtn) skipBtn.className = "px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-xl transition cursor-pointer";
                
                if (completeBtn) completeBtn.disabled = false;
                if (completeBtn) completeBtn.className = "px-6 py-3 bg-green-50 text-green-600 hover:bg-green-100 font-semibold rounded-xl transition cursor-pointer";
            } else {
                currentServingTokenId = null;
                if (currentTokenEl) currentTokenEl.textContent = '--';
                
                if (skipBtn) skipBtn.disabled = true;
                if (skipBtn) skipBtn.className = "px-6 py-3 bg-gray-50 text-gray-300 font-semibold rounded-xl cursor-not-allowed";
                
                if (completeBtn) completeBtn.disabled = true;
                if (completeBtn) completeBtn.className = "px-6 py-3 bg-gray-50 text-gray-300 font-semibold rounded-xl cursor-not-allowed";
            }

            // 4. Update Next in Line Section
            const nextInLineTitle = document.querySelector('.action-area h3');
            const nextInLineDesc = document.querySelector('.action-area p');
            const callNextBtn = document.querySelector('.action-area button');

            if (data.nextInLine) {
                if (nextInLineTitle) nextInLineTitle.textContent = `Next in Line: Token #${data.nextInLine.tokenNumber}`;
                if (nextInLineDesc) nextInLineDesc.textContent = "Call the next person when ready to serve.";
                
                if (callNextBtn) {
                    if (data.currentlyServing) {
                        // There is already someone being served, so Call Next should be locked
                        callNextBtn.disabled = true;
                        callNextBtn.className = "bg-gray-300 text-gray-500 font-bold py-3 px-8 rounded-xl cursor-not-allowed";
                    } else {
                        callNextBtn.disabled = false;
                        callNextBtn.className = "bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5 cursor-pointer";
                    }
                }
            } else {
                if (nextInLineTitle) nextInLineTitle.textContent = "No one in line";
                if (nextInLineDesc) nextInLineDesc.textContent = "Waiting for new customers to join the queue.";
                
                if (callNextBtn) {
                    callNextBtn.disabled = true;
                    callNextBtn.className = "bg-gray-300 text-gray-500 font-bold py-3 px-8 rounded-xl cursor-not-allowed";
                }
            }

            // 5. Update History Panel
            const historyList = document.getElementById('history-list');
            if (historyList && data.history) {
                historyList.innerHTML = '';
                if (data.history.length === 0) {
                    historyList.innerHTML = '<li class="text-sm text-gray-400 text-center py-4">No recent history</li>';
                }
                data.history.forEach(item => {
                    const isCompleted = item.status === 'COMPLETED';
                    const iconClass = isCompleted ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
                    const iconChar = isCompleted ? '✓' : '✕';
                    
                    // Simple parse datetime or format
                    let displayTime = '';
                    if (item.time) {
                        try {
                            const date = new Date(item.time);
                            displayTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        } catch (e) {
                            displayTime = item.time;
                        }
                    }
                    const statusText = isCompleted ? `Completed at ${displayTime}` : `Skipped at ${displayTime}`;

                    const li = document.createElement('li');
                    li.className = 'flex justify-between items-center pb-4 border-b border-gray-50';
                    li.innerHTML = `
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full ${iconClass} flex justify-center items-center text-xs font-bold">${iconChar}</div>
                            <div>
                                <p class="font-semibold text-sm text-gray-900">Token #${item.tokenNumber}</p>
                                <p class="text-xs text-gray-400">${statusText}</p>
                            </div>
                        </div>
                    `;
                    historyList.appendChild(li);
                });
            }
        }
    } catch (err) {
        console.error('Error refreshing staff dashboard', err);
    }
}

async function callNext() {
    try {
        const response = await fetch(`${API_URL}/staff/tokens/next`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        const resData = await response.json();

        if (response.ok && resData.success) {
            refreshStaffDashboard();
        } else {
            alert(resData.message || 'Error calling next token.');
        }
    } catch (err) {
        console.error('Error calling next token', err);
        alert('Could not connect to queue server.');
    }
}

async function skipToken() {
    if (!currentServingTokenId) return;
    try {
        const response = await fetch(`${API_URL}/staff/tokens/${currentServingTokenId}/skip`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        const resData = await response.json();

        if (response.ok && resData.success) {
            refreshStaffDashboard();
        } else {
            alert(resData.message || 'Error skipping token.');
        }
    } catch (err) {
        console.error('Error skipping token', err);
    }
}

async function completeToken() {
    if (!currentServingTokenId) return;
    try {
        const response = await fetch(`${API_URL}/staff/tokens/${currentServingTokenId}/complete`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        const resData = await response.json();

        if (response.ok && resData.success) {
            refreshStaffDashboard();
        } else {
            alert(resData.message || 'Error completing token.');
        }
    } catch (err) {
        console.error('Error completing token', err);
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
