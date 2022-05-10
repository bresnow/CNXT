FROM node:14-alpine 
ENV APP_KEY_PAIR=${APP_KEY_PAIR} 
ENV CLIENT_PORT=${CLIENT_PORT}
ENV PEER_DOMAIN=${PEER_DOMAIN}
ENV DOMAIN=${DOMAIN}

RUN apk add --no-cache git
RUN git clone https://github.com/bresnow/remix.gun-react-18-streaming /app

WORKDIR  /app
RUN yarn \
    && yarn purge \
    && yarn build 

RUN rm -rf app 
CMD ["yarn", "start"] 