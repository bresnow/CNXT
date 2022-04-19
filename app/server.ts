import * as fs from "fs";
import * as fsp from "fs/promises";
import { createServer } from "http";
import type { RequestListener, ServerResponse } from "http";
import * as path from "path";
import { installGlobals, formatServerError } from "@remix-run/node";
import { createRequestHandler } from "@remix-run/server-runtime";
import * as build from "@remix-run/server-build";
import mime from "mime";
import { RemixGunContext } from "./load-context";
import Gun from "gun";
import 'gun/lib/path'
import 'gun/sea'
import 'gun/lib/webrtc'
import 'gun/lib/radix'
import 'gun/lib/radisk'
import 'gun/lib/store'
import 'gun/lib/rindexed'
import 'gun/lib/then'
import 'gun/lib/later'
import 'gun/lib/load'
import 'gun/lib/open'
import 'gun/lib/not'
import 'gun/lib/axe'
import { data } from "../data.config";


installGlobals();
const env = {
  DOMAIN: process.env.DOMAIN,
  PEER_DOMAIN: process.env.PEER_DOMAIN,
  CLIENT: process.env.CLIENT_PORT,
  APP_KEY_PAIR: process.env.APP_KEY_PAIR,
};
let remixHandler = createRequestHandler(
  build,
  { formatServerError },
  process.env.NODE_ENV
);

let cwd = process.cwd();
let requestListener: RequestListener = async (req, res) => {
  try {
    let url = new URL(req.url || "/", `http://${req.headers.host}`);
    path.resolve();

    let filepath = path.resolve(cwd, path.join("public", url.pathname));
    let exists = await fsp
      .stat(filepath)
      .then((r) => r.isFile())
      .catch(() => false);
    if (exists) {
      let stream = fs.createReadStream(filepath);
      res.statusCode = 200;
      res.setHeader("Content-Type", mime.getType(filepath) || "text/plain");
      res.setHeader(
        "Cache-Control",
        url.pathname.startsWith("/build/")
          ? "public, max-age=31536000, immutable"
          : "public, max-age=10"
      );

      stream.pipe(res);
      return;
    }
  } catch (error) { }

  try {
    let url = new URL(req.url || "/", `http://${req.headers.host}`);

    let headers = new Headers();
    for (let [key, value] of Object.entries(req.headers)) {
      if (!value) continue;
      if (Array.isArray(value)) {
        for (let val of value) {
          headers.append(key, val);
        }
        continue;
      }
      headers.append(key, value);
    }

    let method = (req.method || "get").toLowerCase();
    let body: any = ["get", "head"].includes(method) ? undefined : req;

    let request = new Request(url.toString(), {
      headers,
      body,
      method,
    });

    let response = await remixHandler(request, { RemixGunContext, res });
    if (response) {
      let headers: Record<string, string[]> = {};
      for (const [key, value] of response.headers) {
        headers[key] = headers[key] || [];
        headers[key].push(value);
      }
      res.writeHead(response.status, response.statusText, headers);
      if (Buffer.isBuffer(response.body)) {
        res.end(response.body);
      } else if ((response.body as any)?.pipe) {
        (response.body as any).pipe(res);
      } else {
        res.end();
      }
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
};

let server = createServer(requestListener);

const getServeUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return `http://0.0.0.0:${env.CLIENT}/gun`;
  }
  return `http://${env.DOMAIN}:${env.CLIENT}/gun`
}

const gun = Gun({
  web: server.listen(env.CLIENT, () => {
    console.log(`Remix server is also acting as GunDB relay server. Both tasks are listening on ${getServeUrl()}`);
  }),
  radisk: true

});

gun.get('peers').put({ PEER: env.PEER_DOMAIN });
gun.get('pages').put(data.pages)