import { json, LoaderFunction, useLoaderData } from 'remix';
import Gun from 'gun';
import { html } from 'remix-utils';
import React, { Suspense } from 'react';
import jsesc from 'jsesc';
import { useIf } from 'bresnow_utility-react-hooks';
import SecureRender, { SecureRenderProps } from '~/components/Browser';
import { LoadCtx } from 'types';
import { useGunStatic } from '~/lib/gun/hooks';
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
  let { response, cached } = useFetcherAsync(`/api/gun/v1/g?`, {
    params: { path: 'cnxt' },
  });
  // This hook is peered to the http gun server and a few other peers.
  // We are gonna put the demo prop on the node "test" making the node path "test/demo/markup/html/"

  return (
    <div className='h-screen flex overflow-hidden bg-gray-600'>
      <Suspense fallback={<p>{JSON.stringify(cached)}</p>}>
        <AminionComponent load={response} />
      </Suspense>
      {/* <SecureRender namespace={'/profile'} selector={iframeRef} /> */}
    </div>
  );
}
export function AminionComponent({
  load,
  route,
}: {
  load(): string;
  route?: string;
}) {
  let srcDoc = load();
  let iframeRef = React.useRef<HTMLIFrameElement>(null);
  // let aminionRef = React.useRef<SecureRenderProps>(null);
  // let [gun] = useGunStatic(Gun);

  React.useEffect(() => {
    console.log('srcDoc', srcDoc);
  }, [srcDoc, iframeRef]);
  // This hook is peered to the http gun server and a few other peers.
  // We are gonna put the demo prop on the node "test" making the node path "test/demo/markup/html/"

  return (
    // <Iframe refrence={iframeRef} srcdocument={} />
    <SecureRender
      namespace={route}
      srcdoc={JSON.stringify(srcDoc)}
      selector={iframeRef}
    />
  );
}
// let [decrypted, decryptedSet] = React.useState<string | undefined>();
// React.useEffect(() => {
//   let env = (window as any).ENV;
//   //@ts-ignore
//   Gun.SEA.decrypt(data.body, env.APP_KEY_PAIR, (data) => {
//     if (data) {
//       setTimeout(() => {
//         decryptedSet(data);
//       }, 1500);
//     }
//   });
// });
