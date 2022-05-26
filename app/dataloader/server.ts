import { json } from "remix";
import type { EntryContext } from "remix";
import { isResponse } from "@remix-run/server-runtime/responses";
import { ServerRouteModule } from "@remix-run/server-runtime/routeModules";
import { LoadCtx } from "types";
import { getDomain } from "~/server"
import got from "got-cjs";

export function createServerDataloader(
  build: EntryContext,
  request: Request,
  params: any,
  context: LoadCtx
) {
  // console.log(build.manifest.routes)

  const currentRouteId = (id: string) => {
    const url = getDomain().replace('gun', '')
    const current = request.clone().url.replace(url, "").replace('?', '')
    return current + "/" + id
  }
  return {
    async load(id: string) {
      let route: ServerRouteModule = build.routeModules["routes/" + id];
      console.log("testResponse", await got.get(id));
      if (!route) {
        throw new Error(`Route ${id} not found`);
      }

      let loader = route.loader
      if (!loader) {
        throw new Error(`Route ${id} has no loader`);
      }

      let result = await loader({ request, params, context })
      return json(result)

    }
  };
}
