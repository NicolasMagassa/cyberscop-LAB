# 🛠️ Décisions d'Outillage DevSecOps — CyberScope LAB

Ce document analyse la pertinence des outils recommandés dans le document de référence par rapport à l'architecture réelle (GitHub Pages pour le frontend, instance Strapi Node.js/SQLite unique pour le backend).

## Tableau d'Analyse Comparative et Décisions

| Outil | But | Déjà Présent | Pertinent Maintenant | Pertinent Plus Tard | Non Pertinent | Alternative Gratuite | Coût / Complexité | Décision Recommandée | Rationale |
|---|---|---|---|---|---|---|---|---|---|
| **Gitleaks** | Scan de secrets local et historique | **Oui** | **Oui** | - | - | - (Déjà actif) | Faible | **Conserver** | Déjà configuré en pre-commit. Bloque les fuites à la source. |
| **TruffleHog** | Scan de secrets actif (appels API) | Non | Non | **Oui** | - | Gitleaks (Local) | Moyen | **Différer** | Gitleaks suffit pour la taille actuelle du dépôt. |
| **Semgrep** | Scan SAST léger et rapide | **Oui** | **Oui** | - | - | - (Déjà actif) | Faible | **Conserver** | Intégration CI très rapide pour le JS/Node. |
| **SonarLint** | Analyse qualité/sécurité dans l'IDE | Non | **Oui** | - | - | Extension VS Code | Faible | **Intégrer** | Aide le développeur en temps réel directement dans son éditeur. |
| **SonarQube** | Analyse qualité/sécurité centralisée | Non | Non | Non | **Oui** | CodeQL (CI) | Élevé | **Exclure** | Trop lourd. CodeQL et Semgrep couvrent déjà ces aspects dans la CI. |
| **CodeQL** | SAST sémantique et analyse de flux | **Oui** | **Oui** | - | - | - (Déjà actif) | Faible (Gratuit) | **Conserver** | Outil natif GitHub extrêmement performant pour le JS. |
| **npm audit** | Analyse de vulnérabilités dépendances (SCA) | **Oui** | **Oui** | - | - | - (Déjà actif) | Faible | **Conserver** | Indispensable pour garder à jour l'écosystème Node.js. |
| **Dependabot** | Mises à jour automatisées de dépendances | Non | **Oui** | - | - | - (Intégré GitHub) | Faible | **Intégrer** | Automatise la création de Pull Requests de sécurité (Phase 3). |
| **Snyk** | Plateforme SCA / SAST unifiée | Non | Non | Non | **Oui** | Trivy / npm audit | Moyen (Payant) | **Exclure** | Fait doublon avec les outils gratuits déjà en place. |
| **Trivy** | Scan SCA, IaC Docker et génération SBOM | **Oui** | **Oui** | - | - | - (Déjà actif) | Faible | **Conserver** | Outil polyvalent qui gère l'IaC et génère le SBOM. |
| **Syft** | Génération de SBOM | Non | Non | Non | **Oui** | Trivy (SCA/SBOM) | Faible | **Exclure** | Doublon inutile car Trivy génère déjà le SBOM au format CycloneDX. |
| **CycloneDX** | Format standardisé de SBOM | **Oui** | **Oui** | - | - | Format de Trivy | Faible | **Conserver** | Format ouvert idéal pour la gouvernance logicielle. |
| **Checkov** | Scan statique d'IaC (Terraform, K8s) | Non | Non | Non | **Oui** | Conftest (OPA) | Moyen | **Exclure** | Inutile car le projet n'utilise pas Terraform/K8s. Conftest suffit pour Docker. |
| **Conftest** | Policy-as-Code pour Docker/Compose | **Oui** | **Oui** | - | - | - (Déjà actif) | Faible | **Conserver** | Valide nos Dockerfiles locaux par rapport à nos politiques non-root. |
| **Docker** | Conteneurisation de l'application | **Oui** | **Oui** | - | - | - (Déjà actif) | Faible | **Conserver** | Permet d'isoler le frontend et le backend de façon reproductible. |
| **OWASP ZAP** | Scan de vulnérabilités dynamique (DAST) | Non | Non | **Oui** | - | ZAP Baseline | Moyen | **Différer** | Nécessite un environnement de staging ou de test isolé (Phase 5). |
| **Nuclei** | Scanner de vulnérabilités réseau/API | Non | Non | **Oui** | - | Nuclei Engine | Moyen | **Différer** | Utile pour des scans ciblés post-déploiement (Phase 5). |
| **42Crunch** | Sécurité et audit de contrat API | Non | Non | Non | **Oui** | ZAP / Playwright | Élevé | **Exclure** | Outil payant et trop complexe pour l'API minimaliste actuelle. |
| **Cosign** | Signature cryptographique d'images Docker | Non | Non | **Oui** | - | Cosign Open | Moyen | **Différer** | Pertinent uniquement lors du déploiement final en production (Phase 4). |
| **DefectDojo** | Gestion centralisée des vulnérabilités | Non | Non | Non | **Oui** | Onglet Security GitHub | Élevé | **Exclure** | Beaucoup trop lourd pour ce projet (nécessite son propre serveur). |
| **AppSensor** | Détection d'anomalies applicatives | Non | Non | Non | **Oui** | Logs applicatifs | Élevé | **Exclure** | Complexe à intégrer. Préférer un bon rate limiting et un monitoring de base. |
| **Wiz / Prowler** | Gestion de la posture cloud (CSPM) | Non | Non | Non | **Oui** | - | Élevé | **Exclure** | Utile uniquement pour de grandes infrastructures AWS/Azure/GCP. |
| **Falco / Tetragon** | Détection d'intrusions à l'exécution (eBPF) | Non | Non | Non | **Oui** | - | Élevé | **Exclure** | Outils spécifiques à des clusters Kubernetes (K8s). |
| **Imperva RASP** | Auto-protection à l'exécution (RASP) | Non | Non | Non | **Oui** | - | Élevé | **Exclure** | Solution propriétaire trop lourde pour une instance Strapi isolée. |

---

## Décisions Spécifiques de Phase 0

### US-01 — Sécurisation du Rendu Frontend (DOM XSS)
*   **Décision** : **Développement d'un helper natif d'échappement HTML (`escapeHTML`)** et usage de **`textContent`** plutôt que d'intégrer la dépendance tierce **DOMPurify**.
*   **Rationale** : Les données du CMS (titres, descriptions) sont des chaînes textuelles simples et non du HTML riche. L'usage d'outils tiers augmenterait la surface d'attaque de la chaîne d'approvisionnement (Supply Chain) sans bénéfice technique.

### US-02 — Vulnérabilités de Dépendances (SCA)
*   **Décision** : **Exclusion des outils automatiques (`npm audit fix --force`) et remédiation progressive par petits lots contrôlés**.
*   **Rationale** : Une correction automatique (`npm audit fix --force`) détruirait la structure de compatibilité de Strapi v5.48.1 en forçant des rétrogradations vers des versions obsolètes incompatibles avec les extensions et le patch de traduction du mot de passe. L'outillage existant (`npm audit` et `npm outdated` sous forme de scripts) est conservé et intégré à la CI.

