FROM node:17-alpine 
ENV PUB=${PUB} 
ENV PRIV=${PRIV} 
ENV EPUB=${EPUB}
ENV EPRIV=${EPRIV}
ENV CLIENT_PORT=${CLIENT_PORT}
ENV PEER_DOMAIN=${PEER_DOMAIN}
ENV DOMAIN=${DOMAIN}

COPY . /app

WORKDIR  /app
RUN yarn \
    && yarn build \
    && yarn build:css \
    && yarn build:worker
CMD ["yarn", "start"] 
LABEL org.opencontainers.image.source https://github.com/bresnow/remix.gun
