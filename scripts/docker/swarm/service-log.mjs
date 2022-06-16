import { $, chalk, question } from 'zx';
import { read } from 'fsxx';
let pkg = JSON.parse(await read('package.json'));

let service = pkg.name;
await $`docker service ls --format  {{.Name}}`.pipe($`docker service logs ${service}`)
