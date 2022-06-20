import { useMemo, useId } from 'react';
import { useLocation } from 'remix';
import invariant from '@remix-run/react/invariant';
import jsesc from 'jsesc';
import Gun from 'gun';
import { ClientContext, useDataLoader } from './context';
import { useIf, useSafeCallback } from 'bresnow_utility-react-hooks';
import { useGunStatic } from '~/remix-gun-utility/gun/hooks';
import React from 'react';
import { Options } from './browser';
export { DataloaderProvider } from './context';
/**
 * @param {string} remix route path to load
 * @param {Options} options Redaxios options
 */
export interface DeferedData {
  load(): Record<string, any>;
  cached: Record<string, any> | undefined;
  submit: (options: Options) => any;
}

/**
 * Fetches route loaders for Suspended Components. Uses RAD/ and the browser's indexedDB store to load and store cached data.
 * @param routePath remix route path to load
 * @param options Redaxios options
 * @returns
 */
export function useFetcherAsync(routePath: string, options?: Options) {
  let dataloader = useDataLoader();
  let { key, search } = useLocation();
  let id = useId();
  console.log('key', key, search);
  let deferred = useMemo(() => {
    invariant(dataloader, 'Context Provider is undefined for useFetcherAsync');
    let _deferred = { resolved: false } as {
      resolved: boolean;
      cache?: Record<string, any>;
      value?: any;
      error?: any;
      promise: Promise<void>;
    };
    _deferred.promise = dataloader
      .load(routePath, id, options)
      .then(({ data, cache }) => ({ data, cache }))
      .then((value) => {
        _deferred.value = value.data;
        _deferred.cache = value.cache;
        _deferred.resolved = true;
      })
      .catch((error) => {
        _deferred.error = error;
        _deferred.resolved = true;
      });
    return _deferred;
  }, [routePath, key, options]);

  return {
    response() {
      if (typeof deferred.value !== 'undefined') {
        return deferred.value;
      }
      if (typeof deferred.error !== 'undefined') {
        throw deferred.error;
      }

      throw deferred.promise;
    },
    cached: deferred.cache && deferred.cache,
  };
}
export const includes = (object: any, prop: string) => {
  if (typeof object !== 'object') {
    return;
  }
  return Object.getOwnPropertyNames(object).includes(prop);
};
