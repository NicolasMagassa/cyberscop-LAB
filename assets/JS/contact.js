document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const feedbackDiv = document.getElementById('form-feedback');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset errors
        document.querySelectorAll('[id$="-error"]').forEach(el => el.classList.add('hidden'));
        [nameInput, emailInput, subjectInput, messageInput].forEach(el => {
            el.classList.remove('border-cyber-pink', 'ring-cyber-pink');
            el.setAttribute('aria-invalid', 'false');
        });

        // Validation Name
        if (!nameInput.value.trim()) {
            showError(nameInput, 'name-error');
            isValid = false;
        }

        // Validation Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'email-error');
            isValid = false;
        }

        // Validation Subject
        if (!subjectInput.value) {
            showError(subjectInput, 'subject-error');
            isValid = false;
        }

        // Validation Message
        if (!messageInput.value.trim()) {
            showError(messageInput, 'message-error');
            isValid = false;
        }

        if (isValid) {
            // Simulation d'envoi
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin inline"></i> Envoi en cours...';
            if (window.lucide) window.lucide.createIcons();

            setTimeout(() => {
                // Succès
                form.reset();
                feedbackDiv.classList.remove('hidden', 'bg-red-50', 'text-red-600', 'border-red-200');
                feedbackDiv.classList.add('bg-green-50', 'dark:bg-green-900/20', 'text-green-700', 'dark:text-green-400', 'border-green-200', 'dark:border-green-800');
                feedbackDiv.innerHTML = '<i data-lucide="check-circle" class="w-5 h-5 inline mr-2"></i> Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.';
                if (window.lucide) window.lucide.createIcons();
                
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                submitBtn.innerHTML = originalText;
                if (window.lucide) window.lucide.createIcons();
                
                // Cacher le message après 8 secondes
                setTimeout(() => {
                    feedbackDiv.classList.add('hidden');
                }, 8000);
            }, 1500);
        }
    });

    function showError(inputElement, errorId) {
        inputElement.classList.add('border-cyber-pink', 'focus:ring-cyber-pink');
        inputElement.setAttribute('aria-invalid', 'true');
        document.getElementById(errorId).classList.remove('hidden');
    }
});
