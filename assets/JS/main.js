/**
 * =========================================
 *  FONCTIONS DE L'ANCIENNE VERSION (gerer_compte)
 * =========================================
 */
function switchTab(tabId) {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => panel.classList.add('hidden'));

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

    const targetPanel = document.getElementById('panel-' + tabId);
    if (targetPanel) targetPanel.classList.remove('hidden');

    const activeBtn = document.getElementById('tab-btn-' + tabId);
    if (activeBtn) {
        activeBtn.setAttribute('aria-selected', 'true');
        activeBtn.classList.remove('text-gray-600', 'hover:bg-gray-50');
        if (tabId === 'danger') {
            activeBtn.classList.add('bg-red-50', 'text-red-700', 'font-medium');
        } else {
            activeBtn.classList.add('text-indigo-700', 'bg-indigo-50', 'font-medium');
        }
    }
}

function handleSave(event, message) {
    if (event) event.preventDefault();
    const toast = document.getElementById('toast');
    if (!toast) return;
    const toastMsg = document.getElementById('toast-message');
    if (toastMsg) toastMsg.innerText = message;
    toast.classList.remove('hidden');
    toast.classList.add('opacity-100');
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
}

function formatLongDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

function renderVeilleArticles() {
    const container = document.getElementById('veille-container');
    if (!container) return;
    const visibleArticles = [...mockStrapiData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
    let htmlContent = '';
    visibleArticles.forEach(article => {
        htmlContent += `
            <a href="#" class="group flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-all duration-200 border-b border-gray-100 dark:border-gray-700/30 last:border-0">
                <span class="text-xs font-mono font-bold text-cyber-pink min-w-[40px] mt-0.5">${formatDate(article.date)}</span>
                <div class="flex-1">
                    <h4 class="text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:text-cyber-blue transition-colors leading-snug mb-1">
                        ${article.title}
                    </h4>
                    <p class="text-[10px] text-gray-400 line-clamp-1">${article.description}</p>
                </div>
            </a>
        `;
    });
    container.innerHTML = htmlContent;
}

function renderBriefingArticles() {
    const container = document.getElementById('briefing-grid');
    if (!container) return;
    const visibleArticles = [...mockBriefingData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
    let htmlContent = '';
    visibleArticles.forEach(article => {
        const theme = briefingThemes[article.theme] || briefingThemes['blue'];
        const colorClass = theme.color;
        const shadowColor = theme.shadow;
        htmlContent += `
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
                    <a href="#" class="inline-flex items-center text-${colorClass} hover:text-cyber-black dark:hover:text-white font-mono text-sm uppercase tracking-wider mt-auto font-bold transition-colors">
                        <span>Initialiser lecture</span>
                        <i data-lucide="chevron-right" class="ml-1 w-4 h-4"></i>
                    </a>
                </div>
                <div class="h-1 w-full bg-gradient-to-r from-${colorClass} to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </article>
        `;
    });
    container.innerHTML = htmlContent;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    renderVeilleArticles();
    renderBriefingArticles();
});

// --- Menu Mobile Toggle ---
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

// --- Login Modal Logic ---
function toggleLoginModal() {
    if(!loginModal) return;
    const isOpen = !loginModal.classList.contains('hidden');
    if (isOpen) {
        loginModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    } else {
        if(authMessage) {
            authMessage.textContent = '';
            authMessage.classList.add('hidden');
            authMessage.classList.remove('text-cyber-green');
            authMessage.classList.add('text-red-600');
        }
        loginModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}
if(loginModal) {
    loginModal.addEventListener('click', function(e) {
        if (e.target === this) toggleLoginModal();
    });
}

function checkAuthStatus() {
    const storedUser = localStorage.getItem('cyberScopeUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        setUIStateLoggedIn(user.username);
    } else {
        setUIStateLoggedOut();
    }
}

function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username-input')?.value;
    const passwordInput = document.getElementById('password-input')?.value;
    if(authMessage) authMessage.classList.add('hidden');

    if (!usernameInput || usernameInput.trim() === "" || !passwordInput || passwordInput.trim() === "") {
        if(authMessage) {
            authMessage.textContent = 'ERREUR: Identifiants/Mot de passe requis.';
            authMessage.classList.remove('hidden');
        }
        return;
    }

    setTimeout(() => {
        const userData = { username: usernameInput.toUpperCase(), token: 'fake-jwt-token-123456' };
        localStorage.setItem('cyberScopeUser', JSON.stringify(userData));
        if(authMessage) {
            authMessage.classList.remove('text-red-600', 'text-cyber-red', 'text-cyber-blue', 'text-cyber-pink');
            authMessage.classList.add('text-cyber-green');
            authMessage.textContent = 'CONNEXION RÉUSSIE. ACCÈS ACCORDÉ.';
            authMessage.classList.remove('hidden');
        }
        setTimeout(() => {
            setUIStateLoggedIn(userData.username);
            toggleLoginModal(); 
        }, 1500);
    }, 500);
}

function handleLogout() {
    localStorage.removeItem('cyberScopeUser');
    setUIStateLoggedOut();
}

function setUIStateLoggedIn(username) {
    if(loginBtnTrigger) loginBtnTrigger.classList.add('hidden');
    if(userDropdown) userDropdown.classList.remove('hidden');
    if(userDisplayName) userDisplayName.textContent = username;
    if(mobileBtnLogin) mobileBtnLogin.classList.add('hidden');
    if(mobileUserMenu) mobileUserMenu.classList.remove('hidden');
    if(mobileUsernameDisplay) mobileUsernameDisplay.textContent = username;
}

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
const hasConsent = localStorage.getItem('cyberScopeCookieConsent');
const isBannerDismissed = sessionStorage.getItem('cookieBannerDismissed');

function showCookieModal() {
    if (!hasConsent && !isBannerDismissed && cookieModal) {
        cookieModal.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
        cookieModal.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
    }
}

function dismissCookieBanner() {
    sessionStorage.setItem('cookieBannerDismissed', 'true');
    hideCookieModal();
}

function hideCookieModal() {
    if(cookieModal) {
        cookieModal.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
        cookieModal.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
    }
}

function acceptCookies() {
    localStorage.setItem('cyberScopeCookieConsent', 'true');
    hideCookieModal();
}

function declineCookies() {
     localStorage.setItem('cyberScopeCookieConsent', 'false');
     hideCookieModal();
     closePreferencesModal();
}

function showPreferencesModal() {
    hideCookieModal();
    if (preferencesModal) {
        preferencesModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closePreferencesModal() {
    if (preferencesModal) {
        preferencesModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function returnToCookieBanner() {
    closePreferencesModal();
    if (cookieModal) {
        cookieModal.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
        cookieModal.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
    }
}

function declineCookiesAndClosePreferences() {
    declineCookies();
    closePreferencesModal();
}

function savePreferencesAndClose() {
    localStorage.setItem('cyberScopeCookieConsent', 'true');
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
