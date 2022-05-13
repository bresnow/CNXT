import { LoaderFunction } from "remix";
import { LoadCtx } from "types";
import { getSession } from "~/session.server";
import Gun, { ISEAPair } from "gun";

export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { user } = RemixGunContext(Gun, request);
  let method = params.method;
  let keys: ISEAPair;
  let session = await getSession(request.headers.get("Cookie"));
  return null;
};
