import { write, remove, exists } from 'fsxx'
import jsesc from 'jsesc'
import { $, chalk } from 'zx'
$.verbose = true
let _t = () => $.verbose = !$.verbose
/**
 * PATCHWORK
 * overwrites the server runtime script instead of patching it.
 */
// await $`remix setup node`
// _t()
// await remove('node_modules/@remix-run/server-runtime/index.js')
// console.log(`${chalk.yellow('Replacing Remix Server Runtime...')}`)

// let patchedMarkup = await $`cat ./scripts/patch/server.txt`
// await write("node_modules/@remix-run/server-runtime/index.js", patchedMarkup.toString())
// console.log(`${chalk.green('Patched server runtime')}`)



await $`patch-package && remix setup node`