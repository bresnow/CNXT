import { $, question, YAML, chalk, sleep } from 'zx'
import 'zx/globals';
import { read } from 'fsxx'
let pkg = JSON.parse(await read('package.json'))
let args = process.argv.slice(3)

let t = await $`docker stack deploy  -c swarm-stacks/traefik.yml traefik-${pkg.name}`
if (!t.stderr) {
    await $`export VERSION=${pkg.version} docker stack deploy -c swarm-stacks/remix-gun.yml app-${pkg.name}`
}