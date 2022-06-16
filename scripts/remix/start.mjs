import { $ } from 'zx';
let args = process.argv.slice(3);

/** Build and start the app in production */
if (args.length > 0) {
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (arg.startsWith('--build' || '-b')) {
      await $`cross-env NODE_ENV=production remix build`;
      await $`cross-env-shell NODE_ENV=production PUB=$PUB PRIV=$PRIV EPUB=$EPUB EPRIV=$EPRIV DOMAIN=$DOMAIN CLIENT_PORT=$CLIENT_PORT PEER_DOMAIN=$PEER_DOMAIN node ./build/index.js`;
    } else {
      await $`cross-env-shell NODE_ENV=production PUB=$PUB PRIV=$PRIV EPUB=$EPUB EPRIV=$EPRIV DOMAIN=$DOMAIN CLIENT_PORT=$CLIENT_PORT PEER_DOMAIN=$PEER_DOMAIN node ./build/index.js`;
    }
  }
}
