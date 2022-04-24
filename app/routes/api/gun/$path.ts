import { ActionFunction, json, LoaderFunction } from "remix";
import { LoadCtx } from "types";
import Gun from "gun";
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { graph } = RemixGunContext(Gun);
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
  let { graph, formData } = RemixGunContext(Gun);
  let path = params.path;
  let values = await formData(request);
  let obj = {}
  if (typeof path === "string") {
    for (var key in values) {
      if (typeof values[key] !== 'string') {
        return json({ err: ` Invalid entry at: ${key}` });
      } Object.assign(obj, { [key]: values[key] })
    }


    if (Object.values(obj).length > 0) {
      let { ok } = await graph.get(`${path}`).put(obj);
      if (ok) {
        return json({ message: "PUT SUCCESSFUL" });
      }
      return json({ err: "PUT FAILED" });
    }
    return json({ err: "NO VALUES TO PUT" });
  }
}