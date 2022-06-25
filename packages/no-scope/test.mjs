import hub from './index.mjs';
import Gun from 'gun';
import { read } from 'fsxx';
import debug from './debug.mjs';
import { $ } from 'zx';
const { log, error, warn } = debug();
let peer =
  process.env.NODE_ENV !== 'production'
    ? `http://${process.env.DOMAIN}/gun`
    : `https://${env.DOMAIN}/gun`;
const gun = Gun({ peers: [peer], localStorage: false });
hub.watch(['packages/**/*.ts', 'packages/**/*.mjs', 'packages/**/*.tsx']);

gun.get('hub').on(async (data) => {
  console.log(data);
  await $`echo "running hub"`;
});

gun.get('hub').put({ test: 'node' });

gun.get('hub').once((data) => {
  console.log('HUBBARD');
});
