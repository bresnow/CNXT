import { $, chalk, question } from "zx";
import { read } from 'fsxx'
let pkg = JSON.parse(await read('package.json'))

let image = pkg.name, version = pkg.version