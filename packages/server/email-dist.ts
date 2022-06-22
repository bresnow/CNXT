import jsesc from 'jsesc';
import { IGunUserInstance, ISEAPair, IGunChain } from 'gun/types';
import Gun from 'gun';
export async function tsvNumericalSet(
  tsv: string,
  userInstance: IGunChain<any>,
  keys: ISEAPair
) {
  var lines = tsv.split('\n');

  var result: Record<string, any>[] = [];

  var headers = lines[0].split('\t');

  for (var i = 1; i < lines.length; i++) {
    var obj: Record<string, any> = {};
    var currentline: any = lines[i].split('\t');
    // For dev debugging purposes i only want to see the first 5 values
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
    if (encrypted) {
      userInstance.set(encrypted);
    }
  }

  return result;
}

async function nestedEncryption(
  object: Record<string, any>,
  encryptionkey: string
) {
  const checkIf = {
    isObject: (value: any) => {
      return !!(value && typeof value === 'object' && !Array.isArray(value));
    },
    isNumber: (value: any) => {
      return !!isNaN(Number(value));
    },
    isBoolean: (value: any) => {
      if (
        value === 'true' ||
        value === 'false' ||
        value === true ||
        value === false
      ) {
        return true;
      }
    },
    isString: (value: any) => {
      return typeof value === 'string';
    },
    isArray: (value: any) => {
      return Array.isArray(value);
    },
  };
  if (object && checkIf.isObject(object)) {
    const entries = Object.entries(object);
    let obj: Record<string, string> = {};
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
