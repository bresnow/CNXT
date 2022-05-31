FROM node:16-alpine 
ENV PUB=${PUB} 
ENV PRIV=${PRIV} 
ENV EPUB=${EPUB}
ENV EPRIV=${EPRIV}
ENV CLIENT_PORT=${CLIENT_PORT}
ENV PEER_DOMAIN=${PEER_DOMAIN}
ENV DOMAIN=${DOMAIN}
ARG version=${VERSION}

COPY . /app

WORKDIR  /app
RUN yarn \
    && yarn build 

CMD ["yarn", "start"] 
LABEL org.opencontainers.image.source https://github.com/bresnow/remix.gun-react-18-streaming