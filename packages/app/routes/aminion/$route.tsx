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
import { ISEAPair } from 'gun/types';
import { _Window } from '../../../../types/index';
import { on } from 'process';

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
    loadingSet(false);
  }
  React.useEffect(() => {
    console.log('context', context);
  }, [context]);
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
          ${SandBox.allowPopups}
          ${SandBox.allowSameOrigin}
          ${SandBox.allowScripts}
          ${SandBox.allowTopNavigation}
          ${SandBox.allowTopNavigationByUserActivation}`
          }
        />
      </div>
    );
  }
}

export function useSEA(
  data: any,
  options: {
    keys: ISEAPair | string;
    method: 'encrypt' | 'decrypt';
  }
) {
  let crypt = useMemo(() => {
    let crypt = { resolved: false } as {
      resolved: boolean;
      value?: any;
      error?: any;
      promise: Promise<void> | undefined;
    };
    let Sea;
    if (options.method === 'encrypt') {
      Sea = Gun.SEA.encrypt(
        data,
        typeof options.keys === 'string' ? options.keys : options.keys.epriv
      );
    } else if (options.method === 'decrypt') {
      Sea = Gun.SEA.decrypt(
        data,
        typeof options.keys === 'string' ? options.keys : options.keys.epriv
      );
    }
    crypt.promise = Sea?.then((encrypted) => ({ encrypted }))
      .then((value) => {
        crypt.value = value.encrypted;
        crypt.resolved = true;
      })
      .catch((error) => {
        crypt.error = error;
        crypt.resolved = true;
      });
    return crypt;
  }, [data, options]);

  return {
    result() {
      if (typeof crypt.value !== 'undefined') {
        return crypt.value;
      }
      if (typeof crypt.error !== 'undefined') {
        throw crypt.error;
      }

      throw crypt.promise;
    },
  };
}
