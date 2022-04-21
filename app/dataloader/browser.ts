import type { IGun } from "gun/types";
import { useRouteData } from "~/gun/hooks"

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

export function createGunPut() {
  let { data } = useRouteData("/");
  return {
    async put(path: string, obj: { [key: string]: any }) {
      // let url = new URL("/api/gun/" + path, window.location.href);
      let Gun: IGun =
        window !== undefined ? (window as any).Gun : require("gun");
      const gun = Gun(data.gunOpts);
      const putData = () =>
        new Promise((resolve, reject) => {
          gun.path(path).put(obj, (ack: any) => {
            if (ack.ok) {
              resolve(ack);
            } else {
              reject(ack.err);
            }
          });
        });

      return await putData();
    }
  }
}





    // if (reslv) {
    //   return fetch(url.toString(), {
    //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //     mode: 'cors', // no-cors, *cors, same-origin
    //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //     credentials: 'same-origin', // include, *same-origin, omit
    //     headers: {
    //       'Content-Type': 'application/form-data',                // 'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     redirect: 'follow', // manual, *follow, error
    //     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //     body: JSON.stringify(obj) // body data type must match "Content-Type" header
    //   });
    // }


