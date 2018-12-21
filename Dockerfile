#####################################
#        BACKEND ENVIRONMENT        #
#####################################
FROM node:lts-alpine AS backend-base
WORKDIR /app
COPY package*.json /app/
RUN apk add --no-cache g++ make python3
RUN npm i -g node-gyp 

FROM backend-base AS backend-dev
RUN npm install
RUN npm install pg
CMD ["npm", "run", "dev"]

FROM backend-base AS backend-build
WORKDIR /app
COPY --from=backend-base /app/package*.json /app/
RUN npm ci --only=production

FROM backend-build AS backend-final
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /app
RUN addgroup halley -g 12345 && \
    adduser -u 23456 --ingroup halley --home /home/halley \
    --disabled-password -s /sbin/nologin --gecos "halley user" halley && \
    chmod 755 /app && chown halley:halley /app
USER halley
COPY --chown=halley:halley --from=backend-build /app/node_modules /app/node_modules
COPY --chown=halley:halley /src /app/src
RUN mkdir /app/documents
CMD ["dumb-init", "node", "src/server.js"]