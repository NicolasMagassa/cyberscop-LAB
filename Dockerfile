FROM nginx:1.25-alpine

# Configuration pour exécuter Nginx en tant que non-root pour améliorer la sécurité (IaC Hardening)
# Par défaut, le conteneur officiel Nginx tourne en root. Nous configurons ici l'utilisateur 'nginx' (UID 101) existant dans l'image.
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx && \
    chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

# Copier les fichiers du site web statique avec les bons droits d'accès
COPY --chown=nginx:nginx . /usr/share/nginx/html/

# Nettoyage des fichiers et dossiers de développement pour ne pas alourdir l'image et éviter les fuites d'infos en prod
RUN rm -rf /usr/share/nginx/html/backend \
           /usr/share/nginx/html/node_modules \
           /usr/share/nginx/html/tests \
           /usr/share/nginx/html/playwright-report \
           /usr/share/nginx/html/test-results \
           /usr/share/nginx/html/.git \
           /usr/share/nginx/html/.github \
           /usr/share/nginx/html/docs \
           /usr/share/nginx/html/scratch \
           /usr/share/nginx/html/package.json \
           /usr/share/nginx/html/package-lock.json \
           /usr/share/nginx/html/playwright.config.js \
           /usr/share/nginx/html/.eslintrc.json \
           /usr/share/nginx/html/.pre-commit-config.yaml

# Copier la configuration personnalisée et sécurisée de Nginx
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Passer à l'utilisateur non-root nginx pour l'exécution
USER nginx

# Utiliser le port 8080 car les ports < 1024 nécessitent des privilèges root
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
