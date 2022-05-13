import Gun from "gun"
import { useGunStatic } from "~/lib/gun/hooks";
import { RemixGunContext } from "~/load-context";
export function createDeferedLoader() {
  return {
    async load(id: string, internalId: string) {
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
        id,
        window.location.href
      );
      // url.searchParams.set("_data", id);
      return fetch(url.toString());
    }
  }
}




    // if (reslv) {
    //      // }


