import { ActionFunction, json, LoaderFunction } from "remix";
import { LoadCtx } from "types";
import Gun from "gun";
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { graph } = RemixGunContext(Gun, { request, params });
  let path = params.path;
  if (typeof path === "string") {
    let data = await graph.get(path).val();
    if (data) {
      return json(data);
    }
    return json({ err: `no data at node path ${path}` });
  }
  return json({ err: "node path invalid" });
};


export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { graph, formData } = RemixGunContext(Gun, { request, params });
  let path = params.path as string;
  try {
    let values = await formData();
    try {
      let { result } = await graph.get(path).put(values);
      return json({ result });
    } catch (error) {
      return json({ error });
    }
  } catch (error) {
    return json({ error });
  }


}


