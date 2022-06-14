import { $, chalk, question } from "zx";
import { read } from 'fsxx'
let pkg = JSON.parse(await read('package.json'))
let status = await $`git status`.pipe($`grep "On branch"`)
let branch = status.stdout.replace("On branch ", "").trim()
let image = `${pkg.name + branch === "main" ? null : `-${branch}`, version = pkg.version}`, stack
let args = process.argv.slice(3);

if (args.length > 0) {
    for (let i = 0; i < args.length; i++) {
        let arg = args[i]
        if (arg.startsWith('--stack-name=' || '-s=' || '--stack-name' || '-s')) {
            stack = arg.includes("=") ? arg.split('=')[1] : args[i + 1]
        }
    }
}
stack = await question(`Stack name ? `)
console.log(chalk.cyanBright(`Updating stack ${stack}`))
await $`docker service update ${stack} --image=bresnow/${image}:${version}`
console.log(chalk.cyanBright('Fin'))