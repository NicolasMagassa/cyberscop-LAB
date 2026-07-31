/**
 * @file tests/backend-password-policy.integration.test.js
 * @description Integration tests for backend password policy validations,
 * functional authentication checks, and validation error safety.
 */

const sqlite = require('../backend/node_modules/better-sqlite3');
const path = require('path');
const fs = require('fs');

describe('Backend Password Policy & Auth Integration Tests', () => {
    let db;
    let registeredUsername;
    let registeredEmail;

    beforeAll(() => {
        // Connect to the SQLite database
        const dbPath = path.resolve(__dirname, '../backend/.tmp/data.db');
        db = sqlite(dbPath);
    });

    afterAll(() => {
        if (db) {
            db.close();
        }
    });

    beforeEach(() => {
        const rand = Math.random().toString(36).substring(7);
        registeredUsername = `int_user_${rand}`;
        registeredEmail = `int_user_${rand}@cyberscop.lab`;
    });

    // Helper to get all error messages from a validation error response
    const getErrorMessages = (data) => {
        if (!data || !data.error) return [];
        const details = data.error.details;
        if (details && Array.isArray(details.errors)) {
            return details.errors.map(e => e.message);
        }
        return [data.error.message];
    };

    // 1. Policy validation on /api/auth/local/register
    describe('Registration Endpoint Validation', () => {
        test('Should refuse 11 Unicode code points (too short)', async () => {
            const res = await fetch('http://127.0.0.1:1337/api/auth/local/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: registeredUsername,
                    email: registeredEmail,
                    password: '12345678901' // 11 code points
                })
            });
            const data = await res.json();
            expect(res.status).toBe(400);
            expect(data.error.name).toBe('ValidationError');
            
            const errs = getErrorMessages(data);
            expect(errs.some(m => m.includes('Le mot de passe doit contenir au moins 12 caractères.'))).toBe(true);
            expect(data.error.message).not.toContain('12345678901');
        });

        test('Should accept 12 Unicode code points', async () => {
            const res = await fetch('http://127.0.0.1:1337/api/auth/local/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: registeredUsername,
                    email: registeredEmail,
                    password: '123456789012' // 12 code points
                })
            });
            const data = await res.json();
            expect(res.status).toBe(200);
            expect(data.user).toBeDefined();
        });

        test('Should refuse 19 emojis 💻 (19 code points, 76 bytes - too long)', async () => {
            const res = await fetch('http://127.0.0.1:1337/api/auth/local/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: registeredUsername,
                    email: registeredEmail,
                    password: '💻'.repeat(19) // 76 bytes
                })
            });
            const data = await res.json();
            expect(res.status).toBe(400);
            
            const errs = getErrorMessages(data);
            expect(errs.some(m => m.includes('Le mot de passe ne doit pas dépasser la limite technique de 72 octets.'))).toBe(true);
            expect(data.error.message).not.toContain('💻');
        });

        test('Should accept 18 emojis 💻 (18 code points, 72 bytes - valid max)', async () => {
            const res = await fetch('http://127.0.0.1:1337/api/auth/local/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: registeredUsername,
                    email: registeredEmail,
                    password: '💻'.repeat(18) // 72 bytes
                })
            });
            const data = await res.json();
            expect(res.status).toBe(200);
            expect(data.user).toBeDefined();
        });

        test('Should refuse password composed only of spaces', async () => {
            const res = await fetch('http://127.0.0.1:1337/api/auth/local/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: registeredUsername,
                    email: registeredEmail,
                    password: '            ' // 12 spaces
                })
            });
            const data = await res.json();
            expect(res.status).toBe(400);
            
            const errs = getErrorMessages(data);
            expect(errs.some(m => m.includes("Le mot de passe ne peut pas être composé uniquement d'espaces."))).toBe(true);
        });
    });

    // 2. Functional Authentication Checks (exact matching, spaces added/removed, Unicode variation)
    describe('Functional Authentication Checks', () => {
        const passwordExact = 'pâsswôrd_éàê_123';
        const passwordWithLeadingSpace = ' pâsswôrd_éàê_123';
        const passwordWithTrailingSpace = 'pâsswôrd_éàê_123 ';
        const passwordNFD = 'pa\u0302sswo\u0302rd_e\u0301a\u0300e\u0302_123'; // NFD decomposition of accented chars

        beforeEach(async () => {
            // Register a user with exact password (NFC format)
            await fetch('http://127.0.0.1:1337/api/auth/local/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: registeredUsername,
                    email: registeredEmail,
                    password: passwordExact
                })
            });
            
            // Confirm the user in the SQLite database so login works
            db.prepare('UPDATE up_users SET confirmed = 1 WHERE email = ?').run(registeredEmail);
        });

        test('Authentication succeeds with exact password', async () => {
            const res = await fetch('http://127.0.0.1:1337/api/auth/local', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: registeredEmail,
                    password: passwordExact
                })
            });
            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.jwt).toBeDefined();
        });

        test('Authentication fails when space is added/removed', async () => {
            // Test with leading space
            const resLeading = await fetch('http://127.0.0.1:1337/api/auth/local', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: registeredEmail,
                    password: passwordWithLeadingSpace
                })
            });
            expect(resLeading.status).toBe(400);

            // Test with trailing space
            const resTrailing = await fetch('http://127.0.0.1:1337/api/auth/local', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: registeredEmail,
                    password: passwordWithTrailingSpace
                })
            });
            expect(resTrailing.status).toBe(400);
        });

        test('Authentication fails with different Unicode variation (NFD instead of NFC)', async () => {
            const resNFD = await fetch('http://127.0.0.1:1337/api/auth/local', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: registeredEmail,
                    password: passwordNFD
                })
            });
            expect(resNFD.status).toBe(400);
        });
    });

    // 3. Endpoint /api/auth/change-password
    describe('Change Password Endpoint Validation', () => {
        let jwtToken;
        const currentPassword = 'validPassword123';

        beforeEach(async () => {
            await fetch('http://127.0.0.1:1337/api/auth/local/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: registeredUsername,
                    email: registeredEmail,
                    password: currentPassword
                })
            });

            // Confirm user in DB
            db.prepare('UPDATE up_users SET confirmed = 1 WHERE email = ?').run(registeredEmail);

            // Login to get valid JWT token
            const loginRes = await fetch('http://127.0.0.1:1337/api/auth/local', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: registeredEmail,
                    password: currentPassword
                })
            });
            const loginData = await loginRes.json();
            jwtToken = loginData.jwt;
        });

        test('Should refuse new password if < 12 characters', async () => {
            const res = await fetch('http://127.0.0.1:1337/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    password: 'short123',
                    passwordConfirmation: 'short123'
                })
            });
            const data = await res.json();
            expect(res.status).toBe(400);
            
            const errs = getErrorMessages(data);
            expect(errs.some(m => m.includes('Le mot de passe doit contenir au moins 12 caractères.'))).toBe(true);
        });

        test('Should refuse new password if > 72 bytes', async () => {
            const res = await fetch('http://127.0.0.1:1337/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    password: '💻'.repeat(19),
                    passwordConfirmation: '💻'.repeat(19)
                })
            });
            const data = await res.json();
            expect(res.status).toBe(400);
            
            const errs = getErrorMessages(data);
            expect(errs.some(m => m.includes('Le mot de passe ne doit pas dépasser la limite technique de 72 octets.'))).toBe(true);
        });

        test('Should refuse new password if only spaces', async () => {
            const res = await fetch('http://127.0.0.1:1337/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    password: '            ',
                    passwordConfirmation: '            '
                })
            });
            const data = await res.json();
            expect(res.status).toBe(400);
            
            const errs = getErrorMessages(data);
            expect(errs.some(m => m.includes("Le mot de passe ne peut pas être composé uniquement d'espaces."))).toBe(true);
        });

        test('Should accept valid change password and allow logging in with the new password', async () => {
            const newPwd = 'brandNewPassword123';
            const res = await fetch('http://127.0.0.1:1337/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    password: newPwd,
                    passwordConfirmation: newPwd
                })
            });
            expect(res.status).toBe(200);

            // Verify login with new password works
            const loginRes = await fetch('http://127.0.0.1:1337/api/auth/local', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: registeredEmail,
                    password: newPwd
                })
            });
            expect(loginRes.status).toBe(200);
        });
    });

    // 4. Endpoint /api/auth/reset-password
    describe('Reset Password Endpoint Validation', () => {
        let resetToken;

        beforeEach(async () => {
            // 1. Register a user
            await fetch('http://127.0.0.1:1337/api/auth/local/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: registeredUsername,
                    email: registeredEmail,
                    password: 'validPassword123'
                })
            });

            // Confirm user in DB
            db.prepare('UPDATE up_users SET confirmed = 1 WHERE email = ?').run(registeredEmail);

            // 2. Request forgot password to generate token
            await fetch('http://127.0.0.1:1337/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: registeredEmail })
            });

            // 3. Query SQLite database to grab the reset token
            const row = db.prepare('SELECT reset_password_token FROM up_users WHERE email = ?').get(registeredEmail);
            resetToken = row.reset_password_token;
        });

        test('Should refuse reset password if < 12 characters', async () => {
            const res = await fetch('http://127.0.0.1:1337/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: resetToken,
                    password: 'short123',
                    passwordConfirmation: 'short123'
                })
            });
            const data = await res.json();
            expect(res.status).toBe(400);
            
            const errs = getErrorMessages(data);
            expect(errs.some(m => m.includes('Le mot de passe doit contenir au moins 12 caractères.'))).toBe(true);
        });

        test('Should refuse reset password if > 72 bytes', async () => {
            const res = await fetch('http://127.0.0.1:1337/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: resetToken,
                    password: '💻'.repeat(19),
                    passwordConfirmation: '💻'.repeat(19)
                })
            });
            const data = await res.json();
            expect(res.status).toBe(400);
            
            const errs = getErrorMessages(data);
            expect(errs.some(m => m.includes('Le mot de passe ne doit pas dépasser la limite technique de 72 octets.'))).toBe(true);
        });

        test('Should refuse reset password if only spaces', async () => {
            const res = await fetch('http://127.0.0.1:1337/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: resetToken,
                    password: '            ',
                    passwordConfirmation: '            '
                })
            });
            const data = await res.json();
            expect(res.status).toBe(400);
            
            const errs = getErrorMessages(data);
            expect(errs.some(m => m.includes("Le mot de passe ne peut pas être composé uniquement d'espaces."))).toBe(true);
        });

        test('Should accept valid password reset', async () => {
            const newPwd = 'brandNewPasswordReset123';
            const res = await fetch('http://127.0.0.1:1337/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: resetToken,
                    password: newPwd,
                    passwordConfirmation: newPwd
                })
            });
            expect(res.status).toBe(200);

            // Verify login works with reset password
            const loginRes = await fetch('http://127.0.0.1:1337/api/auth/local', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: registeredEmail,
                    password: newPwd
                })
            });
            expect(loginRes.status).toBe(200);
        });
    });

    // 5. Verification of logger safety (ensure password values are not printed in console logs)
    describe('Logger Safety Verification', () => {
        test('Passwords are not leaked/printed in the server logs', async () => {
            const specialUniquePwd = 'SECRET_PASSWORD_LOGS_CHECK_XYZ_999';
            await fetch('http://127.0.0.1:1337/api/auth/local/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: `logger_test_${Math.random().toString(36).substring(7)}`,
                    email: `logger_test_${Math.random().toString(36).substring(7)}@cyberscop.lab`,
                    password: specialUniquePwd
                })
            });

            // Find if there is a running task log file in gemini directory
            const brainDir = path.resolve(__dirname, '../../.gemini/antigravity-ide/brain/683f7c2d-ffa8-43af-88db-252f592bb8d4/.system_generated/tasks');
            if (fs.existsSync(brainDir)) {
                const files = fs.readdirSync(brainDir);
                for (const file of files) {
                    if (file.endsWith('.log')) {
                        const content = fs.readFileSync(path.join(brainDir, file), 'utf8');
                        expect(content).not.toContain(specialUniquePwd);
                    }
                }
            }
        });
    });
});
