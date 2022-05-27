import { useMemo } from "react";
import { useLocation } from "remix";
import invariant from "@remix-run/react/invariant";
import jsesc from "jsesc";
import Gun from "gun";
import { useDeferedLoadData } from "./context";
import { useIf, useSafeCallback } from "bresnow_utility-react-hooks";
import { useGunStatic } from "~/lib/gun/hooks";
import React from "react";
import { Options } from "./browser";
export { DataloaderProvider } from "./context";
/**
 * @param {string} remix route path to load
 * @param {Options} options Redaxios options
 */

export function useDeferedLoaderData<T = any>(
  routePath: string,
  options?: Options
) {
  let dataloader = useDeferedLoadData();
  /**
   * Fetching the data from the browser using RAD && IDB
   */
  const [cache] = useGunStatic(Gun);
  let [cachedValue, setCachedValue] = React.useState<
    Record<string, any> | undefined
  >(undefined);
  let { key } = useLocation();
  useIf([options?.params, includes(options?.params, "path")], () => {
    let { path } = options?.params as { path: string };
    cache.path(`${path}`).on((data: T) => {
      if (data) setCachedValue(data);
    });
  });

  let defered = useMemo(() => {
    invariant(dataloader, "Context Provider is undefined for useGunFetcher");
    let defered = { resolved: false } as {
      resolved: boolean;
      value?: T;
      error?: any;
      promise: Promise<void>;
    };
    defered.promise = dataloader
      .load(routePath, options)
      .then((response) => response.data)
      .then((value) => {
        defered.value = value;
        defered.resolved = true;
      })
      .catch((error) => {
        defered.error = error;
        defered.resolved = true;
      });
    return defered;
  }, [routePath, key]);

  return {
    load(): T {
      if (typeof defered.value !== "undefined") {
        return defered.value;
      }
      if (typeof defered.error !== "undefined") {
        throw defered.error;
      }

      throw defered.promise;
    },
    cached: cachedValue,
  };
}
export const includes = (object: any, prop: string) => {
  if (typeof object !== "object") {
    return;
  }
  return Object.getOwnPropertyNames(object).includes(prop);
};
