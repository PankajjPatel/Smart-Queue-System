// index.js
// Page logic for the landing page and login/register modals.

const registerForm = document.getElementById('register-form');
const registerSubmitBtn = document.getElementById('register-submit');
const regNameInput = document.getElementById('reg-name');
const regEmailInput = document.getElementById('reg-email');
const regPhoneInput = document.getElementById('reg-phone');
const regPasswordInput = document.getElementById('reg-password');
const registerFormError = document.getElementById('register-form-error');

function openModal(type) {
    document.getElementById(type + 'Modal').classList.add('active');
}

function closeModal(type) {
    document.getElementById(type + 'Modal').classList.remove('active');
}

function switchModal(from, to) {
    closeModal(from);
    openModal(to);
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

function hideFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
    }
}

function setFormError(message) {
    if (registerFormError) {
        registerFormError.textContent = message;
        registerFormError.classList.remove('hidden');
    }
}

function clearFormError() {
    if (registerFormError) {
        registerFormError.textContent = '';
        registerFormError.classList.add('hidden');
    }
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
}

function validateName() {
    const value = regNameInput.value.trim();
    if (!value) {
        showFieldError('reg-name-error', 'Please enter your full name');
        return false;
    }
    hideFieldError('reg-name-error');
    return true;
}

function validateEmailField() {
    const value = regEmailInput.value.trim();
    if (!value || !isValidEmail(value)) {
        showFieldError('reg-email-error', 'Please enter a valid email address');
        return false;
    }
    hideFieldError('reg-email-error');
    return true;
}

function validatePhoneField() {
    const value = regPhoneInput.value.trim();
    if (!isValidPhone(value)) {
        showFieldError('reg-phone-error', 'Phone number must be exactly 10 digits');
        return false;
    }
    hideFieldError('reg-phone-error');
    return true;
}

function validatePasswordField() {
    const value = regPasswordInput.value;
    if (!value || value.length < 6) {
        showFieldError('reg-password-error', 'Password must contain at least 6 characters');
        return false;
    }
    hideFieldError('reg-password-error');
    return true;
}

function validateRegistration() {
    const validName = validateName();
    const validEmail = validateEmailField();
    const validPhone = validatePhoneField();
    const validPassword = validatePasswordField();
    return validName && validEmail && validPhone && validPassword;
}

function updateRegisterButtonState() {
    const isValid = validateRegistration();
    if (registerSubmitBtn) {
        registerSubmitBtn.disabled = !isValid;
        registerSubmitBtn.classList.toggle('bg-blue-600', isValid);
        registerSubmitBtn.classList.toggle('bg-blue-400', !isValid);
        registerSubmitBtn.classList.toggle('cursor-not-allowed', !isValid);
    }
}

async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    let role = 'CUSTOMER';

    if (email.includes('admin')) {
        role = 'ADMIN';
    } else if (email.includes('staff')) {
        role = 'STAFF';
    }

    const userName = email.split('@')[0] || 'Customer';
    const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

    localStorage.setItem('userRole', role);
    localStorage.setItem('role', role);
    localStorage.setItem('token', 'mock-token-' + Date.now());
    localStorage.setItem('userName', displayName);

    if (role === 'ADMIN') {
        window.location.href = 'admin.html';
    } else if (role === 'STAFF') {
        window.location.href = 'staff.html';
    } else {
        window.location.href = 'customer.html';
    }
}

async function handleRegister() {
    clearFormError();
    if (!validateRegistration()) {
        setFormError('Please correct the highlighted fields before continuing.');
        return;
    }

    const payload = {
        name: regNameInput.value.trim(),
        email: regEmailInput.value.trim(),
        phone: regPhoneInput.value.trim(),
        password: regPasswordInput.value,
        role: 'CUSTOMER'
    };

    if (registerSubmitBtn) {
        registerSubmitBtn.disabled = true;
        registerSubmitBtn.textContent = 'Creating account...';
    }

    try {
        const response = await fetch('http://localhost:9999/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();

        if (!response.ok) {
            if (responseData && responseData.data) {
                Object.keys(responseData.data).forEach(field => {
                    const errorMessage = responseData.data[field];
                    const errorFieldId = `reg-${field}-error`;
                    showFieldError(errorFieldId, errorMessage);
                });
            }
            setFormError(responseData.message || 'Registration failed. Please check your details.');
            return;
        }

        localStorage.setItem('token', responseData.token);
        localStorage.setItem('role', responseData.role);
        localStorage.setItem('userRole', responseData.role);
        localStorage.setItem('userName', responseData.name || payload.name);
        window.location.href = 'customer.html';
    } catch (error) {
        setFormError('Unable to complete registration. Please try again later.');
    } finally {
        if (registerSubmitBtn) {
            registerSubmitBtn.textContent = 'Create Account';
            updateRegisterButtonState();
        }
    }
}

if (registerForm) {
    registerForm.addEventListener('input', () => {
        clearFormError();
        validateRegistration();
        updateRegisterButtonState();
    });

    updateRegisterButtonState();
}
