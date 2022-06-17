import { $ } from 'zx';
import 'zx/globals';
import { YAML } from 'zx';
import { read } from 'fsxx';
let cl = console.log;
async function logs() {
  let pkg = JSON.parse(await read('package.json'));
  let services = Object.keys(
    YAML.parse(await read('swarm-stacks/remix-gun.yml'))
  );

  let str = YAML.stringify(await read('swarm-stacks/remix-gun.yml'));

  cl(JSON.parse(JSON.stringify(str)));
  // services.forEach(async (serviceName) => {
  //   await $`docker service logs ${pkg.name.replace('.', '-')}_${serviceName}`;
  // });
}

await logs();
