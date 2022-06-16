import 'zx/globals';
import { read } from 'fsxx';

async function getConfig() {
  let args = process.argv.slice(3);
  let pkg = JSON.parse(await read('package.json'));
  console.log({
    name: `${pkg.name.replace('.', '-')}`,
    version: `${pkg.version}`,
  });
}

getConfig();
