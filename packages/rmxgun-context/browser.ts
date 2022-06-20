import LZString from 'lz-string';
import objectAssign from 'object-assign';
import axios, { RequestHeaders } from 'redaxios';
import { includes } from './useFetcherAsync';
import 'gun/lib/path';
import 'gun/sea';
import 'gun/lib/webrtc';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/then';
import 'gun/lib/load';
import 'gun/lib/open';
import 'gun/lib/not';
import 'gun/lib/axe';
import jsesc from 'jsesc';
import { IGunChain, IGunInstance } from 'gun/types';

async function pullGunCache(cache: IGunInstance<any>, internalId: string) {
  return await new Promise((res, rej) =>
    cache.get(internalId).open((data) => {
      data ? res(data) : rej(data);
    })
  );
}
export function createBrowserLoader() {
  return {
    async load(routePath: string, internalId?: string, options?: Options) {
      let Gun = (window as Window).Gun;
      let { host, protocol } = window.location;
      const peeredCache = Gun({
        peers: [`${protocol + host + '/gun'}`],
        localStorage: false,
      });
      let localCache = new Gun({ localStorage: false });
      if (options && options.params) {
        if (!routePath.endsWith('/')) {
          routePath += '/';
        }
        if (
          includes(options.params, 'compressed') &&
          (options.params as any).compressed === ('true' || true)
        ) {
          routePath = LZString.compressToEncodedURIComponent(routePath);
        }
      }
      let { data } = await axios.request(routePath, options);
      let cache;
      if (internalId && data && data.startsWith('<!DOCTYPE')) {
        let slice = JSON.stringify(data).indexOf('window.__remixC');
        if (slice !== -1) {
          let str = JSON.stringify(data).substr(slice);
          slice = str.indexOf(';</script>');
          let _wRC = str.substr(0, slice);
          let json = jsesc(_wRC.split(' = ')[1].trim(), {
            json: true,
          });
          console.log(json);
          localCache.get(internalId).put(JSON.parse(json));
          data = await pullGunCache(peeredCache, internalId);
          data = new Response(JSON.stringify(data), { status: 200 });
          cache = data;
        }
      }
      if (internalId) {
        peeredCache.get(internalId).put(JSON.parse(JSON.stringify(data)));
        cache = await pullGunCache(peeredCache, internalId);
      }
      return { data, cache: cache && (cache as Record<string, any>) };
    },
  };
}

export type Options = {
  url?: string;
  method?:
    | 'get'
    | 'post'
    | 'put'
    | 'patch'
    | 'delete'
    | 'options'
    | 'head'
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'OPTIONS'
    | 'HEAD';
  headers?: RequestHeaders;
  body?: FormData | string | object;
  responseType?:
    | 'text'
    | 'json'
    | 'stream'
    | 'blob'
    | 'arrayBuffer'
    | 'formData'
    | 'stream';
  params?: Record<string, any> | URLSearchParams;
  paramsSerializer?: (params: Options['params']) => string;
  withCredentials?: boolean;
  auth?: string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  validateStatus?: (status: number) => boolean;
  transformRequest?: ((body: any, headers?: RequestHeaders) => any | null)[];
  baseURL?: string;
  fetch?: typeof window.fetch;
  data?: any;
};

// if (reslv) {
//      // }
