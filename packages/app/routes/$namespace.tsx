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
  useLocation,
  Form,
} from 'remix';
import { DeferedData, useFetcherAsync } from '~/rmxgun-context/useFetcherAsync';
import { LoadCtx } from 'types';
import Display from '~/components/DisplayHeading';
import { HashtagLarge } from '~/components/svg/Icons';
import { InputTextProps } from '~/components/InputText';
import CNXTLogo from '~/components/svg/logos/CNXT';
import { Navigation } from '~/components/Navigator';
import { SuspendedTest } from './$namespace/edit';
import Profile from '~/components/Profile';
import { ContentEditable } from '~/components/ContentEditable';
import React from 'react';
import { Cedit, CeditProps, Maybe } from 'cedit';
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
  let { key } = useLocation();
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
  const [value, setValue] = React.useState('');
  return (
    <>
      <Navigation search={searchProps} logo={<CNXTLogo />} />
      <Suspense fallback={<Fallback deferred={deferred} />}>
        <SuspendedTest load={deferred.response} />
      </Suspense>
      <Outlet />
    </>
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

export function BrowserStoreExample({
  bgImg,
  header,
  content,
  headingName,
  textAreaName,
  onImgUpload,
}: {
  bgImg?: string;
  header: string;
  content: string;
  headingName: string;
  textAreaName: string;
  onImgUpload: (e: any) => void;
}) {
  let [editUi, setEditUi] = React.useState(false);
  function FileUploader() {
    return (
      <input
        type='file'
        className='block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    '
        onChange={(e) => onImgUpload(e)}
      />
    );
  }
  return (
    <Form method='post'>
      <div
        className='w-full mx-auto rounded-xl my-5  bg-gray-900 shadow-xl text-gray-300 relative'
        style={{ maxWidth: '600px' }}
      >
        <div
          className={`w-full h-40 rounded-xl bg-center bg-cover relative `}
          style={{ backgroundImage: `url(${bgImg})` }}
        >
          <div className='absolute left-1/2 -translate-x-1/2 bottom-2  w-5/6 bg-slate-800 rounded-md flex items-center bg-opacity-30 backdrop-blur-md'>
            <div className='w-1/2 p-3'>
              <input
                className='font-black text-blue-600  font-heading uppercase  focus:outline-none fo bg-transparent text-3xl   flex flex-col flex-wrap leading-none'
                autoComplete='off'
                draggable={false}
                placeholder={header}
                defaultValue={header}
                name={headingName}
                onClick={() => setEditUi(true)}
              />
              <div className=''></div>
            </div>
            <div className='w-1/2 p-3'>
              <h3 className='font-semibold'></h3>
            </div>
          </div>
        </div>
        <h3 className='font-semibold text-lg px-3 mt-2'>
          {editUi ? <FileUploader /> : null}
        </h3>
        <div className='flex items-center px-3 mt-2'>
          <textarea
            name={textAreaName}
            className={` ml-3 w-full  focus:outline-none bg-transparent  text-zinc-400`}
            rows={10}
            placeholder={content}
          />
        </div>
        <div className='flex mt-2'>
          <SubmitButton
            name={'submit'}
            label={'Submit'}
            value={'create'}
            onSubmit={() => setEditUi(false)}
          />
        </div>
      </div>
    </Form>
  );
}

export function SubmitButton({
  name,
  label,
  onSubmit,
  value,
  color,
}: {
  label: string;
  name?: string;
  value?: string;
  onSubmit?: (x: any) => void;
  color?: string;
}) {
  return (
    <div className='p-3 w-1/2'>
      <button
        type='submit'
        name={name ? name : 'submit'}
        onClick={onSubmit}
        aria-label={label}
        value={value}
        className={`block w-full text-sm text-slate-500
      mr-4 py-2 px-4
      rounded-full border-0
       font-semibold
      bg-${color ?? 'indigo'}-50 hover:text-${color ?? 'indigo'}-700
      hover:bg-${color ?? 'indigo'}-100`}
      >
        <span className='w-full'>Submit</span>
      </button>
    </div>
  );
}
