'use strict';

/**
 * Interface/Abstraction de stockage pour le rate limiter.
 * Permet de basculer facilement vers Redis ou une base de données en production multi-instances.
 */
class RateLimiterStore {
  checkLimit(ip) {
    throw new Error('Method checkLimit(ip) must be implemented');
  }
}

/**
 * Implémentation in-memory provisoire de RateLimiterStore pour mono-instance.
 * Comprend l'expiration, la purge, et la protection contre la saturation mémoire.
 */
class MemoryRateLimiterStore extends RateLimiterStore {
  constructor() {
    super();
    this.cache = new Map();
    this.maxSize = 10000;
    this.intervalId = null;

    // L'intervalle de purge automatique n'est pas démarré en environnement de test Jest
    // pour éviter les poignées persistantes (lingering handles).
    if (process.env.NODE_ENV !== 'test') {
      this.intervalId = setInterval(() => this.purge(), 15 * 60 * 1000);
      if (this.intervalId && this.intervalId.unref) {
        this.intervalId.unref();
      }
    }
  }

  /**
   * Purge les requêtes expirées (plus vieilles d'une heure).
   */
  purge() {
    const now = Date.now();
    for (const [ip, timestamps] of this.cache.entries()) {
      const activeTimestamps = timestamps.filter(ts => now - ts < 3600000);
      if (activeTimestamps.length === 0) {
        this.cache.delete(ip);
      } else {
        this.cache.set(ip, activeTimestamps);
      }
    }
  }

  /**
   * Enregistre la requête pour l'IP donnée et vérifie la limite (max 5 par heure).
   * @param {string} ip 
   * @returns {boolean} true si autorisé, false si bloqué
   */
  checkLimit(ip) {
    const now = Date.now();
    
    if (!this.cache.has(ip)) {
      // Protection anti-DoS mémoire : si la taille maximale est atteinte
      if (this.cache.size >= this.maxSize) {
        this.purge();
        // Si toujours plein, suppression du plus ancien élément
        if (this.cache.size >= this.maxSize) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
      }
      this.cache.set(ip, [now]);
      return true;
    }

    const timestamps = this.cache.get(ip).filter(ts => now - ts < 3600000);
    timestamps.push(now);
    this.cache.set(ip, timestamps);

    return timestamps.length <= 5;
  }

  /**
   * Arrête proprement l'intervalle (utile pour les tests ou le rechargement).
   */
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

const rateLimiterStore = new MemoryRateLimiterStore();

// Liste blanche des motifs de contact autorisés
const SUBJECT_WHITELIST = ['proposition', 'collaboration', 'question', 'autre'];

// Sujets d'e-mail correspondants
const SUBJECT_MAP = {
  collaboration: '[CyberScope LAB] Proposition de collaboration',
  proposition: '[CyberScope LAB] Proposition professionnelle',
  question: '[CyberScope LAB] Question sur un article',
  autre: '[CyberScope LAB] Nouveau message'
};

/**
 * Échappe les caractères HTML pour éviter les injections XSS.
 * @param {string} unsafe 
 * @returns {string}
 */
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = {
  // Exposer le store pour les tests unitaires et d'éventuels nettoyages
  _rateLimiterStore: rateLimiterStore,

  /**
   * Reçoit, valide et traite les demandes de contact envoyées par le formulaire.
   * Procède au rate-limiting, au filtrage honeypot, à l'assainissement anti-injections CRLF/XSS,
   * et transmet l'email via Brevo en cas de soumission valide.
   * @param {Object} ctx - Le contexte de requête Strapi/Koa.
   * @returns {Promise<void>}
   */
  async submit(ctx) {
    // 1. Validation de l'en-tête Content-Type
    if (!ctx.is('application/json')) {
      return ctx.badRequest('Invalid Content-Type');
    }

    // 2. Contrôle de taille du corps de la requête avant traitement (max 10 Ko)
    const contentLength = parseInt(ctx.get('content-length') || '0', 10);
    if (contentLength > 10 * 1024) {
      return ctx.badRequest('Payload too large');
    }

    const bodyStr = JSON.stringify(ctx.request.body || {});
    if (bodyStr.length > 10 * 1024) {
      return ctx.badRequest('Payload too large');
    }

    // 3. Extraction sécurisée de l'adresse IP (en tenant compte d'un éventuel proxy de production)
    const ip = ctx.ip;

    // 4. Application du Rate Limiter (toutes les requêtes y passent, y compris le spam honeypot)
    // Le loopback est exempté de rate limiting uniquement hors environnement de test Jest pour valider le comportement en TDD.
    const isLoopback = (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') && process.env.NODE_ENV !== 'test';
    const allowedByRateLimit = isLoopback ? true : rateLimiterStore.checkLimit(ip);
    if (!allowedByRateLimit) {
      strapi.log.warn('Contact submission rate limited');
      return ctx.send({
        error: 'Too Many Requests',
        message: 'Trop de tentatives de contact. Veuillez réessayer plus tard.'
      }, 429);
    }

    // 5. Extraction des données
    const { name, email, subject, message, website } = ctx.request.body || {};

    // 6. Filtrage Honeypot antispam
    // website doit être absent ou strictement vide. S'il est rempli, nous simulons un succès 200 OK.
    if (website !== undefined && website !== null && website !== '') {
      strapi.log.info('Contact submission filtered by honeypot');
      return ctx.send({
        success: true,
        message: 'Message sent successfully'
      });
    }

    // 7. Validation stricte du schéma de données
    const allowedKeys = ['name', 'email', 'subject', 'message', 'website'];
    const keys = Object.keys(ctx.request.body || {});
    const hasExtraKeys = keys.some(key => !allowedKeys.includes(key));
    if (hasExtraKeys) {
      return ctx.badRequest('Invalid properties');
    }

    // 7.1. Validation Nom
    if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      return ctx.badRequest('Invalid name');
    }

    // 7.2. Validation E-mail
    if (typeof email !== 'string' || email.trim().length === 0 || email.length > 255) {
      return ctx.badRequest('Invalid email');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return ctx.badRequest('Invalid email format');
    }

    // 7.3. Validation Sujet
    if (!SUBJECT_WHITELIST.includes(subject)) {
      return ctx.badRequest('Invalid subject');
    }

    // 7.4. Validation Message
    if (typeof message !== 'string' || message.trim().length === 0 || message.length > 5000) {
      return ctx.badRequest('Invalid message');
    }

    // 7.5. Prévention d'injections de retour à la ligne dans les en-têtes
    const hasLineInjection = (str) => /[\r\n]/.test(str);
    if (hasLineInjection(name) || hasLineInjection(email) || hasLineInjection(subject)) {
      return ctx.badRequest('Line injection detected');
    }

    // 8. Préparation de l'envoi de courriel
    const destinationEmail = process.env.CONTACT_DESTINATION_EMAIL;
    if (!destinationEmail) {
      strapi.log.error('Missing CONTACT_DESTINATION_EMAIL environment variable');
      return ctx.send({
        error: 'Internal Server Error',
        message: 'Le service e-mail est temporairement indisponible.'
      }, 500);
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'Cyberscop.Lab@gmail.com';
    const emailSubject = SUBJECT_MAP[subject];

    // Échappement séparé du contenu HTML
    const escapedName = escapeHtml(name.trim());
    const escapedEmail = escapeHtml(email.trim());
    const escapedMessage = escapeHtml(message.trim());

    const textContent = `Nouveau message de contact :
Nom : ${name.trim()}
Email : ${email.trim()}
Sujet : ${emailSubject}
Message :
${message.trim()}`;

    const htmlContent = `<div style="font-family: sans-serif; padding: 20px; color: #333;">
  <h2>Nouveau message de contact (CyberScope LAB)</h2>
  <p><strong>Nom :</strong> ${escapedName}</p>
  <p><strong>Email :</strong> <a href="mailto:${escapedEmail}">${escapedEmail}</a></p>
  <p><strong>Sujet :</strong> ${emailSubject}</p>
  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
  <p><strong>Message :</strong></p>
  <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #00aa2c;">${escapedMessage}</p>
</div>`;

    // 9. Envoi de l'e-mail avec gestion de Timeout et d'erreurs
    try {
      const emailPromise = strapi.plugin('email').service('email').send({
        to: destinationEmail,
        from: senderEmail,
        replyTo: email.trim(),
        subject: emailSubject,
        text: textContent,
        html: htmlContent
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email service timeout')), 5000)
      );

      // On attend le premier résolu/rejeté : l'envoi d'e-mail ou le timeout de 5s
      const result = await Promise.race([emailPromise, timeoutPromise]);

      // IMPORTANT : Le provider actuellement installé (strapi-provider-email-brevo)
      // retourne explicitement `true` en cas de succès et `false` en cas d'erreur.
      // En cas de future migration vers un autre provider, valider qu'il respecte
      // ce contrat ou adapter cette condition pour éviter de masquer silencieusement des échecs.
      if (result !== true) {
        throw new Error(`Email provider returned invalid status: ${result}`);
      }

      // Journalisation minimale sécurisée (aucune donnée personnelle sensible comme les e-mails ou les messages n'est logguée)
      strapi.log.info(`Contact submission processed: subject=${subject}, status=success`);

      return ctx.send({
        success: true,
        message: 'Message sent successfully'
      });

    } catch (error) {
      strapi.log.error(`Contact email dispatch failed: subject=${subject}, error=${error.message}`);
      return ctx.send({
        error: 'Service Unavailable',
        message: 'Le service e-mail est temporairement indisponible. Veuillez réessayer plus tard.'
      }, 503);
    }
  }
};
