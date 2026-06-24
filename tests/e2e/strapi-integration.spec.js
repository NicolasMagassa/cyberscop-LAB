const { test, expect } = require('@playwright/test');

test.describe('Intégration Strapi & Fallback', () => {

  test('Mode Hors-ligne : devrait afficher les données simulées (mockées) si Strapi est inaccessible', async ({ page }) => {
    // Intercepter et bloquer tous les appels vers Strapi
    await page.route('**/api/veilles', route => route.abort('failed'));
    await page.route('**/api/briefings', route => route.abort('failed'));

    // Naviguer vers la page d'accueil
    await page.goto('/');

    // Attendre que la grille de briefings soit chargée
    const briefingGrid = page.locator('#briefing-grid');
    await expect(briefingGrid).toBeVisible();

    // Vérifier la présence d'un titre de briefing mocké connu
    const neonLockBriefing = briefingGrid.locator('h3', { hasText: "Analyse du Ransomware 'NeonLock'" });
    await expect(neonLockBriefing).toBeVisible();

    // Vérifier la présence d'un article de veille mocké connu dans le panel latéral
    const veilleContainer = page.locator('#veille-container');
    const firstVeilleTitle = veilleContainer.locator('h4', { hasText: "Deepfakes vocaux : Les CEO ciblés" });
    await expect(firstVeilleTitle).toBeVisible();
  });

  test('Mode Connecté (API Simulée) : devrait afficher les données reçues de l\'API Strapi', async ({ page }) => {
    // Mock de la réponse pour les veilles
    await page.route('**/api/veilles', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 10,
              date: "2026-06-24",
              title: "Alerte Sécurité E2E - Veille Réseau",
              description: "Menace critique identifiée en direct de l'API Strapi"
            }
          ]
        })
      });
    });

    // Mock de la réponse pour les briefings
    await page.route('**/api/briefings', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 20,
              date: "2026-06-24",
              title: "Briefing Spécial Playwright",
              description: "Validation de la connexion avec le CMS Strapi réussie.",
              category: "TESTING",
              views: 9999,
              theme: "green",
              icon: "shield-check"
            }
          ]
        })
      });
    });

    // Charger la page d'accueil
    await page.goto('/');

    // Vérifier que le briefing mocké de l'API est rendu sur la grille
    const briefingGrid = page.locator('#briefing-grid');
    const customBriefing = briefingGrid.locator('h3', { hasText: 'Briefing Spécial Playwright' });
    await expect(customBriefing).toBeVisible();

    // Vérifier la catégorie du briefing injecté (convertie en majuscules dans le template)
    const briefingCategory = briefingGrid.locator('span', { hasText: 'TESTING' });
    await expect(briefingCategory).toBeVisible();

    // Vérifier que l'article de veille mocké de l'API est rendu dans le conteneur de veille
    const veilleContainer = page.locator('#veille-container');
    const customVeille = veilleContainer.locator('h4', { hasText: 'Alerte Sécurité E2E - Veille Réseau' });
    await expect(customVeille).toBeVisible();
  });

  test('Mode Réel (Unmocked) : devrait se connecter au serveur Strapi local', async ({ request }) => {
    // Tente de requêter le serveur Strapi local (qui doit tourner en tâche de fond sur le port 1337)
    // Ce test valide que la connexion réseau entre le frontend (ou le runner) et le backend Strapi fonctionne.
    try {
      const response = await request.get('http://localhost:1337/api/briefings');
      // On s'attend à un statut 200 OK si Strapi est démarré et que les permissions publiques "find" sont configurées.
      // Si les permissions ne sont pas configurées, Strapi peut renvoyer un code 403.
      if (response.status() === 403) {
        console.warn("\n⚠️ AVERTISSEMENT : Connexion réussie à Strapi, mais accès INTERDIT (403).");
        console.warn("Veuillez activer les permissions publiques 'find' et 'findOne' dans l'administration Strapi (Settings > Roles > Public).\n");
      }
      expect([200, 403]).toContain(response.status());
    } catch (error) {
      console.error("\n❌ ERREUR DE CONNEXION : Le serveur backend Strapi ne répond pas sur http://localhost:1337.");
      console.error("Assurez-vous de lancer 'npm run dev' dans le dossier 'backend' avant d'exécuter ce test.\n");
      throw error;
    }
  });
});
