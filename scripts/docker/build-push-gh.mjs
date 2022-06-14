import { $, chalk } from "zx";
import { getImageAndVersion } from "./helpers/index.mjs";


let { image, version } = await getImageAndVersion()


console.log(chalk.cyanBright(`Building ghcr.io/bresnow/${image}:${version}`))
await $`docker build -t ghcr.io/bresnow/${image}:${version} .`


console.log(chalk.cyanBright(`Pushing ghcr.io/bresnow/${image}:${version} to Docker Hub`))
await $`docker push ghcr.io/bresnow/${image}:${version}`


console.log(chalk.greenBright('Fin'))