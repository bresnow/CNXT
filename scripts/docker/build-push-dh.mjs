#!/usr/bin/env zx
import { $, chalk } from "zx";
import { read } from "fsxx";
let pkg = JSON.parse(await read('package.json'))
let status = await $`git status`.pipe($`grep "On branch"`)
let branch = status.stdout.replace("On branch ", "").trim()
let image = pkg.name + "-" + branch, version = pkg.version
console.log(chalk.cyanBright(`Building bresnow/${image}:${version}`))
await $`docker build -t bresnow/${image}:${version} .`
console.log(chalk.cyanBright(`Pushing bresnow/${image}:${version} to Docker Hub`))
await $`docker push bresnow/${image}:${version}`
console.log(chalk.greenBright('Fin'))

