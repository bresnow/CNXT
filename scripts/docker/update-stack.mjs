import { $, chalk, question } from "zx";
import { read } from 'fsxx'
let pkg = JSON.parse(await read('package.json'))

let image = pkg.name, version = pkg.version, stack
let args = process.argv.slice(3);
let svc = await $`docker service ls --format  {{.Name}}`.pipe($`grep ${args[0]}`)
console.log(chalk.cyanBright(`Updating stack ${args[0]}`))
await $`docker service update ${svc} --image=bresnow/${image}:${version}`
console.log(chalk.cyanBright('Fin'))