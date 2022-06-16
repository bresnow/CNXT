import { $, question, YAML, chalk, sleep } from 'zx';
import 'zx/globals';
import { read } from 'fsxx';
let pkg = JSON.parse(await read('package.json'));
await $`export VERSION=${pkg.version}`;
await $`docker stack deploy -c swarm-stacks/traefik.yml ${pkg.name.replace(
  '.',
  '-'
)}`;
