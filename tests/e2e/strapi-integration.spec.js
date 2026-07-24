const { test, expect } = require('@playwright/test');

test.describe('Intégration Strapi & Fallback', () => {

  test('Mode Hors-ligne : devrait afficher les données simulées (mockées) si Strapi est inaccessible', async ({ page }) => {
    // Intercepter et bloquer tous les appels vers Strapi
    await page.route('**/api/veilles', route => route.abort('failed'));
    await page.route('**/api/ias', route => route.abort('failed'));
    await page.route('**/api/briefings', route => route.abort('failed'));

    // Naviguer vers la page d'accueil
    await page.goto('/');

    // Attendre que la grille de briefings soit chargée
    const briefingGrid = page.locator('#briefing-grid');
    await expect(briefingGrid).toBeVisible();

    // Vérifier la présence d'un titre de veille mocké connu dans le flux principal
    const firstVeilleTitle = briefingGrid.locator('h3', { hasText: "Deepfakes vocaux : Les CEO ciblés" });
    await expect(firstVeilleTitle).toBeVisible();

    // Vérifier la présence d'un article de veille IA mocké connu dans le panel latéral
    const veilleContainer = page.locator('#veille-container');
    const firstIAMenaceTitle = veilleContainer.locator('h4', { hasText: "Sécurisation des LLM : Les failles d'injection de prompts" });
    await expect(firstIAMenaceTitle).toBeVisible();
  });

  test('Mode Connecté (API Simulée) : devrait afficher les données reçues de l\'API Strapi', async ({ page }) => {
    // Mock de la réponse pour les veilles (grille principale)
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

    // Mock de la réponse pour les ias (panel latéral)
    await page.route('**/api/ias', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 15,
              date: "2026-06-24",
              title: "Alerte IA E2E",
              description: "Menace IA"
            }
          ]
        })
      });
    });

    // Charger la page d'accueil
    await page.goto('/');

    // Vérifier que la veille mockée de l'API est rendue sur la grille
    const briefingGrid = page.locator('#briefing-grid');
    const customVeille = briefingGrid.locator('h3', { hasText: 'Alerte Sécurité E2E - Veille Réseau' });
    await expect(customVeille).toBeVisible();

    // Vérifier que l'article de veille IA mocké de l'API est rendu dans le conteneur de veille IA
    const veilleContainer = page.locator('#veille-container');
    const customIA = veilleContainer.locator('h4', { hasText: 'Alerte IA E2E' });
    await expect(customIA).toBeVisible();
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
