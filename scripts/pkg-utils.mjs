import 'zx/globals';
import {
    YAML
} from 'zx'
import { read } from 'fsxx';
let pkg = JSON.parse(await read('package.json'));

if (args[0] === '--version' || args[0] === '-v') {
    console.log(`${pkg.version}`)
}
if (args[0] === '--name' || args[0] === '-n') {
    console.log(`${pkg.name.replace('.', '-')}`)
}