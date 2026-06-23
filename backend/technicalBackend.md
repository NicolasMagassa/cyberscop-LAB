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

*Note : Les données locales sont enregistrées dans le fichier de base de données SQLite : `backend/.tmp/data.db`.*

---

## 🚀 Commandes utiles

- `npm run dev` : Démarre Strapi pour travailler sur le projet. Ouvrez votre terminal dans le dossier `backend` tape cd backend puis : `npm run dev` (le serveur se relancera tout seul à chaque modification).
- `npm run build` : Prépare et construit l'interface du tableau de bord d'administration (obligatoire pour mettre le site en ligne).
- `npm run start` : Lance le serveur en mode final (plus rapide, mais ne prend pas en compte les modifications de fichiers en direct). 
