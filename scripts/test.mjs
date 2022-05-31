import { $, nothrow, chalk, question, } from 'zx'
import { cd } from 'fsxx'
import fs from 'fs'
import path from 'path'
import 'zx/globals';

let cl = console.log;
$.verbose = false;
cd(path.resolve(__dirname, '..'))

let args = process.argv.slice(3)
let title = args.length > 0 && (args[0] === "--title" || args[0] === "-t") ? args[1] : args[0]
if (title === undefined) {
    title = await question("Title for commit: ")
}
cl(title)
let { modified } = await gitAddAllModified()

$.verbose = true
await $`git commit -s -m ${`${title} \n ${modified}`}`
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
                acc += `${filename}\n`
            }
            return acc
        })
    }
}