import Gun, { IGunChain } from "gun"
import got from "got-cjs"
import { useGunStatic } from "~/lib/gun/hooks";
import { RemixGunContext } from "~/load-context";
export function createDeferedLoader() {
  return {
    async load(routePath: string) {
      let url = new URL(
        routePath,
        window.location.href
      );

      // url.searchParams.set("_data", id);
      return fetch(url.toString());
      // return 
    }
  }
}




    // if (reslv) {
    //      // }


