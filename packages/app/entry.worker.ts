/// <reference lib="WebWorker" />

import { json } from '@remix-run/server-runtime';
import debug from '../no-scope/debug';
import Gun from 'gun';
import { includes } from '../rmxgun-context/useFetcherAsync';
export type {};
declare let self: ServiceWorkerGlobalScope;
let gun = Gun({
  localStorage: false,
  radisk: true,
  file: 'SERVICE_WORKER_CACHE',
});
let STATIC_ASSETS = ['/build/', '/icons/'];
let ASSET_CACHE = 'asset-cache';
let DATA_CACHE = 'data-cache';
let DOCUMENT_CACHE = 'document-cache';

let _ = debug({ devOnly: false });

async function handleInstall(event: ExtendableEvent) {
  _.log('Service worker installed');
}

async function handleActivate(event: ExtendableEvent) {
  _.log('Service worker activated');
}

async function handleMessage(event: ExtendableMessageEvent) {
  let cachePromises: Map<string, Promise<void>> = new Map();

  if (event.data.type === 'REMIX_NAVIGATION') {
    let { isMount, location, matches, manifest } = event.data;
    let documentUrl = location.pathname + location.search + location.hash,
      urlNode = {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      };
    let [gunCacheData, gunCacheDocument] = [
        gun.get(DATA_CACHE).get(documentUrl),
        gun.get(DOCUMENT_CACHE).get(documentUrl),
      ],
      _cArr = [gunCacheData, gunCacheDocument];

    _cArr.forEach(function (item) {
      if (item) {
        item.on(function (data) {
          if (!data) {
            _.log('Setting up gun cache');
            item.put(urlNode, (put) => {
              if (includes(put, 'err')) {
                _.error(
                  'Error while setting url node in cache graph',
                  (put as any).err
                );
              }
              _.log('URL node set in graph');
            });
          }
        });
      }
    });
    let nodeData = await Promise.all([
      gunCacheData.then(),
      gunCacheDocument.then(),
    ]);

    let [dataCache, documentCache, existingDocument] = await Promise.all([
      caches.open(DATA_CACHE),
      caches.open(DOCUMENT_CACHE),
      caches.match(documentUrl),
    ]);

    if (!existingDocument || !isMount) {
      _.log('Caching document for', documentUrl);
      cachePromises.set(
        documentUrl,
        documentCache.add(documentUrl).catch((error) => {
          _.error(`Failed to cache document for ${documentUrl}:`, error);
        })
      );
    }

    if (isMount) {
      for (let match of matches) {
        if (manifest.routes[match.id].hasLoader) {
          let params = new URLSearchParams(location.search);
          params.set('_data', match.id);
          let search = params.toString();
          search = search ? `?${search}` : '';
          let url = location.pathname + search + location.hash;
          if (!cachePromises.has(url)) {
            _.log('Caching data for', url);
            cachePromises.set(
              url,
              dataCache.add(url).catch((error) => {
                _.error(`Failed to cache data for ${url}:`, error);
              })
            );
          }
        }
      }
    }
  }

  await Promise.all(cachePromises.values());
}

async function handleFetch(event: FetchEvent): Promise<Response> {
  let url = new URL(event.request.url);

  if (isAssetRequest(event.request)) {
    let cached = await caches.match(event.request, {
      cacheName: ASSET_CACHE,
      ignoreVary: true,
      ignoreSearch: true,
    });
    if (cached) {
      _.log('Serving asset from cache', url.pathname);
      return cached;
    }

    _.log('Serving asset from network', url.pathname);
    let response = await fetch(event.request);
    if (response.status === 200) {
      let cache = await caches.open(ASSET_CACHE);
      await cache.put(event.request, response.clone());
    }
    return response;
  }

  if (isLoaderRequest(event.request)) {
    try {
      _.log('Serving data from network', url.pathname + url.search);
      let response = await fetch(event.request.clone());
      let cache = await caches.open(DATA_CACHE);
      await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      _.error(
        'Serving data from network failed, falling back to cache',
        url.pathname + url.search
      );
      let response = await caches.match(event.request);
      if (response) {
        response.headers.set('X-Remix-Worker', 'yes');
        return response;
      }

      return json(
        { message: 'Network Error' },
        {
          status: 500,
          headers: { 'X-Remix-Catch': 'yes', 'X-Remix-Worker': 'yes' },
        }
      );
    }
  }

  if (isDocumentGetRequest(event.request)) {
    try {
      _.log('Serving document from network', url.pathname);
      let response = await fetch(event.request);
      let cache = await caches.open(DOCUMENT_CACHE);
      await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      _.error(
        'Serving document from network failed, falling back to cache',
        url.pathname
      );
      let response = await caches.match(event.request);
      if (response) {
        return response;
      }
      throw error;
    }
  }

  return fetch(event.request.clone());
}

function isMethod(request: Request, methods: string[]) {
  return methods.includes(request.method.toLowerCase());
}

function isAssetRequest(request: Request) {
  return (
    isMethod(request, ['get']) &&
    STATIC_ASSETS.some((publicPath) => request.url.startsWith(publicPath))
  );
}

function isLoaderRequest(request: Request) {
  let url = new URL(request.url);
  return isMethod(request, ['get']) && url.searchParams.get('_data');
}

function isDocumentGetRequest(request: Request) {
  return isMethod(request, ['get']) && request.mode === 'navigate';
}

self.addEventListener('install', (event) => {
  event.waitUntil(handleInstall(event).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(handleActivate(event).then(() => self.clients.claim()));
});

self.addEventListener('message', (event) => {
  event.waitUntil(handleMessage(event));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      let result = {} as
        | { error: unknown; response: undefined }
        | { error: undefined; response: Response };
      try {
        result.response = await handleFetch(event);
      } catch (error) {
        result.error = error;
      }

      return appHandleFetch(event, result);
    })()
  );
});

async function appHandleFetch(
  event: FetchEvent,
  {
    error,
    response,
  }:
    | { error: unknown; response: undefined }
    | { error: undefined; response: Response }
): Promise<Response> {
  return response ? response : json(error, { status: 500 });
}
