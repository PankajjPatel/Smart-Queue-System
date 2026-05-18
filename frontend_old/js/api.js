// API Utilities for Smart Queue Management System
const API_URL = 'http://localhost:9999/api';

// ------------------------------------
// 1. AUTHENTICATION
// ------------------------------------
async function apiLogin(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    return data;
}

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// ------------------------------------
// 2. ADMIN DASHBOARD APIS
// ------------------------------------
async function getDashboardMetrics() {
    const res = await fetch(`${API_URL}/admin/dashboard/metrics`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch metrics');
    const data = await res.json();
    return data.data || {};
}

async function getCountersWithAssignments() {
    const res = await fetch(`${API_URL}/admin/counters`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch counters');
    const data = await res.json();
    return data.data || [];
}

async function getLocations() {
    const res = await fetch(`${API_URL}/public/locations?sectorId=1`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch locations');
    return await res.json();
}

async function getAllUsers() {
    const res = await fetch(`${API_URL}/admin/users`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json();
    return data.data || [];
}

async function getReports() {
    const res = await fetch(`${API_URL}/admin/reports`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    const data = await res.json();
    return data.data || {};
}

// ------------------------------------
// 3. COUNTER AND LOCATION MANAGEMENT (Admin)
// ------------------------------------
async function createCounterApi(name, locationId) {
    const res = await fetch(`${API_URL}/admin/counters`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: name, locationId: locationId })
    });
    if (!res.ok) throw new Error('Failed to create counter');
    return await res.json();
}

async function createStaffApi(staffData) {
    const res = await fetch(`${API_URL}/admin/staff`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(staffData)
    });
    if (!res.ok) throw new Error('Failed to create staff');
    return await res.json();
}

// ------------------------------------
// 4. QUEUE & TOKEN MANAGEMENT
// ------------------------------------
async function generateTokenApi(serviceId, userId) {
    const res = await fetch(`${API_URL}/v1/tokens/generate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ serviceId, userId })
    });
    return await res.json();
}

async function fetchMyQueueStatusApi(tokenId) {
    const res = await fetch(`${API_URL}/v1/tokens/${tokenId}/status`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return await res.json();
}

async function getNextTokenApi(counterId) {
    const res = await fetch(`${API_URL}/staff/tokens/next`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ counterId })
    });
    return await res.json();
}

async function completeTokenApi(tokenId) {
    const res = await fetch(`${API_URL}/staff/tokens/${tokenId}/complete`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return await res.json();
}

async function skipTokenApi(tokenId) {
    const res = await fetch(`${API_URL}/staff/tokens/${tokenId}/skip`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return await res.json();
}
