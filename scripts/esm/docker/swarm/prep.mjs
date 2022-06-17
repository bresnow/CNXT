import { $, chalk } from 'zx';
import 'zx/globals';
/**
 * Creates the external network and labels needed for the swarm stack deployment.
 */
try {
  await $`docker network create --driver=overlay traefik-public`;
} catch (error) {
  console.log(chalk.red(error));
}
try {
  await $`export NODE_ID=$(docker info -f '{{.Swarm.NodeID}}')`;
  await $`docker node update --label-add traefik-public.traefik-public-certificates=true $NODE_ID`;
} catch (error) {
  console.log(chalk.red(error));
}
