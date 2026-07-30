let strapiBaseUrl = 'http://localhost:1337';

function getResetCode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

function initResetPassword() {
    const code = getResetCode();
    const form = document.getElementById('reset-password-form');
    const passwordInput = document.getElementById('new-password-input');
    const confirmInput = document.getElementById('confirm-password-input');
    const submitBtn = document.getElementById('reset-submit-btn');
    const messageContainer = document.getElementById('reset-message');

    if (!code || code.trim() === "") {
        if (messageContainer) {
            messageContainer.textContent = "Le lien de réinitialisation est invalide ou incomplet.";
            messageContainer.classList.remove('hidden', 'text-cyber-green');
            messageContainer.classList.add('text-cyber-red');
        }
        if (passwordInput) passwordInput.disabled = true;
        if (confirmInput) confirmInput.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
        return;
    }

    if (form) {
        form.addEventListener('submit', (e) => handleResetPasswordSubmit(e, code));
    }
}

async function handleResetPasswordSubmit(event, code) {
    event.preventDefault();
    
    const passwordInput = document.getElementById('new-password-input');
    const confirmInput = document.getElementById('confirm-password-input');
    const submitBtn = document.getElementById('reset-submit-btn');
    const messageContainer = document.getElementById('reset-message');

    const password = passwordInput?.value;
    const passwordConfirmation = confirmInput?.value;

    if (messageContainer) messageContainer.classList.add('hidden');

    // Validation locale
    if (!password || password.trim() === "" || !passwordConfirmation || passwordConfirmation.trim() === "") {
        if (messageContainer) {
            messageContainer.textContent = "ERREUR: Les mots de passe ne peuvent pas être vides.";
            messageContainer.classList.remove('hidden', 'text-cyber-green');
            messageContainer.classList.add('text-cyber-red');
        }
        return;
    }

    if (password !== passwordConfirmation) {
        if (messageContainer) {
            messageContainer.textContent = "ERREUR: Les mots de passe ne correspondent pas.";
            messageContainer.classList.remove('hidden', 'text-cyber-green');
            messageContainer.classList.add('text-cyber-red');
        }
        return;
    }

    const originalText = submitBtn ? submitBtn.textContent : 'Enregistrer le nouveau mot de passe';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Réinitialisation en cours…';
    }
    if (passwordInput) passwordInput.disabled = true;
    if (confirmInput) confirmInput.disabled = true;

    try {
        const response = await fetch(`${strapiBaseUrl}/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code,
                password: password,
                passwordConfirmation: passwordConfirmation
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data?.error?.message || 'Erreur lors de la réinitialisation.');
        }

        if (messageContainer) {
            messageContainer.textContent = "Votre mot de passe a été réinitialisé avec succès.";
            messageContainer.classList.remove(
                'hidden',
                'text-red-600',
                'dark:text-cyber-red',
                'bg-red-50',
                'dark:bg-red-950/20',
                'border-red-200',
                'dark:border-red-900/30'
            );
            messageContainer.classList.add(
                'text-cyber-green',
                'bg-green-50',
                'dark:bg-green-950/20',
                'border-cyber-green',
                'dark:border-cyber-green/30'
            );
        }

        window.history.replaceState({}, document.title, window.location.pathname);

        if (passwordInput) passwordInput.value = '';
        if (confirmInput) confirmInput.value = '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Mot de passe réinitialisé';
        }
        
        const loginLinkContainer = document.getElementById('login-link-container');
        if (loginLinkContainer) {
            loginLinkContainer.classList.remove('hidden');
        }

    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        
        if (passwordInput) passwordInput.disabled = false;
        if (confirmInput) confirmInput.disabled = false;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }

        if (messageContainer) {
            if (error.message.includes('Failed to fetch') || error.message.includes('Network') || error.message.includes('Impossible de contacter le serveur')) {
                messageContainer.textContent = "Impossible de contacter le serveur. Veuillez réessayer plus tard.";
            } else {
                messageContainer.textContent = "Ce lien est invalide, expiré ou a déjà été utilisé.";
            }
            messageContainer.classList.remove(
                'hidden',
                'text-cyber-green',
                'bg-green-50',
                'dark:bg-green-950/20',
                'border-cyber-green',
                'dark:border-cyber-green/30'
            );
            messageContainer.classList.add(
                'text-red-600',
                'dark:text-cyber-red',
                'bg-red-50',
                'dark:bg-red-950/20',
                'border-red-200',
                'dark:border-red-900/30'
            );
        }
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initResetPassword);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getResetCode,
        initResetPassword,
        handleResetPasswordSubmit,
        strapiBaseUrl
    };
}
