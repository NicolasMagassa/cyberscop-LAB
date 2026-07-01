/**
 * Script de gestion pour la page grc.html (Flux de gouvernance, risques et conformité)
 * Dépend de main.js pour le chargement des utilitaires globaux et des données simulées.
 */

let currentPage = 1;
const pageSize = 5;

async function renderGRCPageArticles() {
    const loader = document.getElementById('grc-loader');
    const listContainer = document.getElementById('grc-articles-list');
    if (!listContainer) return;

    let articles = [];
    let totalPages = 1;

    try {
        const response = await fetch(`http://localhost:1337/api/grcs?pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        const rawData = json.data || [];
        
        // flattenStrapiItem est une fonction globale définie dans main.js
        if (typeof flattenStrapiItem === 'function') {
            articles = rawData.map(flattenStrapiItem);
        } else {
            articles = rawData;
        }

        if (json.meta && json.meta.pagination) {
            totalPages = json.meta.pagination.pageCount || 1;
        }

        if (articles.length === 0 && currentPage === 1) {
            throw new Error("No data in production database, using mock fallback");
        }
    } catch (error) {
        console.warn("Strapi non démarré ou inaccessible pour la page GRC, repli sur les données mockées :", error);
        const fullMockData = typeof mockGRCData !== 'undefined' ? mockGRCData : [];
        const sortedMocks = [...fullMockData].sort((a, b) => new Date(b.date) - new Date(a.date));
        totalPages = Math.ceil(sortedMocks.length / pageSize) || 1;
        
        const startIndex = (currentPage - 1) * pageSize;
        articles = sortedMocks.slice(startIndex, startIndex + pageSize);
    }

    if (articles.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-10 font-mono text-xs text-gray-500 border border-dashed border-gray-300 dark:border-gray-800 rounded-md">
                [SYSTEM WARNING: AUCUN ARTICLE GRC TROUVÉ]
            </div>
        `;
    } else {
        listContainer.innerHTML = articles.map(generateVerticalGRCArticleHTML).join('');
    }

    // Cacher le loader et afficher la liste
    if (loader) loader.classList.add('hidden');
    listContainer.classList.remove('hidden');

    // Réinitialiser les icônes Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Mettre à jour le DOM de la pagination
    if (typeof updatePaginationDOM === 'function') {
        updatePaginationDOM(listContainer, currentPage, totalPages, 'cyber-green', (newPage) => {
            currentPage = newPage;
            if (typeof listContainer.scrollIntoView === 'function') {
                listContainer.scrollIntoView({ behavior: 'smooth' });
            }
            renderGRCPageArticles();
        });
    }
}

/**
 * Génère le code HTML correspondant à un article GRC sous forme de bloc vertical étendu.
 *
 * @param {Object} article - Les données de l'article (id, date, title, description).
 * @returns {string} Le fragment HTML.
 */
function generateVerticalGRCArticleHTML(article) {
    const formattedDate = typeof formatLongDate === 'function' ? formatLongDate(article.date) : article.date;
    return `
        <article class="bg-white dark:bg-cyber-panel border border-gray-200 dark:border-gray-800 rounded-md p-6 shadow-sm relative overflow-hidden group hover:border-cyber-green transition-all duration-300">
            <div class="absolute top-0 left-0 w-1 h-full bg-cyber-green opacity-80 group-hover:w-2 transition-all"></div>
            
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <span class="text-xs font-mono font-bold text-cyber-green flex items-center">
                    <i data-lucide="calendar" class="w-3.5 h-3.5 mr-1.5"></i>
                    ${formattedDate}
                </span>
                <span class="text-[10px] font-mono text-gray-400">ID: SEC-GRC-${String(article.id).padStart(4, '0')}</span>
            </div>

            <h3 class="text-xl sm:text-2xl font-bold font-orbitron text-gray-900 dark:text-gray-100 group-hover:text-cyber-green transition-colors mb-3 leading-snug">
                ${article.title}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-400 text-sm font-sans mb-6 leading-relaxed max-w-4xl">
                ${article.description.length > 180 ? article.description.substring(0, 180) + '...' : article.description}
            </p>

            <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-800/50 pt-4">
                <a href="article.html?type=grc&id=${article.documentId || article.id}" class="inline-flex items-center text-xs font-mono font-bold text-cyber-green hover:text-white border border-cyber-green/20 hover:border-cyber-green bg-cyber-green/5 hover:bg-cyber-green px-4 py-2 rounded transition-all duration-300">
                    <span>Lire =>></span>
                </a>
                <span class="text-[10px] font-mono text-gray-400 flex items-center">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5 mr-1 text-cyber-green"></i> Politique de sécurité
                </span>
            </div>
        </article>
    `;
}

// Initialisation au chargement du DOM
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        renderGRCPageArticles();
    });
}

// Exporter les fonctions pour les tests unitaires sous Node/Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderGRCPageArticles,
        generateVerticalGRCArticleHTML,
        getCurrentPage: () => currentPage,
        setCurrentPage: (val) => { currentPage = val; }
    };
}
