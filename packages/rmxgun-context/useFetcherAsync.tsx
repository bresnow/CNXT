import { FormEvent, FormEventHandler, useMemo } from 'react';
import { Form, useLocation } from 'remix';
import invariant from '@remix-run/react/invariant';
import jsesc from 'jsesc';
import Gun from 'gun';
import { ClientContext, useDataLoader } from './context';
import { useIf, useSafeCallback } from 'bresnow_utility-react-hooks';
import React from 'react';
import { Options } from './browser';
import { ContentEditable } from '~/components/ContentEditable';
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

export type FetcherInputProps = {
  children: React.ReactNode;
  name: string;
  id: string;
  edit?: boolean | undefined;
} & React.HTMLAttributes<HTMLDivElement>;
/**
 * Fetches route loaders for Suspended Components. Uses RAD/ and the browser's indexedDB store to load and store cached data.
 * @param routePath remix route path to load
 * @param options Redaxios options
 * @returns
 */
export function useFetcherAsync(routePath: string, options?: Options) {
  let dataloader = useDataLoader();
  let { key, search } = useLocation();
  let formRef = React.useRef<HTMLFormElement>(null);

  let formdata = new FormData(formRef.current ?? undefined);

  let deferred = useMemo(() => {
    invariant(dataloader, 'Context Provider is undefined for useFetcherAsync');
    let _deferred = { resolved: false } as {
      resolved: boolean;
      cache?: Record<string, any>;
      value?: any;
      error?: any;
      promise: Promise<void>;
    };
    if (typeof options?.body === 'object') {
      for (let prop in options.body) {
        formdata.append(prop, (options.body as any)[prop]);
      }
      options.body = formdata;
    }
    _deferred.promise = dataloader
      .load(routePath, options)
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
  }, [routePath, options, formdata, key]);

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
    Form({
      children,
      ariaDescribed,
      method,
      action,
      className,
      reloadDocument,
      encType,
      replace,
      onSubmit,
    }: {
      children: React.ReactNode;
      ariaDescribed?: string;
      method?: 'get' | 'post';
      action?: string;
      className?: string;
      reloadDocument?: boolean;
      encType?: 'multipart/form-data' | 'application/x-www-form-urlencoded';
      replace?: boolean;
      onSubmit?: FormEventHandler<HTMLFormElement>;
    }) {
      return (
        <>
          <Form
            ref={formRef}
            method={method ?? 'post'}
            action={action}
            aria-describedby={ariaDescribed}
            reloadDocument={reloadDocument}
            replace={replace}
            encType={encType}
            onSubmit={onSubmit}
            className={className}
          >
            {children}
          </Form>
        </>
      );
    },
    Input({ children, ...props }: FetcherInputProps) {
      return <ContentEditable {...props}>{children}</ContentEditable>;
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
