import type { IGun } from "gun/types";
import { error } from "~/lib/console-utils";
import { log } from "~/lib/console-utils";
export function createGunFetchLoader() {
  return {
    async load(nodePath: string, internalId: string) {
      let cache = (window as any).__remix_gun || {};
      let cached = cache[internalId];
      if (cached) {
        if (typeof cached.value !== "undefined") {
          return new Response(JSON.stringify(cached.value));
        }

        if (typeof cached.error !== "undefined") {
          throw cached.error;
        }
      }

      let url = new URL(
        `/api/gun/${nodePath}`,
        window.location.href
      );
      return fetch(url.toString());
    }
  }
}




    // if (reslv) {
    //      // }


