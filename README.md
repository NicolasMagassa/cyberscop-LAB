<div align="center">
  <img src="readmeai/assets/logos/purple.svg" width="30%" alt="Project Logo"/>

  # `CyberScope Lab`

  *Un laboratoire et portfolio technique dédié à la cybersécurité, la gouvernance (GRC), le cloud et la sécurité de l'IA.*

  *Développé avec les outils et technologies suivants :*

font-end
  HTML
  CSS
  JAVASCRIPT
  TAILWIND CSS
back-end
  PYTHON script (maintenance des liens) scripts Python autonomes conçus pour automatiser des modifications répétitives ou globales sur l'ensemble de tes pages HTML statiques.

  NODE JS
  NPM
</div>

---

## Table des matières
- [Présentation générale](#présentation-générale)
- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Prise en main](#prise-en-main)
  - [Prérequis](#prérequis)
  - [Installation & Lancement](#installation--lancement)
- [Utilisation](#utilisation)
- [Tests](#tests)
- [Feuille de route](#feuille-de-route)
- [Contribution](#contribution)
- [Licence](#licence)
- [Remerciements](#remerciements)

---

## Présentation générale
**CyberScope Lab** est un espace de travail personnel et une plateforme de démonstration de compétences axée sur la sécurité offensive, défensive et la gouvernance. Ce projet met en avant l'implémentation de normes de conformité (RGPD) et d'outils de veille dynamique au sein d'une architecture web moderne.

---

## Fonctionnalités

Voici les principales fonctionnalités de mon site web :
* **Page d'accueil (Index) :** Présentation globale du blog CyberScope Lab, affichage dynamique des briefings de sécurité et des flux de veille (grille d'articles et panneau latéral), bandeau défilant d'alertes en temps réel (Threat Ticker), formulaire d'inscription à la newsletter de veille et formulaire de connexion sécurisée.
* **Section Qui suis-je :** Présentation du profil ainsi que des objectifs pédagogiques et professionnels du blog (espace de travail personnel et de démonstration de compétences).
* **Formulaire de contact :** Formulaire sécurisé avec validation interactive côté client (nom, email, sujet et message), retours d'état visuels lors de l'envoi, accompagné des réseaux professionnels et d'une clé publique PGP pour les communications chiffrées.
* **Gestion de compte :** Espace sécurisé dédié permettant aux utilisateurs connectés de gérer leurs informations personnelles avec navigation dynamique par onglets.
* **Conformité & Sécurité (RGPD) :** Pages juridiques complètes (Mentions Légales, CGU, Politique de Confidentialité, Politique de Cookies) associées à un bandeau de consentement interactif et à un modal de gestion granulaire des cookies (essentiels, fonctionnels, analytiques).
* **Mode Sombre (Dark Mode) :** Sélecteur de thème dynamique permettant d'alterner instantanément entre l'interface claire (Light) et sombre (Dark/Cyber) avec sauvegarde persistante du choix de l'utilisateur (via `localStorage`).

---

## Structure du projet
```sh
└── /
    ├── 404.html
    ├── assets
    │   ├── CSS
    │   ├── images
    │   ├── img
    │   └── JS
    ├── CGU.html
    ├── contact.html
    ├── cookies.html
    ├── gerer_compte.html
    ├── index.html
    ├── mentions_legales.html
    ├── politique_confidentialite.html
    ├── qui_suis_je.html
    ├── README.md
    ├── README_cookies.md
    └── scratch
        ├── add_space_header.py
        ├── blend_logo.py
        ├── build_html.py
        ├── build_other_htmls.py
        ├── enlarge_logo.py
        ├── fix_accent.py
        ├── fix_dark_mode.py
        ├── fix_links.py
        ├── fix_visibility.py
        ├── implement_contact.py
        ├── implement_qui_suis_je.py
        ├── inject_modals.py
        ├── refactor_cms_cookies.py
        ├── remove_manifeste.py
        ├── rename_equipe.py
        ├── rename_nav_link.py
        ├── rename_save_btn.py
        ├── rename_sections.py
        ├── rename_veille_cyber.py
        ├── replace_logo.py
        ├── replace_logo_icon.py
        ├── replace_nav.py
        ├── swap_content.py
        ├── update_cgu.py
        ├── update_cookie_accept_class.py
        ├── update_cookie_advanced.py
        ├── update_cookie_close_logic.py
        ├── update_cookie_text.py
        ├── update_cookie_to_real_cookie.py
        ├── update_cookies.py
        ├── update_header_font.py
        ├── update_mentions.py
        └── update_privacy.py

		# Prise en main

## Prérequis

Pour afficher et travailler sur ce site, vous avez seulement besoin de :

- Un navigateur web moderne (Chrome, Firefox, Edge, Safari, etc.).
- Un éditeur de code (comme VS Code, Cursor ou Antigravity) si vous souhaitez modifier les fichiers.

## Installation & Lancement

### Cloner le dépôt Git

```bash
git clone https://github.com/NicolasMagassa/cyberscop-LAB.git
```

### Ouvrir le site (3 options au choix)

- **Option 1 :** Double-cliquez simplement sur le fichier `index.html` à la racine du projet pour l'ouvrir dans votre navigateur.
- **Option 2 :** Lancez-le via l'extension **Live Server** de votre éditeur de code.
- **Option 3 :** Lancez un serveur local Python rapide dans le dossier racine :

```bash
python -m http.server 8000
```

Puis ouvrez l'adresse `http://localhost:8000` dans votre navigateur.

## Utilisation

Pour tester ou modifier le site localement :

### Déplacez-vous dans le dossier du projet

```bash
cd cyberscop-LAB
```

Ouvrez ou modifiez les fichiers HTML/CSS/JS, ou utilisez les scripts Python de maintenance présents dans le dossier `scratch/` pour automatiser les tâches répétitives.

## Tests

Le projet intègre deux types de tests automatisés :

### 1. Tests unitaires et comportementaux (Jest)
Valident la logique JavaScript (cookies, formulaires) dans un DOM simulé. Pour exécuter :
```bash
npm test
```
*Note : sous Windows, en cas de blocage d'exécution de script dans PowerShell, vous pouvez autoriser temporairement en tapant : `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` puis relancer.*

### 2. Tests de bout en bout (Playwright)
Valident le rendu de la page d'accueil dans un navigateur réel et testent la connexion directe avec l'API Strapi (mode connecté, hors-ligne et réel). Pour exécuter :
```bash
npm run test:e2e
```
Pour plus de détails sur l'intégration et la validation front-back, consultez la section dédiée dans [technicalBackend.md](./docs/technicalBackend.md#-validation--tests-dintégration-playwright).


## Feuille de route

- [x] **Core HTML/CSS/JS :** Structure globale du site (Accueil, Qui suis-je, Contact).
- [x] **Design Cyber & Mode Sombre :** Design futuriste adaptatif avec bouton de bascule dynamique (Light/Dark Mode) et persistance du choix.
- [x] **Système de Connexion (Simulé) :** Modale d'authentification interactive et gestion d'état de session utilisateur.
- [x] **Conformité & GRC :** Intégration des pages CGU, Mentions Légales, Politique de Confidentialité et Cookies.
- [x] **Gestion des Cookies (RGPD) :** Bandeau d'avertissement et panneau de configuration fine des consentements (essentiels, fonctionnels, analytiques).
- [x] **Automatisation :** Scripts Python de maintenance (correction des liens, encodage des accents, injection de composants).
- [x] **documentation des fonctions JS :** documentation des fonctions fonction métier/comportement via JSdoc . 
- [x] **Tests Automatisés :** Couverture de test (TDD) pour la logique JavaScript des cookies et des formulaires. le 19/06/2026 35 tests unitaires et comportementaux très solides dans [test.js](./tests/test.js) qui simulent le DOM. chaque test est associé au nom d'une fonction qui a ete documentée a l'etape precedente.
- [x] **CI/CD, Qualité & Sécurité (SAST) :** Intégration continue avec GitHub Actions exécutant les tests (voir [Étape 1](./docs/technicalFrontend.md#étape-1--configuration-du-workflow-github-actions-pour-jest-test-tdd)), la validation de syntaxe (ESLint) (voir [Étape 2](./docs/technicalFrontend.md#étape-2--configuration-et-utilisation-deslint-linter)), et l'audit de sécurité des dépendances (`npm audit`) (voir [Étape 3](./docs/technicalFrontend.md#étape-3--audit-de-sécurité-des-dépendances-npm-audit-dans-la-ci)). Déploiement de l'analyse SAST avec GitHub CodeQL (voir [Étape 4](./docs/technicalFrontend.md#étape-4--analyse-sast-avec-github-codeql)) et Semgrep (voir [Étape 5](./docs/technicalFrontend.md#étape-5--analyse-sast-avec-semgrep)).
- [x] **Analyse SCA (Software Composition Analysis) :** Configuration de Dependance (Dependabot) pour surveiller les bibliothèques obsolètes et intégration de Trivy dans GitHub Actions pour bloquer la CI en cas de vulnérabilité critique ou haute à la racine (voir [Étape 6](./docs/technicalFrontend. md#étape-6--analyse-sca-software-composition-analysis-avec-trivy-et-dependabot)).
- [x] **Signature des commits Git :** Configuration de Git pour signer numériquement chaque commit avec une clé SSH dédiée, garantissant l'authenticité et la non-répudiation (voir [Étape 7](./docs/technicalFrontend.md#étape-7--signature-des-commits-git)).
- [x] **Secret Scanning local (Pre-commit & Gitleaks) :** Configuration d'un hook Git de pre-commit exécutant Gitleaks pour analyser le code localement à la recherche de secrets ou mots de passe (voir [Étape 8](./docs/technicalFrontend.md#étape-8--secret-scanning-local-avec-pre-commit-et-gitleaks)).
- [x] **Connexion du blog avec Strapi (Backend) :** Initialisation locale de l'instance Strapi, configuration des fichiers d'exclusion `.gitignore` pour sécuriser les secrets locaux, définition des schémas de données (`Veille` et `Briefing`), et requêtage API (voir [technicalBackend.md](./docs/technicalBackend.md) pour les détails).
- [x] **Pages de Veille et Lecture dédiée :** Création de la page liste `veille.html` (articles de veille les uns sous les autres avec lien "Lire =>>") et de la page de lecture complète `article.html` (lecture en grand format connectée à l'API Strapi ou fallback mock) et liaison avec le bouton `/VEILLE` global (voir [Étape 13](./docs/technicalFrontend.md#étape-13--pages-de-veille-et-lecture-dédiée-veillehtml-articlehtml)).
- [x] **Tests E2E avec Playwright :** Configuration et écriture de 6 tests E2E robustes validant le rendu réel, les modales et l'intégration Strapi en conditions réelles (voir [Étape 9](./docs/technicalFrontend.md#étape-9--tests-de-bout-en-bout-e2e-avec-playwright-et-validation-de-la-connexion-strapi)).
- [x] **Dockerisation & Scan IaC (Software Infrastructure Security) :** Création des configurations d'exécution isolées (Dockerfiles, Nginx sécurisé, Compose) et analyse de sécurité de l'IaC avec Trivy pour bloquer la CI/CD en cas de mauvaise configuration (voir [Étape 10](./docs/technicalFrontend.md#étape-10--analyse-de-la-sécurité-de-linfrastructure-iac-scanning-avec-trivy)).
- [x] **Génération de SBOM (Software Bill of Materials) :** Inventaire automatisé CycloneDX des dépendances logicielles et système à chaque build avec stockage comme artefact (voir [Étape 11](./docs/technicalFrontend.md#étape-11--génération-automatique-de-sbom-software-bill-of-materials-avec-trivy)).
- [x] **Policy-as-Code (Gouvernance automatisée) :** Intégration de Conftest (Open Policy Agent) pour valider automatiquement la conformité des configurations IaC et des Dockerfiles par rapport aux politiques d'entreprise (voir [Étape 12](./docs/technicalFrontend.md#étape-12--policy-as-code-validation-de-la-conformité-avec-conftest)).
- [ ] **Déploiement :** Configuration finale de la chaîne CI/CD et mise en ligne du site.

 

## Contribution

Les contributions, signalements de bogues ou suggestions d'amélioration sont les bienvenus !

1. **Forker le dépôt :** Créez une copie de ce projet sur votre propre compte GitHub.
2. **Cloner le projet localement :**

```bash
git clone https://github.com/NicolasMagassa/cyberscop-LAB.git
```

3. **Créer une nouvelle branche :** Travaillez toujours sur une nouvelle branche en lui donnant un nom descriptif :

```bash
git checkout -b feature/nouvelle-fonctionnalite
```

4. **Effectuer et valider vos modifications (Commit) :**

```bash
git commit -m 'Description claire de la modification'
```

5. **Pousser et soumettre une Pull Request :** Poussez vos modifications sur votre fork (`git push origin feature/nouvelle-fonctionnalite`) et créez une PR sur le dépôt principal.

## Licence

Ce projet est sous licence **MIT** – Libre d'utilisation pour l'apprentissage, sans aucune garantie ni responsabilité de l'auteur.

## Remerciements

Merci aux outils open-source qui ont facilité le développement et la maintenance automatisée de cette architecture.

