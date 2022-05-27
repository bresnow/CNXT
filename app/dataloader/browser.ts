import Gun, { IGunChain } from "gun"
import axios, { RequestHeaders } from "redaxios"
import { useGunStatic } from "~/lib/gun/hooks";
import { RemixGunContext } from "~/load-context";
export function createDeferedLoader() {
  return {
    async load(routePath: string, options?: Options) {
      if (options && options.params && !routePath.endsWith("/")) {
        routePath += "/q?";
      }
      return axios.get(routePath, options);
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

