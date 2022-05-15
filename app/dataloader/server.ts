import { json } from "remix";
import type { EntryContext } from "remix";
import { isResponse } from "@remix-run/server-runtime/responses";
import { ServerRouteModule } from "@remix-run/server-runtime/routeModules";
import { LoadCtx } from "types";
import { getDomain } from "~/server"

export function createServerDataloader(
  build: EntryContext,
  request: Request,
  params: any,
  context: LoadCtx
) {
  // console.log(build.manifest.routes)

  const currentRouteId = () => {
    const url = getDomain().replace('gun', '')
    const current = "routes/" + request.clone().url.replace(url, "").replace('?', '')
    return current
  }
  return {
    async load(id?: string) {
      console.log(currentRouteId() + ": " + id)
      let route: ServerRouteModule = build.routeModules["routes/" + id ?? currentRouteId()];

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
