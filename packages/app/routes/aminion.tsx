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

export const loader: LoaderFunction = async ({ request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { ENV } = RemixGunContext(Gun, request);
  return json({ body: null });
};

export default function AminionDemo() {
  let data = useLoaderData();
  let iframeRef = React.useRef<HTMLIFrameElement>(null);
  let { response, cached } = useFetcherAsync(`/create`);
  // This hook is peered to the http gun server and a few other peers.
  // We are gonna put the demo prop on the node "test" making the node path "test/demo/markup/html/"

  return (
    <div className='h-screen flex overflow-hidden bg-gray-600'>
      <Suspense fallback={<p>{JSON.stringify(cached)}</p>}>
        <AminionComponent response={response} />
      </Suspense>
      {/* <SecureRender namespace={'/profile'} selector={iframeRef} /> */}
    </div>
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
    <div className='p-8 w-full h-full flex items-center justify-center rounded-lg'>
      <div className='shadow-lg w-full flex items-start justify-start flex-col  rounded-lg'>
        <Iframe
          srcdocument={data}
          className={`w-full h-screen`}
          sandbox={`allow-forms allow-same-origin allow-scripts allow-top-navigation`}
        />
      </div>
    </div>
  );
}
