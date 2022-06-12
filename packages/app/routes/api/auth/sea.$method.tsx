import { json, LoaderFunction } from "remix";
import { LoadCtx } from "types";
import { commitSession, getSession } from "~/session.server";
import Gun, { ISEAPair } from "gun";

export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { seaAuth } = RemixGunContext(Gun, request);
  let method = params.method;
  let keys: ISEAPair;
  let session = await getSession();
  switch (method) {
    case "pair":
      let { pair } = await seaAuth.keypair();
      return json(pair, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    case "session":
      let keys = session.get("key_pair");
      if (!keys) {
        return json({ error: "No keys found" });
      }
      return json(keys);
    default:
      return "SEA ROUTE INCOMPLETE";
  }
};
