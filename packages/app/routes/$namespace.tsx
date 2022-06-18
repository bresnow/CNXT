import { Suspense } from 'react';
import Gun from 'gun';
import {
  ActionFunction,
  json,
  LoaderFunction,
  useLoaderData,
  useActionData,
  useCatch,
  Outlet,
  useParams,
} from 'remix';
import { DeferedData, useFetcherAsync } from '~/rmxgun-context/useFetcherAsync';
import { LoadCtx } from 'types';
import Display from '~/components/DisplayHeading';
import { HashtagLarge } from '~/components/svg/Icons';
import { InputTextProps } from '~/components/InputText';
import CNXTLogo from '~/components/svg/logos/CNXT';
import { Navigation } from '~/components/Navigator';
import { SuspendedTest } from './$namespace/edit';

export function Fallback({
  deferred,
}: {
  deferred: { response(): any; cached: Record<string, any> | undefined };
}) {
  return (
    <div className='grid grid-cols-1 gap-4 p-4'>
      <div className='col-span-1'>
        <h5>Cached Data From Radisk/ IndexedDB</h5>
        {deferred.cached &&
          Object.entries(deferred.cached).map((val) => {
            let [key, value] = val;
            if (key === '_') {
              return;
            }
            return (
              <div
                key={key}
                className='flex animate-pulse flex-row items-center space-y-5 justify-center space-x-5'
              >
                <div className='w-1/3 p-5 rounded-md '>{key}</div>
                <div className='w-1/2 bg-gray-300 p-5 rounded-md flex-wrap'>
                  {`${value}`}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

type ErrObj = {
  _key?: string | undefined;
  _value?: string | undefined;
  _form?: string | undefined;
};
type LoadError = {
  error: ErrObj;
};
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, seaAuth } = RemixGunContext(Gun, request);

  let namespace = params.namespace as string;
  let data;
  try {
    let _data = await gun.get(namespace).then();

    data = { namespace, ..._data };
  } catch (error) {
    data = { error };
  }
  return json(data);
};

export default function NameSpaceRoute() {
  let { namespace } = useParams();
  let deferred = useFetcherAsync(`/api/gun/v1/g?`, {
    params: { path: namespace },
  });

  let searchProps: InputTextProps = {
    value: namespace,
    placeholder: namespace,
    icon: <HashtagLarge className={`${'fill-primary'} `} />,
    className:
      'w-full bg-transparent text-primary py-2 group placeholder:text-primary focus:outline-none rounded-md flex',
  };
  return (
    <Navigation search={searchProps} logo={<CNXTLogo />}>
      <Suspense fallback={<Fallback deferred={deferred} />}>
        <SuspendedTest load={deferred.response} />
      </Suspense>
      <Outlet />
    </Navigation>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 403:
    case 404:
      return (
        <div className='min-h-screen py-4 flex flex-col justify-center items-center'>
          <Display
            title={`${caught.status}`}
            titleColor='white'
            span={`${caught.statusText}`}
            spanColor='pink-500'
            description={`${caught.statusText}`}
          />
        </div>
      );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error.message);
  console.trace(error.message);
  return (
    <div className='min-h-screen py-4 flex flex-col justify-center items-center'>
      <Display
        title='Error:'
        titleColor='#cb2326'
        span={error.message}
        spanColor='#fff'
        description={`error`}
      />
    </div>
  );
}
