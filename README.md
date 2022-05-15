# Remix.Gun Boilerplate

![Remix/Gun](public/github/rmix-gun.png "Remix.Gun")

This is my white-label boilerplate when building full stack apps. Using the Graph Universal Database, SEA authentication and React v18. Out of the box two or more boilerplate instances can share data via GUN's websocket feature. Plus More.

## Goals

- [x] Remix.GUN Relay Server Adapter  
- [x] Authorization with Gun.Sea/ Gun User Api
- [x] Data Encrytion
- [x] Data Compression
- [x] React Concurrent Features
- [x] Docker Swarm Production Deployment

## Demo

Visit the [Demo](https://rmx-gun.fltngmmth.com). In another window visit the [Peer](https://rmx-gun-peer.fltngmmth.com). In the first window use the object builder form by entering the key and value. Refresh the peer window to find your mutation. 

### NOTE: The demo containers are not deployed with persisiting data volumes. When a new container is deployed the data will be reset. 

## Development

Start the Remix development asset server

```sh
npm run dev
```

This starts your app in development mode, which will purge the server require cache when Remix rebuilds assets so you don't need a process manager restarting the express server.

## It works but it's still in development. Not production ready.
