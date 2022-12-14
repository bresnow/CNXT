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
    async load(id: string, options?: Options) {
      let route: ServerRouteModule = build.routeModules['routes/' + id];
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
