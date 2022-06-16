import { $, question, YAML, chalk, sleep } from 'zx'
import { io } from 'fsxx'
import 'zx/globals';
async function push() {
  let pkg = await io.json`package.json`
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

  if (version === undefined) {
    version = await question(`Version ? \n ${chalk.bgCyan('Current Version ') + chalk.cyan((pkg.data as any).version)}: `)
    typeof version === 'undefined' ? version = (Number((pkg.data as any).version) + .01).toString().trim() : version = version.trim()
  }

  //PACKAGE>JSON MODIFY VERSION

  (pkg.data as any).version = version
  await pkg.save()
  await $`git status`
  await $`git add --all`
  await $`git commit -s -m ${`${message} | ${version}`}`
  await $`git push -uf ${await $`git remote show`} ${await $`git branch --show-current`}`

};

push()
