import { $ } from 'zx';
import 'zx/globals';
import { YAML } from 'zx';
import { read } from 'fsxx';
let cl = console.log;
async function logs() {
  let pkg = JSON.parse(await read('package.json'));
  let { name, version } = pkg;
  let services = await $`docker stack services ${name} --format "{{.Name}}"`;
  services.split('\n').forEach(async (service) => {
    await $`docker service logs ${service}`;
  });
}

await logs();
