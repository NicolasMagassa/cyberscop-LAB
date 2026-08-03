/**
 * @file tests/mon-espace.test.js
 * @description Suite de tests unitaires pour le script assets/JS/mon-espace.js.
 * Valide l'affichage du profil, les validations client, le changement de mot de passe,
 * le renouvellement sécurisé de JWT et le cycle de déconnexion.
 */

/**
 * Suite principale testant la logique applicative de mon-espace.js
 */
describe('Mon Espace Frontend Logic', () => {
    let mockElement;
    let mockWelcomeName;
    let mockUsernameVal;
    let mockEmailVal;
    let mockConfirmedVal;
    let mockCreatedVal;
    let mockLoadingContainer;
    let mockDetailsContainer;
    let mockErrorContainer;
    let mockRetryBtn;

    let mockCurrentPasswordInput;
    let mockNewPasswordInput;
    let mockConfirmPasswordInput;
    let mockSubmitBtn;
    let mockErrorDiv;
    let mockSuccessDiv;

    let originalFetch;
    let originalWindow;
    let originalDocument;
    let mockEvent;

    /**
     * Configuration initiale avant chaque test.
     * Mocke les variables globales window, document, fetch et localStorage.
     */
    beforeEach(() => {
        jest.clearAllMocks();

        // Mocks pour les éléments du DOM
        mockWelcomeName = { textContent: '' };
        mockUsernameVal = { textContent: '' };
        mockEmailVal = { textContent: '' };
        mockConfirmedVal = { textContent: '', className: '' };
        mockCreatedVal = { textContent: '' };
        mockLoadingContainer = { classList: { add: jest.fn(), remove: jest.fn() } };
        mockDetailsContainer = { classList: { add: jest.fn(), remove: jest.fn() } };
        mockErrorContainer = { classList: { add: jest.fn(), remove: jest.fn() } };
        mockRetryBtn = { addEventListener: jest.fn() };

        mockCurrentPasswordInput = { value: '', disabled: false };
        mockNewPasswordInput = { value: '', disabled: false };
        mockConfirmPasswordInput = { value: '', disabled: false };
        mockSubmitBtn = { disabled: false, textContent: '' };
        mockErrorDiv = { textContent: '', classList: { add: jest.fn(), remove: jest.fn() } };
        mockSuccessDiv = { textContent: '', classList: { add: jest.fn(), remove: jest.fn() } };

        mockEvent = { preventDefault: jest.fn() };

        // Backup des variables globales
        originalFetch = global.fetch;
        global.fetch = jest.fn();
        originalWindow = global.window;
        originalDocument = global.document;

        // Mock document
        global.document = {
            getElementById: jest.fn().mockImplementation((id) => {
                if (id === 'user-display-welcome') return mockWelcomeName;
                if (id === 'user-username') return mockUsernameVal;
                if (id === 'user-email') return mockEmailVal;
                if (id === 'user-confirmed') return mockConfirmedVal;
                if (id === 'user-created') return mockCreatedVal;
                if (id === 'account-loading') return mockLoadingContainer;
                if (id === 'account-details') return mockDetailsContainer;
                if (id === 'network-error-container') return mockErrorContainer;
                if (id === 'btn-retry-session') return mockRetryBtn;

                if (id === 'current-password-input') return mockCurrentPasswordInput;
                if (id === 'new-password-input') return mockNewPasswordInput;
                if (id === 'confirm-password-input') return mockConfirmPasswordInput;
                if (id === 'btn-submit-password') return mockSubmitBtn;
                if (id === 'change-password-error') return mockErrorDiv;
                if (id === 'change-password-success') return mockSuccessDiv;

                return null;
            }),
            addEventListener: jest.fn()
        };

        // Mock window
        global.window = {
            location: {
                replace: jest.fn()
            }
        };

        // Mock localStorage
        global.localStorage = {
            setItem: jest.fn(),
            getItem: jest.fn(),
            removeItem: jest.fn()
        };

        // Mock global handleLogout
        global.handleLogout = jest.fn();

        // Clear cache
        delete require.cache[require.resolve('../assets/JS/mon-espace.js')];
    });

    /**
     * Nettoyage après chaque test.
     * Restaure les variables globales originales.
     */
    afterEach(() => {
        global.fetch = originalFetch;
        global.window = originalWindow;
        global.document = originalDocument;
    });

    /**
     * Groupe de tests pour la fonction initMonEspace
     */
    describe('initMonEspace', () => {
        /**
         * @test Redirection si session absente
         */
        test('devrait rediriger vers index.html?auth=required si la session est absente de localStorage', async () => {
            global.localStorage.getItem.mockReturnValueOnce(null);
            const monEspace = require('../assets/JS/mon-espace.js');

            await monEspace.initMonEspace();

            expect(global.handleLogout).toHaveBeenCalled();
            expect(global.window.location.replace).toHaveBeenCalledWith("index.html?auth=required");
        });

        /**
         * @test Redirection si session corrompue
         */
        test('devrait rediriger vers index.html?auth=required si le JSON stocké est corrompu', async () => {
            global.localStorage.getItem.mockReturnValueOnce("json-invalide-corrompu");
            const monEspace = require('../assets/JS/mon-espace.js');

            await monEspace.initMonEspace();

            expect(global.handleLogout).toHaveBeenCalled();
            expect(global.window.location.replace).toHaveBeenCalledWith("index.html?auth=required");
        });

        /**
         * @test Affichage des informations de profil
         */
        test('devrait appeler /api/users/me avec le Bearer token si la session est présente', async () => {
            const fakeSession = { username: 'testuser', token: 'token-jwt-secret-999' };
            global.localStorage.getItem.mockReturnValueOnce(JSON.stringify(fakeSession));
            
            global.fetch = jest.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    username: 'testuser',
                    email: 'test@cyberscop.lab',
                    confirmed: true,
                    createdAt: '2026-07-29T10:00:00.000Z'
                })
            });

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.initMonEspace();

            expect(global.fetch).toHaveBeenCalledWith('http://localhost:1337/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer token-jwt-secret-999'
                }
            });

            expect(mockWelcomeName.textContent).toBe('testuser');
            expect(mockUsernameVal.textContent).toBe('testuser');
            expect(mockEmailVal.textContent).toBe('test@cyberscop.lab');
            expect(mockConfirmedVal.textContent).toBe('Adresse e-mail confirmée');
            expect(mockCreatedVal.textContent).toContain('29/07/2026'); // Format français
            expect(mockDetailsContainer.classList.remove).toHaveBeenCalledWith('hidden');
        });

        /**
         * @test Gestion de l'expiration du token JWT
         */
        test('devrait rediriger vers index.html?auth=expired sur une réponse 401 ou 403 (session expirée)', async () => {
            const fakeSession = { username: 'testuser', token: 'token-expiré' };
            global.localStorage.getItem.mockReturnValueOnce(JSON.stringify(fakeSession));
            
            global.fetch = jest.fn().mockResolvedValueOnce({
                ok: false,
                status: 401
            });

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.initMonEspace();

            expect(global.handleLogout).toHaveBeenCalled();
            expect(global.window.location.replace).toHaveBeenCalledWith("index.html?auth=expired");
        });

        /**
         * @test Résilience en cas d'erreur réseau
         */
        test('devrait conserver la session locale en cas d\'erreur réseau (panne réseau)', async () => {
            const fakeSession = { username: 'testuser', token: 'token-valide-mais-panne' };
            global.localStorage.getItem.mockReturnValueOnce(JSON.stringify(fakeSession));
            
            global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network connection lost"));

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.initMonEspace();

            // Pas de déconnexion ni de redirection
            expect(global.handleLogout).not.toHaveBeenCalled();
            expect(global.window.location.replace).not.toHaveBeenCalled();

            // Affiche la zone d'erreur réseau et masque le chargement
            expect(mockErrorContainer.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockLoadingContainer.classList.add).toHaveBeenCalledWith('hidden');
        });
    });

    /**
     * Groupe de tests pour la modification de mot de passe (handleChangePasswordSubmit)
     */
    describe('handleChangePasswordSubmit', () => {
        /**
         * @test Blocage si champs vides
         */
        test('devrait bloquer la soumission et afficher une erreur si un des champs est vide', async () => {
            mockCurrentPasswordInput.value = '';
            mockNewPasswordInput.value = 'newpassword123';
            mockConfirmPasswordInput.value = 'newpassword123';

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.handleChangePasswordSubmit(mockEvent);

            expect(mockErrorDiv.textContent).toBe("Tous les champs sont obligatoires.");
            expect(mockErrorDiv.classList.remove).toHaveBeenCalledWith('hidden');
            expect(global.fetch).not.toHaveBeenCalled();
        });

        /**
         * @test Blocage si nouveau mot de passe identique à l'ancien
         */
        test('devrait bloquer la soumission si le nouveau mot de passe est identique à l\'actuel', async () => {
            mockCurrentPasswordInput.value = 'samepass';
            mockNewPasswordInput.value = 'samepass';
            mockConfirmPasswordInput.value = 'samepass';

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.handleChangePasswordSubmit(mockEvent);

            expect(mockErrorDiv.textContent).toBe("Le nouveau mot de passe doit être différent du mot de passe actuel.");
            expect(mockErrorDiv.classList.remove).toHaveBeenCalledWith('hidden');
            expect(global.fetch).not.toHaveBeenCalled();
        });

        /**
         * @test Blocage si non concordance de confirmation
         */
        test('devrait bloquer la soumission si la confirmation ne correspond pas', async () => {
            mockCurrentPasswordInput.value = 'oldpass';
            mockNewPasswordInput.value = 'newpass123';
            mockConfirmPasswordInput.value = 'differentpass';

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.handleChangePasswordSubmit(mockEvent);

            expect(mockErrorDiv.textContent).toBe("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
            expect(mockErrorDiv.classList.remove).toHaveBeenCalledWith('hidden');
            expect(global.fetch).not.toHaveBeenCalled();
        });

        /**
         * @test Blocage si mot de passe trop court
         */
        test('devrait bloquer la soumission si la longueur est inférieure à 12 caractères', async () => {
            mockCurrentPasswordInput.value = 'oldpass';
            mockNewPasswordInput.value = 'newpass';
            mockConfirmPasswordInput.value = 'newpass';

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.handleChangePasswordSubmit(mockEvent);

            expect(mockErrorDiv.textContent).toBe("ERREUR : Utilisez au moins 12 caractères. Certains caractères spéciaux ou emojis occupent davantage d’espace ; le mot de passe ne doit pas dépasser la limite technique autorisée.");
            expect(mockErrorDiv.classList.remove).toHaveBeenCalledWith('hidden');
            expect(global.fetch).not.toHaveBeenCalled();
        });

        test('devrait bloquer la soumission si la taille dépasse 72 octets', async () => {
            mockCurrentPasswordInput.value = 'oldpass';
            const tooLong = "💻".repeat(19); // 19 * 4 = 76 octets
            mockNewPasswordInput.value = tooLong;
            mockConfirmPasswordInput.value = tooLong;

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.handleChangePasswordSubmit(mockEvent);

            expect(mockErrorDiv.textContent).toBe("ERREUR : Utilisez au moins 12 caractères. Certains caractères spéciaux ou emojis occupent davantage d’espace ; le mot de passe ne doit pas dépasser la limite technique autorisée.");
            expect(mockErrorDiv.classList.remove).toHaveBeenCalledWith('hidden');
            expect(global.fetch).not.toHaveBeenCalled();
        });

        test('devrait bloquer la soumission si le mot de passe est composé uniquement d\'espaces', async () => {
            mockCurrentPasswordInput.value = 'oldpass';
            mockNewPasswordInput.value = '            ';
            mockConfirmPasswordInput.value = '            ';

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.handleChangePasswordSubmit(mockEvent);

            expect(mockErrorDiv.textContent).toBe("ERREUR : Le nouveau mot de passe ne peut pas être composé uniquement d'espaces.");
            expect(mockErrorDiv.classList.remove).toHaveBeenCalledWith('hidden');
            expect(global.fetch).not.toHaveBeenCalled();
        });

        /**
         * @test Prévention des doubles soumissions
         */
        test('devrait désactiver les contrôles pour empêcher la double soumission pendant le traitement', async () => {
            mockCurrentPasswordInput.value = 'oldpass';
            mockNewPasswordInput.value = 'newpassword123';
            mockConfirmPasswordInput.value = 'newpassword123';

            const fakeSession = { username: 'testuser', token: 'token-jwt-xyz' };
            global.localStorage.getItem.mockReturnValue(JSON.stringify(fakeSession));

            // Simuler fetch en suspens pour le premier appel et immédiat pour le second
            let fetchPromiseResolver;
            global.fetch = jest.fn().mockImplementation((url) => {
                if (url.includes('change-password')) {
                    return new Promise((resolve) => {
                        fetchPromiseResolver = resolve;
                    });
                }
                // Deuxième appel de validation du nouveau token
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ username: 'testuser' })
                });
            });

            const monEspace = require('../assets/JS/mon-espace.js');
            const submitPromise = monEspace.handleChangePasswordSubmit(mockEvent);

            // Doit être désactivé
            expect(mockCurrentPasswordInput.disabled).toBe(true);
            expect(mockNewPasswordInput.disabled).toBe(true);
            expect(mockConfirmPasswordInput.disabled).toBe(true);
            expect(mockSubmitBtn.disabled).toBe(true);
            expect(mockSubmitBtn.textContent).toBe("Modification en cours...");

            // Résoudre le fetch
            fetchPromiseResolver({
                ok: true,
                json: async () => ({ jwt: 'new-token-abc' })
            });

            await submitPromise;
        });

        /**
         * @test Modification réussie et renouvellement/validation du JWT
         */
        test('devrait soumettre, enregistrer le nouveau JWT, vider les champs et valider le nouveau JWT', async () => {
            mockCurrentPasswordInput.value = 'oldpass';
            mockNewPasswordInput.value = 'newpassword123';
            mockConfirmPasswordInput.value = 'newpassword123';

            const fakeSession = { username: 'testuser', token: 'token-jwt-xyz' };
            global.localStorage.getItem.mockReturnValue(JSON.stringify(fakeSession));

            // Premier fetch : POST /api/auth/change-password
            // Deuxième fetch : GET /api/users/me (validation du nouveau token)
            global.fetch = jest.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ jwt: 'new-token-abc' })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ username: 'testuser' })
                });

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.handleChangePasswordSubmit(mockEvent);

            // Vérifier le post
            expect(global.fetch).toHaveBeenNthCalledWith(1, 'http://localhost:1337/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token-jwt-xyz'
                },
                body: JSON.stringify({
                    currentPassword: 'oldpass',
                    password: 'newpassword123',
                    passwordConfirmation: 'newpassword123'
                })
            });

            // Vérifier l'étape de validation du JWT
            expect(global.fetch).toHaveBeenNthCalledWith(2, 'http://localhost:1337/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer new-token-abc'
                }
            });

            // Vérifier la mise à jour du localStorage
            expect(global.localStorage.setItem).toHaveBeenCalledWith('cyberScopeUser', JSON.stringify({
                username: 'testuser',
                token: 'new-token-abc'
            }));

            // Vérifier le nettoyage des champs
            expect(mockCurrentPasswordInput.value).toBe('');
            expect(mockNewPasswordInput.value).toBe('');
            expect(mockConfirmPasswordInput.value).toBe('');
            expect(mockSuccessDiv.textContent).toBe("Mot de passe modifié avec succès.");
            expect(mockSuccessDiv.classList.remove).toHaveBeenCalledWith('hidden');
        });

        /**
         * @test Echec de validation du nouveau JWT
         */
        test('devrait déconnecter l\'utilisateur et rediriger si la validation du nouveau JWT échoue', async () => {
            mockCurrentPasswordInput.value = 'oldpass';
            mockNewPasswordInput.value = 'newpassword123';
            mockConfirmPasswordInput.value = 'newpassword123';

            const fakeSession = { username: 'testuser', token: 'token-jwt-xyz' };
            global.localStorage.getItem.mockReturnValue(JSON.stringify(fakeSession));

            // Premier fetch ok, deuxième fetch de validation non ok
            global.fetch = jest.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ jwt: 'new-token-abc' })
                })
                .mockResolvedValueOnce({
                    ok: false,
                    status: 401
                });

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.handleChangePasswordSubmit(mockEvent);

            expect(global.handleLogout).toHaveBeenCalled();
            expect(global.window.location.replace).toHaveBeenCalledWith("index.html?auth=expired");
        });
    });

    /**
     * Groupe de tests pour la fonction handleEspaceLogout
     */
    describe('handleEspaceLogout', () => {
        /**
         * @test Déconnexion réussie
         */
        test('devrait appeler handleLogout et rediriger vers index.html', () => {
            const monEspace = require('../assets/JS/mon-espace.js');
            monEspace.handleEspaceLogout();

            expect(global.handleLogout).toHaveBeenCalled();
            expect(global.window.location.replace).toHaveBeenCalledWith("index.html");
        });
    });

    /**
     * Groupe de tests pour la suppression de compte (Zone sensible et modale)
     */
    describe('Account Deletion UI Logic', () => {
        let mockDeleteAccountModal;
        let mockDeletePasswordInput;
        let mockDeleteConfirmInput;
        let mockDeleteAckCheckbox;
        let mockDeleteConfirmSubmit;
        let mockDeleteAccountError;
        let originalGetElementById;

        beforeEach(() => {
            mockDeleteAccountModal = { classList: { add: jest.fn(), remove: jest.fn() } };
            mockDeletePasswordInput = { value: '', disabled: false };
            mockDeleteConfirmInput = { value: '', disabled: false };
            mockDeleteAckCheckbox = { checked: false, disabled: false };
            mockDeleteConfirmSubmit = { disabled: true, textContent: '' };
            mockDeleteAccountError = { textContent: '', classList: { add: jest.fn(), remove: jest.fn() } };

            originalGetElementById = global.document.getElementById;
            global.document.getElementById = jest.fn().mockImplementation((id) => {
                if (id === 'delete-account-modal') return mockDeleteAccountModal;
                if (id === 'delete-password-input') return mockDeletePasswordInput;
                if (id === 'delete-confirm-input') return mockDeleteConfirmInput;
                if (id === 'delete-acknowledge-checkbox') return mockDeleteAckCheckbox;
                if (id === 'btn-delete-confirm-submit') return mockDeleteConfirmSubmit;
                if (id === 'delete-account-error') return mockDeleteAccountError;
                return originalGetElementById(id);
            });
        });

        afterEach(() => {
            global.document.getElementById = originalGetElementById;
        });

        test('openDeleteAccountModal devrait ouvrir la modale', () => {
            const monEspace = require('../assets/JS/mon-espace.js');
            monEspace.openDeleteAccountModal();
            expect(mockDeleteAccountModal.classList.remove).toHaveBeenCalledWith('hidden');
        });

        test('closeDeleteAccountModal devrait vider les inputs, décocher la case et masquer la modale', () => {
            mockDeletePasswordInput.value = 'some_val';
            mockDeleteConfirmInput.value = 'some_val';
            mockDeleteAckCheckbox.checked = true;
            mockDeleteConfirmSubmit.disabled = false;

            const monEspace = require('../assets/JS/mon-espace.js');
            monEspace.closeDeleteAccountModal();

            expect(mockDeleteAccountModal.classList.add).toHaveBeenCalledWith('hidden');
            expect(mockDeletePasswordInput.value).toBe('');
            expect(mockDeleteConfirmInput.value).toBe('');
            expect(mockDeleteAckCheckbox.checked).toBe(false);
            expect(mockDeleteConfirmSubmit.disabled).toBe(true);
            expect(mockDeleteAccountError.classList.add).toHaveBeenCalledWith('hidden');
        });

        test('validateDeleteButtonState devrait activer le bouton si mdp, confirmText === SUPPRIMER et case cochée', () => {
            const monEspace = require('../assets/JS/mon-espace.js');

            // 1. Les trois vides/décochés -> désactivé
            mockDeletePasswordInput.value = '';
            mockDeleteConfirmInput.value = '';
            mockDeleteAckCheckbox.checked = false;
            monEspace.validateDeleteButtonState();
            expect(mockDeleteConfirmSubmit.disabled).toBe(true);

            // 2. Mdp et confirm corrects, mais non cochée -> désactivé
            mockDeletePasswordInput.value = 'mypass';
            mockDeleteConfirmInput.value = 'SUPPRIMER';
            mockDeleteAckCheckbox.checked = false;
            monEspace.validateDeleteButtonState();
            expect(mockDeleteConfirmSubmit.disabled).toBe(true);

            // 3. Les trois corrects -> activé
            mockDeletePasswordInput.value = 'mypass';
            mockDeleteConfirmInput.value = 'SUPPRIMER';
            mockDeleteAckCheckbox.checked = true;
            monEspace.validateDeleteButtonState();
            expect(mockDeleteConfirmSubmit.disabled).toBe(false);
        });

        test('handleDeleteAccountSubmit devrait soumettre acknowledged et rediriger vers deleted-email-ok en cas de succès Brevo', async () => {
            mockDeletePasswordInput.value = 'valid_pass';
            mockDeleteConfirmInput.value = 'SUPPRIMER';
            mockDeleteAckCheckbox.checked = true;

            global.localStorage.getItem.mockReturnValue(JSON.stringify({
                username: 'agent',
                token: 'valid-token-jwt'
            }));

            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ success: true, emailSent: true })
            });

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.handleDeleteAccountSubmit(mockEvent);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/account/delete'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer valid-token-jwt'
                    }),
                    body: JSON.stringify({
                        password: 'valid_pass',
                        confirmText: 'SUPPRIMER',
                        acknowledged: true
                    })
                })
            );

            expect(global.localStorage.removeItem).toHaveBeenCalledWith('cyberScopeUser');
            expect(global.window.location.replace).toHaveBeenCalledWith('index.html?account=deleted-email-ok');
        });

        test('handleDeleteAccountSubmit devrait rediriger vers deleted-email-fail en cas d\'échec Brevo', async () => {
            mockDeletePasswordInput.value = 'valid_pass';
            mockDeleteConfirmInput.value = 'SUPPRIMER';
            mockDeleteAckCheckbox.checked = true;

            global.localStorage.getItem.mockReturnValue(JSON.stringify({
                username: 'agent',
                token: 'valid-token-jwt'
            }));

            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ success: true, emailSent: false })
            });

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.handleDeleteAccountSubmit(mockEvent);

            expect(global.localStorage.removeItem).toHaveBeenCalledWith('cyberScopeUser');
            expect(global.window.location.replace).toHaveBeenCalledWith('index.html?account=deleted-email-fail');
        });

        test('handleDeleteAccountSubmit devrait vider le mot de passe, décocher et afficher l\'erreur en cas d\'échec API', async () => {
            mockDeletePasswordInput.value = 'invalid_pass';
            mockDeleteConfirmInput.value = 'SUPPRIMER';
            mockDeleteAckCheckbox.checked = true;

            global.localStorage.getItem.mockReturnValue(JSON.stringify({
                username: 'agent',
                token: 'valid-token-jwt'
            }));

            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                json: async () => ({
                    error: { message: 'Mot de passe incorrect.' }
                })
            });

            const monEspace = require('../assets/JS/mon-espace.js');
            await monEspace.handleDeleteAccountSubmit(mockEvent);

            expect(mockDeleteAccountError.textContent).toBe('Mot de passe incorrect.');
            expect(mockDeleteAccountError.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockDeletePasswordInput.value).toBe(''); // Mot de passe vidé
            expect(mockDeletePasswordInput.disabled).toBe(false); // Réactivé
            expect(mockDeleteAckCheckbox.disabled).toBe(false); // Réactivé
            expect(mockDeleteConfirmSubmit.disabled).toBe(true); // Redésactivé (car mdp vide)
        });
    });
});
