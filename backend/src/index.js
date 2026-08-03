'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      // 1. Révoquer la permission user.destroy pour le rôle Authenticated
      const authenticatedRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
        populate: ['permissions'],
      });

      if (authenticatedRole) {
        const destroyPermission = authenticatedRole.permissions.find(
          (p) => p.action === 'plugin::users-permissions.user.destroy'
        );
        if (destroyPermission) {
          await strapi.db.query('plugin::users-permissions.permission').delete({
            where: { id: destroyPermission.id },
          });
          strapi.log.info('Sécurisation : Permission user.destroy révoquée pour le rôle Authenticated.');
        }

        // 2. Assurer que la permission api::account.account.delete est activée pour le rôle Authenticated
        const hasDeletePermission = authenticatedRole.permissions.some(
          (p) => p.action === 'api::account.account.delete'
        );
        if (!hasDeletePermission) {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::account.account.delete',
              role: authenticatedRole.id,
            },
          });
          strapi.log.info('Sécurisation : Permission api::account.account.delete activée pour le rôle Authenticated.');
        }
      }

      // 3. Révoquer la permission api::account.account.delete du rôle Public (par précaution)
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
        populate: ['permissions'],
      });

      if (publicRole) {
        const publicDeletePermission = publicRole.permissions.find(
          (p) => p.action === 'api::account.account.delete'
        );
        if (publicDeletePermission) {
          await strapi.db.query('plugin::users-permissions.permission').delete({
            where: { id: publicDeletePermission.id },
          });
          strapi.log.info('Sécurisation : Permission api::account.account.delete révoquée pour le rôle Public.');
        }
      }
    } catch (err) {
      strapi.log.error(`Erreur lors du paramétrage des permissions de sécurité : ${err.message}`);
    }
  },
};
