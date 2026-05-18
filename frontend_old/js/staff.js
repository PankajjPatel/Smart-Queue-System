// staff.js
// Page logic for the staff dashboard.

window.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        console.log('Staff logged in:', userName);
    }
});

let currentTokenNum = 41;

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

function callNext() {
    const currentToken = document.getElementById('current-token');
    if (!currentToken || currentToken.innerText !== '--') {
        return;
    }
    currentToken.innerText = `#${currentTokenNum}`;
}

function addToHistory(status) {
    const historyList = document.getElementById('history-list');
    const tokenStr = document.getElementById('current-token').innerText;
    if (tokenStr === '--') {
        return;
    }

    const timeString = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const isCompleted = status === 'completed';
    const iconClass = isCompleted ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
    const iconChar = isCompleted ? '✓' : '✕';
    const statusText = isCompleted ? `Completed at ${timeString}` : `Skipped at ${timeString}`;

    const listItem = document.createElement('li');
    listItem.className = 'flex justify-between items-center pb-4 border-b border-gray-50';
    listItem.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full ${iconClass} flex justify-center items-center text-xs font-bold">${iconChar}</div>
            <div>
                <p class="font-semibold text-sm text-gray-900">Token ${tokenStr}</p>
                <p class="text-xs text-gray-400">${statusText}</p>
            </div>
        </div>
    `;

    historyList.prepend(listItem);
}

function skipToken() {
    const currentToken = document.getElementById('current-token');
    if (!currentToken || currentToken.innerText === '--') {
        return;
    }
    addToHistory('skipped');
    currentToken.innerText = '--';
    currentTokenNum += 1;
}

function completeToken() {
    const currentToken = document.getElementById('current-token');
    if (!currentToken || currentToken.innerText === '--') {
        return;
    }
    addToHistory('completed');
    currentToken.innerText = '--';
    currentTokenNum += 1;
}
