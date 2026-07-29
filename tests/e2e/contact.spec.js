/**
 * @file tests/e2e/contact.spec.js
 * @description Suite de tests E2E avec Playwright pour le formulaire de contact.
 * Vérifie le comportement en succès, échecs (400, 429, 503, réseau), honeypot, CORS,
 * blocage double-clic, accessibilité aria-live et intégration réelle.
 */

const { test, expect } = require('@playwright/test');

test.describe('Formulaire de Contact E2E', () => {

    test.beforeEach(async ({ page }) => {
        // Configurer l'URL de base et injecter strapiBaseUrl pour cibler l'API locale
        await page.goto('/contact.html');
        await page.evaluate(() => {
            window.strapiBaseUrl = 'http://localhost:1337';
        });
    });

    /**
     * @test Le champ Honeypot website est bien configuré pour le masquage et l'inaccessibilité
     */
    test('Honeypot : le champ website doit être masqué, non accessible au clavier et invisible aux technologies d\'assistance', async ({ page }) => {
        const honeypotDiv = page.locator('div[aria-hidden="true"]').filter({ hasText: /Ne pas remplir ce champ/ });
        
        // Devrait être masqué en dehors de l'écran par css
        await expect(honeypotDiv).toHaveClass(/absolute -left-\[9999px\]/);
        
        const websiteInput = page.locator('#website');
        await expect(websiteInput).toHaveAttribute('tabindex', '-1');
        await expect(websiteInput).toHaveAttribute('autocomplete', 'off');
    });

    /**
     * @test Soumission valide avec reset de formulaire et message de réussite (200 OK)
     */
    test('Soumission valide : envoie les données, affiche le succès et réinitialise le formulaire après confirmation', async ({ page }) => {
        // Mock de la réponse 200 OK
        await page.route('**/api/contact', async (route) => {
            // Ajouter un délai pour tester l'état "en cours"
            await new Promise(resolve => setTimeout(resolve, 500));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, message: 'Message sent successfully' })
            });
        });

        const nameInput = page.locator('#name');
        const emailInput = page.locator('#email');
        const subjectSelect = page.locator('#subject');
        const messageInput = page.locator('#message');
        const submitBtn = page.locator('#submitBtn');
        const feedbackDiv = page.locator('#form-feedback');

        await nameInput.fill('Alice Liddell');
        await emailInput.fill('alice@wonderland.com');
        await subjectSelect.selectOption('collaboration');
        await messageInput.fill('Hello rabbit hole!');

        // Soumission
        await submitBtn.click();

        // Le bouton doit être désactivé pendant l'envoi (anti-double soumission)
        await expect(submitBtn).toBeDisabled();
        await expect(submitBtn).toHaveText(/Envoi en cours.../);

        // Attendre le succès
        await expect(feedbackDiv).toBeVisible();
        await expect(feedbackDiv).toHaveClass(/bg-green-50/);
        await expect(feedbackDiv).toHaveText(/Votre message a été envoyé avec succès/);
        await expect(feedbackDiv).toHaveAttribute('aria-live', 'polite');

        // Les champs doivent être réinitialisés après le succès
        await expect(nameInput).toHaveValue('');
        await expect(emailInput).toHaveValue('');
        await expect(subjectSelect).toHaveValue('');
        await expect(messageInput).toHaveValue('');

        // Le bouton doit être réactivé après traitement
        await expect(submitBtn).not.toBeDisabled();
    });

    /**
     * @test Réponse 400 Bad Request avec message d'erreur et conservation des valeurs saisies
     */
    test('Réponse 400 : affiche l\'erreur de validation et conserve les champs', async ({ page }) => {
        await page.route('**/api/contact', async (route) => {
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Erreur de validation des données.' })
            });
        });

        const nameInput = page.locator('#name');
        const emailInput = page.locator('#email');
        const subjectSelect = page.locator('#subject');
        const messageInput = page.locator('#message');
        const submitBtn = page.locator('#submitBtn');
        const feedbackDiv = page.locator('#form-feedback');

        await nameInput.fill('Alice Liddell');
        await emailInput.fill('alice@wonderland.com');
        await subjectSelect.selectOption('collaboration');
        await messageInput.fill('Hello rabbit hole!');

        await submitBtn.click();

        // Le message d'erreur doit s'afficher
        await expect(feedbackDiv).toBeVisible();
        await expect(feedbackDiv).toHaveClass(/bg-red-50/);
        await expect(feedbackDiv).toHaveText(/Erreur de validation des données/);

        // Les champs doivent être conservés
        await expect(nameInput).toHaveValue('Alice Liddell');
        await expect(emailInput).toHaveValue('alice@wonderland.com');
        await expect(messageInput).toHaveValue('Hello rabbit hole!');
        await expect(submitBtn).not.toBeDisabled();
    });

    /**
     * @test Réponse 429 Too Many Requests affichant la limitation et conservant les saisies
     */
    test('Réponse 429 : affiche la limitation de fréquence et conserve les champs', async ({ page }) => {
        await page.route('**/api/contact', async (route) => {
            await route.fulfill({
                status: 429,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Trop de requêtes.' })
            });
        });

        const nameInput = page.locator('#name');
        const feedbackDiv = page.locator('#form-feedback');
        const submitBtn = page.locator('#submitBtn');

        await nameInput.fill('Bob');
        await page.locator('#email').fill('bob@builder.com');
        await page.locator('#subject').selectOption('autre');
        await page.locator('#message').fill('Can we fix it?');

        await submitBtn.click();

        await expect(feedbackDiv).toBeVisible();
        await expect(feedbackDiv).toHaveClass(/bg-red-50/);
        await expect(feedbackDiv).toHaveText(/Trop de requêtes/);
        await expect(nameInput).toHaveValue('Bob');
        await expect(submitBtn).not.toBeDisabled();
    });

    /**
     * @test Réponse 503 Service Unavailable affichant l'indisponibilité et réactivant les contrôles
     */
    test('Réponse 503 : affiche l\'indisponibilité du service, conserve les champs et réactive le bouton', async ({ page }) => {
        await page.route('**/api/contact', async (route) => {
            await route.fulfill({
                status: 503,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Service temporairement indisponible' })
            });
        });

        const nameInput = page.locator('#name');
        const feedbackDiv = page.locator('#form-feedback');
        const submitBtn = page.locator('#submitBtn');

        await nameInput.fill('Charlie');
        await page.locator('#email').fill('charlie@factory.com');
        await page.locator('#subject').selectOption('question');
        await page.locator('#message').fill('Where is the golden ticket?');

        await submitBtn.click();

        await expect(feedbackDiv).toBeVisible();
        await expect(feedbackDiv).toHaveClass(/bg-red-50/);
        await expect(feedbackDiv).toHaveText(/momentanément indisponible/);
        await expect(nameInput).toHaveValue('Charlie');
        await expect(submitBtn).not.toBeDisabled();
    });

    /**
     * @test Erreur réseau (ex: indisponibilité DNS ou physique) avec rétention des saisies
     */
    test('Erreur Réseau : affiche l\'erreur de réseau, conserve les champs et réactive le bouton', async ({ page }) => {
        // Simuler un échec réseau (ex: serveur éteint)
        await page.route('**/api/contact', async (route) => {
            await route.abort('failed');
        });

        const nameInput = page.locator('#name');
        const feedbackDiv = page.locator('#form-feedback');
        const submitBtn = page.locator('#submitBtn');

        await nameInput.fill('David');
        await page.locator('#email').fill('david@bowie.com');
        await page.locator('#subject').selectOption('autre');
        await page.locator('#message').fill('Is there life on Mars?');

        await submitBtn.click();

        await expect(feedbackDiv).toBeVisible();
        await expect(feedbackDiv).toHaveClass(/bg-red-50/);
        await expect(feedbackDiv).toHaveText(/erreur réseau/);
        await expect(nameInput).toHaveValue('David');
        await expect(submitBtn).not.toBeDisabled();
    });

    /**
     * @test Blocage d'une double soumission réseau lors d'un double-clic rapide
     */
    test('Double soumission bloquée : soumettre deux fois n\'envoie qu\'une seule requête réseau', async ({ page }) => {
        let requestCount = 0;
        await page.route('**/api/contact', async (route) => {
            requestCount++;
            await new Promise(resolve => setTimeout(resolve, 800));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true })
            });
        });

        await page.locator('#name').fill('Eve');
        await page.locator('#email').fill('eve@apple.com');
        await page.locator('#subject').selectOption('collaboration');
        await page.locator('#message').fill('Bite the apple.');

        const submitBtn = page.locator('#submitBtn');
        
        // Double-clic rapide
        await submitBtn.click();
        try {
            await submitBtn.click({ force: true, timeout: 200 });
        } catch (e) {
            // Playwright peut jeter une erreur car le bouton est désactivé, ce qui est attendu
        }

        // Attendre que l'envoi se termine
        await expect(page.locator('#form-feedback')).toBeVisible();

        // Le compteur ne doit indiquer qu'une seule requête réseau reçue
        expect(requestCount).toBe(1);
    });

    /**
     * @test Contrôle des origines CORS (localhost:8000 autorisée vs evil.com refusée)
     */
    test('CORS : origine frontend autorisée et origine inconnue refusée', async ({ request }) => {
        // 1. Appel avec origine autorisée
        const responseAllowed = await request.post('http://localhost:1337/api/contact', {
            headers: {
                'Origin': 'http://localhost:8000',
                'Content-Type': 'application/json'
            },
            data: {}
        });
        const headersAllowed = responseAllowed.headers();
        expect(headersAllowed['access-control-allow-origin']).toBe('http://localhost:8000');

        // 2. Appel avec origine inconnue
        const responseDenied = await request.post('http://localhost:1337/api/contact', {
            headers: {
                'Origin': 'https://evil.com',
                'Content-Type': 'application/json'
            },
            data: {}
        });
        const headersDenied = responseDenied.headers();
        expect(headersDenied['access-control-allow-origin']).not.toBe('https://evil.com');
    });

    /**
     * @test Intégration physique réelle avec l'instance Strapi locale (sans dispatch courriel via honeypot)
     */
    test('Intégration réelle (Honeypot + Real Local Server) : envoie au vrai Strapi local sans courriel réel', async ({ page }) => {
        // Ce test n'intercepte pas la route **/api/contact, il communique avec le vrai serveur local !
        // Pour éviter d'envoyer un vrai e-mail, nous remplissons le honeypot (website) qui court-circuite l'envoi de mail.
        const nameInput = page.locator('#name');
        const emailInput = page.locator('#email');
        const subjectSelect = page.locator('#subject');
        const messageInput = page.locator('#message');
        const websiteInput = page.locator('#website');
        const submitBtn = page.locator('#submitBtn');
        const feedbackDiv = page.locator('#form-feedback');

        await nameInput.fill('Integration Bot');
        await emailInput.fill('integration@bot.com');
        await subjectSelect.selectOption('autre');
        await messageInput.fill('Testing real integration from Playwright E2E.');
        
        // Remplir le Honeypot pour éviter l'envoi réel d'e-mail
        await websiteInput.fill('http://spambot.com');

        await submitBtn.click();

        // Le serveur réel doit répondre 200 OK avec succès simulé
        await expect(feedbackDiv).toBeVisible();
        await expect(feedbackDiv).toHaveClass(/bg-green-50/);
        await expect(feedbackDiv).toHaveText(/Votre message a été envoyé avec succès/);
        
        // Le formulaire doit être vidé
        await expect(nameInput).toHaveValue('');
    });
});
