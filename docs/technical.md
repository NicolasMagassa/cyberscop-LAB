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
   - Les dépendances de test configurées dans le fichier [package.json](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/package.json).
   - Un fichier [package-lock.json](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/package-lock.json) à jour à la racine.
   - Les tests écrits dans [test.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/tests/test.js).
   - Un dépôt distant configuré sur GitHub.

3. **Commande**  
   Créez le fichier de configuration du workflow sous [.github/workflows/jest.yml](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/.github/workflows/jest.yml) avec la configuration souhaitée, puis envoyez les modifications :

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
   - Nous utilisons `npm ci` au lieu de `npm install` car cette commande est optimisée pour les environnements de CI : elle est plus rapide, plus stricte et échoue si le fichier `package-lock.json` n'est pas synchronisé avec `package.json`.
