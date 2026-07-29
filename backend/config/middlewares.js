module.exports = ({ env }) => {
  const isDevOrTest = env('NODE_ENV', 'development') === 'development' || env('NODE_ENV', 'test') === 'test';
  
  const allowedOrigins = [
    env('FRONTEND_URL', 'https://nicolasmagassa.github.io')
  ];

  if (isDevOrTest) {
    allowedOrigins.push(
      'http://localhost:8000',
      'http://localhost:8080',
      'http://127.0.0.1:8080'
    );
  }

  return [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
        keepHeaderOnError: true,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
