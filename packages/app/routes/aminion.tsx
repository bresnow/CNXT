import { json, LoaderFunction, useLoaderData } from 'remix';
import Gun from 'gun';
import { html } from 'remix-utils';
import React, { Suspense } from 'react';
import jsesc from 'jsesc';
import { useIf } from 'bresnow_utility-react-hooks';
import SecureRender, { SecureRenderProps } from '~/components/Browser';
import { LoadCtx } from 'types';
import { useGunStatic } from '~/remix-gun-utility/gun/hooks';
import { useFetcherAsync } from '~/rmxgun-context/useFetcherAsync';
import Iframe from '~/components/Iframe';
import CNXTLogo from '~/components/svg/logos/CNXT';
import FMLogo from '~/components/svg/logos/FltngMmth';
import { Navigation } from '~/components/Navigator';

export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, seaAuth, ENV } = RemixGunContext(Gun, request);

  let namespace = params.namespace as string;

  let data = { host: ENV.DOMAIN, namespace };

  return json(data);
};
export default function AminionDemo() {
  let { host } = useLoaderData();
  let iframeRef = React.useRef<HTMLIFrameElement>(null);
  let { response, cached } = useFetcherAsync(`/create`);
  // This hook is peered to the http gun server and a few other peers.
  // We are gonna put the demo prop on the node "test" making the node path "test/demo/markup/html/"

  return (
    <>
      <Navigation logo={<CNXTLogo to='/' />} />
      <Suspense
        fallback={
          <Iframe
            src={'/create'}
            className={`w-full h-screen`}
            sandbox={`allow-forms allow-same-origin allow-scripts allow-top-navigation`}
          />
        }
      >
        <AminionComponent response={response} />
      </Suspense>
    </>
  );
}
export function AminionComponent({
  response,
  route,
}: {
  response(): string;
  route?: string;
}) {
  let data = response();
  return (
    <div className='pt-24 w-full h-full flex items-center justify-center rounded-lg'>
      <Iframe
        srcdocument={data}
        className={`w-full h-screen`}
        sandbox={`allow-forms allow-same-origin allow-scripts allow-top-navigation`}
      />
    </div>
  );
}
