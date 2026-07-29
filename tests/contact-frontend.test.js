/**
 * @file tests/contact-frontend.test.js
 * @description Suite de tests unitaires pour la logique frontend du formulaire de contact (assets/JS/contact.js).
 * Valide les validations client, le blocage double-soumission, la persistance des saisies,
 * le délai minimum d'envoi et la réinitialisation uniquement sur succès.
 */

describe('Contact Frontend Logic', () => {
    let mockForm;
    let mockNameInput;
    let mockEmailInput;
    let mockSubjectInput;
    let mockMessageInput;
    let mockWebsiteInput;
    let mockFeedbackDiv;
    let mockSubmitBtn;

    let mockNameError;
    let mockEmailError;
    let mockSubjectError;
    let mockMessageError;

    let originalFetch;
    let originalWindow;
    let originalDocument;

    let submitHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Éléments du DOM mockés
        mockForm = {
            addEventListener: jest.fn().mockImplementation((event, handler) => {
                if (event === 'submit') submitHandler = handler;
            }),
            reset: jest.fn()
        };

        mockNameInput = { value: 'John Doe', disabled: false, classList: { add: jest.fn(), remove: jest.fn() }, setAttribute: jest.fn() };
        mockEmailInput = { value: 'john@example.com', disabled: false, classList: { add: jest.fn(), remove: jest.fn() }, setAttribute: jest.fn() };
        mockSubjectInput = { value: 'question', disabled: false, classList: { add: jest.fn(), remove: jest.fn() }, setAttribute: jest.fn() };
        mockMessageInput = { value: 'Hello, this is a message.', disabled: false, classList: { add: jest.fn(), remove: jest.fn() }, setAttribute: jest.fn() };
        mockWebsiteInput = { value: '', disabled: false };
        mockFeedbackDiv = { className: '', innerHTML: '', classList: { add: jest.fn(), remove: jest.fn() } };
        mockSubmitBtn = { disabled: false, innerHTML: '', classList: { add: jest.fn(), remove: jest.fn() } };

        mockNameError = { classList: { add: jest.fn(), remove: jest.fn() } };
        mockEmailError = { classList: { add: jest.fn(), remove: jest.fn() } };
        mockSubjectError = { classList: { add: jest.fn(), remove: jest.fn() } };
        mockMessageError = { classList: { add: jest.fn(), remove: jest.fn() } };

        originalFetch = global.fetch;
        global.fetch = jest.fn();
        originalWindow = global.window;
        originalDocument = global.document;

        // Mock document
        global.document = {
            getElementById: jest.fn().mockImplementation((id) => {
                if (id === 'contactForm') return mockForm;
                if (id === 'name') return mockNameInput;
                if (id === 'email') return mockEmailInput;
                if (id === 'subject') return mockSubjectInput;
                if (id === 'message') return mockMessageInput;
                if (id === 'website') return mockWebsiteInput;
                if (id === 'form-feedback') return mockFeedbackDiv;
                if (id === 'submitBtn') return mockSubmitBtn;
                if (id === 'name-error') return mockNameError;
                if (id === 'email-error') return mockEmailError;
                if (id === 'subject-error') return mockSubjectError;
                if (id === 'message-error') return mockMessageError;
                return null;
            }),
            querySelectorAll: jest.fn().mockReturnValue([]),
            addEventListener: jest.fn().mockImplementation((event, handler) => {
                if (event === 'DOMContentLoaded') handler();
            })
        };

        global.window = {
            strapiBaseUrl: 'http://test-server:1337',
            lucide: { createIcons: jest.fn() }
        };

        // Charger contact.js
        jest.isolateModules(() => {
            require('../assets/JS/contact.js');
        });
    });

    afterEach(() => {
        global.fetch = originalFetch;
        global.window = originalWindow;
        global.document = originalDocument;
        jest.useRealTimers();
    });

    /**
     * @test Montage et écoute des événements DOM du formulaire de contact
     */
    test('should register DOMContentLoaded listener and mount submit handler', () => {
        expect(global.document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
        expect(mockForm.addEventListener).toHaveBeenCalledWith('submit', expect.any(Function));
    });

    /**
     * @test Affichage d'erreur si des champs sont vides lors de la soumission
     */
    test('should validate input values and show client errors if empty', () => {
        mockNameInput.value = '';
        mockEmailInput.value = '';
        mockSubjectInput.value = '';
        mockMessageInput.value = '';

        const mockEvent = { preventDefault: jest.fn() };
        submitHandler(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockNameError.classList.remove).toHaveBeenCalledWith('hidden');
        expect(mockEmailError.classList.remove).toHaveBeenCalledWith('hidden');
        expect(mockSubjectError.classList.remove).toHaveBeenCalledWith('hidden');
        expect(mockMessageError.classList.remove).toHaveBeenCalledWith('hidden');
        expect(global.fetch).not.toHaveBeenCalled();
    });

    /**
     * @test Affichage d'erreur si le format de l'e-mail est incorrect
     */
    test('should validate email pattern correctly', () => {
        mockEmailInput.value = 'invalid-email-format';

        const mockEvent = { preventDefault: jest.fn() };
        submitHandler(mockEvent);

        expect(mockEmailError.classList.remove).toHaveBeenCalledWith('hidden');
        expect(global.fetch).not.toHaveBeenCalled();
    });

    /**
     * @test Temporisation de 3 secondes avant l'envoi réel de la requête (filtre de rapidité)
     */
    test('should submit data after a silent speed delay of 3 seconds', async () => {
        global.fetch.mockResolvedValue({
            status: 200,
            json: async () => ({ success: true })
        });

        const mockEvent = { preventDefault: jest.fn() };
        submitHandler(mockEvent);

        // La soumission démarre, les boutons se désactivent, mais l'envoi fetch est retardé de 3s
        expect(mockSubmitBtn.classList.add).toHaveBeenCalledWith('opacity-50', 'cursor-not-allowed');
        expect(global.fetch).not.toHaveBeenCalled();

        // Avancer le temps fictif de 3000ms
        jest.advanceTimersByTime(3000);

        // Vérifier que fetch a été appelé avec les bonnes données et l'URL centralisée
        expect(global.fetch).toHaveBeenCalledWith('http://test-server:1337/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john@example.com',
                subject: 'question',
                message: 'Hello, this is a message.',
                website: ''
            })
        });

        // Laisser les promesses de fetch et json se résoudre
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();

        // Réinitialisation du formulaire sur succès
        expect(mockForm.reset).toHaveBeenCalled();
        expect(mockFeedbackDiv.innerHTML).toContain('Votre message a été envoyé avec succès');
        expect(mockSubmitBtn.classList.remove).toHaveBeenCalledWith('opacity-50', 'cursor-not-allowed');
    });

    /**
     * @test Rétention des données du formulaire en cas de blocage de fréquence (429)
     */
    test('should keep form inputs intact on rate-limiting (429)', async () => {
        global.fetch.mockResolvedValue({
            status: 429,
            json: async () => ({ message: 'Trop de tentatives' })
        });

        submitHandler({ preventDefault: jest.fn() });
        jest.advanceTimersByTime(3000);

        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();

        // Pas de reset en cas de 429
        expect(mockForm.reset).not.toHaveBeenCalled();
        expect(mockFeedbackDiv.innerHTML).toContain('Trop de tentatives');
        expect(mockNameInput.disabled).toBe(false);
    });

    /**
     * @test Rétention des données du formulaire en cas d'erreur de validation (400)
     */
    test('should keep form inputs intact on validation error (400)', async () => {
        global.fetch.mockResolvedValue({
            status: 400,
            json: async () => ({ message: 'Erreur validation' })
        });

        submitHandler({ preventDefault: jest.fn() });
        jest.advanceTimersByTime(3000);

        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();

        expect(mockForm.reset).not.toHaveBeenCalled();
        expect(mockFeedbackDiv.innerHTML).toContain('Erreur validation');
    });

    /**
     * @test Rétention des données du formulaire en cas de panne du service SMTP (503)
     */
    test('should keep form inputs intact on email service failure (503)', async () => {
        global.fetch.mockResolvedValue({
            status: 503,
            json: async () => ({})
        });

        submitHandler({ preventDefault: jest.fn() });
        jest.advanceTimersByTime(3000);

        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();

        expect(mockForm.reset).not.toHaveBeenCalled();
        expect(mockFeedbackDiv.innerHTML).toContain('indisponible');
    });

    /**
     * @test Rétention des données du formulaire en cas de coupure de réseau physique
     */
    test('should keep form inputs intact on network exception', async () => {
        global.fetch.mockRejectedValue(new Error('Network disconnected'));

        submitHandler({ preventDefault: jest.fn() });
        jest.advanceTimersByTime(3000);

        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();

        expect(mockForm.reset).not.toHaveBeenCalled();
        expect(mockFeedbackDiv.innerHTML).toContain('erreur réseau');
    });
});
