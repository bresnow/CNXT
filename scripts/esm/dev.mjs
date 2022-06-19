import { $ } from 'zx';
await $`unocss \"packages/**/*.tsx\" --out-file \"packages/app/uno.css\" --watch`
  .pipe($`cross-env NODE_ENV=development remix watch`)
  .pipe(
    $`cross-env-shell NODE_ENV=development PUB=5hVTigjYHty7Vj-ofchDFdAXgHLFyqu9jb_Qjh7vRpg.aevkrLvBWD91XGdpXNZiiXysKj_4QGqqtteUYI6pZ8Q PRIV=x64TSrxG8aIJ6BYmfi4nt26vydaDeaJ6ub9Plmc8hNk EPUB=C5iraTKKmk5pUrSBCBHlpb-P2lxoqkdqDoSpTZLX06k.3Y_fjpOn_mbGdWq6fw8m_haZflJI34IEOxim0aJjm70 EPRIV=stDUVaWdqmUrGD67g8RfLkqocM80EZvHstvrof9BGfQ DOMAIN='localhost:3336' CLIENT_PORT='3336' PEER_DOMAIN='rmx-gun.fltngmmth.com, rmx-gun-peer.fltngmmth.com, dev.cnxt.app'  nodemon ./build/index.js --watch ./build/index.js`
  );
