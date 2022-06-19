import { useFetcher, useLocation, useMatches } from 'remix';
import Gun from 'gun';
import React from 'react';
import 'gun/sea';
import 'gun/lib/path';
import 'gun/lib/open';
import 'gun/lib/load';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/then';
import type {
  IGun,
  ISEAPair,
  GunOptions,
  IGunChain,
  IGunInstance,
  IGunUserInstance,
  IGunInstanceRoot,
  ISEA,
} from 'gun/types';
import type { FormProps } from 'remix';
import { Form } from 'remix';

import {
  useIf,
  useIsMounted,
  useLZObject,
  useSafeCallback,
  useSafeEffect,
} from 'bresnow_utility-react-hooks';

// import { useContextReducer } from "bresnow_utility-react-hooks/context-utils";
import type {
  ActionSubmission,
  LoaderSubmission,
} from '@remix-run/react/transition';
import invariant from '@remix-run/react/invariant';
import { lzObject } from 'lz-object';
import axios from 'redaxios';
import { FileReadResult } from 'fs/promises';
/**
 * @abstract GunDB hooks to use in react - specifically remix.run to mutate data in the render without side effects.
 * @author Bresnow  // inspired by @alterx https://github.com/alterx He killed that shit
 */
export type UpdateType = {
  id: string;
  data: any;
};
export type ActionType = { type: string; payload: any };

export type Nodevalues = {
  [key: string]: any;
};

export const log = (...args: any) =>
  process.env.NODE_ENV !== 'production' ? console.log(args) : console.log;
export const error = (...args: any) =>
  process.env.NODE_ENV !== 'production' ? console.error(args) : console.log;

export function useGunStatic(
  Gun: IGun,
  opt?: GunOptions
): [instance: IGunInstance, sea: ISEA] {
  let gunOptions = opt || {};
  const { data } = useRouteData('/'),
    opts = data.gunOpts;
  let [options] = React.useState<GunOptions>(opts ? opts : gunOptions);
  let gunInstance = Gun(options);
  let [instance] = React.useState(gunInstance);
  return [instance, Gun.SEA];
}

export function useNodeSubscribe(
  cb: (data: any) => void,
  [gunRef]: [gunRef: IGunChain<any>, dependencies?: any],
  opts: { unsubscribe: boolean }
) {
  const subscribe = useSafeCallback(cb);
  const unsubscribe = useSafeCallback(() => {
    (gunRef as IGunChain<any>).off();
  });

  useSafeEffect(() => {
    (gunRef as IGunChain<any>).on(subscribe);
    if (opts.unsubscribe) {
      return unsubscribe;
    }
  }, [opts]);
}

export interface NodeFetcherHook {
  chain: {
    value: Nodevalues | undefined;
    put: (val: any) => void;
    get: (node: string) => IGunChain<any>;
  };
}

export function useNodeFetcher(
  gunRef: IGunChain<any>,
  opt?: { unsubscribe?: boolean }
): NodeFetcherHook {
  let [value, setValue] = React.useState<Nodevalues>();
  let [compress, decompress] = useLZObject({ output: 'utf16' });

  const put = useSafeCallback((val: any) => {
    if (typeof value !== 'undefined') {
      gunRef.put(null);
      gunRef.put(val);
    }
    gunRef.put(val);
  });

  useNodeSubscribe(
    (d: any) => {
      if (d) {
        log(d, 'VALUES');
        setValue(d);
      }
    },
    [gunRef],
    { unsubscribe: opt?.unsubscribe ? opt.unsubscribe : true }
  );

  let chainFetcher = {
    chain: { value, put, get: (node: string) => gunRef.get(node) },
  };

  return chainFetcher;
}

export const useSEAFetcher = (
  gun: IGunInstance,
  existingKeys?: ISEAPair
): {
  isLoggedIn: boolean;
  keys: ISEAPair | undefined;
} => {
  // State Stuff
  const [keys, setKeys] = React.useState<ISEAPair | undefined>(
      existingKeys ? existingKeys : undefined
    ),
    [user, setUser] = React.useState<
      IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>
    >(gun.user()),
    [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const mounted = useIsMounted();

  // Load Fetcher
  const fetcher = useFetcher(),
    authenticate = fetcher.type === 'init' && !keys,
    generate =
      fetcher.type == 'done' && !existingKeys && !keys && !fetcher.data.pair,
    loadedPair = fetcher.type === 'done' && fetcher.data.pair;

  // If theres keys... use them
  useSafeEffect(() => {
    if (existingKeys && mounted.current) {
      setKeys(existingKeys);
    }
  }, [existingKeys]);

  // Check to see if there are keys in cookie storage
  useSafeEffect(() => {
    if (authenticate) {
      fetcher.load('/gun/auth/sea/authenticate'); // session route
    }
    // If you get keys from cookies... use them
    if (loadedPair) {
      setKeys(fetcher.data.pair);
    }
    // if not ... generate new keys
    if (generate) {
      fetcher.load('/gun/auth/sea/generate');
    }
  }, [fetcher]);
  // authorize nodes and create user
  useSafeEffect(() => {
    if (keys) {
      // setUser(gun.user(keys.pub));

      user.auth(keys, (ack: any) => {
        if (ack.err) {
          error(ack?.err, 'AUTH');
        }
        log('logged In');
        setIsLoggedIn(true);
      });
    }
  }, [keys]);
  // If we're logged in and we have new keys... update cookie store
  // useSafeEffect(() => {
  //   if (keys && fetcher.type === "done" && !fetcher.data) {
  //     bobaFetch.submit(
  //       { keyPair: JSON.stringify(keys) },
  //       { method: "post", action: "/gun/auth/session" }
  //     );
  //   }
  // }, [keys, fetcher]);

  //TODO: encryption, signing and compression

  let authFetcher = { isLoggedIn, keys };
  return authFetcher;
};

export interface EnhancedFormProps {
  hiddenInputs: React.InputHTMLAttributes<HTMLInputElement>[];
  children: JSX.Element[] | JSX.Element;
  method?: 'post' | 'get';
  action?: string;
  encType?: 'multipart/form-data' | 'application/x-www-form-urlencoded';
  reloadDocument?: boolean;
  replace?: boolean;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

/**
 * Remix Form Element with hidden inputs built in
 */
export function EnhancedForm({
  hiddenInputs,
  children,
  action,
  method,
  encType,
  reloadDocument,
  replace,
  onSubmit,
}: EnhancedFormProps) {
  let location = useLocation();
  let current = location.pathname;
  return (
    <Form
      action={action ?? current}
      method={method ?? 'post'}
      encType={encType ?? undefined}
      onSubmit={onSubmit ?? undefined}
      replace={replace ?? false}
      reloadDocument={reloadDocument ?? false}
    >
      {children}
      <HiddenInputs props={hiddenInputs} />
    </Form>
  );
}

const HiddenInputs = ({
  props,
}: {
  props: React.InputHTMLAttributes<HTMLInputElement>[];
}) => {
  return (
    <>
      {props.map((prop, i) => (
        <input
          key={
            prop.name +
            Math.floor(
              Math.random() * (Math.ceil(1000) - Math.floor(100) + 1) + i
            ).toString()
          }
          type='hidden'
          name={prop.name}
          value={prop.value}
        />
      ))}
    </>
  );
};

export function useRouteData(pathname: string): {
  params: any;
  data: any;
  handle: any;
} {
  let matches = useMatches();
  let parentMatch = matches.find((match) => match.pathname === pathname);
  if (!parentMatch) return { params: null, data: null, handle: null };
  return {
    params: parentMatch.params,
    data: parentMatch.data,
    handle: parentMatch.handle,
  };
}

export function useFileUploader(): [
  {
    result: any;
    loading: boolean;
    error: any;
  },
  (e: any) => void
] {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<DOMException>();
  const [result, setResult] = React.useState<
    string | ArrayBuffer | null | undefined
  >();
  function onChange(e: any) {
    let file = e.target.files[0];
    var reader = new FileReader();
    reader.onloadstart = () => {
      setLoading(true);
    };
    reader.onload = ({ target }) => {
      let { result } = target as FileReader;
      setResult(result);
    };
    reader.onerror = ({ target }) => {
      if (target?.error) {
        setError(target?.error);
      }
      console.error(target?.error);
    };
    reader.readAsDataURL(file);
  }
  let file = { result, loading, error };
  return [file, onChange];
}
