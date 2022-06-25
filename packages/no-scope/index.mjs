import fs from 'fs';
import { read, fg } from 'fsxx';
import Gun from 'gun';
import chokidar from 'chokidar';

import os from 'os';
let peer =
  process.env.NODE_ENV !== 'production'
    ? `http://${process.env.DOMAIN}/gun`
    : `https://${env.DOMAIN}/gun`;
const gun = Gun({ peers: [peer], localStorage: false });
import debug from './debug.mjs';
const { log } = debug();
/**
 * Watches a directory and send all its content in the database
 * @constructor
 * @param {string} what - Which directory hub should watch.
 * @param {Object} options - https://gun.eco/docs/hub.js#options
 */
async function watch(what, options) {
  options = options ?? {
    msg: true,
    hubignore: false,
    alias: os.userInfo().username,
  };

  options.msg = options.msg ?? true;
  options.hubignore = options.hubignore ?? false;
  options.alias = options.alias ?? os.userInfo().username;

  let modifiedPath = options.alias;
  what = fg(what);
  let watcher;
  try {
    if (options.hubignore) {
      watcher = chokidar.watch(what, {
        ignored: fg(
          (await read('.hubignore'))
            .toString()
            .split('\n')
            .map((x) => x.trim())
            .filter((x) => x.length > 0)
        ),
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 100,
          pollInterval: 100,
        },
      });
    } else if (!options.hubignore) {
      watcher = chokidar.watch(what, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 100,
          pollInterval: 100,
        },
      });
    }

    // const log = console.log.bind(console);

    let hubignore;

    // Handle events !
    watcher
      .on('add', async function (path) {
        if (options.hubignore && path.includes('.hubignore')) {
          hubignore = await read(what + '/.hubignore', 'utf-8');
        } else if (
          !path.includes('.hubignore') &&
          !hubignore?.includes(path.substring(path.lastIndexOf('/') + 1))
        ) {
          if (options.msg) log(`File ${path} has been added`);

          if (path[path.search(/^./gm)] === '/' || '.') {
            gun
              .get('hub')
              .get(modifiedPath + path.split(os.userInfo().username)[1])
              .put(await read(path, 'utf-8'));
          } else {
            gun
              .get('hub')
              .get(modifiedPath + '/' + path.split(os.userInfo().username)[1])
              .put(await read(path, 'utf-8'));
          }
        } else {
          if (options.msg) log(`The addition of ${path} has been ignored !`);
        }
      })
      .on('change', async function (path) {
        if (options.hubignore && path.includes('.hubignore')) {
          hubignore = await read(what + '/.hubignore', 'utf-8');
        } else if (
          !path.includes('.hubignore') &&
          !hubignore?.includes(path.substring(path.lastIndexOf('/') + 1))
        ) {
          if (options.msg) log(`File ${path} has been changed`);
          if (path[path.search(/^./gm)] === '/' || '.') {
            gun
              .get('hub')
              .get(modifiedPath + path.split(os.userInfo().username)[1])
              .put(await read(path, 'utf-8'));
          } else {
            gun
              .get('hub')
              .get(modifiedPath + '/' + path.split(os.userInfo().username)[1])
              .put(await read(path, 'utf-8'));
          }
        } else {
          if (options.msg) log(`The changes on ${path} has been ignored.`);
        }
      })
      .on('unlink', async function (path) {
        if (options.hubignore && path.includes('.hubignore')) {
          hubignore = await read(what + '/.hubignore', 'utf-8');
        } else if (
          !path.includes('.hubignore') &&
          !hubignore?.includes(path.substring(path.lastIndexOf('/') + 1))
        ) {
          if (options.msg) log(`File ${path} has been removed`);
          if (path[path.search(/^./gm)] === '/' || '.') {
            gun
              .get('hub')
              .get(modifiedPath + path.split(os.userInfo().username)[1])
              .put(null);
          } else {
            gun
              .get('hub')
              .get(modifiedPath + '/' + path.split(os.userInfo().username)[1])
              .put(null);
          }
        } else {
          if (options.msg) log(`The deletion of ${path} has been ignored!`);
        }
      });
    if (options.msg) {
      watcher
        .on('addDir', (path) => log(`Directory ${path} has been added`))
        .on('unlinkDir', (path) => log(`Directory ${path} has been removed`))
        .on('error', (error) => log(`Watcher error: ${error}`))
        .on('ready', () => log('Initial scan complete. Ready for changes'));
    }
  } catch (err) {
    console.log(
      'If you want to use the hub feature, you must install `chokidar` by typing `npm i chokidar` in your terminal.'
    );
  }
}

export default { watch };
