/**
 * @file tests/reset-password.test.js
 * @description Suite de tests unitaires pour reset-password.js.
 * Couvre l'extraction du jeton de réinitialisation, les validations de champs,
 * les appels d'API Strapi correspondants et les mécanismes de panne réseau.
 */

/**
 * Suite principale testant la logique frontend de réinitialisation de mot de passe
 */
describe('Reset Password Frontend Logic', () => {
    let mockElement;
    let mockAddEventListener;
    let originalFetch;
    let originalWindow;
    let originalDocument;

    /**
     * Initialisation et configuration globale avant chaque test.
     * Mocke window, document, fetch, localStorage, sessionStorage.
     */
    beforeEach(() => {
        jest.clearAllMocks();

        mockAddEventListener = jest.fn();
        mockElement = {
            addEventListener: mockAddEventListener,
            classList: {
                add: jest.fn(),
                remove: jest.fn(),
                contains: jest.fn(),
                toggle: jest.fn()
            },
            disabled: false,
            value: '',
            textContent: '',
            required: false
        };

        // Backup original globals
        originalFetch = global.fetch;
        originalWindow = global.window;
        originalDocument = global.document;

        // Mock document
        global.document = {
            getElementById: jest.fn().mockReturnValue(mockElement),
            addEventListener: jest.fn(),
            title: 'Test Title'
        };

        // Mock window
        global.window = {
            location: {
                search: '?code=valid-test-token-123',
                pathname: '/reset-password.html'
            },
            history: {
                replaceState: jest.fn()
            }
        };

        // Mock localStorage/sessionStorage to verify no storage
        global.localStorage = {
            setItem: jest.fn(),
            getItem: jest.fn()
        };
        global.sessionStorage = {
            setItem: jest.fn(),
            getItem: jest.fn()
        };

        global.fetch = jest.fn();

        // Clear require cache for the module under test
        delete require.cache[require.resolve('../assets/JS/reset-password.js')];
    });

    /**
     * Restauration des variables globales originales.
     */
    afterEach(() => {
        global.fetch = originalFetch;
        global.window = originalWindow;
        global.document = originalDocument;
    });

    /**
     * @test Extraction du code dans l'URL
     */
    test('devrait extraire le code de réinitialisation de l\'URL', () => {
        const resetPassword = require('../assets/JS/reset-password.js');
        expect(resetPassword.getResetCode()).toBe('valid-test-token-123');
    });

    /**
     * @test Comportement sans code dans l'URL
     */
    test('devrait désactiver le formulaire et afficher un message si le code est absent', () => {
        global.window.location.search = '';
        const resetPassword = require('../assets/JS/reset-password.js');
        
        resetPassword.initResetPassword();

        expect(global.document.getElementById).toHaveBeenCalledWith('reset-message');
        expect(mockElement.textContent).toBe("Le lien de réinitialisation est invalide ou incomplet.");
        expect(mockElement.disabled).toBe(true);
    });

    /**
     * @test Comportement avec code vide dans l'URL
     */
    test('devrait désactiver le formulaire et afficher un message si le code est vide', () => {
        global.window.location.search = '?code=';
        const resetPassword = require('../assets/JS/reset-password.js');
        
        resetPassword.initResetPassword();

        expect(mockElement.textContent).toBe("Le lien de réinitialisation est invalide ou incomplet.");
        expect(mockElement.disabled).toBe(true);
    });

    /**
     * @test Écouteur submit
     */
    test('devrait enregistrer un écouteur d\'événement submit si le code est présent', () => {
        const resetPassword = require('../assets/JS/reset-password.js');
        
        resetPassword.initResetPassword();

        expect(global.document.getElementById).toHaveBeenCalledWith('reset-password-form');
        expect(mockAddEventListener).toHaveBeenCalledWith('submit', expect.any(Function));
    });

    /**
     * @test Blocage si champs de mot de passe vides
     */
    test('devrait bloquer la soumission et afficher une erreur si les mots de passe sont vides', async () => {
        const resetPassword = require('../assets/JS/reset-password.js');
        
        // Mock inputs as empty
        const mockFormEvent = { preventDefault: jest.fn() };
        mockElement.value = ''; // returns empty values for inputs
        
        await resetPassword.handleResetPasswordSubmit(mockFormEvent, 'valid-code');

        expect(mockElement.textContent).toBe("ERREUR: Les mots de passe ne peuvent pas être vides.");
        expect(mockClassListContainsError()).toBe(true);
    });

    /**
     * @test Blocage si non concordance des mots de passe
     */
    test('devrait bloquer la soumission et afficher une erreur si les mots de passe sont différents', async () => {
        const resetPassword = require('../assets/JS/reset-password.js');
        
        const mockFormEvent = { preventDefault: jest.fn() };
        
        // Mock getElementById to return different inputs
        const passwordInput = { value: 'password123', disabled: false };
        const confirmInput = { value: 'password456', disabled: false };
        const messageContainer = { textContent: '', classList: { remove: jest.fn(), add: jest.fn() } };
        
        global.document.getElementById.mockImplementation((id) => {
            if (id === 'new-password-input') return passwordInput;
            if (id === 'confirm-password-input') return confirmInput;
            if (id === 'reset-message') return messageContainer;
            return mockElement;
        });

        await resetPassword.handleResetPasswordSubmit(mockFormEvent, 'valid-code');

        expect(messageContainer.textContent).toBe("ERREUR: Les mots de passe ne correspondent pas.");
    });

    /**
     * @test Appel d'API réussi et réinitialisation de mot de passe confirmée
     */
    test('devrait appeler Strapi avec les bonnes informations et gérer le succès', async () => {
        const resetPassword = require('../assets/JS/reset-password.js');
        
        const mockFormEvent = { preventDefault: jest.fn() };
        
        const passwordInput = { value: 'securepassword', disabled: false };
        const confirmInput = { value: 'securepassword', disabled: false };
        const submitBtn = { textContent: 'Soumettre', disabled: false };
        const messageContainer = { textContent: '', classList: { remove: jest.fn(), add: jest.fn() } };
        const loginLinkContainer = { classList: { remove: jest.fn() } };

        global.document.getElementById.mockImplementation((id) => {
            if (id === 'new-password-input') return passwordInput;
            if (id === 'confirm-password-input') return confirmInput;
            if (id === 'reset-submit-btn') return submitBtn;
            if (id === 'reset-message') return messageContainer;
            if (id === 'login-link-container') return loginLinkContainer;
            return mockElement;
        });

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ ok: true })
        });

        await resetPassword.handleResetPasswordSubmit(mockFormEvent, 'test-token');

        // Check fetch payload
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:1337/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: 'test-token',
                password: 'securepassword',
                passwordConfirmation: 'securepassword'
            })
        });

        // Check success changes
        expect(messageContainer.textContent).toBe("Votre mot de passe a été réinitialisé avec succès.");
        expect(window.history.replaceState).toHaveBeenCalledWith({}, 'Test Title', '/reset-password.html');
        expect(passwordInput.value).toBe('');
        expect(confirmInput.value).toBe('');
        expect(submitBtn.disabled).toBe(true);
        expect(loginLinkContainer.classList.remove).toHaveBeenCalledWith('hidden');

        // Verify token was not stored anywhere
        expect(global.localStorage.setItem).not.toHaveBeenCalled();
        expect(global.sessionStorage.setItem).not.toHaveBeenCalled();
    });

    /**
     * @test Désactivation des champs pendant la soumission
     */
    test('devrait désactiver le bouton de soumission et afficher "Réinitialisation en cours…" pendant l\'envoi', async () => {
        const resetPassword = require('../assets/JS/reset-password.js');
        
        const mockFormEvent = { preventDefault: jest.fn() };
        
        const passwordInput = { value: 'securepassword', disabled: false };
        const confirmInput = { value: 'securepassword', disabled: false };
        const submitBtn = { textContent: 'Soumettre', disabled: false };
        const messageContainer = { textContent: '', classList: { remove: jest.fn(), add: jest.fn() } };

        global.document.getElementById.mockImplementation((id) => {
            if (id === 'new-password-input') return passwordInput;
            if (id === 'confirm-password-input') return confirmInput;
            if (id === 'reset-submit-btn') return submitBtn;
            if (id === 'reset-message') return messageContainer;
            return mockElement;
        });

        // Use custom promise to hold the response and verify state
        let resolveFetch;
        const fetchPromise = new Promise((resolve) => {
            resolveFetch = resolve;
        });
        global.fetch = jest.fn().mockReturnValue(fetchPromise);

        const submitPromise = resetPassword.handleResetPasswordSubmit(mockFormEvent, 'test-token');

        // Verify button is disabled and text is modified during request
        expect(submitBtn.disabled).toBe(true);
        expect(submitBtn.textContent).toBe('Réinitialisation en cours…');
        expect(passwordInput.disabled).toBe(true);
        expect(confirmInput.disabled).toBe(true);

        resolveFetch({
            ok: true,
            json: async () => ({ ok: true })
        });

        await submitPromise;
    });

    /**
     * @test Gestion des erreurs retournées par l'API Strapi (JWT incorrect/expiré)
     */
    test('devrait gérer l\'erreur retournée par Strapi si l\'authentification échoue (statut non-ok)', async () => {
        const resetPassword = require('../assets/JS/reset-password.js');
        
        const mockFormEvent = { preventDefault: jest.fn() };
        
        const passwordInput = { value: 'securepassword', disabled: false };
        const confirmInput = { value: 'securepassword', disabled: false };
        const submitBtn = { textContent: 'Soumettre', disabled: false };
        const messageContainer = { textContent: '', classList: { remove: jest.fn(), add: jest.fn() } };

        global.document.getElementById.mockImplementation((id) => {
            if (id === 'new-password-input') return passwordInput;
            if (id === 'confirm-password-input') return confirmInput;
            if (id === 'reset-submit-btn') return submitBtn;
            if (id === 'reset-message') return messageContainer;
            return mockElement;
        });

        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ error: { message: 'Incorrect code' } })
        });

        await resetPassword.handleResetPasswordSubmit(mockFormEvent, 'test-token');

        expect(messageContainer.textContent).toBe("Ce lien est invalide, expiré ou a déjà été utilisé.");
        expect(submitBtn.disabled).toBe(false); // Re-enabled
        expect(submitBtn.textContent).toBe('Soumettre');
    });

    /**
     * @test Gestion de l'inaccessibilité réseau (panne de serveur)
     */
    test('devrait gérer l\'erreur de panne réseau', async () => {
        const resetPassword = require('../assets/JS/reset-password.js');
        
        const mockFormEvent = { preventDefault: jest.fn() };
        
        const passwordInput = { value: 'securepassword', disabled: false };
        const confirmInput = { value: 'securepassword', disabled: false };
        const submitBtn = { textContent: 'Soumettre', disabled: false };
        const messageContainer = { textContent: '', classList: { remove: jest.fn(), add: jest.fn() } };

        global.document.getElementById.mockImplementation((id) => {
            if (id === 'new-password-input') return passwordInput;
            if (id === 'confirm-password-input') return confirmInput;
            if (id === 'reset-submit-btn') return submitBtn;
            if (id === 'reset-message') return messageContainer;
            return mockElement;
        });

        global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'));

        await resetPassword.handleResetPasswordSubmit(mockFormEvent, 'test-token');

        expect(messageContainer.textContent).toBe("Impossible de contacter le serveur. Veuillez réessayer plus tard.");
        expect(submitBtn.disabled).toBe(false); // Re-enabled
    });

    /**
     * @test Validations de la politique de mot de passe (Points de code, octets, espaces)
     */
    test('devrait rejeter un mot de passe de moins de 12 points de code', async () => {
        const resetPassword = require('../assets/JS/reset-password.js');
        const mockFormEvent = { preventDefault: jest.fn() };
        
        const passwordInput = { value: '12345678901', disabled: false }; // 11 chars
        const confirmInput = { value: '12345678901', disabled: false };
        const submitBtn = { textContent: 'Soumettre', disabled: false };
        const messageContainer = { textContent: '', classList: { remove: jest.fn(), add: jest.fn() } };

        global.document.getElementById.mockImplementation((id) => {
            if (id === 'new-password-input') return passwordInput;
            if (id === 'confirm-password-input') return confirmInput;
            if (id === 'reset-submit-btn') return submitBtn;
            if (id === 'reset-message') return messageContainer;
            return mockElement;
        });

        await resetPassword.handleResetPasswordSubmit(mockFormEvent, 'test-token');

        expect(messageContainer.textContent).toContain("Utilisez au moins 12 caractères");
        expect(global.fetch).not.toHaveBeenCalled();
    });

    test('devrait rejeter un mot de passe de plus de 72 octets', async () => {
        const resetPassword = require('../assets/JS/reset-password.js');
        const mockFormEvent = { preventDefault: jest.fn() };
        
        const tooLong = "💻".repeat(19); // 19 * 4 = 76 octets
        const passwordInput = { value: tooLong, disabled: false };
        const confirmInput = { value: tooLong, disabled: false };
        const submitBtn = { textContent: 'Soumettre', disabled: false };
        const messageContainer = { textContent: '', classList: { remove: jest.fn(), add: jest.fn() } };

        global.document.getElementById.mockImplementation((id) => {
            if (id === 'new-password-input') return passwordInput;
            if (id === 'confirm-password-input') return confirmInput;
            if (id === 'reset-submit-btn') return submitBtn;
            if (id === 'reset-message') return messageContainer;
            return mockElement;
        });

        await resetPassword.handleResetPasswordSubmit(mockFormEvent, 'test-token');

        expect(messageContainer.textContent).toContain("Utilisez au moins 12 caractères");
        expect(global.fetch).not.toHaveBeenCalled();
    });

    test('devrait rejeter un mot de passe composé uniquement d\'espaces', async () => {
        const resetPassword = require('../assets/JS/reset-password.js');
        const mockFormEvent = { preventDefault: jest.fn() };
        
        const passwordInput = { value: '            ', disabled: false }; // 12 spaces
        const confirmInput = { value: '            ', disabled: false };
        const submitBtn = { textContent: 'Soumettre', disabled: false };
        const messageContainer = { textContent: '', classList: { remove: jest.fn(), add: jest.fn() } };

        global.document.getElementById.mockImplementation((id) => {
            if (id === 'new-password-input') return passwordInput;
            if (id === 'confirm-password-input') return confirmInput;
            if (id === 'reset-submit-btn') return submitBtn;
            if (id === 'reset-message') return messageContainer;
            return mockElement;
        });

        await resetPassword.handleResetPasswordSubmit(mockFormEvent, 'test-token');

        expect(messageContainer.textContent).toContain("Le mot de passe ne peut pas être composé uniquement d'espaces");
        expect(global.fetch).not.toHaveBeenCalled();
    });

    test('devrait accepter un mot de passe de 18 emojis 💻 (18 points de code, 72 octets)', async () => {
        const resetPassword = require('../assets/JS/reset-password.js');
        const mockFormEvent = { preventDefault: jest.fn() };
        
        const validPwd = "💻".repeat(18); // 72 octets
        const passwordInput = { value: validPwd, disabled: false };
        const confirmInput = { value: validPwd, disabled: false };
        const submitBtn = { textContent: 'Soumettre', disabled: false };
        const messageContainer = { textContent: '', classList: { remove: jest.fn(), add: jest.fn() } };

        global.document.getElementById.mockImplementation((id) => {
            if (id === 'new-password-input') return passwordInput;
            if (id === 'confirm-password-input') return confirmInput;
            if (id === 'reset-submit-btn') return submitBtn;
            if (id === 'reset-message') return messageContainer;
            return mockElement;
        });

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ ok: true })
        });

        await resetPassword.handleResetPasswordSubmit(mockFormEvent, 'test-token');

        expect(global.fetch).toHaveBeenCalled();
    });

    /**
     * Helper pour vérifier l'ajout d'une classe d'erreur
     * @returns {boolean} True si la classe d'erreur text-cyber-red a été ajoutée
     */
    function mockClassListContainsError() {
        return mockElement.classList.add.mock.calls.some(call => call.includes('text-cyber-red'));
    }
});
