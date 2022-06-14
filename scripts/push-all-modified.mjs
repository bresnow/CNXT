import { $, question, YAML, chalk, sleep } from 'zx'
import { read, io, write } from 'fsxx'
import 'zx/globals';
let pkg = await io.json`package.json`
let message, version
let args = process.argv.slice(3)
if (args.length > 0) {

    for (let i = 0; i < args.length; i++) {

        let arg = args[i]

        if (arg.startsWith('--message=' || '-m=' || '--message' || '-m')) {

            message = arg.includes("=") ? arg.split('=')[1] : args[i + 1]
        }

        if (arg.startsWith('--version=' || '-v=' || '--version' || '-v')) {

            version = arg.includes("=") ? arg.split('=')[1] : args[i + 1]
        }
        if (arg.startsWith('--silent' || '-s')) {

            $.verbose = false

        }

    }

}

if (message === undefined) {
    message = await question("Message for commit : ")
    if (message === '' || message === ' ' || typeof message === 'undefined') {
        message = 'Update'
    }
}

if (version === undefined) {
    version = await question(`Version ? \n ${chalk.bgCyan('Current Version ') + chalk.cyan(pkg.data.version)}: `)
    typeof version === 'undefined' ? version = (Number(pkg.data.version) + .01).toString().trim() : version = version.trim()
}

//PACKAGE>JSON MODIFY VERSION

pkg.data.version = version
await pkg.save()
await $`git status`
// GITHUB WORKFLOW VERSION ENV REVISION
let status = await $`git status`.pipe($`grep "On branch"`)
let branch = status.stdout.replace("On branch ", "").trim()
const yml = YAML.parse(fs.readFileSync(`.github/workflows/${branch}.yml`, "utf8"))
yml.env.VERSION = version
await write(`.github/workflows/${branch}.yml`, YAML.stringify(yml))



let tag$ = await question(`Are we tagging version ${version} ? (y/n) `)

if (tag$ === ('Y' || 'y' || "Yes" || "yes")) {
    await $`git tag -a ${version} -m "${message}"`
    let docker = await question(`Build and push image to ghcr.io? (y/n) `)
    if (docker === ('Y' || 'y' || "Yes" || "yes")) {
        await $`npx zx scripts/docker/build-push-gh.mjs --image=ghcr.io/bresnow/${JSON.parse(await read('package.json')).name + branch === "main" ? null : `-${branch}`} --version=${version}`
    }
}

await $`git add --all`
await $`git commit -s -m ${`${message} | ${version}`}`
await $`git push -uf origin ${branch}`
