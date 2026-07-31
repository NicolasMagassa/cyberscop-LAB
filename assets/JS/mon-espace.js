/**
 * Fichier : assets/JS/mon-espace.js
 * Rôle : Contrôleur pour la page mon-espace.html.
 * Gère la validation de session, l'affichage des données de profil
 * et la modification sécurisée de mot de passe via l'API Strapi.
 */

const strapiBaseUrl = 'http://localhost:1337';

/**
 * Initialise l'espace personnel : valide la session locale avec Strapi,
 * récupère et affiche les informations du compte en lecture seule.
 * En cas d'erreur de session, gère la redirection et le nettoyage.
 * En cas d'erreur réseau, affiche une option de reconnexion.
 *
 * @returns {Promise<void>}
 */
async function initMonEspace() {
    const welcomeName = document.getElementById('user-display-welcome');
    const usernameVal = document.getElementById('user-username');
    const emailVal = document.getElementById('user-email');
    const confirmedVal = document.getElementById('user-confirmed');
    const createdVal = document.getElementById('user-created');
    const loadingContainer = document.getElementById('account-loading');
    const detailsContainer = document.getElementById('account-details');
    const errorContainer = document.getElementById('network-error-container');

    const storedUser = localStorage.getItem('cyberScopeUser');
    if (!storedUser) {
        if (typeof handleLogout === 'function') handleLogout();
        window.location.replace("index.html?auth=required");
        return;
    }

    let user;
    try {
        user = JSON.parse(storedUser);
    } catch (e) {
        if (typeof handleLogout === 'function') handleLogout();
        window.location.replace("index.html?auth=required");
        return;
    }

    if (!user || !user.token) {
        if (typeof handleLogout === 'function') handleLogout();
        window.location.replace("index.html?auth=required");
        return;
    }

    if (errorContainer) errorContainer.classList.add('hidden');
    if (loadingContainer) loadingContainer.classList.remove('hidden');
    if (detailsContainer) detailsContainer.classList.add('hidden');

    try {
        const response = await fetch(`${strapiBaseUrl}/api/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            const data = await response.json();

            if (welcomeName) welcomeName.textContent = data.username;
            if (usernameVal) usernameVal.textContent = data.username;
            if (emailVal) emailVal.textContent = data.email;

            if (confirmedVal) {
                if (data.confirmed) {
                    confirmedVal.textContent = "Adresse e-mail confirmée";
                    confirmedVal.className = "text-cyber-green font-bold text-sm font-mono";
                } else {
                    confirmedVal.textContent = "Adresse e-mail non confirmée";
                    confirmedVal.className = "text-cyber-pink font-bold text-sm font-mono";
                }
            }

            if (createdVal) {
                if (data.createdAt) {
                    const date = new Date(data.createdAt);
                    createdVal.textContent = date.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } else {
                    createdVal.textContent = 'N/A';
                }
            }

            if (loadingContainer) loadingContainer.classList.add('hidden');
            if (detailsContainer) detailsContainer.classList.remove('hidden');
        } else if (response.status === 401 || response.status === 403) {
            // Session expirée
            if (typeof handleLogout === 'function') handleLogout();
            else localStorage.removeItem('cyberScopeUser');
            window.location.replace("index.html?auth=expired");
        } else {
            // Autre erreur de serveur
            throw new Error(`Server returned status: ${response.status}`);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        if (loadingContainer) loadingContainer.classList.add('hidden');
        if (errorContainer) errorContainer.classList.remove('hidden');
    }
}

/**
 * Intercepte et traite la soumission du formulaire de modification de mot de passe.
 * Effectue les validations client nécessaires, interagit avec Strapi,
 * puis valide le nouveau JWT renvoyé.
 *
 * @param {Event} event - L'événement de soumission.
 * @returns {Promise<void>}
 */
async function handleChangePasswordSubmit(event) {
    event.preventDefault();

    const currentPasswordInput = document.getElementById('current-password-input');
    const newPasswordInput = document.getElementById('new-password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    const submitBtn = document.getElementById('btn-submit-password');
    const errorDiv = document.getElementById('change-password-error');
    const successDiv = document.getElementById('change-password-success');

    if (errorDiv) errorDiv.classList.add('hidden');
    if (successDiv) successDiv.classList.add('hidden');

    const currentPassword = currentPasswordInput?.value || '';
    const newPassword = newPasswordInput?.value || '';
    const confirmPassword = confirmPasswordInput?.value || '';

    // Validation client
    if (!currentPassword || !newPassword || !confirmPassword) {
        if (errorDiv) {
            errorDiv.textContent = "Tous les champs sont obligatoires.";
            errorDiv.classList.remove('hidden');
        }
        return;
    }

    if (newPassword === currentPassword) {
        if (errorDiv) {
            errorDiv.textContent = "Le nouveau mot de passe doit être différent du mot de passe actuel.";
            errorDiv.classList.remove('hidden');
        }
        return;
    }

    if (newPassword !== confirmPassword) {
        if (errorDiv) {
            errorDiv.textContent = "Le nouveau mot de passe et sa confirmation ne correspondent pas.";
            errorDiv.classList.remove('hidden');
        }
        return;
    }

    const charCount = Array.from(newPassword).length;
    if (charCount < 12) {
        if (errorDiv) {
            errorDiv.textContent = "ERREUR : Utilisez au moins 12 caractères. Certains caractères spéciaux ou emojis occupent davantage d’espace ; le mot de passe ne doit pas dépasser la limite technique autorisée.";
            errorDiv.classList.remove('hidden');
        }
        return;
    }

    const byteCount = new TextEncoder().encode(newPassword).length;
    if (byteCount > 72) {
        if (errorDiv) {
            errorDiv.textContent = "ERREUR : Utilisez au moins 12 caractères. Certains caractères spéciaux ou emojis occupent davantage d’espace ; le mot de passe ne doit pas dépasser la limite technique autorisée.";
            errorDiv.classList.remove('hidden');
        }
        return;
    }

    if (newPassword.trim().length === 0) {
        if (errorDiv) {
            errorDiv.textContent = "ERREUR : Le nouveau mot de passe ne peut pas être composé uniquement d'espaces.";
            errorDiv.classList.remove('hidden');
        }
        return;
    }

    const storedUser = localStorage.getItem('cyberScopeUser');
    if (!storedUser) {
        window.location.replace("index.html?auth=required");
        return;
    }

    let user;
    try {
        user = JSON.parse(storedUser);
    } catch (e) {
        window.location.replace("index.html?auth=required");
        return;
    }

    // Désactivation des contrôles pour éviter les doubles soumissions
    if (currentPasswordInput) currentPasswordInput.disabled = true;
    if (newPasswordInput) newPasswordInput.disabled = true;
    if (confirmPasswordInput) confirmPasswordInput.disabled = true;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Modification en cours...";
    }

    try {
        const response = await fetch(`${strapiBaseUrl}/api/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                password: newPassword,
                passwordConfirmation: confirmPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Mettre à jour uniquement la propriété token dans le localStorage
            const newUserData = {
                ...user,
                token: data.jwt
            };

            // Etape de validation du nouveau JWT reçu avant d'enregistrer le succès final
            const validateResponse = await fetch(`${strapiBaseUrl}/api/users/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.jwt}`
                }
            });

            if (validateResponse.ok) {
                // Enregistrement définitif du nouveau token
                localStorage.setItem('cyberScopeUser', JSON.stringify(newUserData));
                
                if (successDiv) {
                    successDiv.textContent = "Mot de passe modifié avec succès.";
                    successDiv.classList.remove('hidden');
                }

                // Vider les champs sensibles
                if (currentPasswordInput) currentPasswordInput.value = '';
                if (newPasswordInput) newPasswordInput.value = '';
                if (confirmPasswordInput) confirmPasswordInput.value = '';
            } else {
                // Le nouveau JWT n'a pas été accepté par Strapi
                if (typeof handleLogout === 'function') handleLogout();
                else localStorage.removeItem('cyberScopeUser');
                window.location.replace("index.html?auth=expired");
            }
        } else {
            const errorMsg = data?.error?.message || "Une erreur est survenue lors de la modification du mot de passe.";
            if (errorDiv) {
                errorDiv.textContent = `ERREUR : ${errorMsg}`;
                errorDiv.classList.remove('hidden');
            }
        }
    } catch (error) {
        console.error('Erreur réseau lors de la modification du mot de passe:', error);
        if (errorDiv) {
            errorDiv.textContent = "ERREUR : Impossible de contacter le serveur de sécurité.";
            errorDiv.classList.remove('hidden');
        }
    } finally {
        // Réactivation des contrôles
        if (currentPasswordInput) currentPasswordInput.disabled = false;
        if (newPasswordInput) newPasswordInput.disabled = false;
        if (confirmPasswordInput) confirmPasswordInput.disabled = false;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Modifier mon mot de passe";
        }
    }
}

/**
 * Déconnecte l'utilisateur actuel et le redirige vers l'accueil.
 *
 * @returns {void}
 */
function handleEspaceLogout() {
    if (typeof handleLogout === 'function') {
        handleLogout();
    } else {
        localStorage.removeItem('cyberScopeUser');
    }
    window.location.replace("index.html");
}

// Initialisation au chargement de la page (hors Jest)
document.addEventListener('DOMContentLoaded', () => {
    if (typeof process === 'undefined' || !process.env || process.env.NODE_ENV !== 'test') {
        initMonEspace();
        const retryBtn = document.getElementById('btn-retry-session');
        if (retryBtn) {
            retryBtn.addEventListener('click', initMonEspace);
        }
    }
});

// Exportation des modules pour Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMonEspace,
        handleChangePasswordSubmit,
        handleEspaceLogout
    };
}
