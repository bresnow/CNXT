import { ActionFunction, LoaderFunction, json } from "remix";
import { LoadCtx } from "types";
import { log } from "~/lib/console-utils";
import { parseJSON } from "~/lib/parseJSON";
import { commitSession, destroySession, getSession } from "~/session.server";
import Gun from "gun";
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let session = await getSession(request.headers.get("Cookie"));
  let keyPair = session.get("sea");
  if (keyPair) {
    let keys = parseJSON(keyPair);
    log(keyPair, "keys");
    return json(keys);
  }
  return null;
};
