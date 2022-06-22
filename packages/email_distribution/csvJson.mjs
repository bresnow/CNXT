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
let tsv = await read('packages/email_distribution/sampledata.tsv');
function tsvJSON(tsv) {
  var lines = tsv.split('\n');

  var result = [];

  var headers = lines[0].split('\t');

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
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
    user.set(obj);
    result.push(obj);
  }

  return result;
}
let json = tsvJSON(tsv);

// await write("packages/email_distribution/data.json", JSON.stringify(json))
function parsejson(json) {
  return JSON.parse(JSON.stringify(json));
}
