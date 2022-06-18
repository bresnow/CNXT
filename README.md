# Remix.Gun Boilerplate

![Remix/Gun](public/github/rmix-gun.png 'Remix.Gun')

This is a boilerplate for creating distributed web apps. Using GunDB, SEA authentication and React v18. Out of the box two or more boilerplate instances can share data via GUN's peer websocket feature.

## Goals

- [x] Remix.GUN Relay Server Adapter
- [x] Authorization with Gun.Sea/ Gun User Api
- [x] Data Encrytion
- [x] useFetcherAsync with React Suspense
- [x] Docker Swarm Production Deployment
- [x] Traefik Proxy & Load Balancing

## Treafik Reverse Proxy & Load Balancing In Docker Swarm

![Traefik Proxy & Load Balancing](public/github/traefik.png 'Traefik')

Self-hosted deplyment is a breeze. There are [swarm stacks]('./swarm-stacks) for the app and Traefik. Middleware redirects to https and uses a Lets Encrypt tls certificate resolver. Authenticated UI dashboard is also available. There are github worklow dispatchers for traefik and the app so you can spin up a new production instance from the github repo. See [Self-Hosted Github Runners Documentation]('https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners) .

![Traefik Service Manager](public/github/traefik.png 'Traefik1')

## Demo

Visit the [Demo](https://remix-gun.fltngmmth.com). In another window visit the [Peer](https//dev.cnxt.app). Frontend is still in development.

## Development

Start the Remix development asset server.

```sh
yarn dev
```
