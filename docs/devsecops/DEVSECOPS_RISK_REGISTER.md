# 📝 Registre des Risques de Sécurité (Risk Register) — CyberScope LAB

Ce registre détaille les risques de sécurité identifiés lors de l'audit du projet **CyberScope LAB**, évalués selon leur impact et leur probabilité.

---

## 1. Matrice d'Évaluation des Risques

```
Impact / Gravité
   ▲
 5 │ 
 4 │ [R-01]     [R-02]     [R-04]
 3 │            [R-03]
 2 │            [R-06]
 1 │                       [R-05]
   └──────────────────────────────►
     1          2          3     Probabilité
```

*   **Impact** : 1 (Négligeable) à 5 (Critique)
*   **Probabilité** : 1 (Faible) à 3 (Forte)

---

## 2. Description Détaillée des Risques

### 🔴 Risque R-01 : Faille Cross-Site Scripting (DOM XSS) sur la lecture d'article
*   **Description** : Injection de balises HTML ou scripts arbitraires via le titre ou la description de l'article provenant du CMS Strapi.
*   **Probabilité** : 1 (Nécessite d'avoir un accès administrateur Strapi pour modifier les articles).
*   **Impact** : 4 (Vol de session, usurpation, défiguration).
*   **Score de Risque** : **4/15** (Modéré)
*   **Mesure d'atténuation** : **Mitigé (US-01)**. Remplacement de `innerHTML` par `textContent` et application du filtre d'encodage d'entités HTML `escapeHTML` sur tous les champs dynamiques (titres, descriptions, messages d'erreurs).
*   **État** : **Atténué** (Commit: `5d3c47f0875bc0452a4e86b57c56c54b7151a773`).

### 🔴 Risque R-02 : Vol de session via stockage LocalStorage
*   **Description** : Le jeton JWT de l'agent connecté est stocké dans le `localStorage` (voir [mon-espace.js](file:///c:/Users/user/Desktop/developpeur/BLOG%20PERSO/cyberscop%20LAB/assets/JS/mon-espace.js)). En cas de faille XSS sur le site, le script injecté peut lire et exfiltrer le JWT immédiatement car il n'est pas protégé par le mécanisme `HttpOnly`.
*   **Probabilité** : 2 (Dépend de la présence d'une faille XSS comme R-01).
*   **Impact** : 4 (Compromission complète du compte utilisateur/agent).
*   **Score de Risque** : **8/15** (Élevé)
*   **Mesure d'atténuation** : Migrer le stockage du jeton de session vers des cookies sécurisés `HttpOnly; Secure; SameSite=Strict` (Phase 6).

### 🟡 Risque R-03 : Brute-force et déni de service sur l'authentification
*   **Description** : Absence de rate limiting en production sur les endpoints natifs de Strapi `/api/auth/local/*` (connexion, inscription, mot de passe oublié).
*   **Probabilité** : 2 (Attaque automatisée très courante).
*   **Impact** : 3 (Saturation de la base de données, corruption ou blocage de comptes).
*   **Score de Risque** : **6/15** (Modéré)
*   **Mesure d'atténuation** : Configurer la directive `limit_req` dans Nginx pour limiter à 5 requêtes par minute les routes d'authentification (Phase 6).

### 🔴 Risque R-04 : Exploitation de vulnérabilités connues dans les dépendances
*   **Description** : Présence de vulnérabilités dans le backend Strapi (tar, nodemailer, undici, sharp, ws).
*   **Probabilité** : 3 (Failles publiques documentées).
*   **Impact** : 4 (Déni de service, divulgation de fichiers, corruption de mémoire).
*   **Score de Risque** : **12/15** (Élevé)
*   **Mesure d'atténuation** : **En cours (US-02)**. Application progressive de corrections via overrides par sous-lots.
*   **État** : **Partiellement atténué** (Sous-lots A1 `undici`, A2 `sharp` et A3 `tar` résolus).

### 🟢 Risque R-05 : Usurpation d'identité et commits Git frauduleux
*   **Description** : L'auteur des commits Git n'est pas vérifié par clé cryptographique, permettant à un attaquant tiers ayant compromis le poste ou obtenu des accès d'écrire du code malveillant sous le nom de Nicolas Magassa.
*   **Probabilité** : 3 (Si aucun contrôle n'est imposé, n'importe qui peut configurer le nom et l'email dans git config).
*   **Impact** : 1 (Négligeable sur un dépôt individuel fermé, mais critique pour la réputation).
*   **Score de Risque** : **3/15** (Faible)
*   **Mesure d'atténuation** : Configurer les signatures SSH/GPG sur le poste et exiger des commits vérifiés sur la branche main (Phase 1).

### 🟢 Risque R-06 : Copie et vol de la base de données SQLite locale en clair
*   **Description** : La base de données `data.db` contenant les adresses e-mail des agents n'est pas chiffrée sur le serveur.
*   **Probabilité** : 2 (Nécessite un accès de lecture local au serveur de fichiers).
*   **Impact** : 2 (Divulgation d'adresses e-mail d'agents, non-conformité RGPD en cas de fuite).
*   **Score de Risque** : **4/15** (Faible)
*   **Mesure d'atténuation** : Restreindre strictement les droits du dossier `.tmp/` à l'utilisateur du conteneur `node`, et activer le chiffrement du disque hôte de production (Phase 6).
