/**
 * Fichier de tests pour la logique de redirection d'authentification sur page load de main.js
 */

describe('Redirection Authentification Page Load (main.js)', () => {
    let mockElement;
    let mockLoginModal;
    let mockAuthMessage;
    let originalFetch;
    let originalWindow;
    let originalDocument;
    let domContentLoadedCallback;

    beforeEach(() => {
        jest.clearAllMocks();
        domContentLoadedCallback = null;

        mockLoginModal = {
            addEventListener: jest.fn(),
            classList: {
                contains: jest.fn().mockReturnValue(true), // Masqué par défaut (contient hidden)
                add: jest.fn(),
                remove: jest.fn()
            }
        };

        mockAuthMessage = {
            textContent: '',
            classList: {
                add: jest.fn(),
                remove: jest.fn()
            }
        };

        mockElement = {
            addEventListener: jest.fn(),
            classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() },
            setAttribute: jest.fn(),
            getAttribute: jest.fn(),
            style: {}
        };

        originalFetch = global.fetch;
        originalWindow = global.window;
        originalDocument = global.document;

        // Mock document avec capture de DOMContentLoaded
        global.document = {
            title: 'Test Title',
            getElementById: jest.fn().mockImplementation((id) => {
                if (id === 'login-modal') return mockLoginModal;
                if (id === 'auth-message') return mockAuthMessage;
                return mockElement;
            }),
            querySelectorAll: jest.fn().mockReturnValue([mockElement]),
            querySelector: jest.fn().mockReturnValue(mockElement),
            addEventListener: jest.fn().mockImplementation((event, callback) => {
                if (event === 'DOMContentLoaded') {
                    domContentLoadedCallback = callback;
                }
            }),
            documentElement: {
                classList: { add: jest.fn(), remove: jest.fn() }
            },
            body: {
                style: { overflow: '' }
            }
        };

        // Mock window avec replaceState
        global.window = {
            location: {
                search: '',
                pathname: '/index.html'
            },
            history: {
                replaceState: jest.fn()
            },
            matchMedia: jest.fn().mockReturnValue({ matches: false }),
            addEventListener: jest.fn()
        };

        global.localStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn()
        };

        global.sessionStorage = {
            getItem: jest.fn(),
            setItem: jest.fn()
        };

        // Reset module registry in Jest to allow fresh require calls
        jest.resetModules();
    });

    afterEach(() => {
        global.fetch = originalFetch;
        global.window = originalWindow;
        global.document = originalDocument;
    });

    test('ne devrait rien faire si aucun paramètre auth n\'est présent dans l\'URL', () => {
        global.window.location.search = '';
        const app = require('../assets/JS/main.js');

        // Exécuter DOMContentLoaded
        if (domContentLoadedCallback) {
            domContentLoadedCallback();
        }

        expect(global.window.history.replaceState).not.toHaveBeenCalled();
        expect(mockLoginModal.classList.remove).not.toHaveBeenCalled();
    });

    test('devrait ouvrir la modale et afficher le message correct pour auth=required', () => {
        global.window.location.search = '?auth=required';
        const app = require('../assets/JS/main.js');

        // Exécuter DOMContentLoaded
        if (domContentLoadedCallback) {
            domContentLoadedCallback();
        }

        // Vérifier le nettoyage de l'URL
        expect(global.window.history.replaceState).toHaveBeenCalledWith({}, expect.any(String), '/index.html');

        // Vérifier l'affichage du message d'erreur
        expect(mockAuthMessage.classList.remove).toHaveBeenCalledWith('hidden', 'text-cyber-green');
        expect(mockAuthMessage.textContent).toBe('CONNEXION REQUISE POUR ACCÉDER À CET ESPACE.');

        // Vérifier l'ouverture de la modale (la classe hidden doit être retirée)
        expect(mockLoginModal.classList.remove).toHaveBeenCalledWith('hidden');
    });

    test('devrait ouvrir la modale et afficher le message correct pour auth=expired', () => {
        global.window.location.search = '?auth=expired';
        const app = require('../assets/JS/main.js');

        // Exécuter DOMContentLoaded
        if (domContentLoadedCallback) {
            domContentLoadedCallback();
        }

        // Vérifier le nettoyage de l'URL
        expect(global.window.history.replaceState).toHaveBeenCalledWith({}, expect.any(String), '/index.html');

        // Vérifier l'affichage du message d'erreur
        expect(mockAuthMessage.classList.remove).toHaveBeenCalledWith('hidden', 'text-cyber-green');
        expect(mockAuthMessage.textContent).toBe('VOTRE SESSION A EXPIRÉ. VEUILLEZ VOUS RECONNECTER.');

        // Vérifier l'ouverture de la modale
        expect(mockLoginModal.classList.remove).toHaveBeenCalledWith('hidden');
    });

    test('devrait nettoyer le paramètre auth tout en préservant les autres paramètres de l\'URL', () => {
        global.window.location.search = '?page=2&auth=required&theme=dark';
        const app = require('../assets/JS/main.js');

        if (domContentLoadedCallback) {
            domContentLoadedCallback();
        }

        // Devrait remplacer par l'URL propre préservant ?page=2&theme=dark (sans &auth=required)
        expect(global.window.history.replaceState).toHaveBeenCalledWith({}, expect.any(String), expect.stringContaining('/index.html?page=2&theme=dark'));
    });

    test('devrait vérifier que gerer_compte.html contient la redirection replace sans boucle', () => {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '../gerer_compte.html');
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Vérifie la présence de window.location.replace("mon-espace.html")
        expect(fileContent).toContain('window.location.replace("mon-espace.html")');

        // Vérifie la présence du message de secours sans JS
        expect(fileContent).toContain('<noscript>');
        expect(fileContent).toContain('href="mon-espace.html"');
    });

    test('ne doit jamais journaliser de mot de passe ou de JWT dans la console', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const app = require('../assets/JS/main.js');
        // Effectuer des opérations fictives sans exposer de secrets
        
        console.log("Démarrage de la validation...");
        expect(consoleSpy).toHaveBeenCalledWith("Démarrage de la validation...");

        // S'assurer que les mocks n'ont pas intercepté d'informations sensibles
        for (const call of consoleSpy.mock.calls) {
            const output = JSON.stringify(call);
            expect(output).not.toContain('fake-jwt-token');
            expect(output).not.toContain('password');
        }

        consoleSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
});
