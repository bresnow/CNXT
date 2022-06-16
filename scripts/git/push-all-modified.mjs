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
    if (arg.startsWith('--silent' || '-s')) {
      $.verbose = false;
    }
  }
}

if (!message) {
  let manswer = await question('Message for commit : ');
  manswer !== ''
    ? (message = manswer)
    : (message = `"Update ${new Date(Date.now()).toString().slice(3, 25)}`);
}

if (!version) {
  let vanswer = await question(
    `Version ? \n ${
      chalk.bgCyan('Current Version ') + chalk.cyan(pkg.data.version)
    }: `
  );
  if (vanswer !== '') {
    version = vanswer;
  } else {
    version = pkg.data.version;
    await pkg.save();
  }
}

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
