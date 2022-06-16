import { $, chalk, question } from 'zx';
import { read } from 'fsxx';
let pkg = JSON.parse(await read('package.json'));
import 'zx/globals';

await $`docker service ls --format  {{.Name}}`.stdout.toString()
  .slice('\n')
  .forEach(async (line) => {
    await $`docker service logs ${line}`;
  });
