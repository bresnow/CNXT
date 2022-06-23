import fs from 'fs-extra';
import Gun from 'gun';
import { read, write } from 'fsxx';
import { $ } from 'zx';
import fg from 'fast-glob';
const gun = Gun(`http://0.0.0.0:${process.env.CLIENT_PORT || 8765}/gun`);

try {
  require('chokidar');
} catch (error) {
  let install = await $`npm i chokidar`;
  if (install.stderr) {
    throw new Error(install.stderr);
  }
}
import chokidar from 'chokidar';
/**
 * Watches a directory and send all its content in the database
 * @constructor
 * @param {string} what - Which directory hub should watch.
 * @param {Object} options - https://gun.eco/docs/hub.js#options
 */
function watch(what, options) {
  let { msg, scopeignore, encryptionKey, alias } = options;
  msg ? (msg = msg) : (msg = false);
  scopeignore ? (scopeignore = scopeignore) : (scopeignore = false);
  alias ? (alias = alias) : (alias = require('os').userInfo().username);
  encryptionKey ? (encryptionKey = encryptionKey) : (encryptionKey = null);
  let modifiedPath = alias;

  let watcher;
  try {
    if (scopeignore) {
      what = fg(what, { globstar: true, baseNameMatch: true });
      watcher = chokidar.watch(what, {
        persistent: true,
      });
    } else if (!scopeignore) {
      watcher = chokidar.watch(what, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
      });
    }

    const log = console.log.bind(console);

    let scopeignore;

    // Handle events !
    watcher
      .on('add', async function (path) {
        if (options.scopeignore && path.includes('.scopeignore')) {
          scopeignore = fs.readFileSync(what + '/.scopeignore', 'utf-8');
        } else if (
          !path.includes('.scopeignore') &&
          !scopeignore?.includes(path.substring(path.lastIndexOf('/') + 1))
        ) {
          if (options.msg) log(`File ${path} has been added`);

          if (path[path.search(/^./gm)] === '/' || '.') {
            gun
              .get('hub')
              .get(
                modifiedPath + path.split(require('os').userInfo().username)[1]
              )
              .put(fs.readFileSync(path, 'utf-8'));
          } else {
            gun
              .get('hub')
              .get(
                modifiedPath +
                  '/' +
                  path.split(require('os').userInfo().username)[1]
              )
              .put(fs.readFileSync(path, 'utf-8'));
          }
        } else {
          if (options.msg) log(`The addition of ${path} has been ignored !`);
        }
      })
      .on('change', async function (path) {
        if (options.scopeignore && path.includes('.scopeignore')) {
          scopeignore = fs.readFileSync(what + '/.scopeignore', 'utf-8');
        } else if (
          !path.includes('.scopeignore') &&
          !scopeignore?.includes(path.substring(path.lastIndexOf('/') + 1))
        ) {
          if (options.msg) log(`File ${path} has been changed`);
          if (path[path.search(/^./gm)] === '/' || '.') {
            gun
              .get('hub')
              .get(
                modifiedPath + path.split(require('os').userInfo().username)[1]
              )
              .put(fs.readFileSync(path, 'utf-8'));
          } else {
            gun
              .get('hub')
              .get(
                modifiedPath +
                  '/' +
                  path.split(require('os').userInfo().username)[1]
              )
              .put(fs.readFileSync(path, 'utf-8'));
          }
        } else {
          if (options.msg) log(`The changes on ${path} has been ignored.`);
        }
      })
      .on('unlink', async function (path) {
        if (options.scopeignore && path.includes('.scopeignore')) {
          scopeignore = fs.readFileSync(what + '/.scopeignore', 'utf-8');
        } else if (
          !path.includes('.scopeignore') &&
          !scopeignore?.includes(path.substring(path.lastIndexOf('/') + 1))
        ) {
          if (options.msg) log(`File ${path} has been removed`);
          if (path[path.search(/^./gm)] === '/' || '.') {
            gun
              .get('hub')
              .get(
                modifiedPath + path.split(require('os').userInfo().username)[1]
              )
              .put(null);
          } else {
            gun
              .get('hub')
              .get(
                modifiedPath +
                  '/' +
                  path.split(require('os').userInfo().username)[1]
              )
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

module.exports = { watch: watch };
