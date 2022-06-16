import { $ } from 'zx';
import 'zx/globals';
async function prep() {
    await $`docker network create --driver=overlay traefik-public`;
    await $`export NODE_ID=$(docker info -f '{{.Swarm.NodeID}}')`;
    await $`docker node update --label-add traefik-public.traefik-public-certificates=true $NODE_ID`;
}
prep()