import { $ } from 'zx';
import 'zx/globals';
import {
    YAML
} from 'zx'
import { read } from 'fsxx';

let serviceNames = Object.keys(YAML.parse(await read('swarm-stacks/remix-gun.yml')).services).map(x => x.split('.')[0])

serviceNames.forEach(serviceName => {
    await $`docker service logs ${pkg.name.replace('.', '-')}_${serviceName}`;
})

