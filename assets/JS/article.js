/**
 * Script de gestion pour la page article.html (Lecture détaillée d'un article)
 * Dépend de main.js pour le chargement des utilitaires globaux et des données simulées.
 */

async function loadArticle() {
    const loader = document.getElementById('article-loader');
    const contentContainer = document.getElementById('article-content');
    const backBtn = document.getElementById('article-back-btn');
    if (!contentContainer) return;

    // Récupérer les paramètres d'URL (type et id)
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type'); // 'veille' ou 'briefing'
    const id = parseInt(urlParams.get('id'), 10);

    // Ajuster le bouton de retour en fonction du type d'article
    if (backBtn) {
        if (type === 'veille') {
            backBtn.href = 'veille.html';
            backBtn.innerHTML = '<i data-lucide="arrow-left" class="w-4 h-4 mr-2 inline"></i> RETOUR_VEILLE';
        } else if (type === 'reglementation') {
            backBtn.href = 'ReglementationDevSecOps.html';
            backBtn.innerHTML = '<i data-lucide="arrow-left" class="w-4 h-4 mr-2 inline"></i> RETOUR_REGLEMENTATION';
        } else if (type === 'ia') {
            backBtn.href = 'ia.html';
            backBtn.innerHTML = '<i data-lucide="arrow-left" class="w-4 h-4 mr-2 inline"></i> RETOUR_IA';
        } else if (type === 'grc') {
            backBtn.href = 'grc.html';
            backBtn.innerHTML = '<i data-lucide="arrow-left" class="w-4 h-4 mr-2 inline"></i> RETOUR_GRC';
        } else if (type === 'recherches') {
            backBtn.href = 'recherches.html';
            backBtn.innerHTML = '<i data-lucide="arrow-left" class="w-4 h-4 mr-2 inline"></i> RETOUR_RECHERCHES';
        } else {
            backBtn.href = 'index.html';
            backBtn.innerHTML = '<i data-lucide="arrow-left" class="w-4 h-4 mr-2 inline"></i> RETOUR_ACCUEIL';
        }
    }

    if (isNaN(id) || !type) {
        renderError(contentContainer, "PARAMÈTRES DE REQUÊTE INVALIDES OU ABSENTS.");
        if (loader) loader.classList.add('hidden');
        contentContainer.classList.remove('hidden');
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    let article = null;

    // Tenter de récupérer l'article depuis l'API Strapi
    try {
        let endpoint = '';
        if (type === 'veille') {
            endpoint = `http://localhost:1337/api/veilles/${id}`;
        } else if (type === 'reglementation') {
            endpoint = `http://localhost:1337/api/reglementations/${id}`;
        } else if (type === 'ia') {
            endpoint = `http://localhost:1337/api/ias/${id}`;
        } else if (type === 'grc') {
            endpoint = `http://localhost:1337/api/grcs/${id}`;
        } else if (type === 'recherches') {
            endpoint = `http://localhost:1337/api/recherches/${id}`;
        } else if (type === 'briefing') {
            endpoint = `http://localhost:1337/api/briefings/${id}`;
        }

        if (endpoint) {
            const response = await fetch(endpoint);
            if (response.ok) {
                const json = await response.json();
                const rawItem = json.data;
                // flattenStrapiItem est définie dans main.js
                if (typeof flattenStrapiItem === 'function') {
                    article = flattenStrapiItem(rawItem);
                } else if (rawItem) {
                    article = rawItem.attributes ? { id: rawItem.id, ...rawItem.attributes } : rawItem;
                }
            } else if (response.status === 404) {
                console.warn(`Article non trouvé sur Strapi (ID: ${id}, Type: ${type}), essai sur les données mockées.`);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
    } catch (error) {
        console.warn("Strapi déconnecté ou erreur réseau lors du chargement de l'article, repli sur le mock :", error);
    }

    // Si non récupéré depuis Strapi, chercher dans les mocks locaux (main.js)
    if (!article) {
        if (type === 'veille' && typeof mockStrapiData !== 'undefined') {
            article = mockStrapiData.find(item => item.id === id);
        } else if (type === 'reglementation' && typeof mockReglementationData !== 'undefined') {
            article = mockReglementationData.find(item => item.id === id);
        } else if (type === 'ia' && typeof mockIAData !== 'undefined') {
            article = mockIAData.find(item => item.id === id);
        } else if (type === 'grc' && typeof mockGRCData !== 'undefined') {
            article = mockGRCData.find(item => item.id === id);
        } else if (type === 'recherches' && typeof mockRecherchesData !== 'undefined') {
            article = mockRecherchesData.find(item => item.id === id);
        } else if (type === 'briefing' && typeof mockBriefingData !== 'undefined') {
            article = mockBriefingData.find(item => item.id === id);
        }
    }

    if (!article) {
        renderError(contentContainer, `ENREGISTREMENT INTROUVABLE [TYPE: ${type.toUpperCase()}, ID: ${id}]`);
    } else {
        renderArticleContent(contentContainer, article, type);
    }

    // Masquer le loader et afficher le contenu
    if (loader) loader.classList.add('hidden');
    contentContainer.classList.remove('hidden');

    // Réinitialiser les icônes
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Affiche un message d'erreur stylisé cyber de sécurité
 *
 * @param {HTMLElement} container - Le conteneur HTML où injecter le message d'erreur.
 * @param {string} message - Le message d'erreur à afficher.
 * @returns {void}
 */
function renderError(container, message) {
    container.innerHTML = `
        <div class="bg-red-50 dark:bg-cyber-red/10 border border-cyber-red text-cyber-red rounded-md p-6 font-mono text-sm max-w-2xl mx-auto shadow-lg">
            <h3 class="font-orbitron font-bold text-lg mb-3 flex items-center">
                <i data-lucide="shield-alert" class="w-5 h-5 mr-2 text-cyber-red animate-pulse"></i>
                ACCÈS REFUSÉ / CORRUPTION DE DONNÉES
            </h3>
            <p class="mb-4">> ${message}</p>
            <p class="text-xs text-gray-500 font-sans">Veuillez vérifier les paramètres de votre terminal ou contacter l'administrateur système.</p>
        </div>
    `;
}

/**
 * Construit et injecte le contenu de l'article dans la page.
 *
 * @param {HTMLElement} container - Le conteneur HTML où injecter l'article.
 * @param {Object} article - Les données de l'article (id, date, title, description, category, views, theme, icon).
 * @param {string} type - Le type de l'article ('veille' ou 'briefing').
 * @returns {void}
 */
function renderArticleContent(container, article, type) {
    const formattedDate = typeof formatLongDate === 'function' ? formatLongDate(article.date) : article.date;
    
    // Détermination de la couleur d'accentuation en fonction du thème (pour les briefings) ou par défaut rose (pour la veille)
    let colorClass = 'cyber-pink';
    let themeColor = '#d600d6';
    let subHeaderHTML = '';

    if (type === 'briefing') {
        // briefingThemes est défini dans main.js
        const themesMap = typeof briefingThemes !== 'undefined' ? briefingThemes : {
            green: { color: 'cyber-green' },
            pink: { color: 'cyber-pink' },
            blue: { color: 'cyber-blue' },
            purple: { color: 'cyber-purple' },
            red: { color: 'cyber-red' }
        };
        const theme = themesMap[article.theme] || themesMap['blue'];
        colorClass = theme.color;
        
        subHeaderHTML = `
            <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-${colorClass} font-bold mb-6">
                <span class="border border-${colorClass} px-2 py-0.5 bg-${colorClass}/5 uppercase rounded-sm">${article.category}</span>
                <span class="text-gray-500 dark:text-gray-400 flex items-center">
                    <i data-lucide="eye" class="w-3.5 h-3.5 mr-1"></i>
                    <span>${(article.views || 0).toLocaleString()} Vues</span>
                </span>
                <span class="text-[10px] text-gray-400">ID: SEC-BRIEF-${String(article.id).padStart(4, '0')}</span>
            </div>
        `;
    } else if (type === 'reglementation') {
        colorClass = 'cyber-blue';
        subHeaderHTML = `
            <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-${colorClass} font-bold mb-6">
                <span class="border border-${colorClass} px-2 py-0.5 bg-${colorClass}/5 uppercase rounded-sm">Réglementation & DevSecOps</span>
                <span class="text-[10px] text-gray-400">ID: SEC-REG-${String(article.id).padStart(4, '0')}</span>
            </div>
        `;
    } else if (type === 'ia') {
        colorClass = 'cyber-purple';
        subHeaderHTML = `
            <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-${colorClass} font-bold mb-6">
                <span class="border border-${colorClass} px-2 py-0.5 bg-${colorClass}/5 uppercase rounded-sm">Sécurité de l'IA</span>
                <span class="text-[10px] text-gray-400">ID: SEC-IA-${String(article.id).padStart(4, '0')}</span>
            </div>
        `;
    } else if (type === 'grc') {
        colorClass = 'cyber-green';
        subHeaderHTML = `
            <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-${colorClass} font-bold mb-6">
                <span class="border border-${colorClass} px-2 py-0.5 bg-${colorClass}/5 uppercase rounded-sm">Gouvernance, Risques & Conformité</span>
                <span class="text-[10px] text-gray-400">ID: SEC-GRC-${String(article.id).padStart(4, '0')}</span>
            </div>
        `;
    } else if (type === 'recherches') {
        colorClass = 'cyber-red';
        subHeaderHTML = `
            <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-${colorClass} font-bold mb-6">
                <span class="border border-${colorClass} px-2 py-0.5 bg-${colorClass}/5 uppercase rounded-sm">Recherches & Analyses</span>
                <span class="text-[10px] text-gray-400">ID: SEC-RES-${String(article.id).padStart(4, '0')}</span>
            </div>
        `;
    } else {
        subHeaderHTML = `
            <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-${colorClass} font-bold mb-6">
                <span class="border border-${colorClass} px-2 py-0.5 bg-${colorClass}/5 uppercase rounded-sm">Veille Cyber</span>
                <span class="text-[10px] text-gray-400">ID: SEC-FEED-${String(article.id).padStart(4, '0')}</span>
            </div>
        `;
    }

    const iconName = article.icon || (type === 'briefing' ? 'shield' : 'rss');

    container.innerHTML = `
        <article class="bg-white dark:bg-cyber-panel border border-gray-200 dark:border-gray-800 rounded-md p-6 sm:p-10 shadow-lg relative overflow-hidden">
            <!-- Bandeau décoratif de couleur en haut -->
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${colorClass} to-transparent"></div>
            
            <!-- Icône décorative géante transparente en arrière-plan -->
            <div class="absolute -top-10 -right-10 opacity-[0.03] dark:opacity-[0.02] pointer-events-none">
                <i data-lucide="${iconName}" class="w-64 h-64 text-${colorClass}"></i>
            </div>

            <!-- Date & Méta -->
            <div class="flex items-center text-xs font-mono text-gray-500 dark:text-gray-400 mb-2">
                <i data-lucide="calendar" class="w-4 h-4 mr-1.5 text-${colorClass}"></i>
                <span>PUBLIÉ LE ${formattedDate.toUpperCase()}</span>
            </div>

            <!-- Titre principal -->
            <h1 class="text-2xl sm:text-4xl font-orbitron font-extrabold text-gray-900 dark:text-white leading-tight mb-4 tracking-wide group-hover:text-cyber-blue transition-colors">
                ${article.title}
            </h1>

            <!-- Métadonnées (catégorie, vues, etc.) -->
            ${subHeaderHTML}

            <!-- Corps de l'article -->
            <div class="border-t border-gray-100 dark:border-gray-800/60 pt-8 mt-6">
                <div class="text-gray-700 dark:text-gray-300 font-sans text-base sm:text-lg leading-relaxed space-y-6">
                    <p class="whitespace-pre-wrap">${article.description}</p>
                </div>
            </div>

            <!-- Pied de l'article -->
            <div class="border-t border-gray-100 dark:border-gray-800/60 mt-10 pt-6 flex items-center justify-between text-xs font-mono text-gray-400">
                <span class="flex items-center">
                    <i data-lucide="verified" class="w-4 h-4 mr-1 text-cyber-green"></i> 
                    Donnée vérifiée et cryptée
                </span>
                <span>CYBER-DECRYPT-V1</span>
            </div>
        </article>
    `;
}

// Lancer le chargement au chargement du DOM
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        loadArticle();
    });
}

// Exporter les fonctions pour les tests unitaires sous Node/Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadArticle,
        renderError,
        renderArticleContent
    };
}
