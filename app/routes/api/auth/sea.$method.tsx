import { LoaderFunction, json, ActionFunction, redirect } from "remix";
import { LoadCtx } from "types";
import { log } from "~/lib/console-utils";
import { parseJSON } from "~/lib/parseJSON";
import { commitSession, destroySession, getSession } from "~/session.server";
import Gun, { ISEAPair } from "gun";
import { redirectBack } from "~/lib/responses";

export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { user } = RemixGunContext(Gun, request);
  let method = params.method;
  let keys: ISEAPair;
  let session = await getSession(request.headers.get("Cookie"));
  return null;
};
