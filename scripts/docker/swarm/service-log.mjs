import { $ } from 'zx';

await $`docker service logs ${await $`docker service ls --format  {{.Name}}`}`;