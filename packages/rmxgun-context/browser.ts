import LZString from 'lz-string';
import objectAssign from 'object-assign';
import axios, { RequestHeaders } from 'redaxios';
import { includes } from './useFetcherAsync';
import type { IGunChain, IGunMeta } from 'gun';
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
import { errorCheck } from '~/remix-gun-utility/remix/helpers';

export type GunNodeData = IGunMeta<Record<string, any>>;
export function createBrowserLoader() {
  return {
    async load(routePath: string, options?: Options) {
      let Gun = (window as Window).Gun;
      let { body, params, method, ...opts } = options ?? {};
      let { routeData } = __remixContext;
      let { gunOpts, ENV } = routeData.root;
      const gun = Gun(gunOpts);
      const user = gun.user();
      user.auth(ENV.APP_KEY_PAIR);
      let db = user as unknown as IGunChain<any>;
      if (params) {
        if (!routePath.endsWith('/')) {
          routePath += '/';
        }
        // TODO: search param stuff goes here
      }
      let postfix = 'post' || 'POST';
      let { data } =
        body || method === postfix
          ? await axios.post(routePath, body, { params, method, ...opts })
          : await axios.get(routePath, options);
      let idb;
      if (data && includes(params, 'path') && !errorCheck(data)) {
        let { path } = params ?? {};
        db.path(path).put(data);
        idb = await new Promise((res, rej) =>
          db.path((path as string).replace('/', '.')).load((data) => {
            data && res(data);
          })
        );
      }
      return { data, cache: idb };
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
  body?: FormData | object;
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
