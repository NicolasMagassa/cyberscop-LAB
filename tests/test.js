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

// Rendre les variables et fonctions de main.js disponibles globalement pour veille.js et article.js dans Jest
global.mockStrapiData = [
    { id: 1, date: "2025-10-14", title: "Deepfakes vocaux : Les CEO ciblés", description: "Clonage audio utilisé pour des fraudes au virement." },
    { id: 2, date: "2025-10-12", title: "Jailbreak GPT-5 : Nouveau prompt", description: "La technique 'Do Anything Now' évolue encore." },
    { id: 3, date: "2025-10-10", title: "Malwares polymorphes via LLM", description: "Code mutant généré à la volée par des IA locales." },
    { id: 4, date: "2025-10-09", title: "Poisoning de dataset confirmé", description: "HuggingFace audite ses modèles majeurs." },
    { id: 5, date: "2025-10-08", title: "Phishing IA : +300% de succès", description: "Les emails ne contiennent plus de fautes." },
    { id: 6, date: "2025-10-05", title: "Auto-GPT et Botnets autonomes", description: "Analyse d'un trafic suspect sur le port 443." }
];
global.mockBriefingData = [
    { id: 1, date: "2025-10-12", title: "Analyse du Ransomware 'NeonLock'", description: "Une nouvelle variante utilisant le chiffrement quantique cible les infrastructures critiques.", category: "MALWARE", views: 1542, theme: "green", icon: "lock" },
    { id: 2, date: "2025-10-10", title: "L'IA Offensive : Algorithmes d'attaque", description: "Les outils de pentesting automatisés par l'IA changent la donne.", category: "IA & SÉCURITÉ", views: 1205, theme: "pink", icon: "brain-circuit" },
    { id: 3, date: "2025-10-05", title: "La mort du VPN ? Architecture Zero Trust", description: "\"Ne jamais faire confiance, toujours vérifier\".", category: "ZERO TRUST", views: 980, theme: "blue", icon: "shield-alert" },
    { id: 4, date: "2025-10-01", title: "Smart Home, Smart Hack ?", description: "Votre frigo mine-t-il du crypto ?", category: "IOT", views: 850, theme: "purple", icon: "wifi" }
];
global.mockReglementationData = [
    { id: 1, date: "2025-10-15", title: "Directive NIS 2 : Nouvelles exigences cyber", description: "La directive NIS 2 renforce les exigences de sécurité pour les secteurs essentiels et importants au sein de l'UE. Elle introduit des règles strictes sur la gestion des risques et les notifications d'incidents." },
    { id: 2, date: "2025-10-12", title: "Règlement DORA : Résilience opérationnelle", description: "Le règlement DORA (Digital Operational Resilience Act) harmonise la sécurité des systèmes d'information pour le secteur financier européen. Elle impose des tests de pénétration rigoureux et des audits tiers." }
];
global.mockIAData = [
    { id: 1, date: "2025-10-15", title: "Sécurisation des LLM : Les failles d'injection de prompts", description: "Les injections de prompt (Prompt Injection) représentent la menace numéro 1 du Top 10 OWASP pour les LLM. Ce rapport analyse comment les filtres d'entrées et les architectures de double-contexte permettent de s'en prémunir." },
    { id: 2, date: "2025-10-12", title: "Audit de sécurité sur HuggingFace : Datasets empoisonnés", description: "Des chercheurs découvrent plusieurs datasets populaires contenant des backdoors d'empoisonnement (data poisoning). L'audit recommande la signature cryptographique des modèles." }
];
global.mockGRCData = [
    { id: 1, date: "2025-10-15", title: "Analyse des risques EBIOS RM : Méthodologie officielle", description: "La méthode EBIOS Risk Manager est le standard français pour l'évaluation et le traitement des risques de sécurité des systèmes d'information. Cette fiche guide détaille la mise en œuvre des 5 ateliers réglementaires." },
    { id: 2, date: "2025-10-12", title: "ISO 27001:2022 : Guide de transition et d'implémentation", description: "Les étapes clés pour mettre en conformité votre Système de Management de la Sécurité de l'Information (SMSI) avec la version 2022 de la norme ISO 27001. Focus sur les nouveaux contrôles de sécurité de l'Annexe A." }
];
global.mockRecherchesData = [
    { id: 1, date: "2025-10-15", title: "Analyse formelle des protocoles cryptographiques post-quantiques", description: "Étude et vérification formelle des mécanismes d'encapsulation de clé (KEM) Kyber validés par le NIST. Analyse de la robustesse contre les attaques par canaux auxiliaires." },
    { id: 2, date: "2025-10-12", title: "Modélisation des menaces sur les architectures micro-services Zero-Trust", description: "Recherche académique sur l'évaluation quantitative des surfaces d'attaque dans les réseaux maillés (Service Mesh). Proposition d'un modèle mathématique de propagation des compromissions." }
];
global.briefingThemes = {
    green: { color: 'cyber-green', shadow: 'rgba(0,170,44,0.15)' },
    pink: { color: 'cyber-pink', shadow: 'rgba(214,0,214,0.15)' },
    blue: { color: 'cyber-blue', shadow: 'rgba(0,184,194,0.15)' },
    purple: { color: 'cyber-purple', shadow: 'rgba(138,0,189,0.15)' },
    red: { color: 'cyber-red', shadow: 'rgba(255,0,60,0.15)' }
};
global.flattenStrapiItem = app.flattenStrapiItem;
global.formatLongDate = app.formatLongDate;
global.formatDate = app.formatDate;
global.updatePaginationDOM = app.updatePaginationDOM;

const veilleApp = require('../assets/JS/veille.js');
const reglementationApp = require('../assets/JS/ReglementationDevSecOps.js');
const iaApp = require('../assets/JS/ia.js');
const grcApp = require('../assets/JS/grc.js');
const recherchesApp = require('../assets/JS/recherches.js');
const articleApp = require('../assets/JS/article.js');


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

        test('devrait trier et injecter le HTML des articles de veille dans le conteneur', async () => {
            await app.renderVeilleArticles();

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

        test('devrait trier et injecter le HTML des articles briefing dans le conteneur', async () => {
            await app.renderBriefingArticles();

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

    // =========================================================================
    // CIBLE  : Page de Veille (veille.html / veille.js)
    // RÔLE   : Gérer l'affichage de la liste complète des flux de veille,
    //          le tri chronologique et le fallback automatique sur mocks locaux.
    // =========================================================================
    describe('Veille Cyber Page (veille.js)', () => {
        // Cible : Fonction generateVerticalVeilleArticleHTML dans veille.js
        // Rôle  : Formater le rendu HTML d'un article individuel dans la liste verticale
        test('generateVerticalVeilleArticleHTML devrait générer le HTML correct pour un article', () => {
            const article = { id: 42, date: '2026-06-25', title: 'Test Veille Spec', description: 'Une description de test' };
            const html = veilleApp.generateVerticalVeilleArticleHTML(article);
            expect(html).toContain('article.html?type=veille&id=42');
            expect(html).toContain('Test Veille Spec');
            expect(html).toContain('Une description de test');
            expect(html).toContain('SEC-FEED-0042');
        });

        // Cible : Fonction renderVeillePageArticles dans veille.js
        // Rôle  : Gérer l'affichage du spinner de chargement, la requête API Strapi
        //          et l'injection finale de la liste des articles
        test('renderVeillePageArticles devrait afficher le loader puis injecter les articles', async () => {
            const mockLoader = { classList: { add: jest.fn() } };
            const mockListContainer = { innerHTML: '', classList: { remove: jest.fn() } };
            
            global.document.getElementById.mockImplementation((id) => {
                if (id === 'veille-loader') return mockLoader;
                if (id === 'veille-articles-list') return mockListContainer;
                return mockElement;
            });

            // Tenter de faire le rendu (utilisera les mocks)
            await veilleApp.renderVeillePageArticles();

            expect(mockLoader.classList.add).toHaveBeenCalledWith('hidden');
            expect(mockListContainer.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockListContainer.innerHTML).toContain('Deepfakes vocaux');
        });
    });

    // =========================================================================
    // CIBLE  : Page de Lecture d'Article (article.html / article.js)
    // RÔLE   : Charger et afficher en plein format un article sélectionné (Veille ou Briefing)
    //          avec vérification de l'intégrité des paramètres URL et fallback sécurisé.
    // =========================================================================
    describe('Article Detail Page (article.js)', () => {
        // Cible : Fonction renderError dans article.js
        // Rôle  : Injecter un écran d'erreur cyberpunk en cas de ressource introuvable
        test('renderError devrait injecter un message d\'erreur stylisé', () => {
            const mockContainer = { innerHTML: '' };
            articleApp.renderError(mockContainer, 'Erreur Critique Test');
            expect(mockContainer.innerHTML).toContain('ACCÈS REFUSÉ / CORRUPTION DE DONNÉES');
            expect(mockContainer.innerHTML).toContain('Erreur Critique Test');
        });

        // Cible : Fonction renderArticleContent dans article.js
        // Rôle  : Injecter dynamiquement les données formatées d'un article de type veille
        test('renderArticleContent devrait injecter le contenu d\'un article de type veille', () => {
            const mockContainer = { innerHTML: '' };
            const article = { id: 1, date: '2026-06-25', title: 'Veille Titre', description: 'Veille Corps' };
            articleApp.renderArticleContent(mockContainer, article, 'veille');
            expect(mockContainer.innerHTML).toContain('Veille Titre');
            expect(mockContainer.innerHTML).toContain('Veille Corps');
            expect(mockContainer.innerHTML).toContain('Veille Cyber');
            expect(mockContainer.innerHTML).not.toContain('Vues');
        });

        // Cible : Fonction renderArticleContent dans article.js
        // Rôle  : Injecter dynamiquement les données formatées d'un article de type briefing (avec statistiques de vues)
        test('renderArticleContent devrait injecter le contenu d\'un article de type briefing', () => {
            const mockContainer = { innerHTML: '' };
            const article = { id: 2, date: '2026-06-25', title: 'Briefing Titre', description: 'Briefing Corps', category: 'MALWARE', views: 777, theme: 'green', icon: 'lock' };
            articleApp.renderArticleContent(mockContainer, article, 'briefing');
            expect(mockContainer.innerHTML).toContain('Briefing Titre');
            expect(mockContainer.innerHTML).toContain('Briefing Corps');
            expect(mockContainer.innerHTML).toContain('777 Vues');
            expect(mockContainer.innerHTML).toContain('MALWARE');
        });

        // Cible : Fonction loadArticle dans article.js
        // Rôle  : Détecter et gérer l'absence d'identifiants valides dans l'URL pour renvoyer un état d'erreur propre
        test('loadArticle devrait gérer les paramètres d\'URL invalides et afficher une erreur', async () => {
            const mockLoader = { classList: { add: jest.fn() } };
            const mockContent = { innerHTML: '', classList: { remove: jest.fn() } };
            const mockBackBtn = { href: '', innerHTML: '' };

            global.document.getElementById.mockImplementation((id) => {
                if (id === 'article-loader') return mockLoader;
                if (id === 'article-content') return mockContent;
                if (id === 'article-back-btn') return mockBackBtn;
                return mockElement;
            });

            // Simuler l'absence de paramètres URL
            delete global.window.location;
            global.window.location = { search: '?id=invalid&type=' };

            await articleApp.loadArticle();

            expect(mockLoader.classList.add).toHaveBeenCalledWith('hidden');
            expect(mockContent.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockContent.innerHTML).toContain('ACCÈS REFUSÉ');
        });

        // Cible : Fonction loadArticle dans article.js
        // Rôle  : Charger un article depuis les mocks de secours lorsque l'API Strapi est inaccessible (mode hors-ligne)
        test('loadArticle devrait charger un article valide de type veille depuis le mock si hors-ligne', async () => {
            const mockLoader = { classList: { add: jest.fn() } };
            const mockContent = { innerHTML: '', classList: { remove: jest.fn() } };
            const mockBackBtn = { href: '', innerHTML: '' };

            global.document.getElementById.mockImplementation((id) => {
                if (id === 'article-loader') return mockLoader;
                if (id === 'article-content') return mockContent;
                if (id === 'article-back-btn') return mockBackBtn;
                return mockElement;
            });

            global.window.location = { search: '?id=1&type=veille' };

            await articleApp.loadArticle();

            expect(mockBackBtn.href).toBe('veille.html');
            expect(mockContent.innerHTML).toContain('Deepfakes vocaux');
        });

        // Cible : Fonction renderArticleContent dans article.js
        // Rôle  : Injecter dynamiquement les données d'un article de type reglementation
        test('renderArticleContent devrait injecter le contenu d\'un article de type reglementation', () => {
            const mockContainer = { innerHTML: '' };
            const article = { id: 1, date: '2026-06-25', title: 'Reglementation Titre', description: 'Reglementation Corps' };
            articleApp.renderArticleContent(mockContainer, article, 'reglementation');
            expect(mockContainer.innerHTML).toContain('Reglementation Titre');
            expect(mockContainer.innerHTML).toContain('Reglementation Corps');
            expect(mockContainer.innerHTML).toContain('Réglementation & DevSecOps');
            expect(mockContainer.innerHTML).not.toContain('Vues');
        });

        // Cible : Fonction loadArticle dans article.js
        // Rôle  : Charger un article valide de type reglementation depuis le mock si hors-ligne
        test('loadArticle devrait charger un article valide de type reglementation depuis le mock si hors-ligne', async () => {
            const mockLoader = { classList: { add: jest.fn() } };
            const mockContent = { innerHTML: '', classList: { remove: jest.fn() } };
            const mockBackBtn = { href: '', innerHTML: '' };

            global.document.getElementById.mockImplementation((id) => {
                if (id === 'article-loader') return mockLoader;
                if (id === 'article-content') return mockContent;
                if (id === 'article-back-btn') return mockBackBtn;
                return mockElement;
            });

            global.window.location = { search: '?id=1&type=reglementation' };

            await articleApp.loadArticle();

            expect(mockBackBtn.href).toBe('ReglementationDevSecOps.html');
            expect(mockContent.innerHTML).toContain('Directive NIS 2');
        });

        // Cible : Fonction renderArticleContent dans article.js
        // Rôle  : Injecter dynamiquement les données d'un article de type ia
        test('renderArticleContent devrait injecter le contenu d\'un article de type ia', () => {
            const mockContainer = { innerHTML: '' };
            const article = { id: 1, date: '2026-06-25', title: 'IA Sec Titre', description: 'IA Sec Corps' };
            articleApp.renderArticleContent(mockContainer, article, 'ia');
            expect(mockContainer.innerHTML).toContain('IA Sec Titre');
            expect(mockContainer.innerHTML).toContain('IA Sec Corps');
            expect(mockContainer.innerHTML).toContain('Sécurité de l\'IA');
            expect(mockContainer.innerHTML).not.toContain('Vues');
        });

        // Cible : Fonction loadArticle dans article.js
        // Rôle  : Charger un article valide de type ia depuis le mock si hors-ligne
        test('loadArticle devrait charger un article valide de type ia depuis le mock si hors-ligne', async () => {
            const mockLoader = { classList: { add: jest.fn() } };
            const mockContent = { innerHTML: '', classList: { remove: jest.fn() } };
            const mockBackBtn = { href: '', innerHTML: '' };

            global.document.getElementById.mockImplementation((id) => {
                if (id === 'article-loader') return mockLoader;
                if (id === 'article-content') return mockContent;
                if (id === 'article-back-btn') return mockBackBtn;
                return mockElement;
            });

            global.window.location = { search: '?id=1&type=ia' };

            await articleApp.loadArticle();

            expect(mockBackBtn.href).toBe('ia.html');
            expect(mockContent.innerHTML).toContain('Sécurisation des LLM');
        });

        // Cible : Fonction renderArticleContent dans article.js
        // Rôle  : Injecter dynamiquement les données d'un article de type grc
        test('renderArticleContent devrait injecter le contenu d\'un article de type grc', () => {
            const mockContainer = { innerHTML: '' };
            const article = { id: 1, date: '2026-06-25', title: 'GRC Titre', description: 'GRC Corps' };
            articleApp.renderArticleContent(mockContainer, article, 'grc');
            expect(mockContainer.innerHTML).toContain('GRC Titre');
            expect(mockContainer.innerHTML).toContain('GRC Corps');
            expect(mockContainer.innerHTML).toContain('Gouvernance, Risques & Conformité');
            expect(mockContainer.innerHTML).not.toContain('Vues');
        });

        // Cible : Fonction loadArticle dans article.js
        // Rôle  : Charger un article valide de type grc depuis le mock si hors-ligne
        test('loadArticle devrait charger un article valide de type grc depuis le mock si hors-ligne', async () => {
            const mockLoader = { classList: { add: jest.fn() } };
            const mockContent = { innerHTML: '', classList: { remove: jest.fn() } };
            const mockBackBtn = { href: '', innerHTML: '' };

            global.document.getElementById.mockImplementation((id) => {
                if (id === 'article-loader') return mockLoader;
                if (id === 'article-content') return mockContent;
                if (id === 'article-back-btn') return mockBackBtn;
                return mockElement;
            });

            global.window.location = { search: '?id=1&type=grc' };

            await articleApp.loadArticle();

            expect(mockBackBtn.href).toBe('grc.html');
            expect(mockContent.innerHTML).toContain('Analyse des risques EBIOS RM');
        });

        // Cible : Fonction renderArticleContent dans article.js
        // Rôle  : Injecter dynamiquement les données d'un article de type recherches
        test('renderArticleContent devrait injecter le contenu d\'un article de type recherches', () => {
            const mockContainer = { innerHTML: '' };
            const article = { id: 1, date: '2026-06-25', title: 'Recherches Titre', description: 'Recherches Corps' };
            articleApp.renderArticleContent(mockContainer, article, 'recherches');
            expect(mockContainer.innerHTML).toContain('Recherches Titre');
            expect(mockContainer.innerHTML).toContain('Recherches Corps');
            expect(mockContainer.innerHTML).toContain('Recherches & Analyses');
            expect(mockContainer.innerHTML).not.toContain('Vues');
        });

        // Cible : Fonction loadArticle dans article.js
        // Rôle  : Charger un article valide de type recherches depuis le mock si hors-ligne
        test('loadArticle devrait charger un article valide de type recherches depuis le mock si hors-ligne', async () => {
            const mockLoader = { classList: { add: jest.fn() } };
            const mockContent = { innerHTML: '', classList: { remove: jest.fn() } };
            const mockBackBtn = { href: '', innerHTML: '' };

            global.document.getElementById.mockImplementation((id) => {
                if (id === 'article-loader') return mockLoader;
                if (id === 'article-content') return mockContent;
                if (id === 'article-back-btn') return mockBackBtn;
                return mockElement;
            });

            global.window.location = { search: '?id=1&type=recherches' };

            await articleApp.loadArticle();

            expect(mockBackBtn.href).toBe('recherches.html');
            expect(mockContent.innerHTML).toContain('Analyse formelle des protocoles cryptographiques');
        });
    });

    // =========================================================================
    // CIBLE  : Page de Réglementation & DevSecOps (ReglementationDevSecOps.html / ReglementationDevSecOps.js)
    // RÔLE   : Gérer l'affichage de la liste complète des flux de conformité,
    //          le tri chronologique et le fallback automatique sur mocks locaux.
    // =========================================================================
    describe('Réglementation & DevSecOps Page (ReglementationDevSecOps.js)', () => {
        // Cible : Fonction generateVerticalReglementationArticleHTML dans ReglementationDevSecOps.js
        // Rôle  : Formater le rendu HTML d'un article individuel dans la liste verticale
        test('generateVerticalReglementationArticleHTML devrait générer le HTML correct pour un article', () => {
            const article = { id: 42, date: '2026-06-25', title: 'Test Reglementation Spec', description: 'Une description de test' };
            const html = reglementationApp.generateVerticalReglementationArticleHTML(article);
            expect(html).toContain('article.html?type=reglementation&id=42');
            expect(html).toContain('Test Reglementation Spec');
            expect(html).toContain('Une description de test');
            expect(html).toContain('SEC-REG-0042');
        });

        // Cible : Fonction renderReglementationPageArticles dans ReglementationDevSecOps.js
        // Rôle  : Gérer l'affichage du spinner de chargement, la requête API Strapi
        //          et l'injection finale de la liste des articles avec fallback
        test('renderReglementationPageArticles devrait afficher le loader puis injecter les articles', async () => {
            const mockLoader = { classList: { add: jest.fn() } };
            const mockListContainer = { innerHTML: '', classList: { remove: jest.fn() } };
            
            global.document.getElementById.mockImplementation((id) => {
                if (id === 'reglementation-loader') return mockLoader;
                if (id === 'reglementation-articles-list') return mockListContainer;
                return mockElement;
            });

            // Tenter le rendu
            await reglementationApp.renderReglementationPageArticles();

            expect(mockLoader.classList.add).toHaveBeenCalledWith('hidden');
            expect(mockListContainer.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockListContainer.innerHTML).toContain('Directive NIS 2');
        });
    });

    // =========================================================================
    // CIBLE  : Page de Sécurité de l'IA (ia.html / ia.js)
    // RÔLE   : Gérer l'affichage de la liste complète des flux de sécurité de l'IA,
    //          le tri chronologique et le fallback automatique sur mocks locaux.
    // =========================================================================
    describe('Sécurité de l\'IA Page (ia.js)', () => {
        // Cible : Fonction generateVerticalIAArticleHTML dans ia.js
        // Rôle  : Formater le rendu HTML d'un article individuel dans la liste verticale
        test('generateVerticalIAArticleHTML devrait générer le HTML correct pour un article', () => {
            const article = { id: 42, date: '2026-06-25', title: 'Test IA Spec', description: 'Une description de test' };
            const html = iaApp.generateVerticalIAArticleHTML(article);
            expect(html).toContain('article.html?type=ia&id=42');
            expect(html).toContain('Test IA Spec');
            expect(html).toContain('Une description de test');
            expect(html).toContain('SEC-IA-0042');
        });

        // Cible : Fonction renderIAPageArticles dans ia.js
        // Rôle  : Gérer l'affichage du spinner de chargement, la requête API Strapi
        //          et l'injection finale de la liste des articles avec fallback
        test('renderIAPageArticles devrait afficher le loader puis injecter les articles', async () => {
            const mockLoader = { classList: { add: jest.fn() } };
            const mockListContainer = { innerHTML: '', classList: { remove: jest.fn() } };
            
            global.document.getElementById.mockImplementation((id) => {
                if (id === 'ia-loader') return mockLoader;
                if (id === 'ia-articles-list') return mockListContainer;
                return mockElement;
            });

            // Tenter le rendu
            await iaApp.renderIAPageArticles();

            expect(mockLoader.classList.add).toHaveBeenCalledWith('hidden');
            expect(mockListContainer.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockListContainer.innerHTML).toContain('Sécurisation des LLM');
        });
    });

    // =========================================================================
    // CIBLE  : Page de GRC (grc.html / grc.js)
    // RÔLE   : Gérer l'affichage de la liste complète des flux de gouvernance, risques et conformité,
    //          le tri chronologique et le fallback automatique sur mocks locaux.
    // =========================================================================
    describe('GRC Page (grc.js)', () => {
        // Cible : Fonction generateVerticalGRCArticleHTML dans grc.js
        // Rôle  : Formater le rendu HTML d'un article individuel dans la liste verticale
        test('generateVerticalGRCArticleHTML devrait générer le HTML correct pour un article', () => {
            const article = { id: 42, date: '2026-06-25', title: 'Test GRC Spec', description: 'Une description de test' };
            const html = grcApp.generateVerticalGRCArticleHTML(article);
            expect(html).toContain('article.html?type=grc&id=42');
            expect(html).toContain('Test GRC Spec');
            expect(html).toContain('Une description de test');
            expect(html).toContain('SEC-GRC-0042');
        });

        // Cible : Fonction renderGRCPageArticles dans grc.js
        // Rôle  : Gérer l'affichage du spinner de chargement, la requête API Strapi
        //          et l'injection finale de la liste des articles avec fallback
        test('renderGRCPageArticles devrait afficher le loader puis injecter les articles', async () => {
            const mockLoader = { classList: { add: jest.fn() } };
            const mockListContainer = { innerHTML: '', classList: { remove: jest.fn() } };
            
            global.document.getElementById.mockImplementation((id) => {
                if (id === 'grc-loader') return mockLoader;
                if (id === 'grc-articles-list') return mockListContainer;
                return mockElement;
            });

            // Tenter le rendu
            await grcApp.renderGRCPageArticles();

            expect(mockLoader.classList.add).toHaveBeenCalledWith('hidden');
            expect(mockListContainer.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockListContainer.innerHTML).toContain('Analyse des risques EBIOS RM');
        });
    });

    // =========================================================================
    // CIBLE  : Page de Recherches & Analyses (recherches.html / recherches.js)
    // RÔLE   : Gérer l'affichage de la liste complète des flux de recherches et analyses,
    //          le tri chronologique et le fallback automatique sur mocks locaux.
    // =========================================================================
    describe('Recherches & Analyses Page (recherches.js)', () => {
        // Cible : Fonction generateVerticalRecherchesArticleHTML dans recherches.js
        // Rôle  : Formater le rendu HTML d'un article individuel dans la liste verticale
        test('generateVerticalRecherchesArticleHTML devrait générer le HTML correct pour un article', () => {
            const article = { id: 42, date: '2026-06-25', title: 'Test Recherches Spec', description: 'Une description de test' };
            const html = recherchesApp.generateVerticalRecherchesArticleHTML(article);
            expect(html).toContain('article.html?type=recherches&id=42');
            expect(html).toContain('Test Recherches Spec');
            expect(html).toContain('Une description de test');
            expect(html).toContain('SEC-RES-0042');
        });

        // Cible : Fonction renderRecherchesPageArticles dans recherches.js
        // Rôle  : Gérer l'affichage du spinner de chargement, la requête API Strapi
        //          et l'injection finale de la liste des articles avec fallback
        test('renderRecherchesPageArticles devrait afficher le loader puis injecter les articles', async () => {
            const mockLoader = { classList: { add: jest.fn() } };
            const mockListContainer = { innerHTML: '', classList: { remove: jest.fn() } };
            
            global.document.getElementById.mockImplementation((id) => {
                if (id === 'recherches-loader') return mockLoader;
                if (id === 'recherches-articles-list') return mockListContainer;
                return mockElement;
            });

            // Tenter le rendu
            await recherchesApp.renderRecherchesPageArticles();

            expect(mockLoader.classList.add).toHaveBeenCalledWith('hidden');
            expect(mockListContainer.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockListContainer.innerHTML).toContain('Analyse formelle des protocoles cryptographiques');
        });
    });

    // =========================================================================
    // CIBLE  : Pagination (main.js / updatePaginationDOM et pages de listes)
    // RÔLE   : Valider l'injection du composant de pagination et le découpage
    //          local des articles mockés en cas de repli.
    // =========================================================================
    describe('Gestion de la Pagination et des fallbacks locaux', () => {
        let originalGetElementById;
        let originalCreateElement;
        let parentNode, listContainer, mockPageChange;

        beforeAll(() => {
            originalGetElementById = global.document.getElementById;
            originalCreateElement = global.document.createElement;
        });

        afterAll(() => {
            global.document.getElementById = originalGetElementById;
            global.document.createElement = originalCreateElement;
        });

        beforeEach(() => {
            mockPageChange = jest.fn();
            parentNode = {
                appendChild: jest.fn(),
                removeChild: jest.fn()
            };
            listContainer = {
                id: 'test-articles-list',
                parentNode: parentNode,
                innerHTML: ''
            };
            
            // On s'assure d'avoir un mock pour document.createElement
            global.document.createElement = jest.fn().mockImplementation((tag) => {
                if (tag === 'div') {
                    return {
                        id: '',
                        className: '',
                        innerHTML: '',
                        querySelectorAll: jest.fn().mockReturnValue([])
                    };
                }
                return {};
            });
        });

        test('updatePaginationDOM ne devrait rien faire si listContainer ou son parentNode est manquant', () => {
            app.updatePaginationDOM(null, 1, 3, 'cyber-pink', mockPageChange);
            app.updatePaginationDOM({ id: 'only-container' }, 1, 3, 'cyber-pink', mockPageChange);
            expect(parentNode.appendChild).not.toHaveBeenCalled();
        });

        test('updatePaginationDOM devrait supprimer le conteneur existant si totalPages <= 1', () => {
            const mockExistingPagination = { remove: jest.fn() };
            global.document.getElementById = jest.fn().mockReturnValue(mockExistingPagination);

            app.updatePaginationDOM(listContainer, 1, 1, 'cyber-pink', mockPageChange);

            expect(mockExistingPagination.remove).toHaveBeenCalled();
        });

        test('updatePaginationDOM devrait créer le conteneur de pagination et injecter les boutons sur plusieurs pages', () => {
            const mockCreatedElement = {
                id: '',
                className: '',
                innerHTML: '',
                querySelectorAll: jest.fn().mockReturnValue([])
            };
            global.document.getElementById = jest.fn().mockReturnValue(null);
            global.document.createElement.mockReturnValue(mockCreatedElement);

            app.updatePaginationDOM(listContainer, 1, 3, 'cyber-pink', mockPageChange);

            expect(global.document.createElement).toHaveBeenCalledWith('div');
            expect(mockCreatedElement.id).toBe('test-articles-list-pagination');
            expect(mockCreatedElement.className).toContain('mt-12');
            expect(parentNode.appendChild).toHaveBeenCalledWith(mockCreatedElement);
            
            expect(mockCreatedElement.innerHTML).toContain('PREV');
            expect(mockCreatedElement.innerHTML).toContain('NEXT');
            expect(mockCreatedElement.innerHTML).toContain('bg-cyber-pink');
        });

        test('Les getters et setters de currentPage dans veille.js fonctionnent correctement', () => {
            veilleApp.setCurrentPage(3);
            expect(veilleApp.getCurrentPage()).toBe(3);
            veilleApp.setCurrentPage(1);
        });

        test('renderVeillePageArticles applique bien la pagination locale sur les mocks (taille de page = 5)', async () => {
            const mockLoader = { classList: { add: jest.fn() } };
            const mockListContainer = { 
                id: 'veille-articles-list',
                innerHTML: '', 
                classList: { remove: jest.fn() },
                parentNode: parentNode
            };
            
            global.document.getElementById = jest.fn().mockImplementation((id) => {
                if (id === 'veille-loader') return mockLoader;
                if (id === 'veille-articles-list') return mockListContainer;
                return null;
            });

            // Page 1
            veilleApp.setCurrentPage(1);
            await veilleApp.renderVeillePageArticles();

            expect(mockListContainer.innerHTML).toContain('Deepfakes vocaux');
            expect(mockListContainer.innerHTML).not.toContain('Auto-GPT et Botnets autonomes');

            // Page 2
            veilleApp.setCurrentPage(2);
            await veilleApp.renderVeillePageArticles();

            expect(mockListContainer.innerHTML).toContain('Auto-GPT et Botnets autonomes');
            expect(mockListContainer.innerHTML).not.toContain('Deepfakes vocaux');
            
            veilleApp.setCurrentPage(1);
        });
    });
});
