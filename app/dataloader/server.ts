import { json } from "remix";
import type { EntryContext } from "remix";
import { isResponse } from "@remix-run/server-runtime/responses";
import { RouteModule } from "@remix-run/react/routeModules";
import { ServerRouteModule } from "@remix-run/server-runtime/routeModules";

export function createServerDataloader(
  build: EntryContext,
  request: Request,
  params: any,
  context: any
) {
  return {
    async load(id: string) {
      let route: ServerRouteModule = build.routeModules[id];
      if (!route) {
        throw new Error(`Route ${id} not found`);
      }

      let loader = route.loader;
      if (!loader) {
        throw new Error(`Route ${id} has no loader`);
      }

      let result = await loader({ request, params, context });

      return isResponse(result) ? result : json(result);
    },
  };
}
