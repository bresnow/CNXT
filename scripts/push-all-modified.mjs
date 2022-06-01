import { $, nothrow, chalk, question, } from 'zx'
import { cd } from 'fsxx'
import fs from 'fs'
import path from 'path'
import 'zx/globals';

let cl = console.log;
$.verbose = false;
cd(path.resolve(__dirname, '..'))

let args = process.argv.slice(3)
let message = args.length > 0 && (args[0] === "--message" || args[0] === "-m") ? args[1] : args[0]
if (message === undefined) {
    message = await question("Message for commit: ")
}
cl(message)
let { modified } = await gitAddAllModified()

$.verbose = true
await $`git commit -s -m ${`${message} \n ${modified}`}`
await $`git push`

async function gitAddAllModified() {
    let mod = await $`git status`.pipe($`grep modified:`)
    $.verbose = true
    mod.stdout.split("modified: ").forEach(async (line) => {
        let filename = line.trim()
        if (filename.length > 1) {
            await $`git add ${filename}`
        }
    })

    return {
        modified: mod.stdout.split("modified: ").reduce((acc, line) => {
            let filename = line.trim()
            if (filename.length > 1) {
                acc += `${filename} \n`
            }
            return acc
        })
    }
}