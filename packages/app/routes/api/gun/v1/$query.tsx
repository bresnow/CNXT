import { ActionFunction, json, LoaderFunction } from "remix";
import { LoadCtx } from "types";
import Gun, { ISEAPair } from "gun";
import { getSession } from "../../../../session.server";
import LZString from "lz-string";

let QueryType = {
  GET: "g" || "get",
  OPEN: "o" || "open",
};
type QueryHandler = Map<string, () => Promise<Record<string, any>>>;
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, ENV } = RemixGunContext(Gun, request);
  let url = new URL(request.url);
  let data;
  let session = await getSession();
  let path = url.searchParams.get("path");
  let auth = url.searchParams.get("auth") === ("true" || true) ? true : false;
  let compressed =
    url.searchParams.get("compressed") === ("true" || true) ? true : false;
  let sessionKP = session.get("key_pair")
    ? (JSON.parse(session.get("key_pair") as string) as ISEAPair)
    : undefined;
  if (auth && sessionKP) {
    gun = gun.user().auth(sessionKP);
  }
  if (auth && !sessionKP) {
    gun = gun.user().auth(ENV.APP_KEY_PAIR);
  }
  if (compressed && path) {
    path = LZString.decompressFromEncodedURIComponent(path);
  }
  let queryHandler: QueryHandler = new Map([
    [
      "undefined" || null,
      () => {
        throw new Error("No query type specified");
      },
    ],
    [
      QueryType.GET,
      async () =>
        (data = await gun.path((path as string).replace("/", ".")).then()),
    ],
    [
      QueryType.OPEN,
      () =>
        new Promise((res, _rej) =>
          gun.path((path as string).replace("/", ".")).open((data) => {
            res(data);
          })
        ),
    ],
  ]);
  let query = queryHandler.get(params.query as string),
    res = query && (await query());
  console.log(res, "res");
  return json(res, { status: 200, headers: { "FLTNGMMTH-DEV": "true" } });
};
