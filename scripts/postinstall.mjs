import { write, remove, exists } from 'fsxx'
import { $, chalk } from 'zx'
import { patchedMarkup } from './constants.mjs'
/**
 * PATCHWORK
 * overwrites the server runtime script instead of patching it. Patch folders are gone.
 */

// await remove('node_modules/@remix-run/server-runtime/index.js')
// await $`echo ${chalk.yellow('Replacing Remix Server Runtime...')}`
// await write("node_modules/@remix-run/server-runtime/index.js", patchedMarkup)


await $`patch-package && remix setup node`