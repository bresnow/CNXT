import { $, question, YAML, chalk } from 'zx'
import { cd, io, write } from 'fsxx'
import path from 'path'
import 'zx/globals';


$.verbose = false;
cd(path.resolve(__dirname, '..'))
let message, version
let args = process.argv.slice(3)
if (args.length > 0) {
    for (let i = 0; i < args.length; i++) {
        let arg = args[i]
        if (arg.startsWith('--message=' || '-m=' || '--message' || '-m')) {
            message = arg.split('=')[1]
        }
        if (arg.startsWith('--version=' || '-v=' || '--version' || '-v')) {
            version = arg.split('=')[1]
        }
    }
}
if (message === undefined) {
    message = await question("Message for commit: ")
    if (message === '' || message === ' ' || typeof message === 'undefined') {
        message = 'Update'
    }
}

let pkg = await io.json`package.json`
if (version === undefined) {
    version = await question(`Version ? \n ${chalk.bgCyan('Current Version Is ') + chalk.cyan(pkg.data.version)}: `)
}
//PACKAGE>JSON MODIFY VERSION
pkg.data.version = version
await pkg.save()


// GITHUB WORKFLOW VERSION ENV REVISION
let status = await $`git status`.pipe($`grep "On branch"`)
let branch = status.stdout.replace("On branch ", "").trim()
const yml = YAML.parse(fs.readFileSync(`.github/workflows/${branch}.yml`, "utf8"))
yml.env.VERSION = version
await write(`.github/workflows/${branch}.yml`, YAML.stringify(yml))



await gitAddAllModified()

$.verbose = true
await $`git commit -s -m ${`${message} | ${version}`}`
await $`git push`

async function gitAddAllModified() {
    let mod = await $`git status`.pipe($`grep modified:`)
    $.verbose = true
    mod.stdout.split("modified: ").forEach(async (line) => {
        let filename = line.trim()
        if (filename.endsWith('index.lock')) {
            return
        }
        if (filename.length > 1) {
            await $`git add ${filename}`
        }
    })
}