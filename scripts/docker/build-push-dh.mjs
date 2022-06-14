#!/usr/bin/env zx
import { $, chalk } from "zx";

import { getImageAndVersion } from "./helpers/index.mjs";
let { image, version } = await getImageAndVersion()
console.log(chalk.cyanBright(`Building bresnow/${image}:${version}`))
await $`docker build -t bresnow/${image}:${version} .`
console.log(chalk.cyanBright(`Pushing bresnow/${image}:${version} to Docker Hub`))
await $`docker push bresnow/${image}:${version}`
console.log(chalk.greenBright('Fin'))

