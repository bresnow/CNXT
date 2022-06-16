import { $, chalk, question } from 'zx';
import { read } from 'fsxx';
let pkg = JSON.parse(await read('package.json'));
import 'zx/globals';

await $`docker service logs ${pkg.name.replace('.', '-')}_fltngmmth`;
await $`docker service logs ${pkg.name.replace('.', '-')}_cnxt`;
