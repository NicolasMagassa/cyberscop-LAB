/**
 * @file tests/e2e/smoke.spec.js
 * @description Tests de fumée (Smoke Tests) basiques E2E pour CyberScope Lab.
 * Valide que la page d'accueil se charge correctement, contient le titre attendu
 * et affiche les principaux conteneurs visuels.
 */

const { test, expect } = require('@playwright/test');

/**
 * Suite principale de Smoke Tests pour la validation de surface de l'application
 */
test.describe('Smoke Tests - CyberScope Lab', () => {
  /**
   * Navigue vers la racine avant chaque test.
   */
  test.beforeEach(async ({ page }) => {
    // Navigue vers la page d'accueil servie par notre serveur local
    await page.goto('/');
  });

  /**
   * @test Chargement de la page d'accueil
   */
  test('devrait charger la page d\'accueil avec le bon titre', async ({ page }) => {
    // Vérifie le titre de la page
    await expect(page).toHaveTitle(/CyberScope Lab | Blog Cybersécurité/);
    
    // Vérifie que le titre principal est présent
    const mainHeader = page.locator('h1');
    await expect(mainHeader).toContainText('CyberScope Lab');
  });

  /**
   * @test Rendu des conteneurs principaux de la grille et du panel
   */
  test('devrait afficher les conteneurs principaux de veille et de briefing', async ({ page }) => {
    // Vérifie la présence de la grille de briefing
    const briefingGrid = page.locator('#briefing-grid');
    await expect(briefingGrid).toBeVisible();

    // Vérifie la présence du panneau de veille
    const veilleContainer = page.locator('#veille-container');
    await expect(veilleContainer).toBeVisible();
  });

  /**
   * @test Ouverture de la modale d'authentification
   */
  test('devrait ouvrir la modale de connexion au clic sur le bouton LOGIN', async ({ page }) => {
    // Vérifie que la modale est cachée au départ
    const loginModal = page.locator('#login-modal');
    await expect(loginModal).toBeHidden();

    // Trouve et clique sur le bouton LOGIN
    const loginBtn = page.locator('#btn-login-trigger');
    await expect(loginBtn).toBeVisible();
    await loginBtn.click();

    // Vérifie que la modale de connexion est désormais visible
    await expect(loginModal).toBeVisible();

    // Vérifie que le titre de la modale est correct
    const modalTitle = loginModal.locator('.text-gray-900.text-lg.font-bold');
    await expect(modalTitle).toContainText('CONNEXION SÉCURISÉE');
  });

  /**
   * @test Sécurité - Prévention XSS
   */
  test('devrait neutraliser les injections XSS dans l\'URL de la page Article', async ({ page }) => {
    // Naviguer sur la page article avec un payload XSS inoffensif dans l'URL
    const xssPayload = '<img src="invalid" onerror="document.body.dataset.xssTest=\'triggered\'">';
    await page.goto(`/article.html?type=abc&id=${encodeURIComponent(xssPayload)}`);

    // Attendre que le conteneur d'article s'affiche
    const content = page.locator('#article-content');
    await expect(content).toBeVisible();

    // Vérifier que le texte de l'erreur est visible
    const errorText = page.locator('.error-msg-text');
    await expect(errorText).toBeVisible();

    // Vérifier que le payload n'a pas été interprété (document.body.dataset.xssTest ne doit pas valoir 'triggered')
    const xssStatus = await page.evaluate(() => document.body.dataset.xssTest);
    expect(xssStatus).toBeUndefined();
  });
});
