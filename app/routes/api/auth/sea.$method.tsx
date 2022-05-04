import { LoaderFunction, json, ActionFunction, redirect } from "remix";
import { LoadCtx } from "types";
import { log } from "~/lib/console-utils";
import { parseJSON } from "~/lib/parseJSON";
import { commitSession, destroySession, getSession } from "~/session.server";
import Gun, { ISEAPair } from "gun";
import { redirectBack } from "~/lib/responses";

export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { auth, pair } = RemixGunContext(Gun);
  let method = params.method;
  let keys: ISEAPair;
  let session = await getSession(request.headers.get("Cookie"));
  if (typeof method === "string") {
    switch (method) {
      case "generate": {
        let check = session.get("sea");
        if (check) {
          return json({
            err: "You already have a key pair in your session.",
          });
        }
        keys = await pair();
        session.set("sea", keys);
        if (keys) {
          let { ok, err } = await auth.pair(keys);
          if (ok) {
            return json(
              {
                pair: keys,
              },
              {
                status: 200,
                headers: { "Set-Cookie": await commitSession(session) },
              }
            );
          }
          return json({
            err,
          });
        }
      }
      case "authenticate": {
        keys = session.get("sea");
        if (keys) {
          let { ok, err } = await auth.pair(keys);
          if (ok) {
            return json({
              pair: keys,
            });
          }
          return json({
            err,
          });
        }
      }
      case "logout": {
        return redirectBack(request, {
          fallback: "/",
          headers: {
            "Set-Cookie": await destroySession(session),
          },
        });
      }
    }
  }
  return json({
    err: "No method specified.",
  });
};
