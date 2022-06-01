import { ActionFunction, json, LoaderFunction } from "remix";
import { LoadCtx } from "types";
import Gun from "gun";
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun } = RemixGunContext(Gun, request);
  let q = params.q as string
  let url = new URL(request.url);
  console.log(url);
  let path = url.searchParams.get("path");
  try {
    let data = await gun.path((path as string).replace("/", ".")).then();
    return json(data);
  } catch (error) {
    return json({ error });
  };
};



