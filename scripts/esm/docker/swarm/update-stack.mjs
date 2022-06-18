import { $, YAML } from 'zx';
import { read } from 'fsxx';
import 'zx/globals';
let pkg = JSON.parse(await read('package.json'));

await $`docker stack deploy -c swarm-stacks/demo.yml rg_app`;
