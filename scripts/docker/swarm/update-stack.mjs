import { $, chalk, question } from 'zx';
import { read } from 'fsxx';
let pkg = JSON.parse(await read('package.json'));
import 'zx/globals';

await $`docker service update ${pkg.name.replace(
  '.',
  '-'
)}_fltngmmth --image=bresnow/${image}:${pkg.version}`;
await $`docker service update ${pkg.name.replace(
  '.',
  '-'
)}_cnxt --image=bresnow/${image}:${pkg.version}`;
