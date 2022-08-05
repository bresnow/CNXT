var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@remix-run/server-runtime/responses.js
var require_responses = __commonJS({
  "node_modules/@remix-run/server-runtime/responses.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function json2(data, init = {}) {
      let responseInit = init;
      if (typeof init === "number") {
        responseInit = {
          status: init
        };
      }
      let headers = new Headers(responseInit.headers);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json; charset=utf-8");
      }
      return new Response(JSON.stringify(data), {
        ...responseInit,
        headers
      });
    }
    function redirect2(url, init = 302) {
      let responseInit = init;
      if (typeof responseInit === "number") {
        responseInit = {
          status: responseInit
        };
      } else if (typeof responseInit.status === "undefined") {
        responseInit.status = 302;
      }
      let headers = new Headers(responseInit.headers);
      headers.set("Location", url);
      return new Response(null, {
        ...responseInit,
        headers
      });
    }
    function isResponse2(value) {
      return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
    }
    var redirectStatusCodes = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
    function isRedirectResponse(response) {
      return redirectStatusCodes.has(response.status);
    }
    function isCatchResponse(response) {
      return response.headers.get("X-Remix-Catch") != null;
    }
    exports.isCatchResponse = isCatchResponse;
    exports.isRedirectResponse = isRedirectResponse;
    exports.isResponse = isResponse2;
    exports.json = json2;
    exports.redirect = redirect2;
  }
});

// node_modules/@remix-run/server-runtime/esm/responses.js
function json(data, init = {}) {
  let responseInit = init;
  if (typeof init === "number") {
    responseInit = {
      status: init
    };
  }
  let headers = new Headers(responseInit.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers
  });
}

// app/entry.worker.tsx
var import_responses2 = __toESM(require_responses());

// lib/debug.ts
var collapse = console.groupCollapsed.bind(console.trace);
function debug({ off = false, dev = true }) {
  let isProd = development === "production";
  return {
    log(...args) {
      dev && !isProd && !off || !dev && !off ? args.forEach((arg) => {
        if (typeof arg === "object") {
          arg = JSON.stringify(arg, null, 2);
          console.log(
            `%c${arg.toString()}`,
            "color:#f6f8ff;font-size:15px;font-weight:light;font-family:system-ui;font-style:semi-bold;"
          );
        }
      }) : null;
    },
    warn(...args) {
      dev && !isProd && !off || !dev && !off ? args.forEach((arg) => {
        console.log(
          `%c${arg}`,
          "color:#f3a712;font-size:15px;font-weight:light;font-family:monospace;font-style:semibold;"
        );
      }) : null;
    },
    error(...args) {
      dev && !isProd && !off || !dev && !off ? args.forEach((arg) => {
        console.log(
          `%c${arg}`,
          "color:red;font-size:15px;font-weight:light;font-family:monospace;font-style:bold;"
        );
      }) : null;
    },
    opt({ off: off2, dev: dev2 }) {
      let thisFn = debug.bind(debug, { off: off2, dev: dev2 });
      return thisFn();
    }
  };
}
var debug_default = debug;

// app/entry.worker.tsx
var { log, error, opt, warn } = debug_default({ dev: false });
var STATIC_ASSETS = ["/build/", "/icons/"];
var ASSET_CACHE = "asset-cache";
var DATA_CACHE = "data-cache";
var DOCUMENT_CACHE = "document-cache";
async function handleInstall(event) {
  log("Service worker installed");
}
async function handleActivate(event) {
  log("Service worker activated");
}
async function handleMessage(event) {
  let cachePromises = /* @__PURE__ */ new Map();
  if (event.data.type === "REMIX_NAVIGATION") {
    let { isMount, location, matches, manifest } = event.data;
    let documentUrl = location.pathname + location.search + location.hash;
    let [dataCache, documentCache, existingDocument] = await Promise.all([
      caches.open(DATA_CACHE),
      caches.open(DOCUMENT_CACHE),
      caches.match(documentUrl)
    ]);
    if (!existingDocument || !isMount) {
      log("Caching document for", documentUrl);
      cachePromises.set(
        documentUrl,
        documentCache.add(documentUrl).catch((error2) => {
          error2(`Failed to cache document for ${documentUrl}:`, error2);
        })
      );
    }
    if (isMount) {
      for (let match of matches) {
        if (manifest.routes[match.id].hasLoader) {
          let params = new URLSearchParams(location.search);
          params.set("_data", match.id);
          let search = params.toString();
          search = search ? `?${search}` : "";
          let url = location.pathname + search + location.hash;
          if (!cachePromises.has(url)) {
            log("Caching data for", url);
            cachePromises.set(
              url,
              dataCache.add(url).catch((error2) => {
                error2(`Failed to cache data for ${url}:`, error2);
              })
            );
          }
        }
      }
    }
  }
  await Promise.all(cachePromises.values());
}
async function handleFetch(event) {
  let url = new URL(event.request.url);
  if (isAssetRequest(event.request)) {
    let cached = await caches.match(event.request, {
      cacheName: ASSET_CACHE,
      ignoreVary: true,
      ignoreSearch: true
    });
    if (cached) {
      log("Serving asset from cache", url.pathname);
      return cached;
    }
    log("Serving asset from network", url.pathname);
    let response = await fetch(event.request);
    if (response.status === 200) {
      let cache = await caches.open(ASSET_CACHE);
      await cache.put(event.request, response.clone());
    }
    return response;
  }
  if (isLoaderRequest(event.request)) {
    try {
      log("Serving data from network", url.pathname);
      let response = await fetch(event.request.clone());
      let cache = await caches.open(DATA_CACHE);
      await cache.put(event.request, response.clone());
      return response;
    } catch (err) {
      error(
        "Serving data from network failed, falling back to cache",
        url.pathname
      );
      let response = await caches.match(event.request);
      if (response) {
        response.headers.set("X-Remix-Worker", "yes");
        return response;
      }
      return json(
        { message: "Network Error" },
        {
          status: 500,
          headers: { "X-Remix-Catch": "yes", "X-Remix-Worker": "yes" }
        }
      );
    }
  }
  if (isDocumentGetRequest(event.request)) {
    try {
      log("Serving document from network", url.pathname);
      let response = await fetch(event.request);
      let cache = await caches.open(DOCUMENT_CACHE);
      await cache.put(event.request, response.clone());
      return response;
    } catch (err) {
      error(
        "Serving document from network failed, falling back to cache",
        url.pathname
      );
      let response = await caches.match(event.request);
      if (response) {
        return response;
      }
      throw err;
    }
  }
  return fetch(event.request.clone());
}
function isMethod(request, methods) {
  return methods.includes(request.method.toLowerCase());
}
function isAssetRequest(request) {
  return isMethod(request, ["get"]) && STATIC_ASSETS.some((publicPath) => request.url.startsWith(publicPath));
}
function isLoaderRequest(request) {
  let url = new URL(request.url);
  return isMethod(request, ["get"]) && url.searchParams.get("_data");
}
function isDocumentGetRequest(request) {
  return isMethod(request, ["get"]) && request.mode === "navigate";
}
self.addEventListener("install", (event) => {
  event.waitUntil(handleInstall(event).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(handleActivate(event).then(() => self.clients.claim()));
});
self.addEventListener("message", (event) => {
  event.waitUntil(handleMessage(event));
});
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      let result = {};
      try {
        result.response = await handleFetch(event);
      } catch (error2) {
        result.error = error2;
      }
      return appHandleFetch(event, result);
    })()
  );
});
async function appHandleFetch(event, {
  error: error2,
  response
}) {
  return (0, import_responses2.isResponse)(response) ? response : json(error2, { status: 500 });
}
/**
 * @remix-run/server-runtime v0.0.0-experimental-4e814511
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
