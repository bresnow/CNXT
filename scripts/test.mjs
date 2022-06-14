import { $, question, } from 'zx'
import { cd, read, write } from 'fsxx'
import fs from 'fs'
import jsesc from 'jsesc';
import Configstore from 'configstore';
await $`pwd`
let patsh = await $`cat node_modules/@remix-run/server-runtime/server.js`
console.log(jsesc(patsh))