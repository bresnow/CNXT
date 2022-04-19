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

export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { formData } = RemixGunContext(Gun);
  let { keyPair } = await formData(request);
  switch (request.method) {
    case "POST":
      if (typeof keyPair === "string") {
        let session = await getSession(request.headers.get("Cookie"));
        session.set("sea", keyPair);
        return json(
          { ok: true },
          {
            status: 200,
            headers: { "Set-Cookie": await commitSession(session) },
          }
        );
      }
      return json({ err: "NOT SET" });
  }
};
