# Documentation Technique du Projet

## Contenu du document

Ce document couvre les aspects techniques suivants :

- L'installation des outils nécessaires, avec les commandes exactes.
- Les commandes de test (ex: test TDD) et leur rôle.
- Les workflows GitHub Actions : ce qu'ils vérifient et pourquoi.
- Les scripts utiles, variables d'environnement, conventions de nommage.
- Les cas particuliers ou pièges fréquents.

---

## Structure de chaque étape

Pour chaque étape technique, la structure suivante est utilisée :

1. **Objectif de l'étape**  
   Description courte du but de cette étape.

2. **Prérequis**  
   Outils, dépendances ou configurations nécessaires avant de commencer.

3. **Commande**  
   La commande exacte à exécuter.

```bash
# Exemple de commande
npm test
```

4. **Explication courte**  
   Brève explication précise de ce que fait la commande et pourquoi elle est nécessaire.

5. **Vérification du résultat**  
   Ce que tu dois observer pour confirmer que l'étape a réussi (messages de sortie, fichiers créés, état des tests, etc.).

6. **Notes et conseils supplémentaires**  
   Informations utiles, avertissements, bonnes pratiques, ou astuces spécifiques à cette étape.

---

## Étape 1 : Configuration du Workflow GitHub Actions pour Jest (test TDD)

1. **Objectif de l'étape**  
   Mettre en place l'intégration continue (CI) avec GitHub Actions pour exécuter automatiquement les 35 tests Jest lors de chaque `push` ou `pull_request` sur les branches `dev` et `main`.

2. **Prérequis**  
   - Les dépendances de test configurées dans le fichier [package.json](../package.json)
   - Un fichier [package-lock.json](../package-lock.json) à jour à la racine
   - Les tests écrits dans [tests/test.js](../tests/test.js)
   - Un dépôt distant configuré sur GitHub
   - documentation des fonctions fonction métier/comportement via JSdoc avant l'ecriture des tests. 

3. **Commande**  
   Créez le fichier de configuration du workflow sous [.github/workflows/jest.yml](../.github/workflows/jest.yml) avec la configuration souhaitée, puis envoyez les modifications :

```bash
git add .github/workflows/jest.yml
git commit -m "ci: ajouter le workflow GitHub Actions pour exécuter Jest"
git push origin dev
```

4. **Explication courte**  
   Cette action configure un environnement de test isolé (machine virtuelle Ubuntu) exécutant Node.js, installant proprement les dépendances via la commande ultra-rapide `npm ci`, et exécutant les tests unitaires et comportementaux grâce à la commande `npm test`.

5. **Vérification du résultat**  
   Rendez-vous sur l'onglet **Actions** de votre dépôt GitHub. Vous devriez y voir démarrer un "workflow" nommé **Tests de non-régression (Jest)**. Confirmez que toutes les étapes s'exécutent correctement et que le workflow se termine par une coche verte de succès.

6. **Notes et conseils supplémentaires**  
   > **Astuce :** `npm ci` au lieu de `npm install` est optimisé pour la CI : plus rapide, plus stricte, échoue si `package-lock.json` non synchronisé avec `package.json`.

7. **Danger (si non réalisé)**  
   > **Alerte Sécurité :** Sans tests automatisés exécutés de manière transparente lors de la CI, des bugs ou des régressions critiques affectant des fonctions de sécurité (ex. la validation RGPD des cookies ou la conformité des formulaires) peuvent être déployés par inadvertance en production, offrant des failles faciles à exploiter pour un attaquant.

---

## Étape 2 : Configuration et Utilisation d'ESLint (Linter)

1. **Objectif de l'étape**  
   Mettre en place et configurer ESLint pour analyser automatiquement la qualité du code JavaScript, vérifier la syntaxe et s'assurer que les conventions de codage sont respectées.

2. **Prérequis**  
   - Avoir installé `eslint@8.57.0` (défini dans [package.json](../package.json)).
   - Avoir configuré le fichier [.eslintrc.json](../.eslintrc.json) à la racine du projet.

3. **Commande**  
   Pour analyser le code localement :
   ```bash
   npm run lint
   ```

4. **Explication courte**  
   Cette commande exécute ESLint sur l'ensemble du projet. Elle parcourt les répertoires pour repérer les variables déclarées mais non utilisées, les variables globales indéfinies, ou d'autres erreurs de syntaxe potentielles.

5. **Vérification du résultat**  
   Si aucun avertissement ou erreur n'est trouvé, la commande se termine silencieusement sans retour d'erreur. S'il y a des violations de règles, elles s'affichent sous forme de liste indiquant le fichier, la ligne et la règle enfreinte.

6. **Notes et conseils supplémentaires**  
   - Les environnements configurés dans `.eslintrc.json` sont `browser`, `node`, `jest` et `es2022` afin d'éviter les faux négatifs de type "variable globale non définie" (comme `document` ou `jest`).
   - La globale `lucide` (pour l'affichage des icônes) est déclarée en lecture seule pour éviter que le linter ne la signale comme indéfinie.

7. **Danger (si non réalisé)**  
   > **Alerte Sécurité :** L'absence d'analyse statique syntaxique permet à des variables non déclarées ou à des instabilités logiques d'être intégrées. Un attaquant peut exploiter ces faiblesses pour provoquer un déni de service (crash de l'interface client) ou exploiter des failles de logique métier.

---

## Étape 3 : Audit de sécurité des dépendances (npm audit) dans la CI

1. **Objectif de l'étape**  
   Vérifier automatiquement lors de l'intégration continue qu'aucune dépendance introduite ou mise à jour ne contient de faille de sécurité majeure (Haute ou Critique).

2. **Prérequis**  
   - Avoir configuré le workflow de test sous [.github/workflows/jest.yml](../.github/workflows/jest.yml).
   - Les fichiers [package.json](../package.json) et [package-lock.json](../package-lock.json) doivent être à jour.

3. **Commande**  
   Pour tester localement ou vérifier le comportement :
   ```bash
   npm audit --audit-level=high
   ```

4. **Explication courte**  
   Cette commande interroge la base de données des vulnérabilités npm pour s'assurer que les dépendances listées dans `package-lock.json` n'ont pas de failles de sécurité connues de sévérité élevée ou critique.

5. **Vérification du résultat**  
   La commande doit se terminer par un code de succès (0) s'il n'y a pas de vulnérabilité haute/critique. En local, elle affiche un rapport récapitulatif des dépendances analysées.

6. **Notes et conseils supplémentaires**  
   > **Important :** Nous limitons le seuil à `--audit-level=high`. Le projet possède actuellement des dépendances de développement (notamment via Jest 29) contenant des alertes de niveau modéré (`js-yaml`). En ciblant uniquement le niveau `high`, nous évitons de bloquer inutilement la CI tout en restant alertés en cas de menace réelle.

7. **Danger (si non réalisé)**  
   > **Alerte Sécurité :** Sans audit de sécurité des dépendances, une bibliothèque tierce contenant une vulnérabilité critique de type RCE (exécution de code à distance) ou XSS peut s'infiltrer dans le projet. Un attaquant pourrait l'exploiter directement pour compromettre le système ou voler les données des utilisateurs.

---

## Étape 4 : Analyse SAST avec GitHub CodeQL

1. **Objectif de l'étape**  
   Configurer l'outil SAST (Static Application Security Testing) officiel de GitHub pour scanner en continu le code source JavaScript à la recherche de failles logicielles comme les injections, les failles XSS (mauvaise utilisation de `innerHTML`), ou les faiblesses cryptographiques.

2. **Prérequis**  
   - Un dépôt public sur GitHub (CodeQL est gratuit et activé par défaut sur les projets publics).
   - Un dépôt distant configuré sur GitHub.

3. **Commande et déploiement du workflow**  
   Créez le fichier de configuration du workflow sous [.github/workflows/codeql.yml](../.github/workflows/codeql.yml) puis déployez-le sur votre dépôt :
   ```bash
   # Ajouter le fichier de configuration
   git add .github/workflows/codeql.yml
   
   # Commiter et pousser vers la branche dev
   git commit -m "ci: ajouter le workflow GitHub Actions pour l'analyse SAST CodeQL"
   git push origin dev
   ```

4. **Explication courte**  
   CodeQL analyse statiquement le code en créant une base de données relationnelle modélisant le code source de l'application, puis exécute des requêtes de sécurité complexes pour identifier les failles d'injections ou de mauvaise gestion du flux de données (ex: injection HTML via `innerHTML`).

5. **Vérification du résultat**  
   - **Exécution du workflow** : Allez sur l'onglet **Actions** de votre dépôt GitHub, puis cliquez sur le workflow **CodeQL Security Analysis** pour voir les étapes de compilation et d'analyse.
   - **Rapport de vulnérabilité** : Allez sur l'onglet **Security** de votre dépôt GitHub, puis sous la section **Code scanning** (dans la barre latérale gauche) pour consulter le tableau de bord des alertes de sécurité détectées par CodeQL.

6. **Notes et conseils supplémentaires**  
   - L'analyse est configurée pour scanner le code à chaque `push` ou `pull_request` sur les branches `dev` et `main`, ainsi que de manière planifiée une fois par semaine (cron).

7. **Danger (si non réalisé)**  
   > **Alerte Sécurité :** Sans analyse SAST (CodeQL), des vulnérabilités complexes écrites directement dans votre code (comme les failles XSS dues à une injection via `innerHTML`, ou des faiblesses cryptographiques) ne seront jamais détectées avant la mise en ligne, permettant à des pirates de cibler vos utilisateurs.

---

## Étape 5 : Analyse SAST avec Semgrep

1. **Objectif de l'étape**  
   Intégrer Semgrep, un outil SAST (Static Application Security Testing) ultra-rapide et hautement personnalisable, dans notre pipeline d'intégration continue (CI/CD) sur GitHub Actions. Son rôle est de détecter les configurations non sécurisées, les erreurs d'encodage, les vulnérabilités de logique de code et les faiblesses d'implémentation en scannant le code source à chaque `push` ou `pull_request`.

2. **Prérequis**  
   - Un dépôt distant configuré sur GitHub.
   - (Facultatif) Python/pip ou Docker installé pour l'exécution locale.

3. **Commande, installation et déploiement**  
   
   **Déploiement du workflow CI/CD :**  
   Créez le fichier de configuration du workflow sous [.github/workflows/semgrep.yml](../.github/workflows/semgrep.yml) puis déployez-le sur votre dépôt :
   ```bash
   # Ajouter le fichier de configuration
   git add .github/workflows/semgrep.yml
   
   # Commiter et pousser vers la branche dev
   git commit -m "ci: intégration de Semgrep SAST dans GitHub Actions"
   git push origin dev
   ```

   **Installation et exécution en local :**  
   Pour tester la configuration et lancer une analyse de sécurité sur votre machine avant de pousser le code :
   ```bash
   # Option A : Installation directe de l'outil CLI Semgrep (via Python/pip)
   pip install semgrep
   semgrep scan --config auto

   # Option B : Utilisation sans installation via Docker (recommandé si Docker est installé)
   docker run --rm -v "${PWD}:/src" semgrep/semgrep semgrep scan --config auto
   ```

4. **Explication courte**  
   Cette configuration ajoute un job automatisé dans GitHub Actions qui récupère votre code, lance Semgrep à l'aide de son image Docker officielle, scanne le projet avec les règles communautaires par défaut (`--config auto`), puis exporte les résultats au format standardisé SARIF.

5. **Vérification du résultat**  
   - **Exécution du workflow** : Allez sur l'onglet **Actions** de votre dépôt GitHub, puis cliquez sur le workflow **Semgrep Security Analysis** pour valider le bon déroulement du scan.
   - **Rapport de vulnérabilité** : Allez sur l'onglet **Security** de votre dépôt GitHub, puis sous la section **Code scanning** (dans la barre latérale gauche). Les alertes Semgrep y sont fusionnées avec celles de CodeQL pour vous donner un tableau de bord de sécurité unifié.

6. **Notes et conseils supplémentaires**  
   - > **Synergie :** Semgrep fonctionne en parfaite complémentarité avec CodeQL. CodeQL est exceptionnel pour suivre le flux des données complexes (injections XSS complexes), tandis que Semgrep brille par sa rapidité d'exécution et sa détection de patterns de codage à risque ou de mauvaise configuration.
   - **Règles personnalisées :** Vous pouvez étendre la configuration en ciblant des règles spécifiques via l'argument `--config`.

7. **Danger (si non réalisé)**  
   - > **Alerte Sécurité :** Sans l'analyse automatisée de Semgrep, des fautes de sécurité typiques (comme l'utilisation de méthodes de chiffrement obsolètes, de mauvaises configurations d'en-têtes HTTP, ou des bugs logiques introduits par des librairies tierces) peuvent passer inaperçues lors de la phase de révision du code, augmentant le risque d'exploitation de vulnérabilités connues par des tiers.

---

## Étape 6 : Analyse SCA (Software Composition Analysis) avec Trivy et Dependabot

1. **Objectif de l'étape**  
   Mettre en place une analyse automatisée des dépendances tierces (SCA) pour détecter et corriger les vulnérabilités introduites par les bibliothèques npm et paquets externes, à la fois pour le frontend (racine) et le backend (Strapi). Le but est de bloquer l'intégration si une vulnérabilité haute/critique est introduite à la racine, et de suivre automatiquement les vulnérabilités de Strapi.

2. **Prérequis**  
   - Avoir un dépôt distant GitHub configuré.
   - Avoir ajouté le fichier de configuration de Dependabot [.github/dependabot.yml](../.github/dependabot.yml).
   - Avoir ajouté le fichier de configuration du workflow Trivy [.github/workflows/trivy.yml](../.github/workflows/trivy.yml).

3. **Commande, installation et déploiement**  
   
   **Déploiement des configurations CI/CD :**  
   Ajoutez et poussez les configurations de Dependabot et du workflow Trivy :
   ```bash
   # Ajouter les nouveaux fichiers
   git add .github/dependabot.yml
   git add .github/workflows/trivy.yml
   
   # Commiter et pousser vers la branche dev
   git commit -m "ci: intégration de Dependabot et Trivy pour l'analyse SCA"
   git push origin dev
   ```

   **Exécution d'un audit de sécurité en local (npm audit) :**  
   Pour auditer manuellement les vulnérabilités des dépendances du projet localement :
   ```bash
   # Audit des dépendances du Frontend (à la racine)
   npm audit
   
   # Audit des dépendances du Backend (dans /backend)
   cd backend
   npm audit
   ```

4. **Explication courte**  
   - **Dependabot** scanne périodiquement (chaque semaine) vos fichiers `package.json` et ouvre automatiquement des Pull Requests pour mettre à jour les paquets vulnérables ou obsolètes vers des versions sécurisées.
   - **Trivy** est exécuté via GitHub Actions à chaque push et Pull Request. Il scanne les fichiers de verrouillage (`package-lock.json`). Le scan du frontend est **bloquant** (`exit-code: 1` sur sévérité `HIGH,CRITICAL`) pour interdire l'ajout de dépendances vulnérables. Le scan du backend (Strapi) est **informateur** (`exit-code: 0`) car certaines dépendances imbriquées de Strapi échappent à notre contrôle direct mais doivent être surveillées.

5. **Vérification du résultat**  
   - **Dependabot** : Rendez-vous dans l'onglet **Security** > **Dependabot** de votre dépôt GitHub pour voir la liste des alertes de dépendances et les pull requests de mise à jour automatique créées.
   - **Trivy** : Rendez-vous dans l'onglet **Actions** de votre dépôt pour voir l'exécution du workflow **Trivy Dependency Scan (SCA)**, et dans **Security** > **Code scanning** pour consulter le tableau unifié des alertes.

6. **Notes et conseils supplémentaires**  
   - > **Bonne pratique :** Ne désactivez pas les alertes Dependabot. Si une dépendance à la racine est vulnérable, lancez `npm audit fix` ou `npm audit fix --force` pour la corriger rapidement.
   - **Exclusion Strapi :** Le backend (Strapi) possède un socle technique imposant contenant des vulnérabilités héritées non corrigeables par de simples mises à jour directes. C'est pourquoi le workflow Trivy y est configuré en mode informatif.

7. **Danger (si non réalisé)**  
   - > **Alerte Sécurité :** L'écrasante majorité du code d'une application moderne provient de paquets tiers. Sans SCA, une faille critique de type RCE (Exécution de Code à Distance) ou Prototype Pollution dans une dépendance tierce peut être déployée en production, donnant aux pirates le contrôle complet de votre serveur.

---

## Étape 7 : Signature des commits Git

1. **Objectif de l'étape**  
   Configurer Git localement pour signer numériquement chaque commit avec une clé SSH, permettant d'assurer l'authenticité de l'auteur et la non-répudiation des modifications sur GitHub. Assurer l'authenticité des commits et empêcher l'usurpation d'identité en signant numériquement chaque commit à l'aide d'une clé SSH privée locale. Ainsi github reconnaîtra mes commits comme authentiques et y apposera un badge vert Verified. Cela renforce la sécurité de mon dépôt. 

2. **Prérequis**  
   - Avoir Git installé localement (version 2.34 ou supérieure recommandée pour le support des clés SSH).
   - Avoir généré une clé SSH dédiée à la signature.

3. **Commande**  
   Générez une clé SSH de signature et configurez Git pour l'utiliser :
   ```bash
   # Générer la clé SSH de signature
   ssh-keygen -t ed25519 -f ~/.ssh/id_signing_key -C "signing-key" -N ""

   # Configurer Git pour utiliser SSH pour la signature.
   # Indique à Git d'utiliser automatiquement le protocole SSH avec votre clé de signature locale pour valider chaque commit.

   # Activer la signature automatique globale
   git config --global commit.gpgsign true

   # Spécifier le format SSH pour la signature
   git config --global gpg.format ssh

   # Définir le chemin vers la clé de signature publique
   git config --global user.signingkey "C:/Users/user/.ssh/id_signing_key.pub"
   ```

4. **Explication courte**  
   Ces commandes indiquent à Git d'utiliser l'utilitaire SSH (au lieu de GPG) pour signer cryptographiquement chaque commit avec la clé privée locale. La clé publique doit être déclarée sur GitHub pour permettre la validation automatique.

5. **Vérification du résultat**  
   - Affichez votre clé publique de signature et copiez-la :
     ```bash
     cat ~/.ssh/id_signing_key.pub
     ```
   - Ajoutez-la à votre compte GitHub dans **Settings** > **SSH and GPG keys** > **New SSH key** (en choisissant le type **Signing Key**).
   - Faites un commit de test, puis poussez-le. Sur GitHub, un badge vert **"Verified"** doit apparaître à côté de votre commit.

6. **Notes et conseils supplémentaires**  
   - > **Sécurité :** Ne partagez jamais votre clé privée `id_signing_key`. La signature locale protège contre l'usurpation d'identité, une pratique courante où un attaquant configure votre nom et email localement pour pousser du code malveillant en se faisant passer pour vous.

   - **Validation :** Chaque commit poussé affiche désormais le badge vert **"Verified"** sur GitHub.

7. **Danger (si non réalisé)**  
   > **Alerte Sécurité :** Si vous ne signez pas vos commits, un pirate peut très facilement usurper votre identité Git en configurant vos coordonnées (nom et e-mail) sur sa machine. Il peut alors pousser du code malveillant sous votre identité sans éveiller les soupçons, détruisant ainsi l'intégrité de votre chaîne de livraison (supply chain attack).

---

## Étape 8 : Secret Scanning local avec pre-commit et Gitleaks

1. **Objectif de l'étape**  
   Configurer un système d'analyse préventif local pour empêcher physiquement l'ajout accidentel de secrets (clés d'API, mots de passe, clés SSH) dans le dépôt Git au moment du `git commit`, évitant ainsi leur fuite sur des dépôts distants publics.

2. **Prérequis**  
   - Python et `pip` installés localement.
   - Avoir initialisé Git dans le dossier du projet.

3. **Commande et configuration**  

   - **Étape A :** Installez le gestionnaire `pre-commit` via Python/pip :
     ```bash
     python -m pip install pre-commit
     ```

   - **Étape B :** Créez le fichier de configuration [.pre-commit-config.yaml](../.pre-commit-config.yaml) à la racine du projet avec le contenu suivant :
     ```yaml
     repos:
       - repo: https://github.com/gitleaks/gitleaks
         rev: v8.21.2
         hooks:
           - id: gitleaks
     ```

   - **Étape C :** Installez le hook de pre-commit dans votre dépôt Git local pour qu'il s'exécute à chaque commit :
     ```bash
     python -m pre_commit install
     ```

4. **Explication courte**  
   Le gestionnaire `pre-commit` intercepte la commande `git commit` et exécute automatiquement les hooks configurés. Ici, le hook `gitleaks` analyse l'ensemble des fichiers modifiés et bloque le commit s'il détecte des clés d'API, des mots de passe en clair ou d'autres formats de signatures de secrets connus.

5. **Vérification du résultat**  
   - Lancez l'analyse manuelle sur tous les fichiers du dépôt pour vérifier le bon fonctionnement :
     ```bash
     python -m pre_commit run --all-files
     ```
   - L'étape doit s'exécuter avec succès et renvoyer la ligne suivante pour confirmer que tout est valide et qu'aucun secret n'a été détecté :
     ```text
     Detect hardcoded secrets.................................................Passed
     ```

6. **Notes et conseils supplémentaires**  
   - > **Sécurité :** Si le hook bloque un commit en signalant un faux positif, ou si vous devez absolument passer outre dans un cadre spécifique et maîtrisé, vous pouvez utiliser l'option `git commit --no-verify`. Utilisez-la avec la plus grande prudence.
   - **Mise à jour :** Pour mettre à jour automatiquement les versions des hooks configurés (comme Gitleaks), vous pouvez lancer la commande `python -m pre_commit autoupdate`.

7. **Danger (si non réalisé)**  
   > **Alerte Sécurité :** Sans protection pre-commit comme Gitleaks, des informations secrètes (clés d'API cloud, identifiants de base de données, clés privées) peuvent être poussées par accident sur des dépôts. Les pirates déploient des scanners de secrets automatisés qui détectent ces informations publiques en moins de quelques secondes pour compromettre immédiatement vos serveurs et services.

---

## Étape 9 : Tests de bout en bout (E2E) avec Playwright et Validation de la Connexion Strapi

1. **Objectif de l'étape**  
   Mettre en place et exécuter une suite de tests de bout en bout (E2E) à l'aide de Playwright pour valider l'affichage du site dans un vrai navigateur Chromium et tester le bon fonctionnement de la liaison entre le Frontend et le CMS Backend Strapi (en mode connecté, hors-ligne/fallback et réel).

2. **Prérequis**  
   - Avoir installé `@playwright/test` et `http-server` (pour exécuter le serveur statique local automatique).
   - Avoir configuré le fichier [playwright.config.js](../playwright.config.js) à la racine.
   - Les tests E2E écrits dans [tests/e2e/smoke.spec.js](../tests/e2e/smoke.spec.js) et [tests/e2e/strapi-integration.spec.js](../tests/e2e/strapi-integration.spec.js).

3. **Commande**  
   Pour exécuter les tests E2E en arrière-plan :
   ```bash
   npm run test:e2e
   ```
   Pour lancer les tests avec l'interface graphique interactive de Playwright :
   ```bash
   npm run test:e2e:ui
   ```

4. **Explication courte**  
   Ces commandes lancent Playwright qui va d'abord démarrer le serveur web local sur le port `8080` (grâce à `http-server`), puis lancer un navigateur Chromium headless (ou avec interface via `--ui`) pour simuler le comportement d'un utilisateur réel. Les tests vérifient l'affichage de la page d'accueil, l'ouverture de la modale de connexion, la détection de la panne de Strapi (chargement avec repli transparent sur données mockées) et le bon formatage de l'API Strapi.

5. **Vérification du résultat**  
   Tous les scénarios de test doivent se terminer avec succès (6 tests passés). Si le serveur Strapi local tourne sur le port `1337`, le test vérifie également la validité de la connexion réseau non interceptée (Mode Réel).

6. **Notes et conseils supplémentaires**  
   - > **Important :** Le dossier `playwright-report/` et `test-results/` sont exclus du suivi Git dans [.gitignore](../.gitignore) pour éviter de polluer le dépôt distant.
   - **Visualisation :** En cas d'erreur de test, un rapport HTML détaillé est généré automatiquement dans `playwright-report/` et peut être visualisé avec `npx playwright show-report`.

7. **Danger (si non réalisé)**  
   - > **Alerte Qualité & Sécurité :** Sans tests E2E, il est impossible de garantir que l'application communique correctement avec son CMS ou que les modifications de style (comme le dark mode ou les modales) ne cassent pas l'expérience utilisateur dans un vrai navigateur (effets de régression sur le DOM réel).

---

## Étape 10 : Analyse de la Sécurité de l'Infrastructure (IaC Scanning) avec Trivy

1. **Objectif de l'étape**  
   Auditer et valider automatiquement la configuration de nos fichiers d'infrastructure (les Dockerfiles et le fichier `docker-compose.yml`) pour empêcher des failles de déploiement (ex. exécution en root, ports exposés).

2. **Prérequis**  
   - Les fichiers [Dockerfile](../Dockerfile), [nginx.conf](../nginx.conf), [backend/Dockerfile](../backend/Dockerfile) et [docker-compose.yml](../docker-compose.yml) créés et configurés.
   - Trivy installé localement (pour les scans locaux) ou intégré dans GitHub Actions.

3. **Commande**  
   Pour tester la configuration IaC localement :
   ```bash
   trivy config .
   ```
   Pour envoyer et valider dans la CI/CD :
   ```bash
   git add Dockerfile nginx.conf backend/Dockerfile docker-compose.yml .github/workflows/trivy.yml
   git commit -m "ci: ajouter la dockerisation et le scan de sécurité IaC"
   git push origin dev
   ```

4. **Explication courte**  
   Cette étape utilise Trivy pour analyser les structures de configuration (Kubernetes, Terraform, Docker, etc.) sans démarrer de conteneur. Il recherche des failles courantes comme l'absence de directive `USER` non-root ou des ports trop permissifs, et génère un rapport bloquant dans la CI/CD si une anomalie majeure est trouvée.

5. **Vérification du résultat**  
   - Localement, Trivy affiche un rapport avec `PASS` ou `FAIL` pour chaque règle d'infrastructure.
   - Sur GitHub Actions, le job **IaC Configuration Scan (Blocking)** du workflow Trivy doit se terminer avec succès.

6. **Notes et conseils supplémentaires**  
   - > **Sécurité :** Notre configuration force Nginx à utiliser le port `8080` pour pouvoir s'exécuter en tant qu'utilisateur non-root `nginx` (UID 101), ce qui est requis pour passer le scan sans alerte de sécurité.

7. **Danger (si non réalisé)**  
   - > **Alerte Sécurité :** Sans scan IaC, vous pouvez facilement déployer des conteneurs s'exécutant en tant qu'utilisateur `root` ou exposer inutilement des ports de base de données à internet. En cas de faille applicative, un attaquant obtiendrait instantanément des privilèges d'administrateur total sur votre machine hôte.

---

## Étape 11 : Génération Automatique de SBOM (Software Bill of Materials) avec Trivy

1. **Objectif de l'étape**  
   Générer de façon automatisée un inventaire complet et standardisé des composants logiciels et d'infrastructure du projet (SBOM) pour la transparence logicielle et le suivi de conformité (GRC).

2. **Prérequis**  
   - Un workflow GitHub Actions fonctionnel pour Trivy.
   - *(Optionnel pour test local)* Avoir Trivy installé sur sa machine.

3. **Commande**  
   * **Option A : Via l'intégration continue (CI/CD GitHub Actions - Recommandé, sans installation locale)**  
     Il suffit de pousser le code pour déclencher la génération automatique du SBOM :
     ```bash
     git add .
     git commit -m "ci: configurer la dockerisation, le scan IaC et le SBOM"
     git push origin dev
     ```
   * **Option B : En local (nécessite d'avoir installé Trivy sur sa machine)**  
     Exécutez la commande suivante à la racine du projet :
     ```bash
     trivy fs --format cyclonedx --output sbom.json .
     ```

4. **Explication courte**  
   Le SBOM est la "liste d'ingrédients" de votre projet. Trivy analyse l'intégralité du système de fichiers local ou de l'image de conteneur et produit un fichier standard JSON décrivant chaque dépendance (npm, paquets système, versions, licences). Ce fichier est ensuite stocké comme artefact sécurisé de build dans GitHub Actions pendant 14 jours.

   *Exemple concret d'utilité* : Imaginez que dans 6 mois, une faille de sécurité critique mondiale est découverte sur une bibliothèque que vous utilisez. Votre site est en production et vous n'avez pas modifié le code ou fait de push depuis des semaines.
   - **Sans SBOM** : Vous devez cloner votre projet, relancer vos pipelines de tests et de scan pour savoir si vous êtes concerné, ce qui prend du temps.
   - **Avec le SBOM** : Vous possédez déjà la "fiche d'ingrédients" (`sbom.json`) de votre application en production. Il vous suffit de soumettre ce fichier JSON à un outil de veille (comme *Dependency-Track*, *Snyk* ou même *Trivy* en local) qui va comparer instantanément votre inventaire avec les failles nouvellement découvertes. Vous savez en 2 secondes si votre site en production est vulnérable, sans toucher au code.


5. **Vérification du résultat**  
   Une fois que le workflow de la CI/CD s'est exécuté sur GitHub :
   - Rendez-vous sur l'onglet **Actions** de votre dépôt GitHub.
   - Cliquez sur le dernier run de workflow associé à votre commit.
   - Faites défiler la page tout en bas : dans la section **Artifacts**, vous trouverez un fichier ZIP nommé `cyberscop-lab-sbom` contenant votre fichier `cyberscop-lab-sbom.json` généré automatiquement par le serveur de la CI.

6. **Notes et conseils supplémentaires**  
   - > **Réglementation & Gouvernance :** Le format de sortie est ici CycloneDX, l'un des deux standards industriels majeurs approuvés pour la conformité cyber.
   - > **Surveillance continue en production (sans push)** : Même si le projet est figé et que vous ne faites plus de push, le déclenchement planifié hebdomadaire (`schedule` configuré dans `trivy.yml` chaque vendredi soir) va exécuter automatiquement Trivy pour générer un nouveau SBOM à jour avec les dernières failles découvertes. Vous aurez ainsi toujours un SBOM de moins de 7 jours (valide 14 jours) disponible au téléchargement dans l'onglet **Actions** de GitHub, même sur un dépôt dormant.
   - **Outils de visualisation du SBOM en ligne (gratuits et sécurisés)** :  
     Une fois le fichier `sbom.json` récupéré, vous pouvez l'analyser ou le visualiser sur ces plateformes s'exécutant côté client (les données restent dans votre navigateur) :
     * **[sbom.sh](https://sbom.sh)** : Le plus simple. Glissez-deposez votre fichier `sbom.json` pour obtenir instantanément une analyse graphique et un découpage propre de vos dépendances.
     * **[CycloneDX Web Tool](https://cyclonedx.github.io/cyclonedx-web-tool)** : L'outil officiel. Il vous permet de valider la conformité de votre fichier par rapport au schéma standard de CycloneDX.
     * **[Sunshine SBOM](https://cyclonedx.github.io/sunshine/)** : Visualisation hiérarchique. Idéal pour voir l'arbre de vos dépendances et les scores de vulnérabilité associés de manière visuelle et interactive.



7. **Danger (si non réalisé)**  
   - > **Alerte Gouvernance :** Sans SBOM, vous êtes incapable de savoir instantanément si une nouvelle vulnérabilité publique (CVE) critique impacte votre projet sans devoir cloner et réanalyser l'intégralité de votre code source, ce qui ralentit considérablement la réponse aux incidents de sécurité.

---

## Étape 12 : Policy-as-Code (Validation de la conformité avec Conftest)

1. **Objectif de l'étape**  
   Valider automatiquement nos fichiers de configuration (docker-compose, Dockerfiles) par rapport à nos politiques de sécurité et de conformité légale (ex. utilisateur non-root, redémarrages de sécurité, chargement de secrets externes).

2. **Prérequis**  
   - Les fichiers de règles Rego dans le dossier [policy/](../policy) : [docker_compose.rego](../policy/docker_compose.rego) et [dockerfile.rego](../policy/dockerfile.rego).
   - Conftest installé localement (optionnel pour test) ou configuré dans GitHub Actions.

3. **Commande**  
   Pour tester localement vos fichiers de configuration par rapport à vos politiques :
   ```bash
   # Pour docker-compose.yml
   conftest test docker-compose.yml --policy policy/
   
   # Pour le Dockerfile
   conftest test Dockerfile --policy policy/
   ```
   Pour envoyer et valider dans la CI/CD :
   ```bash
   git add policy/ .github/workflows/conftest.yml docs/technicalFrontend.md README.md
   git commit -m "ci: intégrer Conftest pour le Policy-as-Code"
   git push origin dev
   ```

4. **Explication courte**  
   Le **Policy-as-Code** (PaC) permet de traduire vos chartes de gouvernance et de sécurité (GRC) sous forme de code exécutable. Conftest utilise le moteur OPA (Open Policy Agent) et le langage Rego pour analyser statiquement les fichiers JSON, YAML ou Dockerfile, renvoyant une erreur bloquante dans la CI si les critères de sécurité ne sont pas respectés.

   ### 📜 Charte de Gouvernance GRC & RGPD / CNIL du Projet

   Voici la charte de conformité mise en place pour le projet, combinant des règles d'organisation et des mécanismes de contrôle automatique ou manuel :

   #### A. Principes de Conformité des Données (CNIL & RGPD)

   *   **1. Minimisation des données et finalités documentées**
       *   *Référentiel* : RGPD Art. 5.1.b (Limitation des finalités), Art. 5.1.c (Minimisation), CNIL Guide Sécurité Fiche 2.
       *   *Règle* : Ne collecter que les données strictement nécessaires pour la finalité explicitée (contact, newsletter, commentaires, etc.). Documenter la finalité pour chaque champ de formulaire.
       *   *Contrôle* : Revue trimestrielle des formulaires et suppression des champs inutiles.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Amende administrative de la CNIL (jusqu'à 20 M€ ou 4 % du CA mondial) pour collecte disproportionnée.
           *   *Sécurité* : Augmentation inutile de la surface d'attaque ; en cas de fuite de données, la gravité de l'incident est démultipliée par le volume de données superflues compromises.
   *   **2. Transparence et informations**
       *   *Référentiel* : RGPD Art. 12, 13 et 14 (Obligation d'information), CNIL Modèles de mentions d'information.
       *   *Règle* : Publier une page « Politique de confidentialité » claire détaillant l'identité du responsable, les finalités, la base légale, la durée de conservation, les destinataires, le transfert hors UE éventuel et la procédure d’exercice des droits. Inclure les mentions d'information CNIL obligatoires sur chaque formulaire.
       *   *Contrôle* : Vérifier la présence et la lisibilité (mobile/desktop) avant la mise en production.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Sanctions CNIL pour traitement déloyal et opacité.
           *   *Sécurité* : Perte de réputation et de confiance des utilisateurs, rendant le site suspect et réduisant l'engagement.
   *   **3. Cookies et traceurs — consentement granularisé**
       *   *Référentiel* : Directive ePrivacy (Art. 5.3), RGPD Art. 7 (Consentement), Lignes directrices de la CNIL sur les cookies.
       *   *Règle* : Mettre en place un bandeau CMP qui bloque les traceurs non essentiels jusqu’au consentement (mesure d’audience non anonyme, publicité, boutons sociaux embarqués). Fournir un choix granularisé (tout accepter / tout refuser / configurer).
       *   *Contrôle* : Test automatique (CI) qui détecte les scripts tiers et signale s’ils sont injectés sans consentement.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Astreintes et amendes records de la CNIL (historiquement très ciblées sur les cookies non conformes).
           *   *Sécurité* : Fuites de données comportementales et pistage non consenti des utilisateurs par des tiers (GAFAM, régies publicitaires).
   *   **4. Droits des personnes (accès, rectification, suppression)**
       *   *Référentiel* : RGPD Art. 15 à 22 (Droits des personnes concernées), CNIL Fiche Exercice des droits.
       *   *Règle* : Exposer un moyen simple pour exercer ses droits (email dédié ou formulaire) et conserver un log d’action sécurisé (qui a demandé quoi, quand, et la réponse apportée).
       *   *Contrôle* : Procédure et SLA (délai légal de réponse de 1 mois maximum) ; test annuel sur cas factice.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Rappels à l'ordre et amendes pour non-respect des droits suite à des plaintes directes à la CNIL.
           *   *Sécurité* : Risque d'ingénierie sociale ; si l'identité du demandeur n'est pas rigoureusement vérifiée, divulgation involontaire de données à un usurpateur.
   *   **5. Durées de conservation et purge automatique**
       *   *Référentiel* : RGPD Art. 5.1.e (Limitation de la conservation), CNIL Guide pratique des durées de conservation.
       *   *Règle* : Définir des durées de conservation par type de données (ex. contact : 2 ans, newsletter : jusqu’à désabonnement) et implémenter un mécanisme de purge automatique des données expirées.
       *   *Contrôle* : Job automatisé (cron) qui purge et journalise les suppressions.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Condamnation CNIL classique pour conservation excessive ("droit à l'oubli" bafoué).
           *   *Sécurité* : Les données anciennes stockées indéfiniment augmentent l'impact d'une fuite lors d'une intrusion ultérieure.
   *   **6. Consentements pour newsletter / mailing**
       *   *Référentiel* : Directive ePrivacy Art. 13, Code des postes et des communications électroniques (Art. L.34-5), RGPD Art. 7.
       *   *Règle* : Opt‑in explicite et piste d’audit sur le consentement (qui, quand, comment). Possibilité de retrait simple dans chaque email (unsubscribe).
       *   *Contrôle* : Conserver la preuve de consentement et le log d’unsubscribe.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Poursuites pour prospection directe illicite et spamming de masse.
           *   *Sécurité* : Blocage/blacklistage IP et SMTP par les serveurs de messagerie (Google, Microsoft) pour réputation abusive.
   *   **7. Transferts hors UE et cookies tiers**
       *   *Référentiel* : RGPD Chapitre V (Transferts), Arrêt Schrems II de la CJUE, Clauses Contractuelles Types (SCC).
       *   *Règle* : Si utilisation de services hors UE (ex. analytics, CDN, plates‑formes), vérifier la conformité et les clauses contractuelles (SCC/garanties).
       *   *Contrôle* : Liste des fournisseurs et pays, revue annuelle.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Nullité des traitements et amendes pour transfert illicite vers un pays n'offrant pas de protection adéquate (ex. USA sans accord valide).
           *   *Sécurité* : Interception passive de données personnelles par des services de renseignement étrangers.
   *   **8. Traitement des données des mineurs**
       *   *Référentiel* : RGPD Art. 8 (Consentement des mineurs dans les services de l'information).
       *   *Règle* : Ne pas collecter de données de mineurs de moins de 15 ans sans vérification du consentement parental. Si le blog cible le grand public, préciser l’interdiction ou la politique de contrôle.
       *   *Contrôle* : Formulaire qui refuse la collecte de dates de naissance non requises.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Circonstance aggravante lors des contrôles CNIL (le mineur est considéré comme une personne particulièrement vulnérable).
           *   *Sécurité* : Exposition de mineurs à des risques d'usurpation d'identité ou de harcèlement en ligne.

   #### B. Sécurité & Hardening de l'Infrastructure

   *   **9. Sécurité des transferts et hébergement**
       *   *Référentiel* : RGPD Art. 32 (Sécurité des traitements), CNIL Guide Sécurité Fiches 3 (Chiffrement) et 10 (Flux réseau).
       *   *Règle* : Protocoles TLS partout, HSTS, désactivation des chiffrements obsolètes. Envoyer les emails sans y inclure d’informations sensibles. Limiter le stockage local d’informations personnelles. Documenter les sous-traitants (hébergeur, SMTP, analytics) et s’assurer de leurs garanties RGPD.
       *   *Contrôle* : Scan TLS régulier, revue des contrats et des prestations avec les prestataires.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Manquement grave à l'obligation réglementaire d'assurer la sécurité et l'intégrité des traitements.
           *   *Sécurité* : Interception passive des données en transit (*Man-in-the-Middle*), vol de jetons de session et interception de courriels confidentiels.
   *   **10. Journalisation et conservation minimale des logs**
       *   *Référentiel* : RGPD Art. 32, CNIL Guide Sécurité Fiche 14 (Tracer les événements).
       *   *Règle* : Logger uniquement les événements nécessaires pour la sécurité (connexion, erreurs), mais anonymiser/agréger ou tronquer les logs contenant des données personnelles (PII) ; définir une durée de conservation limitée pour les logs.
       *   *Contrôle* : Pipeline qui rédige/masque les PII, et mécanisme de rotation des logs.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Conservation abusive de données personnelles (les IPs sont des PII) au-delà des durées légales recommandées (souvent 1 an).
           *   *Sécurité* : Absence de logs (aveuglement en cas d'intrusion) ou, au contraire, logs contenant des données sensibles en clair (mots de passe, jetons) exploitables en cas d'accès non autorisé au serveur.
   *   **11. Gestion des incidents et notification**
       *   *Référentiel* : RGPD Art. 33 (Notification à l'autorité) et Art. 34 (Notification aux personnes concernées).
       *   *Règle* : Procédure d’incident claire (détection, confinement, évaluation, notification CNIL si nécessaire dans les 72h) et responsable identifié.
       *   *Contrôle* : Playbook d’incident, exercices annuels et template de notification CNIL.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Sanction autonome spécifique pour défaut de notification de violation dans le délai légal de 72 heures.
           *   *Sécurité* : Propagation incontrôlée d'une intrusion ou d'une fuite par manque de réactivité opérationnelle.
   *   **12. Registre des traitements (micro‑entreprise incluse)**
       *   *Référentiel* : RGPD Art. 30 (Registre des activités).
       *   *Règle* : Tenir un registre simple des traitements (finalité, base légale, durée, catégories de données, catégories de destinataires) pour la preuve de conformité.
       *   *Contrôle* : Garder le registre versionné dans votre dépôt (privé) et l’actualiser lors de modifications.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Incapacité de démontrer sa conformité (inversion de la charge de la preuve lors d'un contrôle de la CNIL).
           *   *Sécurité* : Méconnaissance de la cartographie des données, augmentant le risque d'oublier des systèmes ou serveurs non sécurisés.
   *   **13. Mesures techniques complémentaires (Hardening)**
       *   *Référentiel* : RGPD Art. 32, CNIL Guide Sécurité Fiche 8 (Sécuriser les canaux) et Fiche 12 (Protéger le site).
       *   *Règle* : Validation/filtrage des entrées (XSS/CSRF), intégration d’une CSP (Content Security Policy) stricte, protection contre les injections SQL, WAF basique, et corrections régulières des dépendances. Garder la base de données inaccessible depuis l’internet public (sous-réseau privé).
       *   *Contrôle* : Intégration de scanners SCA (dependencies), tests automatisés de sécurité (SAST), et exécution régulière d’un pentest ou audit ciblé.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Responsabilité civile et pénale engagée pour défaut flagrant de protection technique de l'hébergeur.
           *   *Sécurité* : Compromission totale du site web, défiguration, vol de cookies de session et vol complet des bases de données.
   *   **14. Gestion des secrets et accès (Hardening pratique)**
       *   *Référentiel* : RGPD Art. 32, CNIL Guide Sécurité Fiche 1 (Authentification) et Fiche 4 (Habilitations).
       *   *Règle* : Centraliser les secrets (Vault ou variables d'environnement sécurisées), rotation automatique. Aucun secret ne doit figurer dans le dépôt ou les logs de build. Authentification MFA obligatoire pour tous les accès administrateurs.
       *   *Contrôle* : CI qui refuse les commits contenant des secrets détectés (Gitleaks) et MFA imposé sur tous les accès.
       *   *Dangers si non appliqué* :
           *   *Juridique* : Non-respect de l'obligation de sécuriser les accès privilégiés aux données.
           *   *Sécurité* : Vol de comptes administrateurs, compromission du dépôt ou de la console d'administration, destruction ou chiffrement de l'infrastructure par ransomware.

   #### C. Priorités d'implémentation (Ordre conseillé)

   1.  **Phase 1 (Fondation Légale)** : Politique de confidentialité + mentions CNIL + page de contact sécurisée (Obligatoire).
   2.  **Phase 2 (Consentement)** : CMP (bandeau cookies) et blocage des traceurs non essentiels.
   3.  **Phase 3 (Gestion des données)** : Minimisation des données + durées de conservation + purge automatisée.
   4.  **Phase 4 (Sécurité réseau & hébergement)** : TLS + sous-réseau privé pour la base de données + rotation des secrets + MFA.
   5.  **Phase 5 (Gouvernance & Réponse)** : Journalisation anonymisée + registre des traitements + playbook incident.
   6.  **Phase 6 (Automatisation)** : Raccorder ces politiques à des règles Policy-as-Code (Conftest) supplémentaires dans la CI/CD pour refuser automatiquement les builds non conformes.

7. **Danger (si non réalisé)**  
   - > **Alerte Gouvernance :** Sans Policy-as-Code, des dérives de configuration non conformes aux chartes de l'entreprise (ex. : images Docker utilisant le tag `:latest`, secrets d'API hardcodés dans Docker Compose, ou licences non autorisées) peuvent être déployées en production sans aucun contrôle, entraînant des risques juridiques, de stabilité et de sécurité.

---

## Étape 13 : Pages de Veille et Lecture dédiée (veille.html, article.html)

1. **Objectif de l'étape**  
   Intégrer les pages de veille technologique (`veille.html`) et de lecture d'article (`article.html`), avec récupération dynamique depuis le CMS backend Strapi, repli automatique (fallback) sur des mocks locaux en cas de panne réseau ou de serveur hors-ligne, et valider le comportement via des tests unitaires Jest.

2. **Prérequis**  
   - Les pages [veille.html](../veille.html) et [article.html](../article.html) créées.
   - Les scripts [veille.js](../assets/JS/veille.js) et [article.js](../assets/JS/article.js) implémentant la logique.
   - Les tests unitaires correspondants écrits dans [tests/test.js](../tests/test.js).

3. **Commande**  
   Pour exécuter les tests unitaires et de comportement de la veille :
   ```bash
   npm test
   ```

4. **Explication courte**  
   Les pages de veille et de lecture chargent dynamiquement les articles depuis Strapi en utilisant l'API asynchrone `fetch()`. En cas d'indisponibilité du serveur (réseau coupé ou API en maintenance), un mécanisme de secours (fallback) prend le relais pour charger les articles locaux pré-mockés. Les tests Jest simulent ces comportements (succès API, échecs/404 de Strapi, paramètres d'URL invalides) pour garantir la résilience de l'IHM.

5. **Vérification du résultat**  
   Tous les tests associés doivent passer avec succès :
   ```text
   Veille Cyber Page (veille.js)
     √ generateVerticalVeilleArticleHTML devrait générer le HTML correct pour un article
     √ renderVeillePageArticles devrait afficher le loader puis injecter les articles
   Article Detail Page (article.js)
     √ renderError devrait injecter un message d'erreur stylisé
     √ renderArticleContent devrait injecter le contenu d'un article de type veille
     √ renderArticleContent devrait injecter le contenu d'un article de type briefing
     √ loadArticle devrait gérer les paramètres d'URL invalides et afficher une erreur
     √ loadArticle devrait charger un article valide de type veille depuis le mock si hors-ligne
   ```

6. **Notes et conseils supplémentaires**  
   - > **Bonne pratique :** Toujours valider la présence de paramètres requis (`id` et `type`) dans l'URL pour la page `article.html` afin d'éviter le chargement de données incohérentes ou des erreurs d'exécution JavaScript.

7. **Danger (si non réalisé)**  
   - > **Alerte Qualité & Résilience :** Sans tests unitaires pour la logique de secours et d'injection DOM, les pannes du CMS backend Strapi (ex. lors du déploiement ou d'une maintenance de l'API) peuvent se traduire par des pages blanches ou des crashs de script pour l'utilisateur final.






