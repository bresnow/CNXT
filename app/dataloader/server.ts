import { json } from "remix";
import type { EntryContext } from "remix";
import { isResponse } from "@remix-run/server-runtime/responses";
import { RouteModule } from "@remix-run/react/routeModules";
import { ServerRouteModule } from "@remix-run/server-runtime/routeModules";
import { LoadCtx, RmxGunCtx } from "types";
import type { ServerResponse } from "http";

export function createServerDataloader(
  build: EntryContext,
  request: Request,
  params: any,
  context: LoadCtx
) {
  return {
    async load(nodePath: string) {

      let { RemixGunContext } = context
      let { graph } = RemixGunContext(Gun, request);

      try {
        let data = await graph.get(nodePath).val();
        return json(data);
      } catch (error) {
        return json({ error });
      }

      // let result = await loader({ request, params, context });

      // return isResponse(result) ? result : json(result);
    },
    loadAction(id: string) {
      let route: ServerRouteModule = build.routeModules[id];
      build.manifest.url
      if (!route) {
        throw new Error(`Route ${id} not found`);
      }

      let action = route.action
      if (!action) {
        throw new Error(`Route ${id} has no action`);
      }
      let result = action({ request, params, context })

    }
  };
}
