'use strict';

module.exports = (plugin) => {
  const routes = plugin.routes['content-api'].routes;
  const initialCount = routes.length;

  // Filtrage sécurisé et strict de la route DELETE /users/:id
  plugin.routes['content-api'].routes = routes.filter(
    (route) => !(
      route.method === 'DELETE' &&
      route.path === '/users/:id' &&
      route.handler === 'user.destroy'
    )
  );

  const finalCount = plugin.routes['content-api'].routes.length;

  // Validation automatisée empêchant le bypass silencieux lors d'évolutions futures
  if (initialCount - finalCount !== 1) {
    throw new Error(
      `[users-permissions-extension] SecOps Failure: La route générique de suppression (DELETE /users/:id) n'a pas été localisée ou supprimée. ` +
      `Initial count: ${initialCount}, Final count: ${finalCount}`
    );
  }

  return plugin;
};
