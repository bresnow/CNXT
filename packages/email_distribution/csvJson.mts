import { read, write } from 'fsxx';
import jsesc from 'jsesc';
import Gun from 'gun';
let keys = await Gun.SEA.pair();
let gun = Gun({ localhost: false, file: 'email-dist' });
let user = gun.user();
user = user.auth(keys, (ack) => {
  if ((ack as any).err) {
    console.error('auth failed');
  }
});
let emaildist = user.get('email-distribution')
let tsv = await read('packages/email_distribution/sampledata.tsv');
function tsvJSON(tsv:any) {
  var lines = tsv.split('\n');

  var result:Record<string,any>[] = [];

  var headers = lines[0].split('\t');

  for (var i = 1; i < lines.length; i++) {
    var obj:Record<string,any> = {};
    var currentline = lines[i].split('\t');

    for (var j = 0; j < headers.length; j++) {
      if (currentline[j] && currentline[j].startsWith('"[')) {
        currentline[j] = currentline[j].replace(/\'/g, '"');
        currentline[j] = currentline[j]
          .replace(/[\"\[\]\']/g, '')
          .replace(/\"\{/g, '\\"\\{\\')
          .replace(/\}\"/g, '\\}\\"\\')
          .split("',");
        let line = currentline[j];
        for (let k = 0; k < line.length; k++) {
          currentline[j] = line[k].split(', ');
        }
      }
      obj[headers[j]] = jsesc(currentline[j]);
    }
    //set each object on the email distribution node
    emaildist.set(obj);
    result.push(obj);
  }

  return result;
}
let json = tsvJSON(tsv);

// await write("packages/email_distribution/data.json", JSON.stringify(json))
function parsejson(json: any) {
  return JSON.parse(JSON.stringify(json));
}

export const checkIf = {
  isObject: (value: unknown) => {
    return !!(value && typeof value === "object" && !Array.isArray(value));
  },
  isNumber: (value: unknown) => {
    return !!isNaN(Number(value));
  },
  isBoolean: (value: unknown) => {
    if (value === "true" || value === "false" || value === true || value === false) {
      return true
    }
  },
  isString: (value: unknown) => {
    return typeof value === "string";
  },
  isArray: (value: unknown) => {
    return Array.isArray(value);
  }
}

const findNestedObject = (object: any = {}, keyToMatch?: string | number | boolean, valueToMatch?: string | number | boolean) => {
  if (checkIf.isObject(object)) {
    const entries = Object.entries(object);

    for (let i = 0; i < entries.length; i += 1) {
      const [objectKey, objectValue] = entries[i];

      if (objectKey === keyToMatch && objectValue === valueToMatch) {
        return object;
      }
      if (checkIf.isObject(objectValue)) {
        const nestedLevel: any = findNestedObject(objectValue, keyToMatch && keyToMatch, valueToMatch && valueToMatch);

        if (nestedLevel !== null) {
          return nestedLevel;
        }
      }
    }
  }

  return null;
};