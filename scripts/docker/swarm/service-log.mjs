import { $, chalk, question } from 'zx';
import { read } from 'fsxx';
let pkg = JSON.parse(await read('package.json'));

let service = pkg.name;
let svc = await $`docker service ls --format  {{.Name}}`.pipe(
  $`grep ${service}`
);

let arr = svc.split(`\n`);
arr.forEach(async (element) => {
  await $`docker service logs ${element}`;
});
