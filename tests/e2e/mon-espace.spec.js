/**
 * @file tests/e2e/mon-espace.spec.js
 * @description Suite de tests d'intégration E2E avec Playwright pour l'espace utilisateur.
 * Vérifie la redirection automatique des accès anonymes, l'authentification simulée,
 * l'affichage du profil, la modification du mot de passe avec renouvellement du JWT,
 * et le flux de déconnexion.
 */

const { test, expect } = require('@playwright/test');

/**
 * Suite principale E2E pour l'Espace Personnel Sécurisé
 */
test.describe('Espace Utilisateur Sécurisé (Mon Espace)', () => {

    /**
     * @test Redirection automatique des utilisateurs anonymes
     */
    test('Redirection automatique : l\'accès anonyme à mon-espace.html redirige vers index.html?auth=required', async ({ page }) => {
        // Tenter d'accéder directement à la page protégée
        await page.goto('/mon-espace.html');

        // Devrait être redirigé vers l'accueil (le paramètre d'URL auth=required est immédiatement nettoyé)
        await expect(page).toHaveURL(/.*index.html/);

        // La modale de connexion doit être visible
        const loginModal = page.locator('#login-modal');
        await expect(loginModal).toBeVisible();

        // Le message d'erreur d'authentification doit être affiché
        const authMessage = page.locator('#auth-message');
        await expect(authMessage).toBeVisible();
        await expect(authMessage).toHaveText('CONNEXION REQUISE POUR ACCÉDER À CET ESPACE.');
    });

    /**
     * @test Rendu des informations utilisateur et modification de mot de passe réussie
     */
    test('Affichage des détails du compte et modification de mot de passe réussie', async ({ page }) => {
        // Préparer une session simulée
        const initialUser = {
            id: 42,
            username: 'SysadminTest',
            email: 'admin-test@cyberscop.lab',
            confirmed: true,
            token: 'mock-initial-jwt-token'
        };

        // Mocks API Strapi
        // 1. Mock de GET /api/users/me avec le token initial
        await page.route('**/api/users/me', async (route) => {
            const headers = route.request().headers();
            const authHeader = headers['authorization'];

            if (authHeader === 'Bearer mock-initial-jwt-token') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: 42,
                        username: 'SysadminTest',
                        email: 'admin-test@cyberscop.lab',
                        confirmed: true,
                        createdAt: '2026-07-29T10:15:30.000Z'
                    })
                });
            } else if (authHeader === 'Bearer mock-new-jwt-token') {
                // Validation du nouveau token après changement de mot de passe
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: 42,
                        username: 'SysadminTest',
                        email: 'admin-test@cyberscop.lab',
                        confirmed: true,
                        createdAt: '2026-07-29T10:15:30.000Z'
                    })
                });
            } else {
                await route.fulfill({ status: 401 });
            }
        });

        // 2. Mock de POST /api/auth/change-password
        await page.route('**/api/auth/change-password', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    jwt: 'mock-new-jwt-token'
                })
            });
        });

        // Naviguer d'abord vers l'accueil pour initialiser le localStorage sans script d'initialisation persistant
        await page.goto('/index.html');
        await page.evaluate((user) => {
            window.localStorage.setItem('cyberScopeUser', JSON.stringify(user));
        }, initialUser);

        // Accéder à mon-espace.html
        await page.goto('/mon-espace.html');

        // Vérifier l'en-tête de bienvenue
        const welcomeText = page.locator('#user-display-welcome');
        await expect(welcomeText).toHaveText('SysadminTest');

        // Vérifier les informations du compte affichées
        const usernameVal = page.locator('#user-username');
        await expect(usernameVal).toHaveText('SysadminTest');

        const emailVal = page.locator('#user-email');
        await expect(emailVal).toHaveText('admin-test@cyberscop.lab');

        const confirmedVal = page.locator('#user-confirmed');
        await expect(confirmedVal).toHaveText('Adresse e-mail confirmée');

        const createdVal = page.locator('#user-created');
        // Date formatée fr-FR : 29/07/2026
        await expect(createdVal).toHaveText(/29\/07\/2026/);

        // Remplir le formulaire de changement de mot de passe
        await page.fill('#current-password-input', 'OldPassword123!');
        await page.fill('#new-password-input', 'NewPassword123!');
        await page.fill('#confirm-password-input', 'NewPassword123!');

        // Soumettre le formulaire
        await page.click('#btn-submit-password');

        // Attendre le message de succès
        const successDiv = page.locator('#change-password-success');
        await expect(successDiv).toBeVisible();
        await expect(successDiv).toHaveText('Mot de passe modifié avec succès.');

        // Les champs de mot de passe doivent être vidés
        await expect(page.locator('#current-password-input')).toHaveValue('');
        await expect(page.locator('#new-password-input')).toHaveValue('');
        await expect(page.locator('#confirm-password-input')).toHaveValue('');

        // Vérifier que la session a été mise à jour avec le nouveau token dans le localStorage
        const updatedUserJson = await page.evaluate(() => window.localStorage.getItem('cyberScopeUser'));
        const updatedUser = JSON.parse(updatedUserJson);
        expect(updatedUser.token).toBe('mock-new-jwt-token');
    });

    /**
     * @test Déconnexion de l'utilisateur
     */
    test('Déconnexion utilisateur depuis mon-espace.html', async ({ page }) => {
        const fakeUser = {
            id: 42,
            username: 'SysadminTest',
            email: 'admin-test@cyberscop.lab',
            confirmed: true,
            token: 'mock-jwt-token'
        };

        // Mock GET /api/users/me
        await page.route('**/api/users/me', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 42,
                    username: 'SysadminTest',
                    email: 'admin-test@cyberscop.lab',
                    confirmed: true,
                    createdAt: '2026-07-29T10:15:30.000Z'
                })
            });
        });

        // Naviguer d'abord vers l'accueil pour initialiser le localStorage sans script d'initialisation persistant
        await page.goto('/index.html');
        await page.evaluate((user) => {
            window.localStorage.setItem('cyberScopeUser', JSON.stringify(user));
        }, fakeUser);

        await page.goto('/mon-espace.html');

        // Cliquer sur le bouton de déconnexion
        await page.click('#btn-espace-logout');

        // Devrait être redirigé vers l'accueil index.html
        await expect(page).toHaveURL(/.*index.html/);

        // La session localStorage doit être effacée
        const userSession = await page.evaluate(() => window.localStorage.getItem('cyberScopeUser'));
        expect(userSession).toBeNull();
    });
});
