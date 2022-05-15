import { useId, useMemo } from "react";
import { useLocation } from "remix";
import invariant from "@remix-run/react/invariant";
import jsesc from "jsesc";

import { useDeferedLoadData } from "./context";
import { useSafeCallback } from "bresnow_utility-react-hooks";
export { DataloaderProvider } from "./context";

export function useDeferedLoaderData<T = any>(path?: string) {
  let dataloader = useDeferedLoadData();
  let internalId = useId();
  let { key } = useLocation();
  const location = useLocation();
  const currentPath = location.pathname;

  let defered = useMemo(() => {
    invariant(dataloader, "Context Provider is undefined for useGunFetcher");
    let defered = { resolved: false } as {
      resolved: boolean;
      value?: T;
      error?: any;
      promise: Promise<void>;
    };
    defered.promise = dataloader
      .load(path ?? currentPath, internalId)
      .then((response) => response.json())
      .then((value) => {
        defered.value = value;
        defered.resolved = true;
      })
      .catch((error) => {
        defered.error = error;
        defered.resolved = true;
      });
    return defered;
  }, [path, key, currentPath]);

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
  };
}
