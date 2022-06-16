import { $, question, YAML, chalk, sleep } from 'zx';
import { io } from 'fsxx';
import 'zx/globals';
let pkg = await io.json`package.json`;
let message, version;
let args = process.argv.slice(3);
await $`yarn prettier --check`;
if (args.length > 0) {
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];

    arg.startsWith('--message=' || '-m=' || '--message' || '-m')
      ? (message = arg.includes('=') ? arg.split('=')[1] : args[i + 1])
      : null;

    arg.startsWith('--version=' || '-v=' || '--version' || '-v')
      ? (version = arg.includes('=') ? arg.split('=')[1] : args[i + 1])
      : null;

    arg.startsWith('--silent' || '-s') ? ($.verbose = false) : null;
  }
}

message =
  !message && (await question('Message for commit : ')) !== ''
    ? await question('Message for commit : ')
    : 'Quick Update';

version =
  !version &&
  (await question(
    `Version ? \n ${
      chalk.bgCyan('Current Version ') + chalk.cyan(pkg.data.version)
    }: `
  )) !== ''
    ? await question(
        `Version ? \n ${
          chalk.bgCyan('Current Version ') + chalk.cyan(pkg.data.version)
        }: `
      )
    : pkg.data.version;

//PACKAGE>JSON MODIFY VERSION

pkg.data.version = version;
await pkg.save();
await $`git status`;
await $`git add --all`;
await $`git commit -s -m ${`${message} | ${version}`}`;
await $`git push -uf ${await $`git remote show`} ${await $`git branch --show-current`}`;
