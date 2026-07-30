/**
 * @file tests/contact.test.js
 * @description Suite de tests unitaires et comportementaux pour le contrôleur de contact Strapi.
 * Valide les validations de type, format, honeypot, rate-limiting, injections et journalisation sécurisée.
 */

const contactController = require('../backend/src/api/contact/controllers/contact.js');

describe('Contact Controller Backend Tests', () => {
  let mockCtx;
  let originalStrapi;

  beforeEach(() => {
    // Réinitialisation du cache du rate limiter avant chaque test
    contactController._rateLimiterStore.cache.clear();

    // Préparation d'un contexte Koa factice (mock)
    mockCtx = {
      is: jest.fn().mockReturnValue(true),
      get: jest.fn().mockReturnValue(''),
      request: {
        body: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          subject: 'collaboration',
          message: 'Hello, this is a valid message.',
          website: ''
        }
      },
      badRequest: jest.fn().mockImplementation((msg) => {
        mockCtx.status = 400;
        mockCtx.body = { error: 'Bad Request', message: msg };
        return mockCtx.body;
      }),
      send: jest.fn().mockImplementation((body, status = 200) => {
        mockCtx.status = status;
        mockCtx.body = body;
        return mockCtx.body;
      }),
      ip: '127.0.0.1',
      status: 200,
      body: null
    };

    // Mock global de l'objet Strapi
    originalStrapi = global.strapi;
    global.strapi = {
      log: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
      },
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          send: jest.fn().mockResolvedValue(true)
        })
      })
    };
    process.env.CONTACT_DESTINATION_EMAIL = 'recipient@domain.tld';
    process.env.BREVO_SENDER_EMAIL = 'sender@domain.tld';
  });

  afterEach(() => {
    global.strapi = originalStrapi;
  });

  afterAll(() => {
    // Nettoyage de l'intervalle du rate limiter
    contactController._rateLimiterStore.destroy();
  });

  /**
   * @test Soumission valide avec dispatch courriel réussi
   */
  test('should accept valid requests and call email service', async () => {
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(200);
    expect(mockCtx.body.success).toBe(true);
    expect(global.strapi.plugin).toHaveBeenCalledWith('email');
    expect(global.strapi.log.info).toHaveBeenCalledWith(
      'Contact submission processed: subject=collaboration, status=success'
    );
  });

  /**
   * @test Rejet de format d'en-tête Content-Type invalide
   */
  test('should reject invalid Content-Type', async () => {
    mockCtx.is.mockReturnValue(false);
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Invalid Content-Type');
  });

  /**
   * @test Limitation de la taille du payload par Content-Length
   */
  test('should reject large payloads based on Content-Length', async () => {
    mockCtx.get.mockReturnValue((11 * 1024).toString()); // 11 Ko
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Payload too large');
  });

  /**
   * @test Limitation de la taille du payload par chaîne JSON brute
   */
  test('should reject large payloads based on body string length', async () => {
    mockCtx.request.body.message = 'a'.repeat(10 * 1024); // Message trop grand
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Payload too large');
  });

  /**
   * @test Filtrage Honeypot antispam simulant une réussite
   */
  test('should simulate success on honeypot filled and skip mail sending', async () => {
    mockCtx.request.body.website = 'http://spambot.com';
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(200);
    expect(mockCtx.body.success).toBe(true);
    expect(global.strapi.plugin).not.toHaveBeenCalled();
    expect(global.strapi.log.info).toHaveBeenCalledWith(
      expect.stringContaining('filtered by honeypot')
    );
  });

  /**
   * @test Rejet de clés non déclarées dans le payload
   */
  test('should reject extra properties', async () => {
    mockCtx.request.body.extraField = 'hack';
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Invalid properties');
  });

  /**
   * @test Validation du champ nom (vide ou trop long)
   */
  test('should reject invalid names', async () => {
    mockCtx.request.body.name = '';
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Invalid name');

    mockCtx.request.body.name = '   ';
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Invalid name');

    mockCtx.request.body.name = 'a'.repeat(101);
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Invalid name');
  });

  /**
   * @test Validation du champ email (format et longueur)
   */
  test('should reject invalid emails', async () => {
    mockCtx.request.body.email = 'not-an-email';
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Invalid email format');

    mockCtx.request.body.email = 'a'.repeat(250) + '@domain.com'; // dépasse 255
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Invalid email');
  });

  /**
   * @test Validation du motif/sujet contre la liste blanche
   */
  test('should reject subjects not in whitelist', async () => {
    mockCtx.request.body.subject = 'hacking';
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Invalid subject');
  });

  /**
   * @test Validation du champ message (vide ou trop long)
   */
  test('should reject invalid messages', async () => {
    mockCtx.request.body.message = '';
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Invalid message');

    mockCtx.request.body.message = 'a'.repeat(5001);
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Invalid message');
  });

  /**
   * @test Neutralisation des sauts de ligne CRLF anti-header injection
   */
  test('should reject header line injections', async () => {
    mockCtx.request.body.name = 'Jane\nInjection';
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(400);
    expect(mockCtx.body.message).toBe('Line injection detected');
  });

  /**
   * @test Application de la restriction de fréquence Rate Limiting par IP (y compris spam)
   */
  test('should rate limit after 5 requests from the same IP (including honeypot requests)', async () => {
    // 5 requêtes réussies (honeypot ou non)
    for (let i = 0; i < 5; i++) {
      mockCtx.request.body.website = 'spambot';
      await contactController.submit(mockCtx);
      expect(mockCtx.status).toBe(200);
    }

    // La 6ème doit être bloquée
    mockCtx.request.body.website = '';
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(429);
    expect(mockCtx.body.message).toBe('Trop de tentatives de contact. Veuillez réessayer plus tard.');
  });

  /**
   * @test Traitement des pannes du service SMTP Brevo (503)
   */
  test('should handle Brevo email service errors and return 503', async () => {
    global.strapi.plugin().service().send.mockRejectedValue(new Error('Brevo service down'));
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(503);
    expect(mockCtx.body.message).toBe('Le service e-mail est temporairement indisponible. Veuillez réessayer plus tard.');
  });

  /**
   * @test Traitement du dépassement de délai d'attente (timeout 5s) Brevo (503)
   */
  test('should handle email service timeout and return 503', async () => {
    jest.useFakeTimers();
    global.strapi.plugin().service().send.mockReturnValue(
      new Promise(() => {})
    );

    const promise = contactController.submit(mockCtx);
    
    jest.advanceTimersByTime(6000);
    await promise;

    expect(mockCtx.status).toBe(503);
    expect(mockCtx.body.message).toBe('Le service e-mail est temporairement indisponible. Veuillez réessayer plus tard.');
    jest.useRealTimers();
  });

  /**
   * @test Traitement du cas où le provider retourne false (503)
   */
  test('should return 503 when the email provider returns false', async () => {
    global.strapi.plugin().service().send.mockResolvedValue(false);
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(503);
    expect(mockCtx.body.message).toBe('Le service e-mail est temporairement indisponible. Veuillez réessayer plus tard.');
  });

  /**
   * @test Traitement du cas où le provider retourne undefined (503)
   */
  test('should return 503 when the email provider returns undefined', async () => {
    global.strapi.plugin().service().send.mockResolvedValue(undefined);
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(503);
    expect(mockCtx.body.message).toBe('Le service e-mail est temporairement indisponible. Veuillez réessayer plus tard.');
  });

  /**
   * @test Traitement du cas où le provider retourne un objet inattendu (503)
   */
  test('should return 503 when the email provider returns an unexpected object', async () => {
    global.strapi.plugin().service().send.mockResolvedValue({ messageId: '12345' });
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(503);
    expect(mockCtx.body.message).toBe('Le service e-mail est temporairement indisponible. Veuillez réessayer plus tard.');
  });

  /**
   * @test Rejet sécurisé de la soumission si l'adresse de destination est manquante (500)
   */
  test('should reject safely if destination email is missing', async () => {
    delete process.env.CONTACT_DESTINATION_EMAIL;
    await contactController.submit(mockCtx);
    expect(mockCtx.status).toBe(500);
    expect(mockCtx.body.message).toBe('Le service e-mail est temporairement indisponible.');
  });

  /**
   * @test Garantie de respect de la confidentialité des journaux (pas de fuite de données ni d'IP)
   */
  test('should not leak personal data or IP addresses in log output', async () => {
    // Déclencher un succès, un spam honeypot et un rate-limit pour générer différents logs
    await contactController.submit(mockCtx);
    
    mockCtx.request.body.website = 'spam';
    await contactController.submit(mockCtx);

    for (let i = 0; i < 5; i++) {
      await contactController.submit(mockCtx);
    }

    const checkLogCalls = (calls) => {
      calls.forEach(call => {
        const msg = call[0];
        expect(msg).not.toContain('Jane Doe');
        expect(msg).not.toContain('jane@example.com');
        expect(msg).not.toContain('127.0.0.1');
      });
    };

    checkLogCalls(global.strapi.log.info.mock.calls);
    checkLogCalls(global.strapi.log.warn.mock.calls);
    checkLogCalls(global.strapi.log.error.mock.calls);
  });
});
