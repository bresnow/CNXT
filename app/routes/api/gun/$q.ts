import { ActionFunction, json, LoaderFunction } from "remix";
import { LoadCtx } from "types";
import Gun, { ISEAPair } from "gun";
import { getSession } from "~/session.server";
import LZString from "lz-string";
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, ENV } = RemixGunContext(Gun, request);

  let q = (params.q === "q" || params.q === "query") ?? true
  let map = (params.q === "m" || params.q === "map") ?? true
  let url = new URL(request.url);
  let data
  let session = await getSession();
  let path = url.searchParams.get("path");
  let auth = url.searchParams.get("auth") === ("true" || true) ? true : false;
  let compressed = url.searchParams.get("compressed") === ("true" || true) ? true : false;
  let sessionKP = session.get("key_pair") ? JSON.parse(session.get("key_pair") as string) as ISEAPair : undefined;
  if (auth && sessionKP) {
    gun = gun.user().auth(sessionKP);
  }
  if (auth && !sessionKP) {
    gun = gun.user().auth(ENV.APP_KEY_PAIR);
  }
  if (compressed && path) {
    path = LZString.decompressFromEncodedURIComponent(path);
  }
  let test = LZString.compressToEncodedURIComponent("pages");
  console.log(test, "   TEST");
  try {
    if (q) {
      data = await gun.path((path as string).replace("/", ".")).then();
      console.log(data, "DATA");
    }
    if (map) {
      let _data = await new Promise((res, rej) => gun.path((path as string).replace("/", ".")).open((data) => { data ? res(data) : rej(data) }));
      _data ? data = _data : data = data
    }
    return json(data);
  } catch (error) {
    return json({ error });
  };
};



