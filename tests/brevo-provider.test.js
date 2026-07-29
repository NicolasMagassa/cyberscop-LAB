/**
 * @file tests/brevo-provider.test.js
 * @description Tests unitaires pour le provider d'email Strapi Brevo (TDD).
 * Valide le nettoyage du nom de l'expéditeur et les mécanismes de repli (fallback).
 */

const axios = require('../backend/node_modules/axios');
const provider = require('../backend/node_modules/strapi-provider-email-brevo/index.js');

// Mock axios
jest.mock('../backend/node_modules/axios');

/**
 * Suite principale testant le provider d'emails Brevo
 */
describe('strapi-provider-email-brevo unit tests (TDD)', () => {
  /**
   * Réinitialisation de tous les mocks d'axios avant chaque test.
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * @test Nettoyage des champs de l'option from
   */
  test('should clean the sender name and email correctly from option.from', async () => {
    // Mock axios post success
    axios.post.mockResolvedValue({ status: 200, data: {} });

    // Initialize provider
    const brevoProvider = provider.init(
      { apiKey: 'test-api-key' },
      { defaultSenderEmail: 'default@example.com', defaultSenderName: 'Default Name', defaultReplyTo: 'default@example.com' }
    );

    // Call send with Nodemailer format containing Name and Email in brackets
    const result = await brevoProvider.send({
      from: 'CyberScope LAB <cyberscop.lab@gmail.com>',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test content',
      html: '<p>Test content</p>'
    });

    expect(result).toBe(true);

    // Verify axios was called with the correct url, payload and headers
    expect(axios.post).toHaveBeenCalledTimes(1);
    const [url, payload, config] = axios.post.mock.calls[0];

    expect(url).toBe('https://api.brevo.com/v3/smtp/email');
    expect(config.headers['api-key']).toBe('test-api-key');

    // Crucial check: the sender.name must be cleanly extracted without email brackets
    expect(payload.sender).toEqual({
      name: 'CyberScope LAB',
      email: 'cyberscop.lab@gmail.com'
    });
  });

  /**
   * @test Repli sur les valeurs par défaut
   */
  test('should fallback to default settings if options.from is not provided', async () => {
    axios.post.mockResolvedValue({ status: 200, data: {} });

    const brevoProvider = provider.init(
      { apiKey: 'test-api-key' },
      { defaultSenderEmail: 'default@example.com', defaultSenderName: 'Default Name', defaultReplyTo: 'reply@example.com' }
    );

    await brevoProvider.send({
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test content',
      html: '<p>Test content</p>'
    });

    expect(axios.post).toHaveBeenCalledTimes(1);
    const [, payload] = axios.post.mock.calls[0];

    expect(payload.sender).toEqual({
      name: 'Default Name',
      email: 'default@example.com'
    });
    expect(payload.replyTo).toEqual({
      email: 'reply@example.com'
    });
  });
});
