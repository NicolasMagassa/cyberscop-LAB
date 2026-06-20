/**
 * Fichier de tests pour le projet Cyberscop Lab.
 * Prêt à l'emploi avec Jest.
 * 
 * Contient des tests unitaires (TDD) pour les fonctions pures 
 * et des tests d'interface automatisés utilisant des simulations (mocks) du DOM et du stockage.
 */

// --- CONFIGURATION DU MOCK POUR L'ENVIRONNEMENT BROWSER/DOM ---
const mockAddEventListener = jest.fn();
const mockClassList = {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
    toggle: jest.fn()
};

const mockElement = {
    addEventListener: mockAddEventListener,
    classList: mockClassList,
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    innerText: '',
    innerHTML: '',
    id: '',
    style: {}
};

// Configuration globale des mocks requis avant le chargement de main.js
global.window = {
    location: { protocol: 'http:' },
    matchMedia: jest.fn().mockReturnValue({ matches: false }),
    addEventListener: jest.fn()
};

let cookieStore = {};
global.document = {
    getElementById: jest.fn().mockReturnValue(mockElement),
    querySelectorAll: jest.fn().mockReturnValue([mockElement]),
    addEventListener: jest.fn(),
    documentElement: {
        classList: mockClassList
    },
    body: {
        style: { overflow: '' }
    }
};

Object.defineProperty(global.document, 'cookie', {
    get: () => {
        return Object.entries(cookieStore)
            .map(([k, v]) => `${k}=${v}`)
            .join('; ');
    },
    set: (val) => {
        if (!val) {
            cookieStore = {};
            return;
        }
        const parts = val.split(';');
        const pair = parts[0].split('=');
        if (pair.length === 2) {
            cookieStore[pair[0].trim()] = pair[1].trim();
        }
    },
    configurable: true
});

global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
};

global.sessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};

// Importation des fonctions à tester depuis main.js
const app = require('../assets/JS/main.js');

// --- 1. TESTS UNITAIRES (TDD) ---
describe('Tests Unitaires - Fonctions de formatage et de cookies', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        global.document.cookie = '';
    });

    // =========================================================================
    // Cible : Fonction formatDate() dans main.js
    // Rôle  : Formate une date ISO (AAAA-MM-JJ) en format court (JJ/MM)
    // =========================================================================
    describe('formatDate', () => {
        test('devrait formater correctement une date YYYY-MM-DD en DD/MM', () => {
            expect(app.formatDate('2025-10-14')).toBe('14/10');
            expect(app.formatDate('2026-06-18')).toBe('18/06');
        });

        test('devrait gérer le changement d\'année', () => {
            expect(app.formatDate('2024-01-01')).toBe('01/01');
        });
    });

    // =========================================================================
    // Cible : Fonction formatLongDate() dans main.js
    // Rôle  : Formate une date ISO (AAAA-MM-JJ) en format long (JJ MOIS AAAA)
    // =========================================================================
    describe('formatLongDate', () => {
        test('devrait formater une date en format long (D MMM YYYY)', () => {
            // Note: Le mois renvoyé dépend de la locale du système (souvent en anglais par défaut dans Node/Jest)
            const result = app.formatLongDate('2025-10-12');
            expect(result).toContain('12');
            expect(result).toContain('2025');
        });
    });

    // =========================================================================
    // Cibles : Fonctions getCookieConsent() et setCookieConsent() dans main.js
    // Rôle   : Lecture et écriture de l'état/des préférences de cookies de l'utilisateur
    // =========================================================================
    describe('Gestion des Cookies (getCookieConsent / setCookieConsent)', () => {
        test('getCookieConsent devrait renvoyer null si le cookie n\'existe pas', () => {
            global.document.cookie = 'other_cookie=value';
            expect(app.getCookieConsent('consent_state')).toBeNull();
        });

        test('getCookieConsent devrait renvoyer la valeur du cookie s\'il existe', () => {
            global.document.cookie = 'consent_state=accepted; consent_prefs=analytics';
            expect(app.getCookieConsent('consent_state')).toBe('accepted');
        });

        test('setCookieConsent devrait correctement écrire le cookie dans document.cookie', () => {
            app.setCookieConsent('refused', { necessary: true, functional: false });
            expect(global.document.cookie).toContain('consent_state=refused');
            expect(global.document.cookie).toContain('consent_prefs=');
        });
    });
});


// --- 2. TESTS COMPORTEMENTAUX / AUTOMATISÉS ---
describe('Tests Automatisés - Logique de l\'Interface Utilisateur', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        global.document.body.style.overflow = 'auto';
    });

    // =========================================================================
    // Cible : Fonction switchTab() dans main.js
    // Rôle  : Gère le basculement d'onglet et l'accessibilité visuelle (attributs ARIA)
    // =========================================================================
    describe('switchTab', () => {
        test('devrait modifier les classes des panneaux et boutons d\'onglets', () => {
            app.switchTab('danger');

            // Doit récupérer les éléments par leur ID
            expect(global.document.getElementById).toHaveBeenCalledWith('panel-danger');
            expect(global.document.getElementById).toHaveBeenCalledWith('tab-btn-danger');

            // Doit masquer les autres onglets et afficher l'onglet ciblé
            expect(mockClassList.remove).toHaveBeenCalledWith('hidden');
        });
    });

    // =========================================================================
    // Cible : Fonction checkAuthStatus() dans main.js
    // Rôle  : Vérifie si l'utilisateur est connecté via localStorage et met à jour l'IHM
    // =========================================================================
    describe('checkAuthStatus', () => {
        test('devrait configurer l\'IHM pour un utilisateur connecté si localStorage contient un utilisateur valide', () => {
            const fakeUser = { username: 'ADMIN', token: 'token-xyz' };
            global.localStorage.getItem.mockReturnValueOnce(JSON.stringify(fakeUser));

            app.checkAuthStatus();

            expect(global.localStorage.getItem).toHaveBeenCalledWith('cyberScopeUser');
            // Doit masquer le bouton login et afficher le dropdown
            expect(mockClassList.add).toHaveBeenCalledWith('hidden');
            expect(mockClassList.remove).toHaveBeenCalledWith('hidden');
        });

        test('devrait configurer l\'IHM pour un utilisateur déconnecté si localStorage est vide', () => {
            global.localStorage.getItem.mockReturnValueOnce(null);

            app.checkAuthStatus();

            expect(global.localStorage.getItem).toHaveBeenCalledWith('cyberScopeUser');
            // Doit afficher le bouton login et masquer le dropdown
            expect(mockClassList.remove).toHaveBeenCalledWith('hidden');
            expect(mockClassList.add).toHaveBeenCalledWith('hidden');
        });
    });

    // =========================================================================
    // Cible : Fonction handleLogin() dans main.js
    // Rôle  : Gère la soumission du formulaire de connexion, simule un appel API et connecte l'utilisateur
    // =========================================================================
    describe('handleLogin', () => {
        let mockEvent;
        let mockUsernameInput;
        let mockPasswordInput;

        beforeEach(() => {
            jest.useFakeTimers();
            mockEvent = { preventDefault: jest.fn() };
            mockUsernameInput = { value: '' };
            mockPasswordInput = { value: '' };
            mockElement.textContent = ''; // Réinitialise l'élément global mockElement pour authMessage

            global.document.getElementById.mockImplementation((id) => {
                if (id === 'username-input') return mockUsernameInput;
                if (id === 'password-input') return mockPasswordInput;
                return mockElement;
            });
        });

        afterEach(() => {
            jest.useRealTimers();
            global.document.getElementById.mockImplementation(() => mockElement);
        });

        test('devrait empêcher le comportement par défaut de l\'événement', async () => {
            mockUsernameInput.value = '';
            mockPasswordInput.value = '';
            const loginPromise = app.handleLogin(mockEvent);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            await loginPromise;
        });

        test('devrait afficher une erreur si l\'identifiant ou le mot de passe est vide', async () => {
            mockUsernameInput.value = '   ';
            mockPasswordInput.value = '';
            
            const loginPromise = app.handleLogin(mockEvent);

            expect(mockElement.textContent).toBe('ERREUR: Identifiants/Mot de passe requis.');
            expect(mockClassList.remove).toHaveBeenCalledWith('hidden');
            await loginPromise;
        });

        test('devrait connecter l\'utilisateur après le délai de 500ms et fermer la modale après 1500ms supplémentaires', async () => {
            mockUsernameInput.value = 'nicolas';
            mockPasswordInput.value = 'monmotdepasse';

            const loginPromise = app.handleLogin(mockEvent);

            // Avant l'écoulement du timer de 500ms, localStorage ne doit pas avoir été modifié
            expect(global.localStorage.setItem).not.toHaveBeenCalled();

            // Avancer de 500ms pour déclencher la connexion
            jest.advanceTimersByTime(500);
            await Promise.resolve();

            // Vérifier localStorage
            expect(global.localStorage.setItem).toHaveBeenCalledWith(
                'cyberScopeUser',
                JSON.stringify({ username: 'NICOLAS', token: 'fake-jwt-token-123456' })
            );
            // Vérifier le message de réussite
            expect(mockElement.textContent).toBe('CONNEXION RÉUSSIE. ACCÈS ACCORDÉ.');
            expect(mockClassList.remove).toHaveBeenCalledWith('hidden');

            // Avancer de 1500ms supplémentaires
            jest.advanceTimersByTime(1500);
            await Promise.resolve();

            // Vérifier la fermeture de la modale
            expect(mockClassList.add).toHaveBeenCalledWith('hidden');

            await loginPromise;
        });
    });

    // =========================================================================
    // Cible : Fonction handleLogout() dans main.js
    // Rôle  : Déconnecte l'utilisateur en effaçant localStorage et en réinitialisant l'IHM
    // =========================================================================
    describe('handleLogout', () => {
        test('devrait supprimer la session de localStorage et mettre à jour l\'IHM', () => {
            app.handleLogout();
            expect(global.localStorage.removeItem).toHaveBeenCalledWith('cyberScopeUser');
            // Doit masquer/afficher les éléments correspondants
            expect(mockClassList.remove).toHaveBeenCalledWith('hidden');
            expect(mockClassList.add).toHaveBeenCalledWith('hidden');
        });
    });

    // =========================================================================
    // Cible : Fonction handleSignupAttempt() dans main.js
    // Rôle  : Affiche le message d'inscription sur l'IHM (simulation de redirection)
    // =========================================================================
    describe('handleSignupAttempt', () => {
        test('devrait afficher le message d\'inscription sur l\'IHM', () => {
            mockElement.textContent = '';
            app.handleSignupAttempt();
            expect(mockElement.textContent).toContain('MODULE INSCRIPTION');
            expect(mockClassList.add).toHaveBeenCalledWith('text-cyber-blue');
        });
    });

    // =========================================================================
    // Cible : Fonction handlePasswordResetAttempt() dans main.js
    // Rôle  : Affiche le message de récupération de mot de passe (simulation)
    // =========================================================================
    describe('handlePasswordResetAttempt', () => {
        test('devrait afficher le message de récupération de mot de passe', () => {
            mockElement.textContent = '';
            app.handlePasswordResetAttempt();
            expect(mockElement.textContent).toContain('RÉCUPÉRATION');
            expect(mockClassList.add).toHaveBeenCalledWith('text-cyber-pink');
        });
    });

    // =========================================================================
    // Cible : Fonction toggleTheme() dans main.js
    // Rôle  : Bascule entre les modes clair (light) et sombre (dark) et persiste le choix dans localStorage
    // =========================================================================
    describe('toggleTheme', () => {
        test('devrait passer du mode sombre au mode clair si le mode sombre est actif', () => {
            mockClassList.contains.mockReturnValueOnce(true);
            
            app.toggleTheme();
            
            expect(mockClassList.remove).toHaveBeenCalledWith('dark');
            expect(global.localStorage.theme).toBe('light');
        });

        test('devrait passer du mode clair au mode sombre si le mode sombre n\'est pas actif', () => {
            mockClassList.contains.mockReturnValueOnce(false);
            
            app.toggleTheme();
            
            expect(mockClassList.add).toHaveBeenCalledWith('dark');
            expect(global.localStorage.theme).toBe('dark');
        });
    });

    // =========================================================================
    // Cible : Fonction saveSpecificPreferences() dans main.js
    // Rôle  : Enregistre le choix granulaire des cookies (analytics/fonctionnels) via des cases à cocher
    // =========================================================================
    describe('saveSpecificPreferences', () => {
        let mockFunctionalInput;
        let mockAnalyticsInput;

        beforeEach(() => {
            mockFunctionalInput = { checked: true };
            mockAnalyticsInput = { checked: false };
            global.document.getElementById.mockImplementation((id) => {
                if (id === 'cookie-functional') return mockFunctionalInput;
                if (id === 'cookie-analytics') return mockAnalyticsInput;
                return mockElement;
            });
            global.document.cookie = ''; // Réinitialise les cookies
        });

        afterEach(() => {
            global.document.getElementById.mockImplementation(() => mockElement);
        });

        test('devrait enregistrer les préférences de cookies spécifiques et fermer la modale', () => {
            app.saveSpecificPreferences();
            
            expect(global.document.cookie).toContain('consent_state=custom');
            expect(global.document.cookie).toContain('consent_prefs=');
            
            const match = global.document.cookie.match(/consent_prefs=([^;]+)/);
            expect(match).not.toBeNull();
            const prefs = JSON.parse(decodeURIComponent(match[1]));
            expect(prefs).toEqual({ necessary: true, functional: true, analytics: false });
            
            expect(mockClassList.add).toHaveBeenCalledWith('hidden');
        });
    });

    // =========================================================================
    // Cible : Fonction toggleMenu() dans main.js
    // Rôle  : Affiche/masque le menu de navigation mobile en basculant la classe CSS 'hidden'
    // =========================================================================
    describe('toggleMenu', () => {
        test('devrait basculer la classe hidden sur le menu mobile', () => {
            app.toggleMenu();
            expect(mockClassList.toggle).toHaveBeenCalledWith('hidden');
        });
    });

    // =========================================================================
    // Cible : Fonction handleSave() dans main.js
    // Rôle  : Affiche temporairement une notification visuelle (toast) lors des sauvegardes
    // =========================================================================
    describe('handleSave', () => {
        let mockEvent;
        let mockToast;
        let mockToastMsg;

        beforeEach(() => {
            jest.useFakeTimers();
            mockEvent = { preventDefault: jest.fn() };
            mockToast = {
                classList: {
                    add: jest.fn(),
                    remove: jest.fn()
                }
            };
            mockToastMsg = { innerText: '' };

            global.document.getElementById.mockImplementation((id) => {
                if (id === 'toast') return mockToast;
                if (id === 'toast-message') return mockToastMsg;
                return mockElement;
            });
        });

        afterEach(() => {
            jest.useRealTimers();
            global.document.getElementById.mockImplementation(() => mockElement);
        });

        test('devrait empêcher le comportement par défaut de l\'événement, afficher le toast et le masquer après le délai', async () => {
            const savePromise = app.handleSave(mockEvent, 'Sauvegarde réussie');

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(mockToastMsg.innerText).toBe('Sauvegarde réussie');
            expect(mockToast.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockToast.classList.add).toHaveBeenCalledWith('opacity-100');

            // Avancer de 3000ms et vider les microtâches de promesse
            jest.advanceTimersByTime(3000);
            await Promise.resolve();
            expect(mockToast.classList.remove).toHaveBeenCalledWith('opacity-100');
            expect(mockToast.classList.add).toHaveBeenCalledWith('opacity-0');

            // Avancer de 300ms et vider les microtâches de promesse
            jest.advanceTimersByTime(300);
            await Promise.resolve();
            expect(mockToast.classList.add).toHaveBeenCalledWith('hidden');

            await savePromise;
        });
    });

    // =========================================================================
    // Cible : Fonction updateViewCounts() dans main.js
    // Rôle  : Incrémente de façon aléatoire et périodique le nombre de vues simulé sur les articles
    // =========================================================================
    describe('updateViewCounts', () => {
        test('devrait incrémenter les compteurs de vues de façon aléatoire', () => {
            mockElement.getAttribute.mockReturnValueOnce('12500');
            mockElement.textContent = '';

            app.updateViewCounts();

            expect(global.document.querySelectorAll).toHaveBeenCalledWith('.article-view-count');
            expect(mockElement.getAttribute).toHaveBeenCalledWith('data-initial-views');
            
            // Supprimer les espaces insécables ou normaux pour la comparaison numérique
            const parsedViews = parseInt(mockElement.textContent.replace(/\s/g, '').replace(/\u202f/g, ''));
            expect(parsedViews).toBeGreaterThanOrEqual(12500);
            expect(parsedViews).toBeLessThanOrEqual(12504);
        });

        test('ne devrait pas mettre à jour si l\'attribut de départ n\'est pas un nombre', () => {
            mockElement.getAttribute.mockReturnValueOnce('invalid');
            mockElement.textContent = 'laissez-moi tranquille';

            app.updateViewCounts();

            expect(mockElement.textContent).toBe('laissez-moi tranquille');
        });
    });

    // =========================================================================
    // Cible : Fonction renderVeilleArticles() dans main.js
    // Rôle  : Trie et injecte dynamiquement les articles de veille technologique (depuis Strapi mock)
    // =========================================================================
    describe('renderVeilleArticles', () => {
        let mockContainer;

        beforeEach(() => {
            mockContainer = { innerHTML: '' };
            global.document.getElementById.mockImplementation((id) => {
                if (id === 'veille-container') return mockContainer;
                return mockElement;
            });
        });

        afterEach(() => {
            global.document.getElementById.mockImplementation(() => mockElement);
        });

        test('devrait trier et injecter le HTML des articles de veille dans le conteneur', () => {
            app.renderVeilleArticles();

            expect(global.document.getElementById).toHaveBeenCalledWith('veille-container');
            expect(mockContainer.innerHTML).toContain('14/10');
            expect(mockContainer.innerHTML).toContain('Deepfakes vocaux');
        });
    });

    // =========================================================================
    // Cible : Fonction renderBriefingArticles() dans main.js
    // Rôle  : Trie et injecte dynamiquement les articles de briefing de sécurité
    // =========================================================================
    describe('renderBriefingArticles', () => {
        let mockGrid;

        beforeEach(() => {
            mockGrid = { innerHTML: '' };
            global.document.getElementById.mockImplementation((id) => {
                if (id === 'briefing-grid') return mockGrid;
                return mockElement;
            });
        });

        afterEach(() => {
            global.document.getElementById.mockImplementation(() => mockElement);
        });

        test('devrait trier et injecter le HTML des articles briefing dans le conteneur', () => {
            app.renderBriefingArticles();

            expect(global.document.getElementById).toHaveBeenCalledWith('briefing-grid');
            expect(mockGrid.innerHTML).toContain('NeonLock');
            expect(mockGrid.innerHTML).toContain('L\'IA Offensive');
        });
    });

    // =========================================================================
    // Cible : Fonction toggleLoginModal() dans main.js
    // Rôle  : Ouvre ou ferme la modale d'authentification utilisateur
    // =========================================================================
    describe('toggleLoginModal', () => {
        test('devrait ouvrir la modale de connexion quand elle est masquée', () => {
            // Simuler une modale masquée (contient la classe hidden)
            mockClassList.contains.mockReturnValueOnce(true); 

            app.toggleLoginModal();

            // Doit retirer la classe hidden pour l'afficher et bloquer le défilement du body
            expect(mockClassList.remove).toHaveBeenCalledWith('hidden');
            expect(global.document.body.style.overflow).toBe('hidden');
        });

        test('devrait fermer la modale de connexion quand elle est affichée', () => {
            // Simuler une modale ouverte (ne contient pas la classe hidden)
            mockClassList.contains.mockReturnValueOnce(false); 

            app.toggleLoginModal();

            // Doit ajouter la classe hidden pour la masquer et réactiver le défilement du body
            expect(mockClassList.add).toHaveBeenCalledWith('hidden');
            expect(global.document.body.style.overflow).toBe('auto');
        });
    });

    // =========================================================================
    // Cibles : Fonctions de cookies (acceptCookies, declineCookies, showCookieModal, etc.) dans main.js
    // Rôle   : Regroupe tous les gestionnaires d'événements relatifs au bandeau et panneau RGPD
    // =========================================================================
    describe('Gestion des actions de cookies', () => {
        test('acceptCookies devrait enregistrer le consentement accepté', () => {
            app.acceptCookies();
            expect(global.document.cookie).toContain('consent_state=accepted');
        });

        test('declineCookies devrait enregistrer le refus des cookies', () => {
            app.declineCookies();
            expect(global.document.cookie).toContain('consent_state=refused');
        });

        test('showCookieModal devrait afficher la modale', () => {
            app.showCookieModal();
            expect(mockClassList.remove).toHaveBeenCalledWith('translate-y-20', 'opacity-0', 'pointer-events-none');
            expect(mockClassList.add).toHaveBeenCalledWith('translate-y-0', 'opacity-100', 'pointer-events-auto');
        });

        test('dismissCookieBanner devrait enregistrer dans sessionStorage et cacher le bandeau', () => {
            app.dismissCookieBanner();
            expect(global.sessionStorage.setItem).toHaveBeenCalledWith('cookieBannerDismissed', 'true');
            expect(mockClassList.add).toHaveBeenCalledWith('translate-y-20', 'opacity-0', 'pointer-events-none');
        });

        test('hideCookieModal devrait cacher la modale', () => {
            app.hideCookieModal();
            expect(mockClassList.add).toHaveBeenCalledWith('translate-y-20', 'opacity-0', 'pointer-events-none');
            expect(mockClassList.remove).toHaveBeenCalledWith('translate-y-0', 'opacity-100', 'pointer-events-auto');
        });

        test('showPreferencesModal devrait masquer le bandeau et ouvrir les préférences', () => {
            app.showPreferencesModal();
            expect(mockClassList.add).toHaveBeenCalledWith('translate-y-20', 'opacity-0', 'pointer-events-none');
            expect(mockClassList.remove).toHaveBeenCalledWith('hidden');
            expect(global.document.body.style.overflow).toBe('hidden');
        });

        test('closePreferencesModal devrait masquer le panneau et libérer le défilement', () => {
            app.closePreferencesModal();
            expect(mockClassList.add).toHaveBeenCalledWith('hidden');
            expect(global.document.body.style.overflow).toBe('auto');
        });

        test('returnToCookieBanner devrait fermer les préférences et réafficher le bandeau', () => {
            app.returnToCookieBanner();
            expect(mockClassList.add).toHaveBeenCalledWith('hidden');
            expect(mockClassList.remove).toHaveBeenCalledWith('translate-y-20', 'opacity-0', 'pointer-events-none');
            expect(mockClassList.add).toHaveBeenCalledWith('translate-y-0', 'opacity-100', 'pointer-events-auto');
        });

        test('declineCookiesAndClosePreferences devrait refuser les cookies et fermer les préférences', () => {
            app.declineCookiesAndClosePreferences();
            expect(global.document.cookie).toContain('consent_state=refused');
            expect(mockClassList.add).toHaveBeenCalledWith('hidden');
        });
    });
});
