import { read, write } from 'fsxx';
let tsv = await read('./sampledata.tsv');
function tsvJSON(tsv) {
  var lines = tsv.split('\n');

  var result = [];

  var headers = lines[0].split('\t');

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split('\t');

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  return JSON.stringify(result);
}
let json = tsvJSON(tsv);

// await write("data.json", json)
