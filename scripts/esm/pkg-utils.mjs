import 'zx/globals';
import { read } from 'fsxx';

async function getConfig() {
  let args = process.argv.slice(3);
  let pkg = JSON.parse(await read('package.json'));
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (arg.startsWith('--name ' || '-n')) {
      console.log(`${pkg.name.replace('.', '-')}`);
    }
    if (arg.startsWith('--version ' || '-v')) {
      console.log(`${pkg.version}`);
    }
  }
}
await getConfig();
