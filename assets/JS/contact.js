/**
 * @file assets/JS/contact.js
 * @description Gère la soumission sécurisée et asynchrone du formulaire de contact.
 * Intègre les validations côté client, l'effet de double-clic, un filtre de rapidité (heuristique),
 * la communication avec le backend Strapi, et la gestion granulaire des erreurs.
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const websiteInput = document.getElementById('website');
    const feedbackDiv = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submitBtn');

    // Centralisation de l'URL API
    const strapiBaseUrl = window.strapiBaseUrl || 'http://localhost:1337';

    // Enregistrement de l'heure de chargement de la page pour le filtre heuristique frontend
    const pageLoadTime = Date.now();

    if (!form) return;

    /**
     * Tente de générer les icônes Lucide de manière sécurisée en interceptant les erreurs éventuelles.
     */
    function safeCreateIcons() {
        if (window.lucide) {
            try {
                window.lucide.createIcons();
            } catch (error) {
                console.warn('[Lucide] Erreur lors de la création des icônes :', error);
            }
        }
    }

    /**
     * Écouteur d'événement pour intercepter la soumission du formulaire de contact.
     * Effectue les validations visuelles côté client et active le délai silencieux antispam.
     */
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset visual errors
        document.querySelectorAll('[id$="-error"]').forEach(el => el.classList.add('hidden'));
        [nameInput, emailInput, subjectInput, messageInput].forEach(el => {
            el.classList.remove('border-cyber-pink', 'ring-cyber-pink');
            el.setAttribute('aria-invalid', 'false');
        });

        // Validation client
        if (!nameInput.value.trim()) {
            showError(nameInput, 'name-error');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'email-error');
            isValid = false;
        }

        if (!subjectInput.value) {
            showError(subjectInput, 'subject-error');
            isValid = false;
        }

        if (!messageInput.value.trim()) {
            showError(messageInput, 'message-error');
            isValid = false;
        }

        if (isValid) {
            // Désactivation des contrôles et affichage du spinner de chargement
            const originalText = submitBtn.innerHTML;
            setControlsDisabled(true);
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin inline"></i> Envoi en cours...';
            safeCreateIcons();

            // Filtre heuristique frontend : délai minimum de 3 secondes avant l'envoi réel
            const elapsed = Date.now() - pageLoadTime;
            const delay = Math.max(0, 3000 - elapsed);

            setTimeout(() => {
                sendFormData(originalText);
            }, delay);
        }
    });

    /**
     * Transmet les données du formulaire à l'API backend de contact.
     * Gère les réponses HTTP 200, 400, 429, 503 et les exceptions réseau.
     * @param {string} originalText - Contenu HTML initial du bouton de soumission.
     * @returns {Promise<void>}
     */
    async function sendFormData(originalText) {
        const payload = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            subject: subjectInput.value,
            message: messageInput.value.trim(),
            website: websiteInput ? websiteInput.value : ''
        };

        try {
            const response = await fetch(`${strapiBaseUrl}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));

            if (response.status === 200) {
                // Succès : réinitialisation du formulaire et notification
                form.reset();
                showFeedback(
                    'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
                    'check-circle',
                    'Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.'
                );
                
                // Masquer automatiquement le message de succès après 8 secondes
                setTimeout(() => {
                    feedbackDiv.classList.add('hidden');
                }, 8000);
            } else if (response.status === 429) {
                // Rate Limiting : Conserver les saisies
                showFeedback(
                    'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
                    'alert-triangle',
                    data.message || 'Trop de tentatives de contact. Veuillez réessayer plus tard.'
                );
            } else if (response.status === 400) {
                // Erreur de validation : Conserver les saisies
                showFeedback(
                    'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
                    'alert-circle',
                    data.message || 'Erreur de validation des données. Veuillez vérifier vos saisies.'
                );
            } else if (response.status === 503 || response.status === 500) {
                // Erreur serveur / Indisponibilité : Conserver les saisies
                showFeedback(
                    'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
                    'wifi-off',
                    'Le service d\'envoi d\'e-mail est momentanément indisponible. Veuillez réessayer plus tard.'
                );
            } else {
                // Autre erreur : Conserver les saisies
                showFeedback(
                    'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
                    'alert-circle',
                    'Une erreur inattendue est survenue. Veuillez réessayer plus tard.'
                );
            }
        } catch (error) {
            // Erreur réseau : Conserver les saisies
            showFeedback(
                'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
                'wifi-off',
                'Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.'
            );
        } finally {
            // Réactivation des contrôles
            setControlsDisabled(false);
            submitBtn.innerHTML = originalText;
            safeCreateIcons();
        }
    }

    /**
     * Affiche un message d'erreur visuel et configure les attributs d'accessibilité d'un champ.
     * @param {HTMLElement} inputElement - Le champ de saisie concerné.
     * @param {string} errorId - L'ID de l'élément de texte affichant l'erreur.
     */
    function showError(inputElement, errorId) {
        inputElement.classList.add('border-cyber-pink', 'focus:ring-cyber-pink');
        inputElement.setAttribute('aria-invalid', 'true');
        document.getElementById(errorId).classList.remove('hidden');
    }

    /**
     * Active ou désactive l'ensemble des éléments de contrôle du formulaire (boutons, champs)
     * pour prévenir la double soumission pendant les requêtes.
     * @param {boolean} disabled - Vrai pour désactiver, faux pour activer.
     */
    function setControlsDisabled(disabled) {
        [nameInput, emailInput, subjectInput, messageInput, submitBtn].forEach(el => {
            if (el) el.disabled = disabled;
        });
        if (submitBtn) {
            if (disabled) {
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    /**
     * Affiche la zone de feedback avec une classe CSS de coloration, une icône Lucide et un message.
     * @param {string} classesStr - Classes de couleur et de bordure (ex: bg-red-50).
     * @param {string} iconName - Nom de l'icône Lucide (ex: check-circle).
     * @param {string} textMessage - Message de statut textuel.
     */
    function showFeedback(classesStr, iconName, textMessage) {
        feedbackDiv.className = 'p-4 rounded-md border text-sm mt-4 font-mono font-bold ' + classesStr;
        feedbackDiv.innerHTML = `<i data-lucide="${iconName}" class="w-5 h-5 inline mr-2"></i> ${textMessage}`;
        safeCreateIcons();
    }
});
