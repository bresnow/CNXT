import { json } from 'remix';
import type { EntryContext } from 'remix';
import { isResponse } from '@remix-run/server-runtime/responses';
import { ServerRouteModule } from '@remix-run/server-runtime/routeModules';
import { LoadCtx } from 'types';
import { Options } from './browser';
import invariant from '@remix-run/react/invariant';
import Gun from 'gun';

export function createServerDataloader(
  build: EntryContext,
  request: Request,
  params: any,
  context: LoadCtx
) {
  return {
    async load(id: string, internalId?: string, options?: Options) {
      let route: ServerRouteModule = build.routeModules['routes/' + id];
      if (!route) {
        throw new Error(`Route ${id} not found`);
      }
      let loader = route.loader;
      let action = route.action;
      if (!options?.data || !options.body) {
        if (!loader) {
          throw new Error(`Route ${id} has no loader`);
        }
        let result = await loader({ request, params, context });
        return isResponse(result) ? result : json(result);
      } else {
        if (!action) {
          throw new Error(`Route ${id} has no action`);
        } // This should be able to handle a POST method JSON data: Lets check
        let result = await action({ request, params, context });
        return isResponse(result) ? result : json(result);
      }
    },
  };
}
