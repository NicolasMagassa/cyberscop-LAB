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

## 🚀 Commandes utiles

- **Backend (depuis `/backend`)** :
  - `npm run dev` : Démarre Strapi pour travailler sur le projet (le serveur se relancera tout seul à chaque modification).
  - `npm run build` : Prépare et construit l'interface du tableau de bord d'administration (obligatoire pour mettre le site en ligne).
  - `npm run start` : Lance le serveur en mode final (plus rapide, mais sans prise en compte des modifications de fichiers en direct).
- **E2E & Frontend (depuis la racine `/`)** :
  - `npm run test:e2e` : Lance toute la suite de tests Playwright (smoke tests + intégration Strapi).
  - `npm run test:e2e:ui` : Lance l'interface interactive de Playwright. 
