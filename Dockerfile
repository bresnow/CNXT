FROM bresnow/alpnode-wrkspce:base
ENV PUB=${PUB} 
ENV PRIV=${PRIV} 
ENV EPUB=${EPUB}
ENV EPRIV=${EPRIV}
ENV PORT=8081
ENV PEER_DOMAIN=${PEER_DOMAIN}
ENV DOMAIN=${DOMAIN}

COPY ./cnxt-supervisor.conf /etc/supervisord/cnxt-supervisor.conf
COPY . /app

WORKDIR  /app
RUN yarn 
#     && yarn build:worker \
#     && yarn build:css \
#     && yarn build 


ENTRYPOINT /usr/bin/supervisord "/etc/supervisord/cnxt-supervisor.conf"
