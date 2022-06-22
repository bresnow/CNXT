import { read, write } from 'fsxx';
import jsesc from 'jsesc';
import Gun from 'gun';
let gun = Gun({
  peers: ['https://dev.cnxt.app/gun', 'https://remix-gun.fltngmmth.com'],
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
}(async function () {
  try {
    let set = await emaildist.then();
    if (!set) {
      let tsv = await read('/home/bresnow/config/cnxt/email-distribution.tsv');
      await tsvNumericalSet(tsv, emaildist, env.APP_KEY_PAIR);
    }
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
})();
user = user.auth(env.APP_KEY_PAIR, (ack) => {
  if (ack.err) {
    console.error('auth failed');
  }
});
let emaildist = user.get('email-distribution');
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
}

async function nestedEncryption(object, encryptionkey) {
  const checkIf = {
    isObject: (value) => {
      return !!(value && typeof value === 'object' && !Array.isArray(value));
    },
    isNumber: (value) => {
      return !!isNaN(Number(value));
    },
    isBoolean: (value) => {
      if (
        value === 'true' ||
        value === 'false' ||
        value === true ||
        value === false
      ) {
        return true;
      }
    },
    isString: (value) => {
      return typeof value === 'string';
    },
    isArray: (value) => {
      return Array.isArray(value);
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
