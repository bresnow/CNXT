import { $, question, YAML, chalk, sleep } from 'zx';
import { io } from 'fsxx';
import 'zx/globals';
let pkg = await io.json`package.json`;
let message, version;
let args = process.argv.slice(3);

if (args.length > 0) {
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];

    if (arg.startsWith('--message=' || '-m=' || '--message' || '-m')) {
      message = arg.includes('=') ? arg.split('=')[1] : args[i + 1];
    }

    if (arg.startsWith('--version=' || '-v=' || '--version' || '-v')) {
      version = arg.includes('=') ? arg.split('=')[1] : args[i + 1];
    }
  }
}
$.verbose = false;
if (!message) {
  let manswer = await question(chalk.green('\n Message for commit '));
  if (manswer !== '') {
    message = manswer;
  } else {
    message = `Default Push - ${new Date(Date.now()).toString().slice(3, 25)}`;
    console.log(chalk.yellow(`Using default message`));
    console.log(chalk.blueBright(`${message}`));
  }
}
let noop = () => {};
if (!version) {
  let vanswer = await question(
    `${chalk.green('Current Version ') + chalk.cyan(pkg.data.version)} \n
    ${chalk.green('Change version?')} `
  );
  if (vanswer !== '') {
    version = vanswer;
  } else {
    console.log(chalk.yellow(`Keeping current version ${pkg.data.version}`));
  }
}
version = pkg.data.version;
await pkg.save();

let mod = await $`git status`.pipe($`grep modified:`);
// Prettier writes all modified files
mod.stdout.split('modified: ').forEach(async (line) => {
  let filename = line.trim();
  if (filename.length > 1) {
    await $`npx prettier --write ${filename}`;
  }
});
await $`git add --all`;
await $`git commit -s -m ${`${message} | ${version}`}`;
await $`git push -uf ${await $`git remote show`} ${await $`git branch --show-current`}`;
