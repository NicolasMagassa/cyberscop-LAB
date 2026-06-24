const { test, expect } = require('@playwright/test');

test.describe('Smoke Tests - CyberScope Lab', () => {
  test.beforeEach(async ({ page }) => {
    // Navigue vers la page d'accueil servie par notre serveur local
    await page.goto('/');
  });

  test('devrait charger la page d\'accueil avec le bon titre', async ({ page }) => {
    // Vérifie le titre de la page
    await expect(page).toHaveTitle(/CyberScope Lab | Blog Cybersécurité/);
    
    // Vérifie que le titre principal est présent
    const mainHeader = page.locator('h1');
    await expect(mainHeader).toContainText('CyberScope Lab');
  });

  test('devrait afficher les conteneurs principaux de veille et de briefing', async ({ page }) => {
    // Vérifie la présence de la grille de briefing
    const briefingGrid = page.locator('#briefing-grid');
    await expect(briefingGrid).toBeVisible();

    // Vérifie la présence du panneau de veille
    const veilleContainer = page.locator('#veille-container');
    await expect(veilleContainer).toBeVisible();
  });

  test('devrait ouvrir la modale de connexion au clic sur le bouton LOGIN', async ({ page }) => {
    // Vérifie que la modale est cachée au départ
    const loginModal = page.locator('#login-modal');
    await expect(loginModal).toBeHidden();

    // Trouve et clique sur le bouton LOGIN_
    const loginBtn = page.locator('#btn-login-trigger');
    await expect(loginBtn).toBeVisible();
    await loginBtn.click();

    // Vérifie que la modale de connexion est désormais visible
    await expect(loginModal).toBeVisible();

    // Vérifie que le titre de la modale est correct
    const modalTitle = loginModal.locator('.text-gray-900.text-lg.font-bold');
    await expect(modalTitle).toContainText('CONNEXION SÉCURISÉE');
  });
});
