# 🛡️ Rapport d'Audit DevSecOps — CyberScope LAB

Ce document présente l'audit de sécurité complet et l'évaluation de conformité du dépôt **CyberScope LAB** par rapport aux directives du document de référence *DevSecOps COMPLET.pdf*.

---

## 1. Inventaire Technique Réel du Dépôt

L'analyse en lecture seule des fichiers du dépôt montre la configuration technique suivante :

### 🟢 Gestion des versions et environnements d'exécution
* **Node.js** : Version requise configurée dans [backend/package.json](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/package.json#L29-L32) : `node: ">=20.0.0 <=26.x.x"`. La version `20-alpine` est explicitement épinglée dans [backend/Dockerfile](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/Dockerfile#L2).
* **npm** : Version requise configurée dans `backend/package.json` : `npm: ">=6.0.0"`.
* **Strapi** : Version du CMS Headless est **5.48.1** (dernière v5 stable locale) définie dans `backend/package.json`.
* **Base de données** : SQLite locale configurée dans [backend/config/database.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/config/database.js#L45-L51), persistée dans le fichier [backend/.tmp/data.db](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/.env#L21) (exclu de Git).
* **Frontend** : Site web statique en HTML5/Vanilla JS. La liaison API est faite dans [assets/JS/main.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/JS/main.js).

### 🟢 Infrastructure, Conteneurs et Configuration Réseau
* **Conteneurisation (Docker)** :
  * [Dockerfile](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/Dockerfile) (Frontend) : Utilise l'image de base `nginx:1.25-alpine`. S'exécute en non-root via l'utilisateur `nginx` (UID 101) et écoute sur le port non privilégié `8080`.
  * [backend/Dockerfile](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/Dockerfile) (Backend) : Multi-stage build basé sur `node:20-alpine`, s'exécute en non-root via l'utilisateur par défaut `node` (UID 1000) et écoute sur le port `1337`.
* **Orchestration** :
  * [docker-compose.yml](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/docker-compose.yml) définit deux services (`frontend` et `backend`) avec des politiques de redémarrage `unless-stopped`. Le service backend charge ses secrets depuis le fichier `.env` via `env_file`.
* **Policy-as-Code** :
  * Présence de règles de conformité écrites sous Open Policy Agent (OPA) dans [policy/docker_compose.rego](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/policy/docker_compose.rego) and [policy/dockerfile.rego](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/policy/dockerfile.rego).
* **Serveur Web Frontend** :
  * Fichier [nginx.conf](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/nginx.conf) configuré avec des en-têtes de sécurité (CSP, X-Frame-Options, X-Content-Type-Options) et la directive `server_tokens off;`.

### 🟢 Suite de Tests et Outils de Validation
* **Tests Unitaires/Fonctionnels (Jest)** : Suite de tests Jest configurée à la racine pour tester la logique frontend et backend (ex: `brevo-provider.test.js`, `backend-password-policy.integration.test.js`, `account-deletion.test.js`).
* **Tests E2E (Playwright)** : Suite de tests configurée dans [playwright.config.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/playwright.config.js) visant les scénarios fonctionnels (suppression de compte, contact, fallback hors-ligne).
* **Qualité du code** : Configuré avec ESLint dans [.eslintrc.json](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/.eslintrc.json).

### 🟢 Stratégie Git et Outils de Sécurité du Poste
* **Secret Scanning (Pre-commit)** : Hook de pre-commit configuré via le framework `pre-commit` dans [.pre-commit-config.yaml](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/.pre-commit-config.yaml) qui exécute **Gitleaks** (v8.21.2) localement avant chaque commit.
* **Intégration Continue (GitHub Actions)** :
  * [jest.yml](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/.github/workflows/jest.yml) : Exécute `eslint`, `npm audit --audit-level=high` et `npm test`.
  * [codeql.yml](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/.github/workflows/codeql.yml) : Scan SAST avancé CodeQL pour Javascript/Typescript.
  * [semgrep.yml](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/.github/workflows/semgrep.yml) : Scan SAST léger Semgrep.
  * [trivy.yml](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/.github/workflows/trivy.yml) : Scan de vulnérabilités SCA sur la racine (bloquant) et le backend (informatif), scan de configuration IaC, et génération d'un SBOM (CycloneDX).
  * [conftest.yml](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/.github/workflows/conftest.yml) : Valide les Dockerfiles et docker-compose par rapport aux politiques OPA.

---

## 2. Audit des Bonnes Pratiques de Sécurité dans le Code

### 2.1. Mots de Passe, Authentification et Rate Limiting
* **Stockage et hachage** : Strapi stocke les mots de passe de la table `up_users` sous forme de hashs **bcrypt**. Le facteur de coût utilisé est la valeur par défaut de Strapi (10). Aucun moyen natif simple dans Strapi 5 ne permet d'augmenter le coût à 12-14 (recommandation du PDF) sans modifier le plugin d'authentification natif, ce qui introduirait un risque d'instabilité logicielle.
* **Politique de complexité des mots de passe** : Implémentée de manière personnalisée et robuste dans `backend/config/plugins.js` (validation à l'inscription, au changement de mot de passe et à la réinitialisation : minimum 12 caractères Unicode, maximum 72 octets pour éviter l'attaque par déni de service de hachage bcrypt, rejet des mots de passe uniquement composés d'espaces).
* **Rate Limiting** :
  * **Endpoints personnalisés** : Le rate limiting est correctement implémenté en mémoire locale sur `/api/contact` (max 5 requêtes par IP par heure, avec purge automatique anti-fuite de mémoire) et `/api/account/delete` (max 5 requêtes par IP/User par heure).
  * **Endpoints d'authentification natifs de Strapi** (ex: `/api/auth/local`, `/api/auth/local/register`, `/api/auth/forgot-password`) : **Aucun rate-limiting personnalisé n'est configuré en production dans l'application ou dans le reverse-proxy Nginx**. En développement/test, une configuration de repli est déclarée dans [plugins.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/config/plugins.js#L17-L22) (1000 requêtes par minute), mais elle est absente en production.
* **MFA (Authentification Multi-Facteurs)** : Absente pour le panneau d'administration Strapi (car c'est une fonctionnalité payante de Strapi Enterprise).
* **JWT (JSON Web Tokens)** :
  * Durée d'expiration par défaut (30 jours) très élevée par rapport à la recommandation du PDF (15-30 minutes).
  * Stocké côté frontend dans le `localStorage` de l'utilisateur (voir [assets/JS/mon-espace.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/JS/mon-espace.js)), ce qui expose le jeton à un vol direct en cas de faille XSS.
* **Comportement post-suppression de compte** : Implémentation robuste. La suppression physique en cascade nettoie les liaisons de rôles dans la base SQLite. La session est invalidée et un courriel transactionnel de confirmation conforme à l'article 12 du RGPD est envoyé (avec gestion de timeout de 5s pour éviter le blocage de l'API en cas de panne de Brevo).

### 2.2. Gestion des Secrets et variables d'environnement
* **Configuration** : Les secrets sont correctement stockés dans le fichier local [backend/.env](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/.env) (exclus de Git dans [.gitignore](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/.gitignore#L15)).
* **Fuites de secrets** : Le scan local Gitleaks (via pre-commit) réduit le risque de commit accidentel de secrets.
* **Variables d'environnement d'exemple** : Le fichier [backend/.env.example](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/.env.example) contient des valeurs fictives génériques adaptées.
* **Historique Git** : L'audit de l'historique récent (5 derniers commits) ne révèle aucune fuite de clés ou secrets. Cependant, le fichier `.env` actif en local contient une vraie clé API Brevo fonctionnelle. Bien qu'elle soit ignorée par Git, ce secret reste visible sur le poste de travail. Un coffre de secrets de production (comme Doppler ou Vault) sera nécessaire lors du déploiement cloud.

### 2.3. Injection et Accès aux Données
* **SQL Injection (SQLi)** : La base SQLite locale est requêtée via le Query Engine de Strapi 5 (Knex.js sous le capot) qui applique par défaut des requêtes paramétrées. Aucune concaténation brute (`.raw`) ou requête SQL manuelle n'a été détectée dans le backend.
* **Command Injection / Path Traversal** : Pas d'usage de fonctions système risquées (`eval`, `Function`, `exec`, `spawn`) dans le code applicatif.
* **Client-Side XSS (Faille de Rendu DOM)** :
  * Le script frontend [assets/JS/article.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/JS/article.js#L333) utilise la propriété `innerHTML` pour insérer le titre et la description des articles sans appliquer d'assainissement préalable.
  * Si un administrateur ayant accès au panneau Strapi insère des scripts malveillants (ex: `<script>fetch(...)` ou `<img src=x onerror=...>` ) dans le titre ou le corps d'un article, ils seront exécutés dans le navigateur des visiteurs de la page `article.html`.

### 2.4. Validation des Entrées (Input Validation)
* **Endpoints Personnalisés** :
  * `/api/contact` : Validation extrêmement rigoureuse. Vérification de Content-Type, limitation stricte du corps HTTP (max 10 Ko), liste blanche des sujets autorisés, rejet des propriétés inconnues, regex pour l'email, échappement HTML anti-XSS, validation de taille des chaînes, et blocage d'injection CRLF (retours à la ligne).
  * `/api/account/delete` : Validation complète. Vérification du texte de confirmation ("SUPPRIMER"), validation de la case de consentement, rejet de propriétés inconnues et vérification du mot de passe.
* **Endpoints Natifs Strapi** :
  * S'appuient sur la validation de schéma par défaut de Strapi (types de base, champs requis). Ils ne rejettent pas par défaut les propriétés supplémentaires non déclarées et n'implémentent pas de protection spécifique contre les injections d'en-têtes HTTP (CRLF) ou d'Unicode exotique.

### 2.5. Gestion des Erreurs et Logs
* **Stack Traces** : Côté frontend, le script de repli hors-ligne intercepte proprement les erreurs de réseau et rebascule sur des mocks. Le backend Strapi désactive l'affichage des stack traces détaillées en mode production (renvoie des réponses d'erreur standardisées).
* **Logs applicatifs** : Le logger backend Strapi (`strapi::logger`) n'écrit pas de jetons JWT, d'adresses e-mail, de messages ou de mots de passe de manière brute. Les tests unitaires dans `account-deletion.test.js` valident la sécurité des logs en analysant la sortie console simulée.
* **Traitement des retours d'API e-mail** : La gestion d'envoi Brevo vérifie formellement le retour booléen (`result === true`) pour ne jamais renvoyer de faux succès à l'utilisateur final.

### 2.6. Chiffrement et Transport
* **HTTPS/TLS** : Le site frontend statique est configuré pour être servi via GitHub Pages (HTTPS par défaut en production). Le backend local tourne en HTTP (port 1337). Il n'y a pas de configuration TLS native dans le backend Strapi, ce qui est normal pour du développement local, mais nécessite un reverse-proxy HTTPS (Nginx, Caddy ou Cloudflare) en environnement de pré-production/production.
* **En-têtes de sécurité (Headers)** :
  * Les en-têtes sont déclarés dans le fichier `nginx.conf` pour le frontend statique.
  * Cependant, la politique CSP contient la directive `script-src 'self' 'unsafe-inline'`. Cette directive `'unsafe-inline'` affaiblit la protection contre les injections XSS en autorisant l'exécution de scripts directement écrits dans l'HTML statique du site.
  * De plus, le backend Strapi n'a pas d'en-têtes HTTP de sécurité configurés par défaut en sortie.
* **Protection des jetons de session (Cookies vs LocalStorage)** :
  * Le jeton JWT de l'agent est stocké dans le `localStorage` (voir [assets/JS/mon-espace.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/JS/mon-espace.js)). Cela rend la session vulnérable aux attaques XSS (un script injecté via XSS dans le frontend pourrait facilement lire le jeton JWT). Une migration vers un stockage de session sécurisé par cookies `HttpOnly; Secure; SameSite=Strict` est fortement recommandée.
* **Chiffrement au repos (At Rest)** :
  * La base SQLite stockée dans `backend/.tmp/data.db` contient des données de structure, les articles rédigés, et les adresses e-mail des utilisateurs inscrits. Elle n'est pas chiffrée. Si un attaquant accède au serveur de fichiers, il peut copier et lire l'intégralité de la base de données.

## 3. Audit des Dépendances (SCA - Software Composition Analysis) — US-02

### Status de validation de la feuille de route
*   **User Story US-01 — Sécurisation du rendu frontend contre les failles DOM XSS** : **Clôturée** 
    *   *Commit de référence* : `5d3c47f0875bc0452a4e86b57c56c54b7151a773`
    *   *Commit de documentation* : `0ed8477e11fe16c4219d3c940e90cc3e0c9e03b4`
*   **User Story US-02 — Analyse et traitement progressif des vulnérabilités de dépendances** : **En cours d'audit** (ciblé, sans modification).

---

### 3.1. Inventaire des Avis de Sécurité à la Racine (Frontend & Outils)
L'exécution de `npm audit` à la racine met en évidence **3 vulnérabilités de sévérité Haute** :

1.  **`brace-expansion`** (<= 1.1.17) :
    *   *CVE/GHSA* : GHSA-3jxr-9vmj-r5cp, GHSA-mh99-v99m-4gvg, GHSA-rgw5-rvv9-x895
    *   *Type de dépendance* : Transitive (installée via `minimatch`).
    *   *Chaîne de dépendances* : `cyberscop-lab` -> `eslint` -> `minimatch` -> `brace-expansion`
    *   *Environnement* : **Développement / Test uniquement** (outils eslint, jest, jsdoc).
    *   *Exploitabilité réelle* : **Nulle**. Utilisé uniquement en phase locale ou de build de CI. Aucun chemin réseau n'expose l'expansion d'accolades dans l'application en cours d'exécution.
2.  **`js-yaml`** (<= 3.14.2 ou 4.0.0 - 4.2.0) :
    *   *CVE/GHSA* : GHSA-h67p-54hq-rp68, GHSA-52cp-r559-cp3m
    *   *Type de dépendance* : Transitive.
    *   *Chaîne de dépendances* : `cyberscop-lab` -> `eslint` -> `@eslint/eslintrc` -> `js-yaml`
    *   *Environnement* : **Développement / Test uniquement**.
    *   *Exploitabilité réelle* : **Nulle**. Le parser YAML n'est exécuté que localement pour analyser les règles ESLint ou JSDoc, sans manipulation de fichiers YAML fournis par des utilisateurs.
3.  **`linkify-it`** (<= 5.0.1) :
    *   *CVE/GHSA* : GHSA-v245-v573-v5vm
    *   *Type de dépendance* : Transitive.
    *   *Chaîne de dépendances* : `cyberscop-lab` -> `jsdoc` -> `markdown-it` -> `linkify-it`
    *   *Environnement* : **Développement / Test uniquement** (générateur de documentation JSDoc).
    *   *Exploitabilité réelle* : **Nulle**. N'est utilisé que pour la génération statique de la documentation technique du développeur.

---

### 3.2. Inventaire des Avis de Sécurité du Backend (Strapi CMS)
L'exécution de `npm audit` dans le sous-dossier `backend` met en évidence **54 vulnérabilités** (6 basses, 22 modérées, 25 hautes, 1 critique) :

1.  **`tar`** (<= 7.5.20) :
    *   *CVE/GHSA* : GHSA-vmf3-w455-68vh, GHSA-w8wr-v893-vjvp, GHSA-23hp-3jrh-7fpw, GHSA-8x88-c5mf-7j5w, GHSA-gvwx-54wh-qm9j, GHSA-r292-9mhp-454m
    *   *Gravité* : **Critique**
    *   *Type de dépendance* : Transitive.
    *   *Chaîne de dépendances* : `backend` -> `@strapi/strapi` -> `@strapi/cloud-cli` -> `tar`
    *   *Environnement* : **Production / Développement** (outil CLI de déploiement cloud Strapi).
    *   *Exploitabilité réelle* : **Nulle**. L'application CyberScope LAB n'utilise pas de fonctionnalités de compression ou décompression d'archives tar à l'exécution. Les flux d'API (articles, contact, authentification) ne traitent pas de fichiers tar.
    *   *Action recommandée* : Laisser la mise à jour Strapi v5 ou forcer la version via `resolutions` (Lot E).
2.  **`nodemailer`** (<= 9.0.0) :
    *   *CVE/GHSA* : GHSA-268h-hp4c-crq3, GHSA-wqvq-jvpq-h66f, GHSA-r7g4-qg5f-qqm2, GHSA-p6gq-j5cr-w38f
    *   *Gravité* : **Haute**
    *   *Type de dépendance* : Transitive.
    *   *Chaîne de dépendances* : `backend` -> `@strapi/strapi` -> `@strapi/provider-email-sendmail` -> `nodemailer`
    *   *Environnement* : **Production / Développement**.
    *   *Exploitabilité réelle* : **Nulle**. Bien que nodemailer soit présent dans les modules de Strapi, notre application utilise explicitement le provider **`strapi-provider-email-brevo`** (API HTTPS) pour tous les envois de courriels (opt-in, reset de mot de passe, suppression de compte). Le provider par défaut `sendmail` (nodemailer) est totalement inactif.
    *   *Action recommandée* : Remplacée par Strapi upgrade ou lockfile override (Lot E/F).
3.  **`ws`** (8.0.0 - 8.20.1) :
    *   *CVE/GHSA* : GHSA-96hv-2xvq-fx4p
    *   *Gravité* : **Haute**
    *   *Type de dépendance* : Transitive.
    *   *Chaîne de dépendances* : `backend` -> `@strapi/strapi` -> `ws`
    *   *Environnement* : **Développement uniquement** (utilisé pour les connexions de hot-reloading du panneau d'administration en mode dev).
    *   *Exploitabilité réelle* : **Nulle**. En production, les sockets de développement sont désactivés et le panneau d'admin est servi sous forme d'actifs statiques.
4.  **`undici`** (<= 6.27.0) :
    *   *CVE/GHSA* : GHSA-p88m-4jfj-68fv, GHSA-vxpw-j846-p89q, GHSA-35p6-xmwp-9g52, GHSA-g8m3-5g58-fq7m, GHSA-8xcm-r25x-g524, GHSA-m8rv-5g2x-5cg5, GHSA-v3r7-h72x-cjcm
    *   *Gravité* : **Haute**
    *   *Type de dépendance* : Transitive.
    *   *Chaîne de dépendances* : `backend` -> `@strapi/strapi` -> `undici`
    *   *Environnement* : **Production / Développement** (HTTP Client sous-jacent de Node).
    *   *Exploitabilité réelle* : **Très faible**. Undici gère les requêtes HTTP asynchrones.
    *   *État de correction* : **Corrigé via package override** vers la version `6.28.0` (Sous-Lot A1). Aucun impact sur les autres dépendances et tests passés à 100%.
5.  **`sharp`** (< 0.35.0) :
    *   *CVE/GHSA* : GHSA-f88m-g3jw-g9cj (hérite des CVEs de la bibliothèque native `libvips` comme CVE-2026-33327).
    *   *Gravité* : **Haute**
    *   *Type de dépendance* : Transitive.
    *   *Chaîne de dépendances* : `backend` -> `@strapi/strapi` -> `@strapi/upload` -> `sharp`
    *   *Environnement* : **Production / Développement** (gestionnaire de média Strapi).
    *   *Exploitabilité réelle* : **Faible**. Utilisé pour le recadrage et la génération de miniatures à l'import de médias.
    *   *État de correction* : **Corrigé via package override** vers la version `0.35.3` (Sous-Lot A2). Les tests unitaires Jest (187/187 passés), E2E Playwright (24/24 passés) et la validation fonctionnelle de la médiathèque (téléversement, génération de miniatures et suppression via Sharp) sont validés avec succès.
6.  **`lodash`** (vulnerable via `_.template`, `_.unset`, `_.omit`) :
    *   *CVE/GHSA* : GHSA-r5fr-rjxr-66jc, GHSA-f23m-r3pf-42rh
    *   *Gravité* : **Haute**
    *   *Type de dépendance* : Transitive.
    *   *Chaîne de dépendances* : `backend` -> `@strapi/plugin-cloud` (ou `@strapi/design-system`) -> `lodash`
    *   *Environnement* : **Production / Développement**.
    *   *Exploitabilité réelle* : **Nulle**. Le backend n'exécute pas de templates Lodash (`_.template`) à partir de paramètres contrôlés par l'utilisateur final.

---

### 3.3. Gestion du Patch Brevo et Robustesse
*   **Version exacte** : `strapi-provider-email-brevo` est en version **`1.0.4`**.
*   **Contenu et raison du patch** : Le patch [strapi-provider-email-brevo+1.0.4.patch](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/patches/strapi-provider-email-brevo+1.0.4.patch) applique un nettoyage de chaîne (`trim()` et suppression des chevrons `<>`) sur les variables `senderEmail` et `senderName` pour corriger un rejet d'envoi d'e-mail par l'API HTTPS de Brevo lorsque l'expéditeur contient des caractères non conformes.
*   **Version de validation** : Ce patch s'applique automatiquement après chaque installation (`postinstall`) via `patch-package`. Une mise à jour ou réinstallation propre (`npm ci`) réapplique bien le patch avec succès.
*   **Risque de mise à jour** : Si le module `strapi-provider-email-brevo` est mis à jour vers une version corrigeant ce bug, le patch doit être supprimé pour éviter les conflits d'application de patch.
*   **Dépendances vulnérables apportées** : Aucune dépendance vulnérable n'est directement apportée par ce provider (il dépend principalement de packages HTTP légers).
*   **Alternative maintenue** : Le provider officiel de Strapi ou l'usage direct du client API SDK Brevo dans un contrôleur personnalisé. Actuellement, la version 1.0.4 patchée est robuste, stable et maintenue.

---

### 3.4. Étude de l'Upgrade de Strapi (v5.48.1 vers v5.51.1)
*   **Version compatible disponible** : Strapi **`5.51.1`** est la dernière version v5 stable.
*   **Sécurité et modifications** : Corrige de nombreuses vulnérabilités dans le moteur et met à jour des modules transitifs (notamment `undici` et `ws`).
*   **Risques techniques identifiés** :
    *   **Users & Permissions** : Notre patch local [server/controllers/auth.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/backend/patches/@strapi+plugin-users-permissions+5.48.1.patch) traduit les messages d'erreur des schémas yup en français. Une mise à jour vers 5.51.1 cassera ce patch car le fichier de destination diffèrera en signature. Il faudra régénérer le patch `@strapi+plugin-users-permissions+5.51.1.patch`.
    *   **SQLite** : Pas de breaking change majeur sur le driver `better-sqlite3` lors d'une mise à jour mineure de Strapi.
    *   **Contrôleurs, routes, extensions et Brevo** : Le contrôleur personnalisé de suppression de compte (`/api/account/delete`) et le raccordement Brevo restent compatibles car ils s'appuient sur les APIs stables de Strapi (Query Engine et Email Service).
*   **Décision** : Ne pas faire d'upgrade majeur de version de Strapi dans ce lot pour éviter des régressions fonctionnelles. Préférer des résolutions de versions ciblées et régénérer le patch de traduction en français.
