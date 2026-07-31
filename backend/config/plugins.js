module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'strapi-provider-email-brevo',
      providerOptions: {
        apiKey: env('BREVO_API_KEY'),
      },
      settings: {
        defaultSenderEmail: env('BREVO_SENDER_EMAIL'),
        defaultSenderName: env('BREVO_SENDER_NAME'),
        defaultReplyTo: env('BREVO_SENDER_EMAIL'),
      },
    },
  },
  'users-permissions': {
    config: {
      ...(process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' ? {
        ratelimit: {
          interval: 60000,
          max: 1000,
        }
      } : {}),
      validationRules: {
        validatePassword: async (value) => {
          if (!value) return true;

          // 1. Minimum 12 Unicode code points
          const charCount = Array.from(value).length;
          if (charCount < 12) {
            throw new Error("Le mot de passe doit contenir au moins 12 caractères.");
          }

          // 2. Maximum 72 UTF-8 bytes
          const byteCount = Buffer.byteLength(value, 'utf8');
          if (byteCount > 72) {
            throw new Error("Le mot de passe ne doit pas dépasser la limite technique de 72 octets.");
          }

          // 3. No only-spaces passwords
          if (value.trim().length === 0) {
            throw new Error("Le mot de passe ne peut pas être composé uniquement d'espaces.");
          }

          return true;
        },
      },
    },
  },
});
