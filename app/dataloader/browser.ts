import type { IGun } from "gun/types";
export function createGunFetchLoader() {
  return {
    async load(id: string, internalId: string) {
      let cache = (window as any).__remix_dataloader || {};
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
        id.replace("root", "/").replace("routes/", "/api/gun/"),
        window.location.href
      );
      return fetch(url.toString());
    }
  }
}




    // if (reslv) {
    //      // }


