import { $, chalk, question } from "zx";
import { read } from 'fsxx'
let pkg = JSON.parse(await read('package.json'))

let image = pkg.name, version = pkg.version, stack
let args = process.argv.slice(3);

if (args.length > 0) {
    for (let i = 0; i < args.length; i++) {
        let arg = args[i]
        if (arg.startsWith('--stack-name=' || '-s=' || '--stack-name' || '-s')) {
            stack = arg.includes("=") ? arg.split('=')[1] : args[i + 1]
        }
    }
}
console.log(chalk.cyanBright(`Updating stack ${stack}`))
await $`docker service update ${stack} --image=bresnow/${image}:${version}`
console.log(chalk.cyanBright('Fin'))