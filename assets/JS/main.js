/**
 * =========================================
 *  FONCTIONS DE L'ANCIENNE VERSION (gerer_compte)
 * =========================================
 */

/**
 * Masque tous les panneaux de la page en ajoutant la classe 'hidden'.
 *
 * @returns {void}
 */
function hideAllPanels() {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => panel.classList.add('hidden'));
}

/**
 * Réinitialise l'état visuel et d'accessibilité de tous les boutons d'onglets.
 *
 * @returns {void}
 */
function resetAllTabButtons() {
    const buttons = document.querySelectorAll('.sidebar__nav-item');
    buttons.forEach(btn => {
        btn.setAttribute('aria-selected', 'false');
        btn.classList.remove('text-indigo-700', 'bg-indigo-50', 'font-medium');
        btn.classList.add('text-gray-600', 'hover:bg-gray-50');
        if (btn.id === 'tab-btn-danger') {
            btn.classList.remove('text-gray-600');
            btn.classList.add('text-red-600');
        }
    });
}

/**
 * Affiche le panneau associé à l'identifiant spécifié.
 *
 * @param {string} tabId - L'identifiant de l'onglet.
 * @returns {void}
 */
function showTargetPanel(tabId) {
    const targetPanel = document.getElementById('panel-' + tabId);
    if (targetPanel) targetPanel.classList.remove('hidden');
}

/**
 * Active visuellement le bouton d'onglet correspondant et met à jour ses attributs ARIA.
 *
 * @param {string} tabId - L'identifiant de l'onglet à activer.
 * @returns {void}
 */
function activateTabButton(tabId) {
    const activeBtn = document.getElementById('tab-btn-' + tabId);
    if (!activeBtn) return;
    
    activeBtn.setAttribute('aria-selected', 'true');
    activeBtn.classList.remove('text-gray-600', 'hover:bg-gray-50');
    if (tabId === 'danger') {
        activeBtn.classList.add('bg-red-50', 'text-red-700', 'font-medium');
    } else {
        activeBtn.classList.add('text-indigo-700', 'bg-indigo-50', 'font-medium');
    }
}

/**
 * Permet de basculer l'affichage entre les différents onglets de l'interface utilisateur.
 * Modifie l'état visuel et l'accessibilité (attributs ARIA) des onglets et panneaux correspondants.
 *
 * @param {string} tabId - L'identifiant de l'onglet à activer (ex: 'danger', 'info').
 * @returns {void}
 */
function switchTab(tabId) {
    hideAllPanels();
    resetAllTabButtons();
    showTargetPanel(tabId);
    activateTabButton(tabId);
}

/**
 * Gère l'action de sauvegarde en affichant un message de notification (toast).
 *
 * @param {Event|null} event - L'événement de soumission ou de clic à intercepter.
 * @param {string} message - Le message à afficher dans la notification.
 * @returns {Promise<void>} Une promesse résolue une fois l'affichage terminé.
 */
async function handleSave(event, message) {
    if (event) event.preventDefault();
    const toast = document.getElementById('toast');
    if (!toast) return;
    const toastMsg = document.getElementById('toast-message');
    if (toastMsg) toastMsg.innerText = message;
    
    toast.classList.remove('hidden');
    toast.classList.add('opacity-100');
    
    await delay(3000);
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
    
    await delay(300);
    toast.classList.add('hidden');
}


/**
 * =========================================
 *  NOUVEAU DESIGN CYBER & LOGIQUE GLOBALE
 * =========================================
 */

// Initialisation des icônes Lucide (si dispo)
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// --- DOM Elements ---
const loginModal = document.getElementById('login-modal');
const loginBtnTrigger = document.getElementById('btn-login-trigger');
const userDropdown = document.getElementById('user-dropdown');
const userDisplayName = document.getElementById('user-display-name');
const authMessage = document.getElementById('auth-message');

const cookieModal = document.getElementById('cookie-modal');
const preferencesModal = document.getElementById('preferences-modal');

const mobileBtnLogin = document.getElementById('mobile-btn-login');
const mobileUserMenu = document.getElementById('mobile-user-menu');
const mobileUsernameDisplay = document.getElementById('mobile-username-display');

// --- SIMULATION STRAPI (BACKEND) ---
const mockStrapiData = [
    { id: 1, date: "2025-10-14", title: "Deepfakes vocaux : Les CEO ciblés", description: "Clonage audio utilisé pour des fraudes au virement." },
    { id: 2, date: "2025-10-12", title: "Jailbreak GPT-5 : Nouveau prompt", description: "La technique 'Do Anything Now' évolue encore." },
    { id: 3, date: "2025-10-10", title: "Malwares polymorphes via LLM", description: "Code mutant généré à la volée par des IA locales." },
    { id: 4, date: "2025-10-09", title: "Poisoning de dataset confirmé", description: "HuggingFace audite ses modèles majeurs." },
    { id: 5, date: "2025-10-08", title: "Phishing IA : +300% de succès", description: "Les emails ne contiennent plus de fautes." },
    { id: 6, date: "2025-10-05", title: "Auto-GPT et Botnets autonomes", description: "Analyse d'un trafic suspect sur le port 443." }
];

const mockReglementationData = [
    { id: 1, date: "2025-10-15", title: "Directive NIS 2 : Nouvelles exigences cyber", description: "La directive NIS 2 renforce les exigences de sécurité pour les secteurs essentiels et importants au sein de l'UE. Elle introduit des règles strictes sur la gestion des risques et les notifications d'incidents." },
    { id: 2, date: "2025-10-12", title: "Règlement DORA : Résilience opérationnelle", description: "Le règlement DORA (Digital Operational Resilience Act) harmonise la sécurité des systèmes d'information pour le secteur financier européen. Il impose des tests de pénétration rigoureux et des audits tiers." },
    { id: 3, date: "2025-10-08", title: "Sécurisation du Pipeline CI/CD DevSecOps", description: "Guide pratique pour intégrer l'analyse de secrets (Gitleaks), le scan IaC (Trivy) et la validation de conformité (Conftest) dans vos pipelines de déploiement continu." },
    { id: 4, date: "2025-10-05", title: "RGPD & Minimisation : Bonnes pratiques CNIL", description: "Application concrète du principe de minimisation des données (Art. 5.1.c du RGPD) sur les formulaires de collecte. Gestion des consentements granulaires et politique de purge automatique." },
    { id: 5, date: "2025-10-02", title: "OWASP DevSecOps Guideline 2026", description: "Les nouvelles recommandations de l'OWASP pour l'automatisation de la sécurité dans le cycle de développement logiciel, en mettant l'accent sur les outils de SAST et SCA." }
];

const mockIAData = [
    { id: 1, date: "2025-10-15", title: "Sécurisation des LLM : Les failles d'injection de prompts", description: "Les injections de prompt (Prompt Injection) représentent la menace numéro 1 du Top 10 OWASP pour les LLM. Ce rapport analyse comment les filtres d'entrées et les architectures de double-contexte permettent de s'en prémunir." },
    { id: 2, date: "2025-10-12", title: "Audit de sécurité sur HuggingFace : Datasets empoisonnés", description: "Des chercheurs découvrent plusieurs datasets populaires contenant des backdoors d'empoisonnement (data poisoning). L'audit recommande la signature cryptographique des modèles." },
    { id: 3, date: "2025-10-08", title: "Apprentissage fédéré et confidentialité des données de santé", description: "Mise en œuvre d'algorithmes d'apprentissage fédéré (Federated Learning) couplés à la confidentialité différentielle (Differential Privacy) pour entraîner des modèles de diagnostic sans centraliser les PII." },
    { id: 4, date: "2025-10-05", title: "IA Offensive vs. Défensive : La guerre des algorithmes", description: "Comment les équipes de sécurité offensive simulent des attaques par force brute intelligente et comment les SIEM dopés à l'IA détectent ces micro-anomalies en temps réel." },
    { id: 5, date: "2025-10-02", title: "Réguler l'IA : Conformité avec l'AI Act européen", description: "Analyse des exigences juridiques et techniques imposées par l'AI Act européen pour les systèmes d'intelligence artificielle classés à haut risque. Documentation technique et audit de robustesse obligatoires." }
];

const mockGRCData = [
    { id: 1, date: "2025-10-15", title: "Analyse des risques EBIOS RM : Méthodologie officielle", description: "La méthode EBIOS Risk Manager est le standard français pour l'évaluation et le traitement des risques de sécurité des systèmes d'information. Cette fiche guide détaille la mise en œuvre des 5 ateliers réglementaires." },
    { id: 2, date: "2025-10-12", title: "ISO 27001:2022 : Guide de transition et d'implémentation", description: "Les étapes clés pour mettre en conformité votre Système de Management de la Sécurité de l'Information (SMSI) avec la version 2022 de la norme ISO 27001. Focus sur les nouveaux contrôles de sécurité de l'Annexe A." },
    { id: 3, date: "2025-10-08", title: "Gestion des risques tiers : Questionnaire de sécurité fournisseurs", description: "Modèle standardisé d'évaluation de la sécurité des sous-traitants et fournisseurs SaaS. Comment mesurer le niveau d'exposition au risque de la supply chain numérique." },
    { id: 4, date: "2025-10-05", title: "Sensibilisation phishing : Indicateurs clés et reporting", description: "Comment concevoir des campagnes réalistes de test d'hameçonnage, calculer le taux de clics critique et mesurer l'évolution de la posture de vigilance des collaborateurs." },
    { id: 5, date: "2025-10-02", title: "Conformité RGPD : Le registre des traitements et la PIA", description: "Guide méthodologique de la CNIL pour la tenue du registre des activités de traitement et la réalisation d'Analyses d'Impact relatives à la Protection des Données (AIPD / PIA)." }
];

const mockRecherchesData = [
    { id: 1, date: "2025-10-15", title: "Analyse formelle des protocoles cryptographiques post-quantiques", description: "Étude et vérification formelle des mécanismes d'encapsulation de clé (KEM) Kyber validés par le NIST. Analyse de la robustesse contre les attaques par canaux auxiliaires." },
    { id: 2, date: "2025-10-12", title: "Modélisation des menaces sur les architectures micro-services Zero-Trust", description: "Recherche académique sur l'évaluation quantitative des surfaces d'attaque dans les réseaux maillés (Service Mesh). Proposition d'un modèle mathématique de propagation des compromissions." },
    { id: 3, date: "2025-10-08", title: "Détection des anomalies de flux par apprentissage non-supervisé", description: "Application d'auto-encodeurs profonds à la détection de signaux faibles et d'exfiltration de données dans les réseaux industriels haut débit." },
    { id: 4, date: "2025-10-05", title: "Vulnérabilités matérielles : Analyse comparative de Spectre et Meltdown", description: "Modélisation fine des attaques temporelles basées sur l'exécution spéculative des processeurs modernes. Évaluation des correctifs logiciels et microcode." }
];

const mockBriefingData = [
    { id: 1, date: "2025-10-12", title: "Analyse du Ransomware 'NeonLock'", description: "Une nouvelle variante utilisant le chiffrement quantique cible les infrastructures critiques.", category: "MALWARE", views: 1542, theme: "green", icon: "lock" },
    { id: 2, date: "2025-10-10", title: "L'IA Offensive : Algorithmes d'attaque", description: "Les outils de pentesting automatisés par l'IA changent la donne.", category: "IA & SÉCURITÉ", views: 1205, theme: "pink", icon: "brain-circuit" },
    { id: 3, date: "2025-10-05", title: "La mort du VPN ? Architecture Zero Trust", description: "\"Ne jamais faire confiance, toujours vérifier\".", category: "ZERO TRUST", views: 980, theme: "blue", icon: "shield-alert" },
    { id: 4, date: "2025-10-01", title: "Smart Home, Smart Hack ?", description: "Votre frigo mine-t-il du crypto ?", category: "IOT", views: 850, theme: "purple", icon: "wifi" }
];

const briefingThemes = {
    green: { color: 'cyber-green', shadow: 'rgba(0,170,44,0.15)' },
    pink: { color: 'cyber-pink', shadow: 'rgba(214,0,214,0.15)' },
    blue: { color: 'cyber-blue', shadow: 'rgba(0,184,194,0.15)' },
    purple: { color: 'cyber-purple', shadow: 'rgba(138,0,189,0.15)' },
    red: { color: 'cyber-red', shadow: 'rgba(255,0,60,0.15)' }
};

/**
 * Formate une date ISO sous format court (JJ/MM).
 *
 * @param {string} dateString - Chaîne de caractères représentant la date (format ISO AAAA-MM-JJ).
 * @returns {string} La date formatée (JJ/MM).
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
}

/**
 * Formate une date ISO sous format long (JJ MOIS AAAA), le mois étant en toutes lettres abrégé.
 *
 * @param {string} dateString - Chaîne de caractères représentant la date (format ISO AAAA-MM-JJ).
 * @returns {string} La date formatée (ex: "18 JUIN 2026").
 */
function formatLongDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

/**
 * Crée une promesse qui se résout après un délai spécifié en millisecondes.
 * Utilisée pour moderniser les setTimeout et éviter le callback hell.
 *
 * @param {number} ms - Le délai en millisecondes.
 * @returns {Promise<void>} Une promesse résolue après le délai.
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Aplatit la structure de réponse de Strapi pour prendre en charge les formats v4 et v5.
 *
 * @param {Object} item - Un élément de données renvoyé par Strapi.
 * @returns {Object} L'élément aplati.
 */
function flattenStrapiItem(item) {
    if (!item) return null;
    if (item.attributes) {
        return { id: item.id, ...item.attributes };
    }
    return item;
}

/**
 * Génère le code HTML correspondant à un article de veille technologique.
 *
 * @param {Object} article - Les données de l'article (id, date, title, description).
 * @returns {string} Le fragment de code HTML représentant l'article.
 */
function generateVeilleArticleHTML(article) {
    return `
        <a href="article.html?type=veille&id=${article.id}" class="group flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-all duration-200 border-b border-gray-100 dark:border-gray-700/30 last:border-0">
            <span class="text-xs font-mono font-bold text-cyber-pink min-w-[40px] mt-0.5">${formatDate(article.date)}</span>
            <div class="flex-1">
                <h4 class="text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:text-cyber-blue transition-colors leading-snug mb-1">
                    ${article.title}
                </h4>
                <p class="text-[10px] text-gray-400 line-clamp-1">${article.description}</p>
            </div>
        </a>
    `;
}

/**
 * Récupère, trie et injecte le code HTML des articles de veille technologique
 * dans le conteneur principal '#veille-container'.
 *
 * @returns {Promise<void>}
 */
async function renderVeilleArticles() {
    const container = document.getElementById('veille-container');
    if (!container) return;
    
    let articles = [];
    try {
        const response = await fetch('http://localhost:1337/api/veilles');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        const rawData = json.data || [];
        articles = rawData.map(flattenStrapiItem);
        
        if (articles.length === 0) {
            articles = mockStrapiData;
        }
    } catch (error) {
        console.warn("Strapi non démarré ou erreur réseau, repli sur les données mockées :", error);
        articles = mockStrapiData;
    }

    const sortedArticles = [...articles]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);
    container.innerHTML = sortedArticles.map(generateVeilleArticleHTML).join('');
}

/**
 * Génère le code HTML correspondant à un article briefing.
 *
 * @param {Object} article - Les données de l'article (id, date, title, description, category, views, theme, icon).
 * @returns {string} Le fragment de code HTML représentant l'article.
 */
function generateBriefingArticleHTML(article) {
    const theme = briefingThemes[article.theme] || briefingThemes['blue'];
    const colorClass = theme.color;
    const shadowColor = theme.shadow;
    return `
        <article class="bg-white dark:bg-cyber-panel border border-gray-200 dark:border-gray-800 hover:border-${colorClass} dark:hover:border-${colorClass} transition-all duration-300 hover:shadow-lg group relative overflow-hidden rounded-md flex flex-col h-full shadow-sm theme-transition" style="--hover-shadow: ${shadowColor}">
            <style>.group:hover { box-shadow: 0 0 15px var(--hover-shadow); }</style>
            <div class="absolute top-0 right-0 p-2 opacity-30 dark:opacity-20">
                <i data-lucide="${article.icon}" class="text-gray-400 dark:text-gray-600 group-hover:text-${colorClass} transition-colors w-8 h-8"></i>
            </div>
            <div class="p-6 flex-grow relative z-10">
                <div class="flex items-center justify-between text-xs font-mono text-${colorClass} font-bold mb-3">
                    <div class="flex space-x-2">
                        <span class="border border-${colorClass} px-1 bg-${colorClass}/5 dark:bg-transparent uppercase">${article.category}</span>
                        <span class="text-gray-500 dark:text-gray-400">${formatLongDate(article.date)}</span>
                    </div>
                    <span class="flex items-center text-gray-500 dark:text-gray-400">
                        <i data-lucide="eye" class="w-3 h-3 mr-1"></i>
                        <span>${article.views.toLocaleString()}</span>
                    </span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-${colorClass} transition-colors font-orbitron">${article.title}</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4 font-sans leading-relaxed text-sm">${article.description}</p>
                <a href="article.html?type=briefing&id=${article.id}" class="inline-flex items-center text-${colorClass} hover:text-cyber-black dark:hover:text-white font-mono text-sm uppercase tracking-wider mt-auto font-bold transition-colors">
                    <span>Initialiser lecture</span>
                    <i data-lucide="chevron-right" class="ml-1 w-4 h-4"></i>
                </a>
            </div>
            <div class="h-1 w-full bg-gradient-to-r from-${colorClass} to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </article>
    `;
}

/**
 * Récupère, trie et injecte le code HTML des articles briefing
 * dans la grille d'affichage '#briefing-grid'.
 *
 * @returns {Promise<void>}
 */
async function renderBriefingArticles() {
    const container = document.getElementById('briefing-grid');
    if (!container) return;

    let articles = [];
    try {
        const response = await fetch('http://localhost:1337/api/briefings');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        const rawData = json.data || [];
        articles = rawData.map(flattenStrapiItem);

        if (articles.length === 0) {
            articles = mockBriefingData;
        }
    } catch (error) {
        console.warn("Strapi non démarré ou erreur réseau, repli sur les données mockées :", error);
        articles = mockBriefingData;
    }

    const sortedArticles = [...articles]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);
    container.innerHTML = sortedArticles.map(generateBriefingArticleHTML).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    renderVeilleArticles();
    renderBriefingArticles();
});

// --- Menu Mobile Toggle ---
/**
 * Affiche ou masque le menu de navigation sur mobile en basculant la classe CSS 'hidden'.
 *
 * @returns {void}
 */
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

// --- Login Modal Logic ---

/**
 * Ferme la modale de connexion et rétablit le défilement de la page.
 *
 * @returns {void}
 */
function closeLoginModal() {
    loginModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

/**
 * Réinitialise les messages d'état de l'authentification.
 *
 * @returns {void}
 */
function resetAuthMessage() {
    if (!authMessage) return;
    authMessage.textContent = '';
    authMessage.classList.add('hidden');
    authMessage.classList.remove('text-cyber-green');
    authMessage.classList.add('text-red-600');
}

/**
 * Ouvre la modale de connexion, réinitialise les messages et désactive le défilement.
 *
 * @returns {void}
 */
function openLoginModal() {
    resetAuthMessage();
    loginModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Ouvre ou ferme la boîte de dialogue de connexion (modale).
 * Réinitialise les éventuels messages d'erreur et bloque le défilement de la page en arrière-plan lorsque la modale est active.
 *
 * @returns {void}
 */
function toggleLoginModal() {
    if (!loginModal) return;
    const isOpen = !loginModal.classList.contains('hidden');
    if (isOpen) {
        closeLoginModal();
    } else {
        openLoginModal();
    }
}
if(loginModal) {
    loginModal.addEventListener('click', function(e) {
        if (e.target === this) toggleLoginModal();
    });
}

/**
 * Vérifie le statut d'authentification de l'utilisateur au chargement de la page.
 * Restaure la session depuis le localStorage si des identifiants existent.
 *
 * @returns {void}
 */
function checkAuthStatus() {
    const storedUser = localStorage.getItem('cyberScopeUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        setUIStateLoggedIn(user.username);
    } else {
        setUIStateLoggedOut();
    }
}

/**
 * Vérifie si les identifiants saisis sont valides (non vides).
 *
 * @param {string} username - Le nom d'utilisateur.
 * @param {string} password - Le mot de passe.
 * @returns {boolean} True si valide, false sinon.
 */
function isValidCredentials(username, password) {
    return !!(username && username.trim() !== "" && password && password.trim() !== "");
}

/**
 * Affiche un message d'erreur d'authentification sur l'IHM.
 *
 * @param {string} message - Le message d'erreur à afficher.
 * @returns {void}
 */
function showLoginError(message) {
    if (!authMessage) return;
    authMessage.textContent = message;
    authMessage.classList.remove('hidden');
}

/**
 * Simule la connexion réseau, sauvegarde la session dans le localStorage et retourne l'utilisateur.
 *
 * @param {string} username - Le nom d'utilisateur.
 * @returns {Object} Les données utilisateur de session.
 */
function loginUser(username) {
    const userData = { username: username.toUpperCase(), token: 'fake-jwt-token-123456' };
    localStorage.setItem('cyberScopeUser', JSON.stringify(userData));
    return userData;
}

/**
 * Affiche le message de réussite de la connexion.
 *
 * @returns {void}
 */
function showLoginSuccess() {
    if (!authMessage) return;
    authMessage.classList.remove('text-red-600', 'text-cyber-red', 'text-cyber-blue', 'text-cyber-pink');
    authMessage.classList.add('text-cyber-green');
    authMessage.textContent = 'CONNEXION RÉUSSIE. ACCÈS ACCORDÉ.';
    authMessage.classList.remove('hidden');
}

/**
 * Termine la session de connexion en mettant à jour l'IHM et fermant la modale.
 *
 * @param {string} username - Le nom d'utilisateur de la session.
 * @returns {void}
 */
function completeLoginSession(username) {
    setUIStateLoggedIn(username);
    toggleLoginModal();
}

/**
 * Gère la soumission du formulaire de connexion utilisateur (simulation).
 * Valide les champs obligatoires, simule un appel réseau asynchrone et met à jour l'interface.
 *
 * @param {Event} event - L'événement de soumission du formulaire.
 * @returns {Promise<void>} Une promesse résolue une fois l'authentification finalisée.
 */
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username-input')?.value;
    const password = document.getElementById('password-input')?.value;
    
    if (authMessage) authMessage.classList.add('hidden');

    if (!isValidCredentials(username, password)) {
        showLoginError('ERREUR: Identifiants/Mot de passe requis.');
        return;
    }

    await delay(500);
    const userData = loginUser(username);
    showLoginSuccess();

    await delay(1500);
    completeLoginSession(userData.username);
}

/**
 * Déconnecte l'utilisateur actuel en supprimant sa session du localStorage et en réinitialisant l'interface utilisateur.
 *
 * @returns {void}
 */
function handleLogout() {
    localStorage.removeItem('cyberScopeUser');
    setUIStateLoggedOut();
}

/**
 * Met à jour l'interface graphique (desktop et mobile) pour refléter un état connecté.
 *
 * @param {string} username - Le nom d'utilisateur à afficher dans le menu de profil.
 * @returns {void}
 */
function setUIStateLoggedIn(username) {
    if(loginBtnTrigger) loginBtnTrigger.classList.add('hidden');
    if(userDropdown) userDropdown.classList.remove('hidden');
    if(userDisplayName) userDisplayName.textContent = username;
    if(mobileBtnLogin) mobileBtnLogin.classList.add('hidden');
    if(mobileUserMenu) mobileUserMenu.classList.remove('hidden');
    if(mobileUsernameDisplay) mobileUsernameDisplay.textContent = username;
}

/**
 * Met à jour l'interface graphique (desktop et mobile) pour refléter un état déconnecté.
 *
 * @returns {void}
 */
function setUIStateLoggedOut() {
    if(loginBtnTrigger) loginBtnTrigger.classList.remove('hidden');
    if(userDropdown) userDropdown.classList.add('hidden');
    if(userDisplayName) userDisplayName.textContent = 'USER';
    if(mobileBtnLogin) mobileBtnLogin.classList.remove('hidden');
    if(mobileUserMenu) mobileUserMenu.classList.add('hidden');
    if(mobileUsernameDisplay) mobileUsernameDisplay.textContent = '';
}

function handleSignupAttempt() {
    if(authMessage) {
        authMessage.classList.remove('hidden', 'text-cyber-green', 'text-cyber-red', 'text-cyber-pink');
        authMessage.classList.add('text-cyber-blue');
        authMessage.textContent = 'MODULE INSCRIPTION: Protocole activé. Veuillez entrer vos informations et cliquer sur "Se connecter".';
    }
}

function handlePasswordResetAttempt() {
    if(authMessage) {
        authMessage.classList.remove('hidden', 'text-cyber-green', 'text-cyber-red', 'text-cyber-blue');
        authMessage.classList.add('text-cyber-pink');
        authMessage.textContent = 'RÉCUPÉRATION: Un lien sécurisé a été envoyé sur votre terminal de messagerie (simulation).';
    }
}

checkAuthStatus();

// --- Theme Toggle Logic ---
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
}

function updateViewCounts() {
    const viewElements = document.querySelectorAll('.article-view-count');
    viewElements.forEach(el => {
        let currentViews = parseInt(el.getAttribute('data-initial-views'));
        if(!isNaN(currentViews)) {
            const newViews = currentViews + Math.floor(Math.random() * 5); 
            el.textContent = newViews.toLocaleString('fr-FR');
        }
    });
}

// --- Cookie Modal Logic ---
// Configuration globale pour les cookies (facilement surchargeable par un CMS)
window.AppCookieConfig = window.AppCookieConfig || {
    consentName: 'consent_state',
    prefsName: 'consent_prefs',
    maxAge: 6 * 30 * 24 * 60 * 60, // 6 mois
    path: '/',
    sameSite: 'Strict'
};

/**
 * Récupère la valeur d'un cookie donné par son nom.
 *
 * @param {string} name - Le nom du cookie à rechercher.
 * @returns {string|null} La valeur du cookie décodée, ou null s'il n'existe pas.
 */
function getCookieConsent(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

/**
 * Enregistre le consentement et les préférences de cookies dans les cookies du document.
 *
 * @param {string} value - L'état global du consentement (ex: 'accepted', 'refused', 'custom').
 * @param {Object} [prefsObj] - Un objet contenant les consentements détaillés (ex: { functional: true, analytics: false }).
 * @returns {void}
 */
function setCookieConsent(value, prefsObj) {
    const config = window.AppCookieConfig;
    const isSecure = window.location.protocol === 'https:' ? 'Secure;' : '';
    
    // Cookie d'état global
    document.cookie = `${config.consentName}=${value}; max-age=${config.maxAge}; path=${config.path}; ${isSecure} SameSite=${config.sameSite}`;
    
    // Cookie des préférences détaillées
    if (prefsObj) {
        const prefsStr = encodeURIComponent(JSON.stringify(prefsObj));
        document.cookie = `${config.prefsName}=${prefsStr}; max-age=${config.maxAge}; path=${config.path}; ${isSecure} SameSite=${config.sameSite}`;
    }
}

const hasConsent = getCookieConsent(window.AppCookieConfig.consentName);
const isBannerDismissed = sessionStorage.getItem('cookieBannerDismissed');

/**
 * Affiche la modale de cookies (effets visuels et interactifs).
 *
 * @returns {void}
 */
function displayCookieModal() {
    if (!cookieModal) return;
    cookieModal.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    cookieModal.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
}

/**
 * Masque la modale de cookies (effets visuels et interactifs).
 *
 * @returns {void}
 */
function concealCookieModal() {
    if (!cookieModal) return;
    cookieModal.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    cookieModal.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
}

/**
 * Affiche la modale d'avertissement de cookies si l'utilisateur n'a pas encore consenti
 * et que la bannière n'a pas été temporairement masquée pour cette session.
 *
 * @returns {void}
 */
function showCookieModal() {
    if (!hasConsent && !isBannerDismissed) {
        displayCookieModal();
    }
}

/**
 * Masque temporairement la bannière de cookies pour la session en cours.
 *
 * @returns {void}
 */
function dismissCookieBanner() {
    sessionStorage.setItem('cookieBannerDismissed', 'true');
    hideCookieModal();
}

/**
 * Masque la modale d'avertissement de cookies en appliquant les classes CSS de transition appropriées.
 *
 * @returns {void}
 */
function hideCookieModal() {
    concealCookieModal();
}

/**
 * Accepte tous les cookies en enregistrant le consentement global et ferme le bandeau.
 *
 * @returns {void}
 */
function acceptCookies() {
    setCookieConsent('accepted', { necessary: true, functional: true, analytics: true });
    hideCookieModal();
}

/**
 * Refuse les cookies non essentiels en enregistrant le choix et ferme le bandeau et le panneau des préférences.
 *
 * @returns {void}
 */
function declineCookies() {
     setCookieConsent('refused', { necessary: true, functional: false, analytics: false });
     hideCookieModal();
     closePreferencesModal();
}

/**
 * Ouvre le panneau de configuration fine des préférences de cookies.
 * Masque la bannière d'avertissement générale et bloque le défilement de la page.
 *
 * @returns {void}
 */
function showPreferencesModal() {
    hideCookieModal();
    if (preferencesModal) {
        preferencesModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Ferme le panneau des préférences de cookies et réactive le défilement de la page.
 *
 * @returns {void}
 */
function closePreferencesModal() {
    if (preferencesModal) {
        preferencesModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Retourne au bandeau de cookies principal à partir du panneau de configuration fine.
 *
 * @returns {void}
 */
function returnToCookieBanner() {
    closePreferencesModal();
    displayCookieModal();
}

/**
 * Décline tous les cookies non essentiels et ferme le panneau de configuration.
 *
 * @returns {void}
 */
function declineCookiesAndClosePreferences() {
    declineCookies();
    closePreferencesModal();
}

/**
 * Enregistre les préférences de cookies spécifiques sélectionnées par l'utilisateur via les cases à cocher du panneau de configuration.
 *
 * @returns {void}
 */
function saveSpecificPreferences() {
    const functional = document.getElementById('cookie-functional') ? document.getElementById('cookie-functional').checked : false;
    const analytics = document.getElementById('cookie-analytics') ? document.getElementById('cookie-analytics').checked : false;
    setCookieConsent('custom', { necessary: true, functional: functional, analytics: analytics });
    closePreferencesModal();
}

if(preferencesModal) {
    preferencesModal.addEventListener('click', function(e) {
        if (e.target === this) closePreferencesModal();
    });
}

if (!hasConsent && !isBannerDismissed) {
    const handleScroll = () => {
        if (window.scrollY > 100) {
            showCookieModal();
            window.removeEventListener('scroll', handleScroll);
        }
    };
    window.addEventListener('scroll', handleScroll);
    if(window.scrollY > 100 || document.body.scrollHeight < window.innerHeight + 100) {
         showCookieModal();
    }
}

updateViewCounts();
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
});

// Exporter les fonctions pour les tests unitaires sous Node/Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        formatLongDate,
        switchTab,
        handleSave,
        toggleMenu,
        toggleLoginModal,
        checkAuthStatus,
        handleLogin,
        handleLogout,
        setUIStateLoggedIn,
        setUIStateLoggedOut,
        handleSignupAttempt,
        handlePasswordResetAttempt,
        toggleTheme,
        updateViewCounts,
        getCookieConsent,
        setCookieConsent,
        showCookieModal,
        dismissCookieBanner,
        hideCookieModal,
        acceptCookies,
        declineCookies,
        showPreferencesModal,
        closePreferencesModal,
        returnToCookieBanner,
        declineCookiesAndClosePreferences,
        saveSpecificPreferences,
        renderVeilleArticles,
        renderBriefingArticles,
        flattenStrapiItem,
        delay
    };
}
