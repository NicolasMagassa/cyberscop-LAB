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

## Étape 1 : Configuration du Workflow GitHub Actions pour Jest

1. **Objectif de l'étape**  
   Mettre en place l'intégration continue (CI) avec GitHub Actions pour exécuter automatiquement les 35 tests Jest lors de chaque `push` ou `pull_request` sur les branches `dev` et `main`.

2. **Prérequis**  
   - Les dépendances de test configurées dans le fichier [package.json](../package.json)
   - Un fichier [package-lock.json](../package-lock.json) à jour à la racine
   - Les tests écrits dans [tests/test.js](../tests/test.js)
   - Un dépôt distant configuré sur GitHub

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
