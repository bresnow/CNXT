import { read } from 'fsxx';
import jsesc from 'jsesc';
import Gun from 'gun';

let peers = process.env.PEERS
  ? process.env.PEERS.split(',')
  : ['https://dev.cnxt.app/gun', 'https://remix-gun.fltngmmth.com/gun'];
let gun = Gun({
  peers,
  localhost: false,
});
let user = gun.user();
const env = {
  APP_KEY_PAIR: {
    pub: process.env.PUB,
    priv: process.env.PRIV,
    epub: process.env.EPUB,
    epriv: process.env.EPRIV,
  },
};
user = user.auth(env.APP_KEY_PAIR, (ack) => {
  if (ack.err) {
    throw new Error(ack.err);
  }
});
let emaildist = user.get('email-distribution').get('num-set');

try {
  let set = await emaildist.then();
  if (!set) {
    let tsv = await read(
      process.env.TSV_PATH ?? 'scripts/esm/tsv/sampledata.tsv'
    );
    let done = await tsvNumericalSet(tsv);
    if (done === 'Done') {
      process.exit(0);
    }
  }
  console.error('Data already loaded');
} catch (error) {
  throw new Error(JSON.stringify(error));
}

async function tsvNumericalSet(tsv) {
  var lines = tsv.split('\n');
  var headers = lines[0].split('\t');
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split('\t');
    for (var j = 0; j < headers.length; j++) {
      if (currentline[j] && currentline[j].startsWith('"[')) {
        currentline[j] = currentline[j].replace(/\'/g, '"');
        currentline[j] = currentline[j]
          .replace(/[\"\[\]\']/g, '')
          .replace(/\"\{/g, '\\\\"\\\\{\\\\')
          .replace(/\}\"/g, '\\\\}\\\\"\\\\')
          .split("',");
        let line = currentline[j];
        for (let k = 0; k < line.length; k++) {
          currentline[j] = line[k].split(', ');
        }
      }
      obj[headers[j]] = jsesc(currentline[j]);
    }
    let encrypted = await nestedEncryption(obj, env.APP_KEY_PAIR.epriv);
    emaildist.set(encrypted);
  }
  return 'Done';
}

async function nestedEncryption(object, encryptionkey) {
  const checkIf = {
    isObject: (value) => {
      return !!(value && typeof value === 'object' && !Array.isArray(value));
    },
    isString: (value) => {
      return typeof value === 'string';
    },
  };
  if (object && checkIf.isObject(object)) {
    const entries = Object.entries(object);
    let obj = {};
    for (let i = 0; i < entries.length; i += 1) {
      const [objectKey, objectValue] = entries[i];

      if (encryptionkey && checkIf.isString(objectValue)) {
        let encrypted = await Gun.SEA.encrypt(objectValue, encryptionkey);
        obj[objectKey] = encrypted;
      }
      if (checkIf.isObject(objectValue)) {
        await nestedEncryption(objectValue, encryptionkey);
      }
    }
    return obj;
  }
}
