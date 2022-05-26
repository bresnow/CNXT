import { ActionFunction, json, LoaderFunction } from "remix";
import { LoadCtx } from "types";
import Gun from "gun";
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { graph } = RemixGunContext(Gun, request);
  let path = params.path;
  if (typeof path === "string") {
    // path = path.replace(/^\//, ".");
    try {
      let data = await graph.get(path).val();
      console.log("data", data);
      return json(data);
    } catch (error) {
      return json({ error });
    }
  }
  return json({ err: "node path invalid" });
};


export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { graph, formData } = RemixGunContext(Gun, request);
  let path = params.path as string;
  try {
    let values = await formData();
    try {
      let message = await graph.get(path).put(values);
      return json({ message });
    } catch (error) {
      return json({ error });
    }
  } catch (error) {
    return json({ error });
  }


}


