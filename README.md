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

Le projet intègre des tests automatisés et unitaires pour valider la logique des scripts JavaScript (JS).

Pour lancer la totalité de la suite de tests, exécutez :

```bash
npm test

installer dans un premier temps node js puis npm. il se peut qu'au premier test tout plante, c'est normal il faut donc eteindre vscode puis le relancer et dans le terminal taper :
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
npm test

```

Pour lancer un test spécifique en particulier, exécutez :

```bash
npm test nom-du-test
```


## Feuille de route

- [x] **Core HTML/CSS/JS :** Structure globale du site (Accueil, Qui suis-je, Contact).
- [x] **Design Cyber & Mode Sombre :** Design futuriste adaptatif avec bouton de bascule dynamique (Light/Dark Mode) et persistance du choix.
- [x] **Système de Connexion (Simulé) :** Modale d'authentification interactive et gestion d'état de session utilisateur.
- [x] **Conformité & GRC :** Intégration des pages CGU, Mentions Légales, Politique de Confidentialité et Cookies.
- [x] **Gestion des Cookies (RGPD) :** Bandeau d'avertissement et panneau de configuration fine des consentements (essentiels, fonctionnels, analytiques).
- [x] **Automatisation :** Scripts Python de maintenance (correction des liens, encodage des accents, injection de composants).
- [x] **documentation des fonctions JS :** documentation des fonctions fonction métier/comportement via JSdoc . 
- [x] **Tests Automatisés :** Couverture de test (TDD) pour la logique JavaScript des cookies et des formulaires. le 19/06/2026 35 tests unitaires et comportementaux très solides dans [test.js](./tests/test.js) qui simulent le DOM. chaque test est associé au nom d'une fonction qui a ete documentée a l'etape precedente.
- [x] **CI/CD, Qualité & Sécurité (SAST) :** Intégration continue avec GitHub Actions exécutant les tests, la validation de syntaxe (ESLint), et l'audit de sécurité des dépendances (`npm audit`). Déploiement de l'analyse SAST avec GitHub CodeQL. 
- [x] **Signature des commits Git :** Configuration de Git pour signer numériquement chaque commit avec une clé SSH dédiée, garantissant l'authenticité et la non-répudiation (badge "Verified" sur GitHub).
- [x] **Secret Scanning local (Pre-commit & Gitleaks) :** Configuration d'un hook Git de pre-commit exécutant Gitleaks pour analyser le code localement à la recherche de secrets, clés d'API ou mots de passe avant chaque commit.
- [x] **Connexion du blog avec Strapi (Backend) :** Initialisation locale de l'instance Strapi, configuration des fichiers d'exclusion `.gitignore` pour sécuriser les clés secrètes et la base de données SQLite locale, définition des schémas de données (`Veille` et `Briefing`), et développement des requêtes d'API asynchrones dans le frontend avec système de repli (voir [technicalBackend.md](./backend/technicalBackend.md) pour les détails d'installation, de droits d'accès et de sécurité).
- [ ] **Tests E2E avec Playwright :** Installation et configuration de Playwright pour valider l'affichage réel des articles provenant de l'API Strapi dans un vrai navigateur.
- [ ] **Déploiement :** Configuration de la chaîne CI/CD et mise en ligne du site. 

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

