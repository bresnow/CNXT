FROM node:14-alpine 
ENV APP_KEY_PAIR=${APP_KEY_PAIR} 
ENV CLIENT_PORT=${CLIENT_PORT}
ENV PEER_DOMAIN=${PEER_DOMAIN}
ENV DOMAIN=${DOMAIN}

COPY . /app

WORKDIR  /app
RUN yarn \
    && yarn purge \
    && yarn build 

CMD ["yarn", "start"] 