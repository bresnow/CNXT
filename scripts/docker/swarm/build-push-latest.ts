import { $, chalk } from 'zx';
import { read } from 'fsxx';

async function build() {
  let pkg = JSON.parse(await read('package.json'));

  let image = pkg.name;
  console.log(chalk.cyanBright(`Building bresnow/${image}:latest`));
  await $`docker build -t bresnow/${image}:latest .`;
  console.log(
    chalk.cyanBright(`Pushing bresnow/${image}:latest to Docker Hub`)
  );
  await $`docker push bresnow/${image}:latest`;

  console.log(chalk.cyanBright(`Building ghcr.io/bresnow/${image}:latest`));
  await $`docker build -t ghcr.io/bresnow/${image}:latest .`;

  console.log(
    chalk.cyanBright(`Pushing ghcr.io/bresnow/${image}:latest to Docker Hub`)
  );
  await $`docker push ghcr.io/bresnow/${image}:latest`;

  console.log(chalk.greenBright('Fin'));
}

build();
