import { $ } from 'zx';

await $`unocss \"**/*.tsx\" --out-file \"app/uno.css\"`
  .pipe(
    $`esbuild app/entry.worker.tsx --outfile=public/entry.worker.js --minify --bundle --format=esm --define:process.env.NODE_ENV='\"production\"'`
  )
  .pipe($`cross-env NODE_ENV=production remix build`)
  .pipe(
    $`cross-env-shell NODE_ENV=production PUB=$PUB PRIV=$PRIV EPUB=$EPUB EPRIV=$EPRIV DOMAIN=$DOMAIN PORT=$PORT PEER_DOMAIN=$PEER_DOMAIN node ./build/index.js`
  );
