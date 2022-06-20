#!/usr/bin/env zx
import { $, chalk } from 'zx';
import { read } from 'fsxx';

async function buildPush() {
  let args = process.argv.slice(3);
  let version, git, $ghAT;
  if (args.length > 0) {
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      if (arg === ('--ghcr' || '-G')) {
        git = true;
        $ghAT = args[i + 1];
        if (typeof $ghAT === 'string' && git === true) {
          try {
            await $`echo ${$ghAT}`.pipe(
              `docker login ghcr.io -u $USERNAME --password-stdin`
            );
          } catch (error) {
            throw new Error(error);
          }
        }
      }
      if (arg === ('--latest' || '-L')) {
        version = false;
      }
    }
  }
  let pkg = JSON.parse(await read('package.json'));
  let name = pkg.name;
  let image = git
    ? 'ghcr.io/bresnow/'
    : 'bresnow/' + `${name}:${!version ? 'latest' : pkg.version}`;
  console.log(chalk.cyanBright(`Building ${image} `));
  await $`docker build -t ${image} .`;
  console.log(
    chalk.cyanBright(
      `Pushing ${image} to ${git ? 'Github Container Registry' : 'Docker Hub'} `
    )
  );
  await $`docker push ${image} `;
  console.log(chalk.greenBright('Fin'));
}
await buildPush();
