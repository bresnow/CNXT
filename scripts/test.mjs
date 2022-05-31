import { $, nothrow, chalk, question, } from 'zx'
import { cd } from 'fsxx'
import fs from 'fs'
import path from 'path'
import 'zx/globals';
let grepMark = `Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)`
let cl = console.log;
$.verbose = false;
cd(path.resolve(__dirname, '..'))
await $`pwd`


let { modified } = await gitAddAllModified()

$.verbose = true
await $`git commit -s -m ${modified}`
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

    return { modified: mod }
}