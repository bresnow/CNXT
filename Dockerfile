FROM bresnow/alpnode-wrkspce:base

COPY ./docker_env/cnxt-supervisor.conf /etc/supervisord/cnxt-supervisor.conf

ENV PUB 5hVTigjYHty7Vj-ofchDFdAXgHLFyqu9jb_Qjh7vRpg.aevkrLvBWD91XGdpXNZiiXysKj_4QGqqtteUYI6pZ8Q 
ENV PRIV x64TSrxG8aIJ6BYmfi4nt26vydaDeaJ6ub9Plmc8hNk 
ENV EPUB C5iraTKKmk5pUrSBCBHlpb-P2lxoqkdqDoSpTZLX06k.3Y_fjpOn_mbGdWq6fw8m_haZflJI34IEOxim0aJjm70 
ENV EPRIV stDUVaWdqmUrGD67g8RfLkqocM80EZvHstvrof9BGfQ 
ENV PORT 8081
ENV DOMAIN localhost:${PORT} 
ENV PEER_DOMAIN dev.cnxt.app

COPY . /app

WORKDIR  /app
RUN yarn \
    && yarn build:worker \
    && yarn build:css \
    && yarn build 

# export PUB=5hVTigjYHty7Vj-ofchDFdAXgHLFyqu9jb_Qjh7vRpg.aevkrLvBWD91XGdpXNZiiXysKj_4QGqqtteUYI6pZ8Q \
#     && export PRIV=x64TSrxG8aIJ6BYmfi4nt26vydaDeaJ6ub9Plmc8hNk \
#     && export EPUB=C5iraTKKmk5pUrSBCBHlpb-P2lxoqkdqDoSpTZLX06k.3Y_fjpOn_mbGdWq6fw8m_haZflJI34IEOxim0aJjm70 \
#     && export EPRIV=stDUVaWdqmUrGD67g8RfLkqocM80EZvHstvrof9BGfQ \
#     && export PORT=8081 \
#     && export DOMAIN=localhost:${PORT} \
#     && export PEER_DOMAIN=dev.cnxt.app