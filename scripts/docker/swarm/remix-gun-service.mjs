import { $, question, YAML, chalk, sleep } from 'zx'
import 'zx/globals';
import { read } from 'fsxx'
let pkg = JSON.parse(await read('package.json'))
let args = process.argv.slice(3)


await $`export VERSION=${pkg.version}`
await $`docker stack deploy -c swarm-stacks/remix-gun.yml app-${pkg.name.replace(".", "-")}`
