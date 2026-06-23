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
   - Avoir ajouté le fichier de configuration du workflow sous [.github/workflows/codeql.yml](../.github/workflows/codeql.yml).

3. **Commande**  
   Aucune commande locale n'est requise. Les étapes sont automatisées par GitHub Actions sur les serveurs de GitHub via le workflow :
   ```yaml
   # Déclenché à chaque push ou pull request sur dev/main
   uses: github/codeql-action/init@v3
   uses: github/codeql-action/analyze@v3
   ```

4. **Explication courte**  
   CodeQL analyse statiquement le code en créant une base de données logique de ton code, puis exécute des requêtes de sécurité complexes pour identifier des flux de données non sécurisés (ex: saisie utilisateur non nettoyée affichée directement).

5. **Vérification du résultat**  
   Rendez-vous dans l'onglet **Security** de votre dépôt GitHub, puis sous **Code scanning**. Vous y trouverez le rapport d'analyse détaillé ainsi que les éventuelles alertes trouvées.

6. **Notes et conseils supplémentaires**  
   - L'analyse est configurée pour scanner le code à chaque `push` ou `pull_request` sur les branches `dev` et `main`, ainsi que de manière planifiée une fois par semaine (cron).

7. **Danger (si non réalisé)**  
   > **Alerte Sécurité :** Sans analyse SAST (CodeQL), des vulnérabilités complexes écrites directement dans votre code (comme les failles XSS dues à une injection via `innerHTML`, ou des faiblesses cryptographiques) ne seront jamais détectées avant la mise en ligne, permettant à des pirates de cibler vos utilisateurs.

---

## Étape 5 : Signature des commits Git

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

## Étape 6 : Secret Scanning local avec pre-commit et Gitleaks

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
