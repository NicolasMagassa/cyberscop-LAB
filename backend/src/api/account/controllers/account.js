'use strict';

const crypto = require('crypto');

// Mémoire cache pour le rate limiting
const rateLimitCache = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 heure

function checkRateLimit(ip, userId) {
  const now = Date.now();
  const env = process.env.NODE_ENV;
  const isLoopback = (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1');
  
  // Exemption loopback strictement limitée à development et test
  const isExempt = isLoopback && (env === 'development' || env === 'test');

  if (isExempt) {
    return true;
  }

  const ipKey = `ip_${ip}`;
  const userKey = `user_${userId}`;

  const checkKey = (key) => {
    if (!rateLimitCache.has(key)) {
      rateLimitCache.set(key, []);
    }
    const timestamps = rateLimitCache.get(key).filter(ts => now - ts < WINDOW_MS);
    rateLimitCache.set(key, timestamps);
    return timestamps.length < MAX_ATTEMPTS;
  };

  return checkKey(ipKey) && checkKey(userKey);
}

function recordAttempt(ip, userId) {
  const now = Date.now();
  const env = process.env.NODE_ENV;
  const isLoopback = (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1');
  
  // Exemption loopback strictement limitée à development et test
  const isExempt = isLoopback && (env === 'development' || env === 'test');

  if (isExempt) {
    return;
  }

  const ipKey = `ip_${ip}`;
  const userKey = `user_${userId}`;

  const addAttempt = (key) => {
    if (!rateLimitCache.has(key)) {
      rateLimitCache.set(key, []);
    }
    const timestamps = rateLimitCache.get(key).filter(ts => now - ts < WINDOW_MS);
    timestamps.push(now);
    rateLimitCache.set(key, timestamps);
  };

  addAttempt(ipKey);
  addAttempt(userKey);
}

module.exports = {
  // Exposer les fonctions utilitaires pour pouvoir les tester
  _rateLimitCache: rateLimitCache,
  _checkRateLimit: checkRateLimit,
  _recordAttempt: recordAttempt,

  async delete(ctx) {
    const correlationId = crypto.randomUUID();

    // 1. Double vérification d'authentification
    if (!ctx.state.user || !ctx.state.user.id) {
      return ctx.unauthorized('Veuillez vous connecter pour effectuer cette action.');
    }

    const userId = ctx.state.user.id;
    const ip = ctx.ip;

    // 2. Contrôle de fréquence (Rate Limiting)
    if (!checkRateLimit(ip, userId)) {
      strapi.log.warn(`[SecOps] Account deletion blocked by rate limit. correlationId=${correlationId}`);
      return ctx.send({
        error: 'Too Many Requests',
        message: 'Trop de tentatives de suppression de compte. Veuillez réessayer plus tard.'
      }, 429);
    }

    // Enregistrer la tentative immédiatement (consomme un crédit)
    recordAttempt(ip, userId);

    // 3. Validation stricte du corps de la requête
    const { password, confirmText, acknowledged } = ctx.request.body || {};
    
    // Rejet de toute propriété supplémentaire pour éviter les injections de paramètres
    const allowedKeys = ['password', 'confirmText', 'acknowledged'];
    const bodyKeys = Object.keys(ctx.request.body || {});
    const extraKeys = bodyKeys.filter(k => !allowedKeys.includes(k));

    if (extraKeys.length > 0) {
      strapi.log.warn(`[SecOps] Account deletion rejected: extra parameters. correlationId=${correlationId}`);
      return ctx.badRequest('Paramètres invalides.');
    }

    if (acknowledged !== true) {
      strapi.log.warn(`[SecOps] Account deletion rejected: acknowledged is not true. correlationId=${correlationId}`);
      return ctx.badRequest('Validation de la case de compréhension requise.');
    }

    if (!password || typeof password !== 'string') {
      return ctx.badRequest('Le mot de passe actuel est requis.');
    }

    // Vérification stricte du texte de confirmation
    if (confirmText !== 'SUPPRIMER') {
      return ctx.badRequest('Confirmation invalide.');
    }

    try {
      // 4. Charger l'utilisateur avec son mot de passe haché
      const user = await strapi.service('plugin::users-permissions.user').fetch(userId);
      if (!user) {
        strapi.log.error(`[SecOps] Account deletion failed: user not found. correlationId=${correlationId}`);
        return ctx.notFound('Utilisateur non trouvé.');
      }

      // Conserver temporairement l'adresse e-mail en variable locale
      const userEmail = user.email;

      // 5. Valider le mot de passe actuel
      const isPasswordValid = await strapi
        .service('plugin::users-permissions.user')
        .validatePassword(password, user.password);

      if (!isPasswordValid) {
        strapi.log.warn(`[SecOps] Account deletion failed: wrong password. correlationId=${correlationId}`);
        return ctx.badRequest('Mot de passe incorrect.');
      }

      // 6. Transaction de suppression (syntaxe Strapi 5)
      await strapi.db.transaction(async ({ trx }) => {
        // La suppression physique supprime également la liaison up_users_role_lnk par cascade
        await strapi.db.query('plugin::users-permissions.user').delete({
          where: { id: userId }
        });
      });

      strapi.log.info(`[SecOps] Account deletion successful. correlationId=${correlationId}`);

      // 7. Envoi de l'e-mail de confirmation après validation définitive de la transaction
      let emailSent = false;
      let emailTimeoutId;
      try {
        const senderEmail = process.env.BREVO_SENDER_EMAIL || 'Cyberscop.Lab@gmail.com';
        const now = new Date();
        const deletionDateUTC = now.toISOString();

        const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
          timeZone: 'Europe/Paris',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
          timeZone: 'Europe/Paris',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        const tzFormatter = new Intl.DateTimeFormat('fr-FR', {
          timeZone: 'Europe/Paris',
          timeZoneName: 'short'
        });

        const parts = tzFormatter.formatToParts(now);
        const tzNamePart = parts.find(p => p.type === 'timeZoneName');
        const tzName = tzNamePart ? tzNamePart.value : 'UTC+2';

        const parisDateStr = dateFormatter.format(now);
        const parisTimeStr = timeFormatter.format(now);
        const humanReadableParisDate = `${parisDateStr} à ${parisTimeStr} (${tzName})`;

        const emailPromise = strapi.plugin('email').service('email').send({
          to: userEmail,
          from: senderEmail,
          subject: 'Confirmation de suppression de votre compte — CyberScope LAB',
          text: `Bonjour,\n\nNous vous confirmons que votre compte CyberScope LAB a été supprimé de notre base de données active.\n\nCette opération a entraîné la suppression des informations directement associées à votre compte et la désactivation de son accès.\n\nConformément à l'article 17 du Règlement général sur la protection des données, relatif au droit à l'effacement, votre demande a été exécutée.\n\nCette confirmation vous est communiquée conformément à l'article 12, paragraphe 3, du RGPD, relatif à l'information fournie sur les mesures prises à la suite de l'exercice d'un droit.\n\nDes copies techniques peuvent éventuellement subsister temporairement dans les sauvegardes jusqu'à leur rotation sécurisée. Elles ne sont pas utilisées dans le fonctionnement courant du site.\n\nVous ne pourrez plus vous connecter avec les anciens identifiants du compte supprimé.\n\nSi vous n'êtes pas à l'origine de cette opération, contactez rapidement CyberScope LAB à l'adresse suivante : Cyberscop.Lab@gmail.com.\n\nDétails techniques de l'opération :\n- Date et heure de suppression (heure de Paris) : ${humanReadableParisDate}\n- Horodatage technique (UTC) : ${deletionDateUTC}\n- Identifiant de transaction (UUID) : ${correlationId}\n\nL'équipe CyberScope LAB`,
          html: `<p>Bonjour,</p><p>Nous vous confirmons que votre compte CyberScope LAB a été supprimé de notre base de données active.</p><p>Cette opération a entraîné la suppression des informations directement associées à votre compte et la désactivation de son accès.</p><p>Conformément à l’article 17 du Règlement général sur la protection des données, relatif au droit à l’effacement, votre demande a été exécutée.</p><p>Cette confirmation vous est communiquée conformément à l’article 12, paragraphe 3, du RGPD, relatif à l’information fournie sur les mesures prises à la suite de l’exercice d’un droit.</p><p>Des copies techniques peuvent éventuellement subsister temporairement dans les sauvegardes jusqu’à leur rotation sécurisée. Elles ne sont pas utilisées dans le fonctionnement courant du site.</p><p>Vous ne pourrez plus vous connecter avec les anciens identifiants du compte supprimé.</p><p>Si vous n’êtes pas à l’origine de cette opération, contactez rapidement CyberScope LAB à l’adresse suivante : <a href="mailto:Cyberscop.Lab@gmail.com">Cyberscop.Lab@gmail.com</a>.</p><p><strong>Détails techniques de l'opération :</strong><br/>- Date et heure de suppression (heure de Paris) : ${humanReadableParisDate}<br/>- Horodatage technique (UTC) : ${deletionDateUTC}<br/>- Identifiant de transaction (UUID) : ${correlationId}</p><p>L’équipe CyberScope LAB</p>`
        });

        const timeoutPromise = new Promise((_, reject) => {
          emailTimeoutId = setTimeout(() => reject(new Error('Email service timeout')), 5000);
        });

        const result = await Promise.race([emailPromise, timeoutPromise]);
        if (emailTimeoutId) clearTimeout(emailTimeoutId);

        if (result !== true) {
          throw new Error(`Email provider returned invalid status: ${result}`);
        }
        emailSent = true;
        strapi.log.info(`[SecOps] Confirmation email sent successfully. correlationId=${correlationId}`);
      } catch (emailError) {
        if (emailTimeoutId) clearTimeout(emailTimeoutId);
        strapi.log.error(`[SecOps] Confirmation email sending failed. correlationId=${correlationId}, error=${emailError.message}`);
      }

      return ctx.send({
        success: true,
        emailSent
      });

    } catch (error) {
      strapi.log.error(`[SecOps] Account deletion transactional error. correlationId=${correlationId}, error=${error.message}`);
      return ctx.internalServerError('Une erreur interne est survenue lors de la suppression du compte.');
    }
  }
};
