# Étape 1 : Construction de l'application
FROM node:20-alpine AS build

# Installer les outils nécessaires pour la compilation des dépendances natives (ex. better-sqlite3 ou libpng)
RUN apk update && apk add --no-cache build-base gcc autoconf automake libtool zlib-dev libpng-dev nasm bash vips-dev

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/

# Copier les fichiers de dépendances séparément pour utiliser le cache Docker
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

WORKDIR /opt/app
COPY . .
RUN npm run build

# Étape 2 : Image finale légère
FROM node:20-alpine

# Installer vips-dev (requis pour le traitement d'images dans Strapi)
RUN apk add --no-cache vips-dev

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY --from=build /opt/node_modules ./node_modules

WORKDIR /opt/app
COPY --from=build /opt/app ./

# Configurer les permissions pour l'utilisateur non-root par défaut 'node' (UID 1000)
RUN chown -R node:node /opt/app /opt/node_modules
USER node

# Exposer le port par défaut de Strapi
EXPOSE 1337

CMD ["npm", "run", "start"]
