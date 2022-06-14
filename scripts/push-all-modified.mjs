import { $, question, YAML, chalk, sleep } from 'zx'
import { cd, io, write } from 'fsxx'
import path from 'path'
import 'zx/globals';

function argumentsArray() {

}


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

let pkg = await io.json`package.json`
if (version === undefined) {
    version = await question(`Version ? \n ${chalk.bgCyan('Current Version ') + chalk.cyan(pkg.data.version)}: `)
    typeof version === 'undefined' ? version = (Number(pkg.data.version) + .01).toString().trim() : version = version.trim()
}
let tag$ = await question(`Are we tagging version ${version} ? (y/n/help) `)

if (tag$ === ('Y' || 'y' || "Yes" || "yes")) {
    await $`git tag -a ${version} -m "${message}"`
}
if (tag$ === ('N' || 'n' || "No" || "no")) {
    console.log(`Not tagging version ${version}`)
}
if (tag$ === ('H' || 'h' || "Help" || "help")) {
    console.log(chalk.redBright(`God helps those that help themselves. No one helps God. Duck Duck Go search some git docs`))
    sleep(1000)
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



await gitAddAllModified()

await $`git commit -s -m ${`${message} | ${version}`}`
await $`git push`

async function gitAddAllModified() {
    let mod = await $`git status`.pipe($`grep modified:`)
    mod.stdout.split("modified: ").forEach(async (line) => {
        let filename = line.trim()
        if (filename.length > 1) {
            await $`git add ${filename}`
        }
    })
}