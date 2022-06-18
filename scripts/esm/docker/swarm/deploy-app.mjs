#!/usr/bin/env zx
import { $, chalk, fs } from 'zx';
import 'zx/globals';
import { read } from 'fsxx';
import Gun from 'gun';
let SEA = Gun.SEA;
let gun = Gun(),
  user = gun.user();

function auth(pair) {
  return new Promise((resolve, reject) => {
    user.auth(pair, (ack) => {
      if (ack.err) {
        reject(err);
      } else {
        resolve(`Authenticated`);
      }
    });
  });
}

// --[OPTIONS] <SERVICE NAME>

async function keyGen() {
  let keypair = await SEA.pair();
  console.log(chalk.yellow(`Generated new keypair`));
  console.log(chalk.cyanBright(JSON.stringify(keypair)));
  console.log(chalk.green('Store for safe keeping'));
  $.prefix += `export PUB=${keypair.pub}; export PRIV=${keypair.priv}; export EPUB=${keypair.epub}; export EPRIV=${keypair.epriv};`;
}

let pkg = JSON.parse(await read('package.json'));
let args = process.argv.slice(3);
let name = pkg.name,
  version = pkg.version;
for (let i = 0; i < args.length; i++) {
  if (key.indexOf('-') <= 1) {
    let key = args[i];
    let value = args[i + 1];
    key = key.slice(2);
    if (key === ('keypair' || 'k')) {
      let keypair = value;
      if (keypair.pub && keypair.priv && keypair.epub && keypair.epriv) {
        try {
          let authed = await auth(keypair);
          console.log(chalk.green(authed));
          $.prefix += `export PUB=${keypair.pub}; export PRIV=${keypair.priv}; export EPUB=${keypair.epub}; export EPRIV=${keypair.epriv};`;
        } catch (error) {
          console.log(chalk.redBright(error));
          keypair = await keyGen();
        }
      }
    }
    if (key === ('domain' || 'd')) {
      $.prefix += `export DOMAIN=${value};`;
    }
    if (key === ('port' || 'p')) {
      $.prefix += `export CLIENT_PORT=${value};`;
    }
    if (key === ('relay-peer' || 'r')) {
      $.prefix += `export PEER_DOMAIN=${value};`;
    }
  }
}

try {
  await $`docker stack deploy -c swarm-stacks/remix-gun.yml rg_app-${args[-1]}`;
} catch (error) {
  console.log(chalk.redBright(error));
}

// }
