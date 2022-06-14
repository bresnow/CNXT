import { $, chalk } from "zx";

let args = process.argv.slice(3);

/**
 * Export all the env variables. Maps are so much cleaner than switch statements.
 */
let handler = new Map([
    ["--version" || "-v", async (arg) => {
        let version = arg
        await $`export VERSION=${version}`
    }], ["--image" || "-i", async (arg) => {
        let image = arg
        await $`export IMAGE=${image}`
    }]]);
for (let i = 0; i < args.length; i++) {
    if (handler.has(args[i])) {
        await handler.get(args[i + 1])()
    }
}
console.log(chalk.cyanBright('Building bresnow/$IMAGE:$VERSION'))
await $`docker build -t bresnow/$IMAGE:$VERSION .`
console.log(chalk.cyanBright('Pushing bresnow/$IMAGE:$VERSION to Docker Hub'))
await $`docker push bresnow/$IMAGE:$VERSION`
console.log(chalk.greenBright('Fin'))

