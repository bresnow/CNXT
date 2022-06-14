import { $, chalk } from "zx";
import { read } from "fsxx";

let pkg = JSON.parse(await read('package.json'))

let image = pkg.name, version = pkg.version

console.log(chalk.cyanBright(`Building ghcr.io/bresnow/${image}:${version}`))
await $`docker build -t ghcr.io/bresnow/${image}:${version} .`


console.log(chalk.cyanBright(`Pushing ghcr.io/bresnow/${image}:${version} to Docker Hub`))
await $`docker push ghcr.io/bresnow/${image}:${version}`


console.log(chalk.greenBright('Fin'))