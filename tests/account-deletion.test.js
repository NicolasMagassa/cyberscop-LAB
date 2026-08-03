/**
 * @file tests/account-deletion.test.js
 * @description Unit and integration tests for secure account deletion and data erasure.
 */

const sqlite = require('../backend/node_modules/better-sqlite3');
const path = require('path');
const crypto = require('crypto');
const controller = require('../backend/src/api/account/controllers/account');

describe('Account Deletion Feature Tests', () => {
  let db;

  beforeAll(() => {
    const dbPath = path.resolve(__dirname, '../backend/.tmp/data.db');
    db = sqlite(dbPath);
  });

  afterAll(() => {
    if (db) {
      db.close();
    }
  });

  // =========================================================================
  // 1. UNIT TESTS (Controller Business Logic, Validation, Logs, Rate Limiting)
  // =========================================================================
  describe('Unit Tests - Controller Logic', () => {
    let mockCtx;
    let mockStrapi;
    let originalStrapi;

    beforeEach(() => {
      originalStrapi = global.strapi;

      // Mock strapi context and services
      mockStrapi = {
        log: {
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn()
        },
        service: jest.fn().mockReturnValue({
          fetch: jest.fn().mockResolvedValue({
            id: 42,
            password: 'hashed_password',
            email: 'agent@cyberscop.lab'
          }),
          validatePassword: jest.fn().mockResolvedValue(true),
          remove: jest.fn().mockResolvedValue(true)
        }),
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockReturnValue({
            send: jest.fn().mockResolvedValue(true)
          })
        }),
        db: {
          transaction: jest.fn(async (cb) => {
            return cb({ trx: {} });
          }),
          query: jest.fn().mockReturnValue({
            delete: jest.fn().mockResolvedValue(true)
          })
        }
      };

      global.strapi = mockStrapi;

      // Reset Rate Limit Cache
      controller._rateLimitCache.clear();

      mockCtx = {
        ip: '127.0.0.1',
        state: {
          user: { id: 42 }
        },
        request: {
          body: {
            password: 'current_password',
            confirmText: 'SUPPRIMER',
            acknowledged: true
          }
        },
        unauthorized: jest.fn().mockImplementation((msg) => {
          mockCtx.status = 401;
          mockCtx.body = { error: 'Unauthorized', message: msg };
          return mockCtx.body;
        }),
        badRequest: jest.fn().mockImplementation((msg) => {
          mockCtx.status = 400;
          mockCtx.body = { error: 'BadRequest', message: msg };
          return mockCtx.body;
        }),
        notFound: jest.fn().mockImplementation((msg) => {
          mockCtx.status = 404;
          mockCtx.body = { error: 'NotFound', message: msg };
          return mockCtx.body;
        }),
        internalServerError: jest.fn().mockImplementation((msg) => {
          mockCtx.status = 500;
          mockCtx.body = { error: 'InternalServerError', message: msg };
          return mockCtx.body;
        }),
        send: jest.fn().mockImplementation((data, status = 200) => {
          mockCtx.status = status;
          mockCtx.body = data;
          return mockCtx.body;
        })
      };
    });

    afterEach(() => {
      global.strapi = originalStrapi;
    });

    test('Should reject if user is not authenticated', async () => {
      mockCtx.state.user = null;
      await controller.delete(mockCtx);
      expect(mockCtx.status).toBe(401);
      expect(mockCtx.body.message).toContain('Veuillez vous connecter');
    });

    test('Should reject if confirmText is not SUPPRIMER', async () => {
      mockCtx.request.body.confirmText = 'SUPPRIMER_DEUX';
      await controller.delete(mockCtx);
      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body.message).toContain('Confirmation invalide.');
    });

    test('Should reject if confirmText is missing', async () => {
      delete mockCtx.request.body.confirmText;
      await controller.delete(mockCtx);
      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body.message).toContain('Confirmation invalide.');
    });

    test('Should reject if password is missing', async () => {
      delete mockCtx.request.body.password;
      await controller.delete(mockCtx);
      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body.message).toContain('Le mot de passe actuel est requis.');
    });

    test('Should reject if acknowledged is missing', async () => {
      delete mockCtx.request.body.acknowledged;
      await controller.delete(mockCtx);
      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body.message).toContain('Validation de la case de compréhension requise.');
    });

    test('Should reject if acknowledged is false', async () => {
      mockCtx.request.body.acknowledged = false;
      await controller.delete(mockCtx);
      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body.message).toContain('Validation de la case de compréhension requise.');
    });

    test('Should reject if acknowledged is not a boolean', async () => {
      mockCtx.request.body.acknowledged = 'true';
      await controller.delete(mockCtx);
      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body.message).toContain('Validation de la case de compréhension requise.');
    });

    test('Should reject if extra properties are sent in request body', async () => {
      mockCtx.request.body.extraField = 'malicious_injected_value';
      await controller.delete(mockCtx);
      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body.message).toContain('Paramètres invalides.');
    });

    test('Should reject if id or email is injected in body', async () => {
      mockCtx.request.body.id = 99;
      await controller.delete(mockCtx);
      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body.message).toContain('Paramètres invalides.');
    });

    test('Should execute deletion successfully and send confirmation email', async () => {
      const mockSend = mockStrapi.plugin('email').service('email').send;

      await controller.delete(mockCtx);
      expect(mockCtx.status).toBe(200);
      expect(mockCtx.body.success).toBe(true);
      expect(mockCtx.body.emailSent).toBe(true);
      expect(mockStrapi.db.transaction).toHaveBeenCalled();

      // Verify email was sent with UUID, Paris local time and UTC date
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'agent@cyberscop.lab',
          subject: 'Confirmation de suppression de votre compte — CyberScope LAB',
          text: expect.stringMatching(/Date et heure de suppression \(heure de Paris\) : \d{2}\/\d{2}\/\d{4} à \d{2}:\d{2}.*\n- Horodatage technique \(UTC\) : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
          html: expect.stringMatching(/Date et heure de suppression \(heure de Paris\) : \d{2}\/\d{2}\/\d{4} à \d{2}:\d{2}.*Horodatage technique \(UTC\) : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
        })
      );
    });

    test('Should execute deletion successfully even if email dispatch fails', async () => {
      mockStrapi.plugin('email').service('email').send.mockRejectedValueOnce(
        new Error('Brevo service offline')
      );

      await controller.delete(mockCtx);
      expect(mockCtx.status).toBe(200);
      expect(mockCtx.body.success).toBe(true);
      expect(mockCtx.body.emailSent).toBe(false); // Technical key notifies frontend that email dispatch failed
      expect(mockStrapi.db.transaction).toHaveBeenCalled();
      expect(mockStrapi.log.error).toHaveBeenCalledWith(
        expect.stringContaining('Brevo service offline')
      );
    });

    test('Should execute deletion successfully even if email dispatch times out', async () => {
      const originalRace = Promise.race;
      Promise.race = jest.fn().mockImplementationOnce(async () => {
        throw new Error('Email service timeout');
      });

      await controller.delete(mockCtx);

      Promise.race = originalRace;

      expect(mockCtx.status).toBe(200);
      expect(mockCtx.body.success).toBe(true);
      expect(mockCtx.body.emailSent).toBe(false);
      expect(mockStrapi.log.error).toHaveBeenCalledWith(
        expect.stringContaining('Email service timeout')
      );
    });

    test('Should trigger transactional rollback on database error', async () => {
      mockStrapi.db.transaction.mockImplementationOnce(async () => {
        throw new Error('Database connection lost');
      });

      await controller.delete(mockCtx);
      expect(mockCtx.status).toBe(500);
      expect(mockCtx.body.message).toContain('Une erreur interne');
      expect(mockStrapi.log.error).toHaveBeenCalledWith(
        expect.stringContaining('Database connection lost')
      );
    });

    test('Should rate limit after 5 attempts', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        // Run 5 attempts
        for (let i = 0; i < 5; i++) {
          const allowed = controller._checkRateLimit('1.2.3.4', 99);
          expect(allowed).toBe(true);
          controller._recordAttempt('1.2.3.4', 99);
        }

        // 6th attempt must be blocked
        const allowed6 = controller._checkRateLimit('1.2.3.4', 99);
        expect(allowed6).toBe(false);

        // Check controller integration
        mockCtx.ip = '1.2.3.4';
        mockCtx.state.user.id = 99;
        await controller.delete(mockCtx);
        expect(mockCtx.status).toBe(429);
        expect(mockCtx.body.error).toBe('Too Many Requests');
      } finally {
        process.env.NODE_ENV = originalNodeEnv;
      }
    });

    test('Should verify loopback IP is NOT exempt in production', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        // Run 5 attempts on 127.0.0.1
        for (let i = 0; i < 5; i++) {
          const allowed = controller._checkRateLimit('127.0.0.1', 99);
          expect(allowed).toBe(true);
          controller._recordAttempt('127.0.0.1', 99);
        }

        // 6th attempt must be blocked, loopback IP is NOT exempt in production
        const allowed6 = controller._checkRateLimit('127.0.0.1', 99);
        expect(allowed6).toBe(false);
      } finally {
        process.env.NODE_ENV = originalNodeEnv;
      }
    });

    test('Should verify loopback IP IS exempt in test/development environment', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';

      try {
        // Run 10 attempts on 127.0.0.1
        for (let i = 0; i < 10; i++) {
          const allowed = controller._checkRateLimit('127.0.0.1', 99);
          expect(allowed).toBe(true);
          controller._recordAttempt('127.0.0.1', 99);
        }
      } finally {
        process.env.NODE_ENV = originalNodeEnv;
      }
    });

    test('Should check that logs do not contain sensitive data', async () => {
      await controller.delete(mockCtx);

      const logCalls = [
        ...mockStrapi.log.info.mock.calls,
        ...mockStrapi.log.warn.mock.calls,
        ...mockStrapi.log.error.mock.calls
      ];

      logCalls.forEach((call) => {
        const logString = JSON.stringify(call);
        expect(logString).not.toContain('current_password');
        expect(logString).not.toContain('agent@cyberscop.lab');
        expect(logString).not.toContain('jwt');
        expect(logString).not.toContain('mock-jwt-token');
      });
    });
  });

  // =========================================================================
  // 2. INTEGRATION TESTS (Real Strapi Server & Database assertions)
  // =========================================================================
  describe('Integration Tests - API Endpoints', () => {
    let userA, userB;
    let jwtA, jwtB;
    const testPassword = 'SecretTestPassword123!';

    beforeAll(async () => {
      const randA = Math.random().toString(36).substring(7);
      const randB = Math.random().toString(36).substring(7);

      // Create two temporary users
      const registerUser = async (username, email) => {
        const res = await fetch('http://127.0.0.1:1337/api/auth/local/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email,
            password: testPassword
          })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(`Failed to register user: ${JSON.stringify(data)}`);
        }
        
        // Confirm account directly in the SQLite database to bypass email confirmation
        db.prepare('UPDATE up_users SET confirmed = 1 WHERE email = ?').run(email);
        
        // Login to get a valid JWT
        const loginRes = await fetch('http://127.0.0.1:1337/api/auth/local', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: email,
            password: testPassword
          })
        });
        const loginData = await loginRes.json();
        return {
          user: loginData.user,
          jwt: loginData.jwt
        };
      };

      const resultA = await registerUser(`test_user_a_${randA}`, `test_a_${randA}@cyberscop.lab`);
      userA = resultA.user;
      jwtA = resultA.jwt;

      const resultB = await registerUser(`test_user_b_${randB}`, `test_b_${randB}@cyberscop.lab`);
      userB = resultB.user;
      jwtB = resultB.jwt;
    });

    test('Security - Route DELETE /api/users/:id must return 405 (Method Not Allowed) or 404', async () => {
      const res = await fetch(`http://127.0.0.1:1337/api/users/${userB.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtA}`
        }
      });
      expect([404, 405]).toContain(res.status);
    });

    test('Security - Route DELETE /api/users/:id must return 405 or 404 even when user tries to delete their own account', async () => {
      const res = await fetch(`http://127.0.0.1:1337/api/users/${userA.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtA}`
        }
      });
      expect([404, 405]).toContain(res.status);
    });

    test('Route without JWT must return 401 or 403 (Blocked by permissions)', async () => {
      const res = await fetch('http://127.0.0.1:1337/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: testPassword,
          confirmText: 'SUPPRIMER',
          acknowledged: true
        })
      });
      expect([401, 403]).toContain(res.status);
    });

    test('Route with invalid JWT must return 401', async () => {
      const res = await fetch('http://127.0.0.1:1337/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer invalid_mocked_jwt_token'
        },
        body: JSON.stringify({
          password: testPassword,
          confirmText: 'SUPPRIMER',
          acknowledged: true
        })
      });
      expect(res.status).toBe(401);
    });

    test('Route with incorrect password must return 400', async () => {
      const res = await fetch('http://127.0.0.1:1337/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtA}`
        },
        body: JSON.stringify({
          password: 'wrong_password_here',
          confirmText: 'SUPPRIMER',
          acknowledged: true
        })
      });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error.message).toContain('Mot de passe incorrect.');
    });

    test('Route with incorrect confirmText must return 400', async () => {
      const res = await fetch('http://127.0.0.1:1337/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtA}`
        },
        body: JSON.stringify({
          password: testPassword,
          confirmText: 'SUPPRIMER_TEXTE_INCORRECT',
          acknowledged: true
        })
      });
      expect(res.status).toBe(400);
    });

    test('Route with missing acknowledged must return 400', async () => {
      const res = await fetch('http://127.0.0.1:1337/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtA}`
        },
        body: JSON.stringify({
          password: testPassword,
          confirmText: 'SUPPRIMER'
        })
      });
      expect(res.status).toBe(400);
    });

    test('Route with false acknowledged must return 400', async () => {
      const res = await fetch('http://127.0.0.1:1337/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtA}`
        },
        body: JSON.stringify({
          password: testPassword,
          confirmText: 'SUPPRIMER',
          acknowledged: false
        })
      });
      expect(res.status).toBe(400);
    });

    test('Route with extra body properties must return 400', async () => {
      const res = await fetch('http://127.0.0.1:1337/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtA}`
        },
        body: JSON.stringify({
          password: testPassword,
          confirmText: 'SUPPRIMER',
          acknowledged: true,
          extraField: 'malicious'
        })
      });
      expect(res.status).toBe(400);
    });

    test('Should delete authenticated user A successfully and clean up all tables', async () => {
      const res = await fetch('http://127.0.0.1:1337/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtA}`
        },
        body: JSON.stringify({
          password: testPassword,
          confirmText: 'SUPPRIMER',
          acknowledged: true
        })
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);

      // Verify direct database status: user A must be deleted from up_users
      const userInDb = db.prepare('SELECT * FROM up_users WHERE id = ?').get(userA.id);
      expect(userInDb).toBeUndefined();

      // Verify that role links in up_users_role_lnk are cleaned up
      const roleLinkInDb = db.prepare('SELECT * FROM up_users_role_lnk WHERE user_id = ?').get(userA.id);
      expect(roleLinkInDb).toBeUndefined();

      // Verify that old JWT A is now rejected
      const meRes = await fetch('http://127.0.0.1:1337/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtA}`
        }
      });
      expect(meRes.status).toBe(401);

      // Verify that login fails with user A credentials
      const loginRes = await fetch('http://127.0.0.1:1337/api/auth/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: userA.email,
          password: testPassword
        })
      });
      expect(loginRes.status).toBe(400);
    });

    test('Database - Real Transaction Rollback on error', async () => {
      const testUserId = 99999;
      
      // Insert temporary user
      db.prepare("INSERT INTO up_users (id, username, email, password, confirmed, blocked) VALUES (?, 'rollback_user', 'rollback@cyberscop.lab', 'hash', 1, 0)").run(testUserId);
      db.prepare("INSERT INTO up_users_role_lnk (user_id, role_id) VALUES (?, 1)").run(testUserId);

      expect(db.prepare("SELECT * FROM up_users WHERE id = ?").get(testUserId)).toBeDefined();
      expect(db.prepare("SELECT * FROM up_users_role_lnk WHERE user_id = ?").get(testUserId)).toBeDefined();

      // Execute transaction that throws
      try {
        db.transaction(() => {
          db.prepare("DELETE FROM up_users WHERE id = ?").run(testUserId);
          db.prepare("DELETE FROM up_users_role_lnk WHERE user_id = ?").run(testUserId);
          throw new Error('Simulated database error');
        })();
      } catch (err) {
        expect(err.message).toBe('Simulated database error');
      }

      // Assert rollback: user and link still exist!
      expect(db.prepare("SELECT * FROM up_users WHERE id = ?").get(testUserId)).toBeDefined();
      expect(db.prepare("SELECT * FROM up_users_role_lnk WHERE user_id = ?").get(testUserId)).toBeDefined();

      // Clean up manually
      db.prepare("DELETE FROM up_users WHERE id = ?").run(testUserId);
      db.prepare("DELETE FROM up_users_role_lnk WHERE user_id = ?").run(testUserId);
    });

    // Cleanup User B
    afterAll(async () => {
      db.prepare('DELETE FROM up_users WHERE id = ?').run(userB.id);
      db.prepare('DELETE FROM up_users_role_lnk WHERE user_id = ?').run(userB.id);
    });
  });
});
