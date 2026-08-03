/**
 * @file tests/e2e/account-deletion.spec.js
 * @description End-to-end tests for the account deletion feature.
 */

const { test, expect } = require('@playwright/test');

test.describe('Flux de suppression de compte (E2E)', () => {
  const fakeUser = {
    id: 101,
    username: 'DisposableUser',
    email: 'disposable@cyberscop.lab',
    confirmed: true,
    token: 'disposable-mock-jwt-token'
  };

  test.beforeEach(async ({ page }) => {
    // Mock de chargement des infos utilisateur
    await page.route('**/api/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 101,
          username: 'DisposableUser',
          email: 'disposable@cyberscop.lab',
          confirmed: true,
          createdAt: '2026-07-30T14:20:00.000Z'
        })
      });
    });
  });

  test('Validation IHM : le bouton ne doit s\'activer que si mot de passe saisi, texte SUPPRIMER écrit, et case cochée', async ({ page }) => {
    // Initialisation session
    await page.goto('/index.html');
    await page.evaluate((user) => {
      window.localStorage.setItem('cyberScopeUser', JSON.stringify(user));
    }, fakeUser);

    await page.goto('/mon-espace.html');

    // Cliquer sur le bouton de suppression pour ouvrir la modale
    await page.click('button:has-text("Supprimer mon compte")');

    const modal = page.locator('#delete-account-modal');
    await expect(modal).toBeVisible();

    const submitBtn = page.locator('#btn-delete-confirm-submit');
    const checkbox = page.locator('#delete-acknowledge-checkbox');
    await expect(submitBtn).toBeDisabled();

    // Saisir uniquement le mot de passe -> reste désactivé
    await page.fill('#delete-password-input', 'SecretPassword!');
    await expect(submitBtn).toBeDisabled();

    // Saisir la confirmation exacte sans checkbox -> reste désactivé
    await page.fill('#delete-confirm-input', 'SUPPRIMER');
    await expect(submitBtn).toBeDisabled();

    // Cocher la case -> bouton activé !
    await checkbox.check();
    await expect(submitBtn).toBeEnabled();

    // Décocher la case -> bouton désactivé !
    await checkbox.uncheck();
    await expect(submitBtn).toBeDisabled();

    // Recocher -> bouton activé !
    await checkbox.check();
    await expect(submitBtn).toBeEnabled();

    // Vider le mot de passe -> bouton désactivé !
    await page.fill('#delete-password-input', '');
    await expect(submitBtn).toBeDisabled();
  });

  test('Suppression réussie avec e-mail : nettoyage de session, redirection et message de succès vert', async ({ page }) => {
    // Mock de l'API de suppression de compte
    await page.route('**/api/account/delete', async (route) => {
      expect(route.request().method()).toBe('POST');
      const body = JSON.parse(route.request().postData());
      expect(body).toEqual({
        password: 'MyPassword123!',
        confirmText: 'SUPPRIMER',
        acknowledged: true
      });
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, emailSent: true })
      });
    });

    await page.goto('/index.html');
    await page.evaluate((user) => {
      window.localStorage.setItem('cyberScopeUser', JSON.stringify(user));
    }, fakeUser);

    await page.goto('/mon-espace.html');

    // Ouvrir modale et soumettre
    await page.click('button:has-text("Supprimer mon compte")');
    await page.fill('#delete-password-input', 'MyPassword123!');
    await page.fill('#delete-confirm-input', 'SUPPRIMER');
    await page.check('#delete-acknowledge-checkbox');
    await page.click('#btn-delete-confirm-submit');

    // Devrait rediriger vers l'accueil index.html
    await expect(page).toHaveURL(/.*index.html.*/);

    // Le paramètre URL account=deleted-email-ok doit être nettoyé immédiatement
    await expect(page).not.toHaveURL(/.*account=deleted-email-ok.*/);

    // La modale de connexion doit s'ouvrir automatiquement avec le message de succès vert
    const loginModal = page.locator('#login-modal');
    await expect(loginModal).toBeVisible();

    const authMessage = page.locator('#auth-message');
    await expect(authMessage).toBeVisible();
    await expect(authMessage).toHaveText('Votre compte a bien été supprimé. Un e-mail de confirmation vous a été envoyé.');
    await expect(authMessage).toHaveClass(/.*text-cyber-green.*/);

    // La session localStorage doit être effacée
    const session = await page.evaluate(() => window.localStorage.getItem('cyberScopeUser'));
    expect(session).toBeNull();
  });

  test('Suppression réussie avec échec de l\'e-mail : nettoyage de session, redirection et message de succès vert avec échec courriel', async ({ page }) => {
    // Mock de l'API de suppression de compte
    await page.route('**/api/account/delete', async (route) => {
      expect(route.request().method()).toBe('POST');
      const body = JSON.parse(route.request().postData());
      expect(body).toEqual({
        password: 'MyPassword123!',
        confirmText: 'SUPPRIMER',
        acknowledged: true
      });
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, emailSent: false })
      });
    });

    await page.goto('/index.html');
    await page.evaluate((user) => {
      window.localStorage.setItem('cyberScopeUser', JSON.stringify(user));
    }, fakeUser);

    await page.goto('/mon-espace.html');

    // Ouvrir modale et soumettre
    await page.click('button:has-text("Supprimer mon compte")');
    await page.fill('#delete-password-input', 'MyPassword123!');
    await page.fill('#delete-confirm-input', 'SUPPRIMER');
    await page.check('#delete-acknowledge-checkbox');
    await page.click('#btn-delete-confirm-submit');

    // Devrait rediriger vers l'accueil index.html
    await expect(page).toHaveURL(/.*index.html.*/);

    // Le paramètre URL account=deleted-email-fail doit être nettoyé immédiatement
    await expect(page).not.toHaveURL(/.*account=deleted-email-fail.*/);

    // La modale de connexion doit s'ouvrir automatiquement avec le message de succès vert
    const loginModal = page.locator('#login-modal');
    await expect(loginModal).toBeVisible();

    const authMessage = page.locator('#auth-message');
    await expect(authMessage).toBeVisible();
    await expect(authMessage).toHaveText('Votre compte a bien été supprimé, mais l’e-mail de confirmation n’a pas pu être envoyé.');
    await expect(authMessage).toHaveClass(/.*text-cyber-green.*/);

    // La session localStorage doit être effacée
    const session = await page.evaluate(() => window.localStorage.getItem('cyberScopeUser'));
    expect(session).toBeNull();
  });

  test('Échec de la suppression : affichage de l\'erreur, mot de passe vidé et session conservée', async ({ page }) => {
    // Mock de l'API retournant une erreur
    await page.route('**/api/account/delete', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: { message: 'Mot de passe incorrect.' }
        })
      });
    });

    await page.goto('/index.html');
    await page.evaluate((user) => {
      window.localStorage.setItem('cyberScopeUser', JSON.stringify(user));
    }, fakeUser);

    await page.goto('/mon-espace.html');

    await page.click('button:has-text("Supprimer mon compte")');
    await page.fill('#delete-password-input', 'WrongPassword!');
    await page.fill('#delete-confirm-input', 'SUPPRIMER');
    await page.check('#delete-acknowledge-checkbox');
    await page.click('#btn-delete-confirm-submit');

    // Pas de redirection
    await expect(page).toHaveURL(/.*mon-espace.html/);

    // Message d'erreur visible dans la modale
    const errorDiv = page.locator('#delete-account-error');
    await expect(errorDiv).toBeVisible();
    await expect(errorDiv).toHaveText('Mot de passe incorrect.');

    // Mot de passe vidé
    const pwdValue = await page.locator('#delete-password-input').inputValue();
    expect(pwdValue).toBe('');

    // Session conservée dans le localStorage
    const session = await page.evaluate(() => window.localStorage.getItem('cyberScopeUser'));
    expect(session).not.toBeNull();
  });
});
