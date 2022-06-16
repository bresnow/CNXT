#!/usr/bin/env zx
import { $, chalk } from 'zx';
import { read } from 'fsxx';

async function build() {
  let pkg = JSON.parse(await read('package.json'));

  let image = pkg.name,
    version = pkg.version;
  console.log(chalk.cyanBright(`Building bresnow/${image}:${version}`));
  await $`docker build -t bresnow/${image}:${version} .`;
  console.log(
    chalk.cyanBright(`Pushing bresnow/${image}:${version} to Docker Hub`)
  );
  await $`docker push bresnow/${image}:${version}`;
  console.log(chalk.greenBright('Fin'));
}

build();
