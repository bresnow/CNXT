import LZString from "lz-string";
import objectAssign from "object-assign";
import axios, { RequestHeaders } from "redaxios"
import { Submit } from "./context";
import { includes } from "./useFetcherAsync";
export function createBrowserLoader() {
  return {
    async load(routePath: string, options?: Options) {
      let Gun = (window as Window).Gun

      let { host, protocol } = window.location
      const cacheRef = Gun({ peers: [`${protocol + host + '/gun'}`], localStorage: false });


      if (options && options.params) {
        if (!routePath.endsWith("/")) {
          routePath += "/";
        }
        if (includes(options.params, "compressed") && (options.params as any).compressed === ("true" || true)) {
          routePath = LZString.compressToEncodedURIComponent(routePath);
        }
      }


      let { data } = await axios.get(routePath, options);
      let cache
      if (includes(options?.params, "path")) {
        let { path } = options?.params as any;
        cacheRef.path(path).put(data.data);
        cache = await new Promise((res, rej) => cacheRef.path((path as string).replace("/", ".")).open((data) => { data ? res(data) : rej(data) }));
      }
      return { data, cache: cache && cache as Record<string, any> }
    },
    async submit(options?: Options) {
      let Gun = (window as Window).Gun
      let MasterKeys = (window as any).ENV.APP_KEY_PAIR
      console.log(MasterKeys, "MasterKeys")
      let { host, protocol } = window.location
      const gun = Gun({ peers: [`${protocol + host + '/gun'}`], localStorage: false });
      const radCookie = new Gun({ localStorage: false, file: 'rad_biscuit' });
      if (options && options.params) {
        if (!options?.url?.endsWith("/")) {
          options.url += "/";
        }
        if (options?.url && includes(options.params, "compressed") && (options.params as any).compressed === ("true" || true)) {
          options.url = LZString.compressToEncodedURIComponent(options?.url);
        }
        let response = await axios.post(options?.url || "/", options.data || options.body, options)
        return response
      }
    }
  }
}

export type Options = {
  url?: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
  headers?: RequestHeaders;
  body?: FormData | string | object;
  responseType?: 'text' | 'json' | 'stream' | 'blob' | 'arrayBuffer' | 'formData' | 'stream';
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
}


    // if (reslv) {
    //      // }

