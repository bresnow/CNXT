#!/usr/bin/env zx
import { $, chalk } from 'zx';
import { read } from 'fsxx';

async function deploy() {
  let pkg = JSON.parse(await read('package.json'));
  let name = pkg.name;
  let version = pkg.version;
  console.log(chalk.cyanBright(`Deploying Stack ${name}`));
  await $`export VERSION=${version}`;
  await $`docker stack deploy -c swarm-stacks/test.yml ${name}`;
}
await deploy();
