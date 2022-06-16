import 'zx/globals';
import {
    YAML
} from 'zx'
import { read } from 'fsxx';
let args = process.argv.slice(3)
let serviceNames = Object.keys(YAML.parse(await read('swarm-stacks/remix-gun.yml')).services).map(x => x.split('.')[0])
console.log(serviceNames)