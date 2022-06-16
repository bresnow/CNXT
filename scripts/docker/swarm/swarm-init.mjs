import { $, question } from 'zx';
import { cd } from 'fsxx';
import fs from 'fs';
import path from 'path';
import 'zx/globals';

let cl = console.log;
await $`docker network create --driver=overlay traefik-public`
await $`export NODE_ID=$(docker info -f '{{.Swarm.NodeID}}')`
await $`docker node update --label-add traefik-public.traefik-public-certificates=true $NODE_ID`