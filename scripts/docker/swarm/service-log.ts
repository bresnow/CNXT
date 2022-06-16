import { $ } from 'zx';
import 'zx/globals';
import {
    YAML
} from 'zx'
import { read } from 'fsxx';
export async function logs() {
    let pkg = JSON.parse(await read('package.json'));
    let serviceNames = Object.keys(YAML.parse(await read('swarm-stacks/remix-gun.yml')))
    serviceNames.forEach(async serviceName => {
        await $`docker service logs ${pkg.name.replace('.', '-')}_${serviceName}`;
    })
}


