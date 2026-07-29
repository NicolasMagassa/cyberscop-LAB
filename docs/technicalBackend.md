# 🚀 Backend Strapi - CyberScope Lab

Ce répertoire contient le backend du projet **CyberScope Lab**, propulsé par le CMS Headless **Strapi** (v5) en local. Il permet de gérer et d'exposer dynamiquement le contenu du blog via une API REST.

> ℹ️ **État de l'installation :** L'application backend est entièrement installée, lancée en tâche de fond sur votre machine, et les modèles de données **Veille** et **Briefing** sont déjà créés et configurés dans le code.
>
> Ces deux entités correspondent à des sections déjà développées et prêtes côté frontend :
> - **Veille** : Le flux rapide d'actualités technologiques (panneau latéral droit du site).
> - **Briefing** : Les cartes de sécurité principales avec compteurs de vues et icônes (grille centrale du site).

---

## 🛠️ Guide Opérationnel de Démarrage

### Étape 1 : Installation des dépendances (si réinstallation nécessaire)
Le projet est déjà initialisé localement. En cas de déploiement sur une nouvelle machine :
```bash
# Se déplacer dans le dossier backend
cd backend

# Installer les packages
npm install
```

### Étape 2 : Lancement du serveur local
Démarrez le serveur Strapi en mode développement avec le rechargement automatique (Hot Reload) activé :
```bash
npm run dev
```

### Étape 3 : Premier accès et création du compte Administrateur
Une fois le serveur démarré avec succès :
- Ouvrez votre navigateur sur : **[http://localhost:1337/admin](http://localhost:1337/admin)**.
- Remplissez le formulaire d'inscription pour créer votre premier compte Administrateur local (vos identifiants restent stockés localement sur votre machine).

### Étape 4 : Saisie et publication du contenu
Dans le menu latéral gauche, cliquez sur le **Content Manager** :
- **Briefing** : Permet d'écrire les cartes de sécurité principales (catégorie, date, titre, description, thèmes visuels, nombre de vues initial, icône).
- **Veille** : Permet de gérer le flux d'articles rapides de veille dans le panneau latéral.
- > ⚠️ **Rappel Sécurité & Visibilité :** N'oubliez pas de cliquer sur **Publish** (Publier) après avoir enregistré vos articles d'exemple pour qu'ils soient visibles sur l'API publique.

> ℹ️ **Pourquoi le site n'affiche-t-il pas encore vos articles à cette étape ?**  
> Même si vos articles sont écrits et publiés, Strapi les garde secrets par sécurité. Par défaut, il refuse de les partager avec le monde extérieur (y compris avec votre site internet). Pour lier définitivement le site au panneau d'administration, vous devez l'autoriser à lire vos articles en réalisant l'**Étape 5** ci-dessous.


### Étape 5 : Configuration des permissions d'accès public
Par défaut, Strapi bloque l'accès public aux APIs pour des raisons de sécurité. Pour autoriser la lecture des articles par le site web :
1. Allez dans les **Settings** (Paramètres) en bas à gauche de la console Strapi.
2. Sous la catégorie **Users & Permissions Plugin**, cliquez sur **Roles**.
3. Sélectionnez le rôle **Public** (accès anonyme).
4. Dans la liste déroulante des APIs :
   - Pour **Briefing** : Cochez les cases `find` et `findOne`.
   - Pour **Veille** : Cochez les cases `find` et `findOne`.
5. Cliquez sur **Save** en haut à droite.

### Étape 6 : Liaison automatique Frontend & Backend
Le code de liaison est **déjà entièrement intégré et opérationnel** côté frontend (dans le fichier [main.js](file:///C:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/JS/main.js)). 

Une fois les permissions de l'Étape 5 accordées :
- **Si le serveur Strapi est démarré (`npm run dev`) :** Le frontend détecte le serveur, charge et affiche automatiquement les vrais articles saisis dans votre interface d'administration Strapi.
- **Si le serveur Strapi est arrêté ou inaccessible :** Un mécanisme de secours automatique (*offline fallback*) prend le relais de manière transparente pour afficher les données locales de démonstration, empêchant ainsi le site de planter.

#### ⚙️ Détails techniques de l'implémentation dans [main.js](file:///C:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/JS/main.js) :

##### 1. Normalisation des données Strapi (`flattenStrapiItem`)
Les versions récentes de Strapi (v4/v5) enveloppent les champs de données dans un objet `attributes`. Pour garantir la compatibilité entre l'API et nos structures de données locales, nous utilisons la fonction `flattenStrapiItem` pour extraire et aplatir les propriétés :
```javascript
function flattenStrapiItem(item) {
    if (!item) return null;
    if (item.attributes) {
        return { id: item.id, ...item.attributes };
    }
    return item;
}
```

##### 2. Requêtes asynchrones et résilience
Les fonctions de rendu `renderVeilleArticles()` et `renderBriefingArticles()` effectuent des requêtes `fetch` vers les points d'entrée de l'API locale. Si le serveur Strapi est injoignable, l'erreur est interceptée par un bloc `try/catch` afin de rebasculer automatiquement sur les données de démonstration :

```javascript
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
        articles = rawData.map(flattenStrapiItem); // Extraction des données
        
        if (articles.length === 0) {
            articles = mockStrapiData; // Repli si l'API est vide
        }
    } catch (error) {
        console.warn("Strapi non démarré ou erreur réseau, repli sur les données mockées :", error);
        articles = mockStrapiData; // Repli automatique si le serveur est éteint
    }

    // Tri par date décroissante et rendu HTML...
}
```

---

## 🔒 Sécurité et d'exclusions Git (.gitignore)

Afin de protéger le code et les données sensibles du projet, le fichier d'exclusions [.gitignore](../.gitignore) (à la racine du projet) a été configuré pour exclure les ressources locales du backend Strapi.

### Éléments exclus du suivi Git :
```text
# Strapi backend exclusions
backend/node_modules/  # Dépendances locales volumineuses
backend/.tmp/          # Base de données SQLite locale contenant vos articles et comptes
backend/build/         # Fichiers de construction temporaires
backend/.cache/        # Fichiers cache de Strapi
backend/dist/          # Fichiers compilés de production
backend/exports/       # Fichiers d'exports de données
backend/.env           # Clés d'API et secrets d'environnement
```

### ⚠️ Danger (si non réalisé)
> **Alerte Sécurité :** Sans cette configuration, votre base de données locale contenant vos comptes administrateurs (`data.db`) et vos variables d'environnement secrètes (`.env`) seraient poussées en clair sur votre dépôt public GitHub. Les pirates utilisent des scripts automatisés qui détectent ces fichiers sensibles en quelques secondes, ce qui permettrait d'usurper vos droits de gestion ou de pirater votre infrastructure. De plus, pousser les milliers de fichiers du répertoire `node_modules` saturerait et bloquerait les commandes de synchronisation Git.

---

## 📦 Points d'entrée (Endpoints) de l'API REST

Une fois les permissions définies, les données sont accessibles publiquement via les requêtes GET suivantes :

- **Flux de Briefings (Cartes principales) :** `GET http://localhost:1337/api/briefings`
- **Flux de Veille (Panneau latéral) :** `GET http://localhost:1337/api/veilles`
- **Flux de Réglementation (Widget & Listes) :** `GET http://localhost:1337/api/reglementations`

*Note : Les données locales sont enregistrées dans le fichier de base de données SQLite : `backend/.tmp/data.db`.*

---

## 🛠️ Création Manuelle de Nouveaux Content-Types (API)

Si tu as besoin de créer un nouveau type d'article (par exemple, pour **`grc`**, **`ia`** ou **`recherche`**) sans passer par l'interface d'administration de Strapi, tu peux créer directement 4 petits fichiers dans le code. Strapi les détectera automatiquement au démarrage et créera la table en base de données.

Voici la structure de dossiers à créer sous `backend/src/api/` :

```
backend/src/api/<nom_api>/
├── content-types/
│   └── <nom_api>/
│       └── schema.json      <-- Définit les champs (titre, date, etc.)
├── controllers/
│   └── <nom_api>.js         <-- Gère la réception des requêtes
├── routes/
│   └── <nom_api>.js         <-- Définit l'URL d'accès (ex: /api/grcs)
└── services/
    └── <nom_api>.js         <-- Gère l'accès à la base de données
```

Voici le code standard à copier-coller dans chacun de ces fichiers (en remplaçant `<nom_api>` par `grc`, `ia`, ou `recherche`) :

### 1. Le Schéma de données : `content-types/<nom_api>/schema.json`
Ce fichier JSON explique à Strapi de quels champs est constitué ton article.

```json
{
  "kind": "collectionType",
  "collectionName": "<nom_api>s",
  "info": {
    "singularName": "<nom_api>",
    "pluralName": "<nom_api>s",
    "displayName": "<Nom_Affiché_En_Majuscule>"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text",
      "required": true
    },
    "date": {
      "type": "date",
      "required": true
    }
  }
}
```
*Note : Tu peux remplacer `<Nom_Affiché_En_Majuscule>` par exemple par `GRC` ou `IA` pour l'affichage dans le menu Strapi.*

### 2. Le Controller : `controllers/<nom_api>.js`
Ce fichier dit à Strapi d'utiliser son comportement par défaut pour traiter les requêtes HTTP.

```javascript
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::<nom_api>.<nom_api>');
```

### 3. Le Router : `routes/<nom_api>.js`
Ce fichier crée automatiquement les routes d'API (ex: `GET /api/<nom_api>s` et `GET /api/<nom_api>s/:id`).

```javascript
'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::<nom_api>.<nom_api>');
```

### 4. Le Service : `services/<nom_api>.js`
Ce fichier permet à Strapi de faire des requêtes internes en base de données.

```javascript
'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::<nom_api>.<nom_api>');
```

---

### Une fois les fichiers créés :
1. Démarre ou redémarre ton serveur de développement (`npm run dev` dans le dossier `/backend`).
2. Rends-toi sur l'administration Strapi : ta nouvelle collection apparaît dans la barre de gauche.
3. Rends-toi dans **Settings** ⚙️ > **Roles** > **Public**, déroule ta nouvelle collection et coche les cases **`find`** et **`findOne`** pour rendre l'accès public, puis clique sur **Save**.
4. Écris et publie tes articles !
---

---

## 🔍 Optimisation SEO Complète et Référencement

Pour propulser la visibilité du **CyberScope Lab** sur Google, structurer les partages sur les réseaux sociaux (LinkedIn, X/Twitter, Discord) et assurer la sécurité du parcours d'exploration, un package d'optimisation SEO complet a été déployé. 

Voici le détail point par point des mécanismes implémentés, l'explication de leur intérêt, et l'impact de leur absence :

---

### 1. Le champ `metaDescription` (Backend Strapi)
* **Ce qui a été fait** : Ajout d'un attribut `"metaDescription": { "type": "string" }` dans les fichiers [schema.json](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/src/api/veille/content-types/veille/schema.json) des 6 collections d'articles.
* **Pourquoi** : Permet à l'administrateur de rédiger un résumé court (120-160 caractères) optimisé avec des mots-clés accrocheurs pour chaque publication.
* **Conséquences si absent** :
  * **Référencement** : Sans champ dédié, nous serions obligés de tronquer automatiquement le début du texte de l'article. Or, l'introduction d'un article technique n'est pas toujours conçue pour servir d'accroche publicitaire sur Google, ce qui diminue le taux de clic (CTR) des utilisateurs.

---

### 2. La balise Meta Description dynamique (`<meta name="description">`)
* **Ce qui a été fait** : Mise à jour du script [article.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/JS/article.js) pour injecter ou mettre à jour dynamiquement cette balise dans le `<head>` de la page lors du rendu HTML.
* **Pourquoi** : Indique aux moteurs de recherche la description à afficher sous le titre de votre site dans la liste des résultats.
* **Conséquences si absente** :
  * **Affichage du site** : Google va générer un extrait aléatoire à partir du contenu visible de la page. Les robots peuvent par exemple capturer des textes hors contexte comme le menu de navigation ("Accueil / Contact / RGPD") ou des messages système, rendant l'aperçu du site brouillon et non professionnel.

---

### 3. Le fichier de directives d'exploration ([robots.txt](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/robots.txt))
* **Ce qui a été fait** : Création du fichier [robots.txt](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/robots.txt) à la racine, autorisant l'indexation publique tout en interdisant expressément l'accès aux dossiers `/backend/`, `/scratch/`, et `/node_modules/`.
* **Pourquoi** : Guide le comportement des moteurs de recherche pour préserver les ressources du serveur.
* **Conséquences si absent** :
  * **Sécurité** : Les robots et outils d'exploration automatisés (scanners de vulnérabilités, scrapers agressifs) vont analyser les fichiers du backend, les scripts de maintenance internes (`/scratch/`) ou les dépendances système, révélant la structure interne du serveur ou surchargeant la bande passante avec des requêtes inutiles.
  * **Référencement** : Le "budget d'exploration" (le temps maximal alloué par Google pour visiter votre site) est gaspillé sur des dossiers techniques au détriment de l'indexation de vos nouveaux articles de veille.

---

### 4. Le Plan du site XML ([sitemap.xml](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/sitemap.xml))
* **Ce qui a été fait** : Création du fichier [sitemap.xml](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/sitemap.xml) listant toutes les pages statiques fixes (Accueil, Qui suis-je, Contact, CGU, Cookies...).
* **Pourquoi** : Fournit une carte d'accès directe et structurée à l'ensemble du site pour les robots, accélérant leur travail d'exploration.
* **Conséquences si absent** :
  * **Référencement** : Les moteurs de recherche mettraient beaucoup plus de temps à découvrir l'existence de vos pages secondaires ou juridiques, retardant d'autant plus leur indexation dans les résultats de recherche.

---

### 5. Le script d'automatisation ([generate_sitemap.py](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/scratch/generate_sitemap.py))
* **Ce qui a été fait** : Création d'un script Python dans le dossier de maintenance pour interroger Strapi et injecter automatiquement les liens de vos articles de blog dans le [sitemap.xml](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/sitemap.xml).
* **Pourquoi** : Évite d'avoir à éditer manuellement le code XML à chaque publication d'article.
* **Conséquences si absent** :
  * **Référencement** : Les nouveaux articles dynamiques mis en ligne sur Strapi risquent de ne jamais être signalés à Google s'ils ne sont pas reliés dans le sitemap.
  * **Bon fonctionnement** : L'édition manuelle du format XML est propice aux erreurs de frappe (balise mal fermée, caractères spéciaux non échappés). Une seule erreur de syntaxe invalide le fichier XML complet auprès de la Google Search Console, bloquant l'exploration.

---

### 6. La balise de lien Canonique (`<link rel="canonical">`)
* **Ce qui a été fait** : Ajout d'une injection de balise canonique dans [article.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/JS/article.js) pointant vers l'URL officielle unique de l'article (ex: `https://.../article.html?type=veille&id=1`).
* **Pourquoi** : Indique à Google quelle URL doit être considérée comme la source originale faisant autorité.
* **Conséquences si absente** :
  * **Référencement** : Si vous partagez des liens contenant des paramètres de suivi (comme des codes UTM, des tris ou des variables de session), Google considérera chaque variante d'URL comme une page distincte. Cela crée du "contenu dupliqué" (*duplicate content*), ce qui dilue l'autorité SEO de votre page et peut faire pénaliser ou déclasser votre site par les algorithmes de Google.

---

### 7. Les données structurées JSON-LD (Schema.org)
* **Ce qui a été fait** : Injection dynamique dans le `<head>` d'un script JSON-LD de type `BlogPosting` contenant le titre, le résumé, la date de publication, l'auteur, l'éditeur et le logo du site.
* **Pourquoi** : Fournit une explication sémantique standardisée aux moteurs de recherche pour comprendre précisément le type de document consulté.
* **Conséquences si absentes** :
  * **Référencement & Affichage** : Votre article sera traité comme une simple page de texte. Vous perdez la chance d'afficher des **Rich Snippets** (par exemple, voir la date de publication ou la catégorie s'afficher directement à côté du titre dans la liste des résultats de recherche Google), réduisant la visibilité graphique de votre lien.

---

### 8. Les balises Open Graph (OG) et Twitter Cards
* **Ce qui a été fait** : Injection dynamique des métadonnées requises par les réseaux sociaux (`og:title`, `og:description`, `og:image`, `og:url`, `og:type` et équivalents Twitter) dans [article.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/JS/article.js).
* **Pourquoi** : Formate l'affichage de vos liens lorsqu'ils sont partagés en ligne (ex: sur LinkedIn).
* **Conséquences si absentes** :
  * **Affichage sur les réseaux** : Lors du partage d'un article, le réseau social affichera au mieux un lien bleu textuel brut et impersonnel, au pire une image aléatoire (souvent déformée) combinée avec le premier texte qu'il trouve sur la page. Vos publications perdront toute attractivité visuelle pour vos contacts professionnels.

---

### 🛠️ Comment exécuter et maintenir ces configurations ?

> [!IMPORTANT]
> **Pourquoi exécuter cette commande à chaque publication/suppression d'article ?**
> Par défaut, Googlebot ne navigue pas en permanence sur votre site pour "deviner" si de nouvelles URLs dynamiques ont été créées via Strapi. Il s'appuie en priorité sur votre fichier `sitemap.xml`. 
> Si vous publiez un article dans Strapi sans lancer cette commande :
> 1. **L'article sera lisible sur le site** pour les humains, mais...
> 2. **L'URL de l'article sera absente du sitemap**, empêchant Google de l'indexer rapidement. L'article peut alors mettre plusieurs semaines avant d'apparaître sur le moteur de recherche Google.
>
> Relancer le script après chaque publication permet de notifier Google de la présence immédiate de votre nouveau contenu.

Pour mettre à jour le plan du site suite à la publication ou à la suppression d'un article, exécutez le script dans votre console de développement à la racine du projet :
```bash
python scratch/generate_sitemap.py
```
*Le script interrogera automatiquement Strapi (et utilisera un ensemble d'articles locaux mockés de secours en cas d'indisponibilité du serveur) pour actualiser le fichier [sitemap.xml](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/sitemap.xml) de manière propre et sécurisée.*

---

## 🖼️ Optimisation SEO des Pages Statiques et Favicon

Pour compléter l'optimisation dynamique des articles, les pages statiques du site (Accueil, À propos, Contact, etc.) ont été équipées de balises méta de base et d'une gestion propre du favicon.

### 1. Métadonnées SEO complètes (Description, Open Graph et Twitter Cards)
* **Ce qui a été fait** : Les balises de Description, Open Graph (Facebook/LinkedIn) et Twitter Cards ont été ajoutées et adaptées pour chacune de vos pages statiques (comme [index.html](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/index.html), [qui_suis_je.html](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/qui_suis_je.html), etc.).
* **Pourquoi** : Fournit une accroche claire sur les résultats de recherche (Google snippet) et formate proprement le visuel, le titre et la description lors d'un partage de lien sur les réseaux sociaux (ex. : LinkedIn, Slack, Discord, X).
* **Conséquences si absentes** :
  * **Référencement & Clics (CTR)** : Sans description explicite, Google sélectionne un extrait de texte arbitraire sur la page (souvent les premiers mots du menu comme "Accueil / Contact / CGU"). Sur les réseaux sociaux, le lien apparaîtra sous forme de texte brut sans image d'illustration, réduisant drastiquement le taux de clic et l'attractivité professionnelle du blog.

---

### 2. Protection des pages privées (Sécurité SEO)
* **Ce qui a été fait** : La balise `<meta name="robots" content="noindex, nofollow">` a été configurée sur [gerer_compte.html](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/gerer_compte.html) et [404.html](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/404.html) pour éviter leur indexation inutile par les moteurs de recherche.
* **Pourquoi** : Indique formellement aux moteurs de recherche qu'ils ne doivent pas référencer publiquement ces pages dans leurs résultats.
* **Conséquences si absente** :
  * **Sécurité & Posture** : La page d'administration privée [gerer_compte.html](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/gerer_compte.html) pourrait être indexée et visible par n'importe quel internaute effectuant des recherches sur Google. Cela expose la page à des tentatives d'accès malveillantes (brute-force) et nuit à la sécurité générale. 
  * **Qualité du référencement** : L'indexation de pages d'erreur 404 pollue l'index de votre site auprès de Google et gaspille votre "budget d'exploration" (*crawl budget*) sur des URLs invalides au lieu de vos vrais articles.

---

### 3. Liaison du Favicon
* **Ce qui a été fait** : Le lien vers le favicon a été inséré dans le `<head>` de l'ensemble des 15 fichiers HTML avec la ligne : `<link rel="icon" type="image/webp" href="assets/images/favicon.webp">`.
* **Pourquoi** : Permet aux navigateurs d'afficher l'icône graphique du blog dans les onglets, et à Google d'afficher cette icône à côté de l'URL du site dans les résultats de recherche (notamment sur mobile).
* **Conséquences si absente** :
  * **Expérience utilisateur & Image de marque** : Sans déclaration de favicon, les navigateurs affichent une icône de page blanche générique. Sur Google Search Console, des erreurs d'exploration seront levées, et Google remplacera l'icône de recherche par une icône grise par défaut, décrédibilisant le professionnalisme du site.

---

## 🖼️ Compression et conversion des images au format WebP

Pour optimiser les performances de chargement et respecter les exigences de performance de Google, les ressources graphiques du site ont fait l'objet d'une refonte technique complète.

### 1. Conversion et optimisation des ressources (WebP)
* **Ce qui a été fait** : 
  * **[logo-cyber.webp](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/img/logo-cyber.webp)** : Conversion du format d'origine PNG (1024x1024 px, 679.67 Ko) en WebP compressé (1024x1024 px, **94.99 Ko**, soit **-86.02%**).
  * **[favicon.webp](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/images/favicon.webp)** : Redimensionnement depuis la taille brute géante de 1024x1024 px (445.6 Ko) vers une taille optimale de **192x192 px** au format WebP (soit **4.84 Ko**, une réduction spectaculaire de **-98.91%**).
  * **Mise à jour des références** : Remplacement des chemins d'accès `.png` par `.webp` dans l'ensemble des 15 fichiers HTML statiques et dans la configuration dynamique de [article.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/JS/article.js).
* **Pourquoi** : Le WebP est un format moderne de compression avec et sans perte pour les images Web. Il conserve une transparence parfaite (canal alpha) tout en étant extrêmement plus léger que le PNG traditionnel.
* **Conséquences si absentes / Dangers** :
  * **Référencement (SEO)** : Google Lighthouse pénalise les sites avec un score de performance médiocre en mesurant le *Largest Contentful Paint* (LCP). Ne pas optimiser les images fait chuter ce score de performance, rétrogradant le site dans les résultats de recherche.
  * **Expérience utilisateur (UX) & Rétention** : Le chargement inutile de plus d'1 Mo d'images pour un simple logo et favicon crée une latence d'affichage (page blanche ou logo qui se dessine lentement) particulièrement visible sur mobile ou en connexion instable (3G/4G), ce qui fait augmenter le taux de rebond des visiteurs.

---

## 🧪 Validation & Tests d'Intégration (Playwright)


Pour garantir la résilience et la bonne communication entre le frontend et le backend Strapi, une suite de tests E2E avec **Playwright** a été configuré à la racine du projet.

Les tests valident trois comportements fondamentaux :
1. **Mode nominal (API connectée)** : Simulation d'une réponse de l'API Strapi. Playwright intercepte l'appel réseau et retourne des données simulées conformes au format JSON de Strapi (v4/v5) pour s'assurer que le frontend les déstructure et les affiche correctement.
2. **Mode de repli (API hors-ligne)** : Simulation d'une coupure du serveur Strapi ou d'une erreur réseau. Playwright bloque les requêtes API pour s'assurer que le frontend bascule de manière transparente sur les données locales simulées (`mockStrapiData` et `mockBriefingData`) sans planter.
3. **Mode Réel (Unmocked)** : Teste la **connexion réelle en direct entre le frontend et le backend**. Playwright tente de requêter directement le serveur local Strapi sur `http://localhost:1337` pour valider que le serveur répond et que l'intégration fonctionne en conditions réelles (renvoie une alerte si le serveur est éteint ou si l'accès public 403 est bloqué).

### Exécuter les tests E2E
Depuis la **racine du projet** :
* `npm run test:e2e` : Lance les tests en arrière-plan.
* `npm run test:e2e:ui` : Lance l'interface utilisateur interactive de Playwright pour analyser visuellement le déroulement des scénarios.

---

## ✉️ Correction du Provider d'Email Brevo & Persistance

### 1. Le problème (Bug de format de l'expéditeur)
Lors de l'envoi de l'e-mail de confirmation d'inscription, l'API REST de Brevo rejetait silencieusement la requête. En inspectant le payload envoyé, le nom de l'expéditeur (`sender.name`) était envoyé au format brut Nodemailer (ex: `"CyberScope LAB <cyberscop.lab@gmail.com>"`), contenant des chevrons et l'adresse e-mail. L'API de Brevo exige un nom d'affichage propre sans chevrons.

Ce bug provenait du provider `strapi-provider-email-brevo` : le développeur avait créé la variable nettoyée `senderName` mais l'avait oubliée en l'affectant avec `from || settings.defaultSenderName` dans l'objet final.

### 2. Solution & Trimming
* **Correction** : Le fichier `backend/node_modules/strapi-provider-email-brevo/index.js` a été modifié pour utiliser la variable locale correctement nettoyée `senderName` dans l'objet `msg.sender.name`.
* **Trimming** : Un nettoyage supplémentaire à l'aide de `.trim()` a été ajouté pour enlever d'éventuels espaces blancs résiduels issus de l'extraction Regex (comme l'espace de fin entre le nom et le chevron `<`).
* **Persistance (`patch-package`)** : Afin d'éviter que cette modification ne soit écrasée lors du prochain `npm install`, le module `patch-package` a été installé dans `backend` et configuré en script de `postinstall`. Le patch est stocké dans le fichier [strapi-provider-email-brevo+1.0.4.patch](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/patches/strapi-provider-email-brevo+1.0.4.patch).

### 3. Tests Unitaires & TDD
Un test unitaire Jest dédié a été créé à la racine dans [brevo-provider.test.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/tests/brevo-provider.test.js) pour garantir :
* Le bon nettoyage de la chaine de l'expéditeur (extraction propre du nom et de l'e-mail).
* Le bon repli (fallback) sur les configurations par défaut si l'option `from` n'est pas passée.

Pour exécuter le test de ce provider :
```bash
npm test tests/brevo-provider.test.js
```

### 🔍 Protocole de Diagnostic de l'Authentification et de l'Envoi d'E-mails (Front-End ➔ API ➔ BDD ➔ Config ➔ Brevo ➔ Patch ➔ Validation) lors de l'inscription

Ce protocole suit l'ordre logique d'un diagnostic : **Front-End → API → Base de données → Configuration → Fournisseur d'e-mails → Correctif → Validation finale** qui a servi à identifier et corriger le problème d'absence de réception d'e-mails lors de l'inscription.

#### Étape 1 — Vérification du serveur Strapi
Avant toute chose :
* Vérifier que Strapi est lancé (`npm run develop`).
* Vérifier que le serveur répond sur : http://localhost:1337
* Vérifier qu'aucune erreur n'apparaît au démarrage.

#### Étape 2 — Vérification des permissions Strapi
Dans l'interface d'administration : **Settings** ➔ **Users & Permissions Plugin** ➔ **Roles** ➔ **Public**
Vérifier que les permissions nécessaires sont cochées :
* `register`
* `login`
* `forgotPassword`
* `resetPassword`
* `emailConfirmation` (si utilisé)

#### Étape 3 — Vérification des paramètres d'authentification
Dans : **Settings** ➔ **Users & Permissions** ➔ **Advanced Settings**
Vérifier :
* **Enable email confirmation** (Activé)
* **Allow registration** (Activé)
* **Default role** (Rôle par défaut configuré)

#### Étape 4 — Vérification du Front-End
Le formulaire doit envoyer une requête `POST` vers `/api/auth/local/register` avec le format JSON suivant :
```json
{
  "username": "...",
  "email": "...",
  "password": "..."
}
```
Vérifier :
* `username` présent
* `email` valide
* `password` présent
* JSON correctement formé
* En-tête de requête : `Content-Type: application/json`

#### Étape 5 — Vérification de la réponse Strapi
* Si l'inscription fonctionne : Strapi doit répondre `200 OK` ou `201`.
* En cas d'erreur : Lire précisément le message retourné dans `error.message` pour ne jamais masquer les erreurs.

#### Étape 6 — Vérification de la base SQLite
Ouvrir le fichier `.tmp/data.db` (par exemple avec l'extension VS Code *SQLite Viewer*).
Vérifier dans la table `up_users` que le nouvel utilisateur existe et contrôler les champs :
* `confirmed`
* `blocked`
* `email`
* `username`
* `provider`

> [!NOTE]
> Si l'utilisateur est bien créé dans la table `up_users` mais que le mail n'arrive pas, **le problème n'est PAS le Front-End**.

#### Étape 7 — Vérification du fichier .env
Contrôler la configuration des variables d'environnement dans le fichier `backend/.env` :
* `BREVO_API_KEY`
* `BREVO_SENDER_EMAIL`
* `BREVO_SENDER_NAME`
* *Exemple :*
  ```env
  BREVO_API_KEY=xkeysib-...
  BREVO_SENDER_EMAIL=cyberscop.lab@gmail.com
  BREVO_SENDER_NAME=CyberScope LAB
  ```

#### Étape 8 — Vérification du provider Strapi
Dans le fichier [config/plugins.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/config/plugins.js), vérifier l'activation du provider :
* `provider`
* `providerOptions`
* `settings`
Le provider doit être configuré pour utiliser la dépendance `strapi-provider-email-brevo`.

#### Étape 9 — Vérification Brevo
Dans l'interface de Brevo, s'assurer que :
* La clé API (`API Key`) utilisée est valide.
* L'expéditeur (`Sender`) configuré est bien vérifié et actif.
* Le service d'envoi d'e-mails transactionnels est activé.

#### Étape 10 — Vérification des Logs Brevo
Dans Brevo, naviguer dans : **Transactional** ➔ **Logs**
Vérifier le statut de l'e-mail :
* *Envoyé* / *En attente* / *Rejeté*
Lire le message exact. Par exemple, l'erreur *"Sender is not valid"* est très différente de *"Invalid API Key"*.

#### Étape 11 — Test direct de l'API Brevo
Créer un petit script Node.js minimal requêtant directement l'endpoint `https://api.brevo.com/v3/smtp/email` avec la clé API pour envoyer un e-mail de test.
* **Si ce script fonctionne** ➔ L'API Brevo est pleinement fonctionnelle, le problème vient donc de Strapi ou de son module provider.

#### Étape 12 — Vérification du provider Strapi
Ouvrir le fichier `node_modules/strapi-provider-email-brevo/index.js`.
Avant la ligne réalisant l'appel `axios.post(...)`, ajouter temporairement un log :
```javascript
console.log(JSON.stringify(msg, null, 2));
```
Observer précisément la structure des champs `sender`, `to`, `subject` et `htmlContent`.

#### Étape 13 — Vérification du champ sender
Le JSON doit contenir exactement :
```json
{
  "sender": {
    "name": "CyberScope LAB",
    "email": "cyberscop.lab@gmail.com"
  }
}
```
* **Attention :** Ne jamais envoyer `"name": "CyberScope LAB <cyberscop.lab@gmail.com>"`. Brevo refuse ce format avec chevrons dans le nom d'affichage de l'expéditeur.

#### Étape 14 — Vérification du bug connu du provider
Le provider officiel `strapi-provider-email-brevo` en version `1.0.4` contient un bug natif.
Il utilise `name: from || settings.defaultSenderName` au lieu d'utiliser la variable locale nettoyée `senderName`.
Le correctif consiste à patcher :
```diff
- name: from || settings.defaultSenderName,
+ name: senderName,
```

#### Étape 15 — Rendre le correctif permanent
Ne jamais modifier directement les fichiers de `node_modules` de manière volatile.
* Installez `patch-package` : `npm install patch-package --save-dev` dans `backend`.
* Ajoutez la commande postinstall dans le fichier [package.json](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/package.json) : `"postinstall": "patch-package"`.
* Créez le patch : `npx patch-package strapi-provider-email-brevo`.
* Vérifier que le dossier `backend/patches/` contient le fichier de correctif `strapi-provider-email-brevo+1.0.4.patch`.

#### Étape 16 — Vérification après réinstallation
* Supprimer le dossier `node_modules` dans `backend`.
* Lancer `npm install`.
* Vérifier l'application automatique du patch :
  ```text
  Applying patches...
  strapi-provider-email-brevo@1.0.4 ✔
  ```
* Relancer le serveur avec `npm run develop` et retester une inscription. Le mail doit arriver normalement.

#### Étape 17 — Vérification du flux complet
Une fois l'inscription fonctionnelle, tester l'ensemble du flux d'authentification :
* Réception du lien de confirmation d'e-mail.
* Clic sur le lien de confirmation (mise à jour de la BDD).
* Connexion au compte.
* Déconnexion.
* Demande de mot de passe oublié (envoi d'e-mail).
* Clic sur le lien de réinitialisation.
* Modification du mot de passe.
* Reconnexion avec le nouveau mot de passe.

### Résultat attendu
À la fin de cette procédure :
* **✅ Front-End validé**
* **✅ API Strapi validée**
* **✅ Base SQLite validée**
* **✅ Provider Brevo validé**
* **✅ API Brevo validée**
* **✅ Envoi des e-mails validé**
* **✅ Correctif du provider rendu permanent**
* **✅ Réinstallation testée**
* **✅ Flux d'authentification complet opérationnel**


---

## 📧 API de Contact & Messagerie (`/api/contact`)

Le backend implémente une route personnalisée publique dédiée à la réception des messages du formulaire de contact.

### ⚙️ Conception Technique & Fichiers
- **Route** : [backend/src/api/contact/routes/contact.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/src/api/contact/routes/contact.js)  
  Définit le point d'accès `POST /api/contact` sans authentification requise (`auth: false`).
- **Contrôleur** : [backend/src/api/contact/controllers/contact.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/src/api/contact/controllers/contact.js)  
  Valide le corps de la requête, applique les barrières antispam et procède à l'expédition de l'e-mail.

### 🛡️ Mesures de Sécurité Implémentées
1. **Contrôle de taille (Payload <= 10 Ko)** :
   Le contrôleur intercepte la taille de la requête (via l'en-tête `Content-Length` et la chaîne JSON brute) et renvoie un code `400 Bad Request` si la taille excède 10 Ko, empêchant l'épuisement de la mémoire du serveur par des soumissions massives.
2. **Filtrage Honeypot antispam** :
   Un champ `website` (invisible pour les humains) est inclus dans le payload. Si ce champ est rempli, le serveur simule instantanément une réussite complète (`200 OK` avec le même corps JSON de succès) mais court-circuite l'envoi de courriel et journalise anonymement l'incident.
3. **Assainissement et nettoyage des injections** :
   - Les retours à la ligne (`\r`, `\n`) sont strictement interdits dans les champs `name`, `email` et `subject` pour neutraliser toute tentative d'injection d'en-têtes SMTP (Header Injection / CRLF Injection).
   - Les caractères spéciaux dans le sujet du courriel sont nettoyés via une liste blanche stricte de sujets admissibles (`collaboration`, `recrutement`, `question`, `autre`).
   - Le corps du message est converti au format texte brut avec un échappement de sécurité des caractères HTML pour éviter les injections de scripts (XSS).
4. **Rate Limiting (IP)** :
   - Limite d'IP fixée à un maximum de **5 requêtes par heure** (toutes requêtes confondues, spam honeypot inclus).
   - Géré en mémoire via une structure de dictionnaire JavaScript (`rateLimiterStore`), avec un nettoyage automatique des entrées expirées toutes les heures.
   - **Limitation connue :** Cette solution in-memory est adaptée aux architectures mono-instance. Pour des déploiements multi-instances / conteneurisés (ex: Docker, Kubernetes behind a load balancer), l'interface logicielle `RateLimiterStore` a été conçue comme une abstraction facilitant son remplacement par un service partagé (ex: Redis).
   - Les adresses IP des clients sont traitées uniquement en mémoire vive pour le filtrage et ne sont jamais journalisées dans les fichiers de logs.
5. **CORS par environnement** :
   - En **Production** (`NODE_ENV === 'production'`), seules les requêtes provenant de l'origine définie par la variable d'environnement `FRONTEND_URL` (par défaut `https://nicolasmagassa.github.io`) sont acceptées.
   - En **Développement** / **Test**, la liste des origines s'étend aux hôtes locaux nécessaires au développement et à l'exécution de Playwright (`http://localhost:8000`, `http://localhost:8080`, `http://127.0.0.1:8080`).

### 📦 Données et Intégration RGPD
- **Pas de stockage en Base de Données** : Aucun modèle de contenu (*Content-Type*) `Contact` n'est créé dans Strapi. Les messages sont transmis directement à l'adresse de contact configurée et ne sont pas stockés dans la base SQLite locale.
- **Politique de messagerie** : Les e-mails transitent via le serveur SMTP transactionnel de Brevo. La durée maximale de conservation des messages au sein de la boîte de réception du destinataire est fixée à **2 ans** après le dernier échange, après quoi ils sont purgés manuellement ou automatiquement par les règles de la boîte de messagerie.

### 🌐 Variables d'Environnement Requises (dans `backend/.env`)
- `BREVO_API_KEY` : Clé API transactionnelle de Brevo.
- `BREVO_SENDER_EMAIL` : Adresse d'expédition autorisée sur Brevo (ex: `Cyberscop.Lab@gmail.com`).
- `BREVO_SENDER_NAME` : Nom d'affichage de l'expéditeur (ex: `CyberScope LAB`).
- `CONTACT_DESTINATION_EMAIL` : Adresse email de réception des messages (ex: `Cyberscop.Lab@gmail.com`).

---

## 🚀 Commandes utiles

- **Backend (depuis `/backend`)** :
  - `npm run dev` : Démarre Strapi pour travailler sur le projet (le serveur se relancera tout seul à chaque modification).
  - `npm run build` : Prépare et construit l'interface du tableau de bord d'administration (obligatoire pour mettre le site en ligne).
  - `npm run start` : Lance le serveur en mode final (plus rapide, mais sans prise en compte des modifications de fichiers en direct).
- **E2E & Frontend (depuis la racine `/`)** :
  - `npm run test:e2e` : Lance toute la suite de tests Playwright (smoke tests + intégration Strapi).
  - `npm run test:e2e:ui` : Lance l'interface interactive de Playwright. 
