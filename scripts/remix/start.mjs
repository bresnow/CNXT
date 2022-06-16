import { $ } from 'zx';
await $`unocss \"packages/**/*.tsx\" --out-file \"packages/app/uno.css\"`
  .pipe(
    $`cross-env NODE_ENV=production remix build`
  )
  .pipe($`cross-env-shell NODE_ENV=production PUB=$PUB PRIV=$PRIV EPUB=$EPUB EPRIV=$EPRIV DOMAIN=$DOMAIN CLIENT_PORT=$CLIENT_PORT PEER_DOMAIN=$PEER_DOMAIN node ./build/index.js`);
