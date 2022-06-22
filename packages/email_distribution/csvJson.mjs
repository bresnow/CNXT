import { read, write } from 'fsxx';
import jsesc from 'jsesc';
import Gun from 'gun';
let keys = await Gun.SEA.pair();
let gun = Gun({ localhost: false, file: 'email-dist' });
let user = gun.user();
user = user.auth(keys, (ack) => {
  if (ack.err) {
    console.error('auth failed');
  }
});
let emaildist = user.get('email-distribution');
let tsv = await read('packages/email_distribution/sampledata.tsv');
async function tsvJSON(tsv) {
  var lines = tsv.split('\n');

  var result = [];

  var headers = lines[0].split('\t');

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split('\t');
    // For dev debugging purposes i only want to see the first 5 values
    if (i < 5) {
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
      let encrypted = await nestedEncryption(obj, keys.priv);
      // console.log(encrypted);
      //set each object on the email distribution node
      // emaildist.set(encrypted);
      result.push(encrypted);
    }
  }

  return result;
}
let json = await tsvJSON(tsv);
console.log(json);
await write('packages/email_distribution/data.json', JSON.stringify(json));
function parsejson(json) {
  return JSON.parse(JSON.stringify(json));
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
