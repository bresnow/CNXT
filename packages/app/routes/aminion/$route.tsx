import {
  json,
  LoaderFunction,
  useLoaderData,
  EntryContext,
  useLocation,
} from 'remix';
import Gun from 'gun';
import React, { useMemo } from 'react';
import { LoadCtx } from 'types';
import Iframe, { SandBox } from '~/components/Iframe';
import CNXTLogo from '~/components/svg/logos/CNXT';
import { Navigation } from '~/components/Navigator';
import invariant from '@remix-run/react/invariant';
import { Options } from 'redaxios';
import { useDataLoader } from '~/rmxgun-context/context';
import { ISEA, ISEAPair } from 'gun/types';
import { _Window } from '../../../../types/index';
import { on } from 'process';
import jsesc from 'jsesc';

export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, seaAuth, ENV } = RemixGunContext(Gun, request);

  let { route } = params;

  let data = { route };

  return json(data);
};

export default function AminionDemo() {
  let { route } = useLoaderData();
  let iframeRef = React.useRef<HTMLIFrameElement>(null);
  let [loading, loadingSet] = React.useState(true);
  let [context, contextSet] = React.useState<EntryContext>();
  // let { response, cached } = useFetcherAsync(`/create`);
  // This hook is peered to the http gun server and a few other peers.
  // We are gonna put the demo prop on the node "test" making the node path "test/demo/markup/html/"

  function onLoad({ target }: Event) {
    const log = console.log.bind(console);
    let window = (target as HTMLIFrameElement).contentWindow;
    let document = (target as HTMLIFrameElement).contentDocument;
    contextSet(window?.__remixContext);
    let browser = window?.navigator;
    window?.postMessage(
      { hello: 'World', description: 'wllawllallalllal' },
      `*`
    );
    loadingSet(false);
  }
  function onMessage({ data }: MessageEvent) {
    console.log('onMessage', data);
    let _window = iframeRef.current?.contentWindow;
    if (_window) {
      _window.__remixContext.routeData['description'] = data.description;
    }
  }
  React.useEffect(() => {
    let _window = iframeRef.current?.contentWindow;
    if (_window) {
      _window.addEventListener('message', onMessage);
    }
  }, []);
  return (
    <>
      <Aminion
        route={`/${route}`}
        loading={loading}
        onLoad={onLoad}
        reference={iframeRef}
      />
    </>
  );
}
export function Aminion({
  route,
  reference,
  onLoad,
  sandbox,
  loading,
}: {
  route: string;
  onLoad?: (e: Event) => void;

  sandbox?: SandBox;
  loading: boolean;
  reference?: React.MutableRefObject<HTMLIFrameElement | null>;
}) {
  {
    return (
      <div className='pt-24 w-full h-full flex items-center justify-center rounded-lg'>
        <Iframe
          url={route}
          reference={reference}
          className={`w-full h-screen transition-all duration-500  ${
            loading ? 'blur opacity-50' : ' opacity-100'
          }`}
          onLoad={onLoad}
          sandbox={
            sandbox ??
            ` ${SandBox.allowForms}  
          ${SandBox.allowModals}
          ${SandBox.allowSameOrigin}
          ${SandBox.allowScripts}
          ${SandBox.allowTopNavigationByUserActivation}`
          }
        />
      </div>
    );
  }
}

/**
 *
 * useSEA is a hook that  uses the SEA encryption algorithm to
 * generate keypairs,encrypt, decrypt, sign and verify data. Returs a promise to be
 * used with React.Suspense and suspended component.
 *
 */
export function useSEA({
  method,
  keys,
  data = {},
}: {
  keys: ISEAPair | string;
  method: 'encrypt' | 'decrypt' | 'sign' | 'verify' | 'pair';
  data: any;
}) {
  // memoize sea method to avoid generating new keypairs every render
  let crypt = useMemo(() => {
    // "if you make a promise you do everything in your power not to break... the code"
    let _crypt = { resolved: false } as {
      resolved: boolean;
      value?: any;
      error?: any;
      promise: Promise<void> | undefined;
    };
    // store variables in the context before we start listing conditions
    let SEA,
      _key = typeof keys === 'string' ? keys : keys.epriv;

    // method prop determines the ...  method.
    switch (method) {
      case 'encrypt':
        SEA = Gun.SEA.encrypt(data, _key);
        break;
      case 'decrypt':
        SEA = Gun.SEA.decrypt(data, _key);
        break;
      case 'sign':
        (keys as ISEAPair).pub
          ? (SEA = Gun.SEA.sign(data, keys as ISEAPair))
          : console.error('error: Keys are not a SEAPair');
        break;
      case 'verify':
        SEA = Gun.SEA.verify(data, _key);
        break;
      case 'pair':
        SEA = Gun.SEA.pair();
      default:
        throw new Error('method not supported');
    }
    // Cross my heart and hope for immortaility... Promise joke
    _crypt.promise = SEA?.then((result) => result)
      .then((value) => {
        _crypt.value = value;
        _crypt.resolved = true;
      })
      .catch((error) => {
        _crypt.error = error;
        _crypt.resolved = true;
      });
    return _crypt;
  }, [data, keys, method]);
  // Is it a high order function now?
  return function () {
    if (typeof crypt.value !== 'undefined') {
      return crypt.value;
    }
    if (typeof crypt.error !== 'undefined') {
      throw crypt.error;
    }
    throw crypt.promise;
  };
}
