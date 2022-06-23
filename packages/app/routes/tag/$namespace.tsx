import Gun from 'gun';
import {
  json,
  LoaderFunction,
  useLoaderData,
  useCatch,
  Outlet,
  useParams,
  Form,
} from 'remix';
import { useFetcherAsync } from '~/rmxgun-context/useFetcherAsync';
import { LoadCtx } from 'types';
import Display from '~/components/DisplayHeading';
import CNXTLogo from '~/components/svg/logos/CNXT';
import { Navigation } from '~/components/Navigator';
import Profile from '~/components/Profile';
import React, { Suspense } from 'react';

export function Fallback({
  deferred,
}: {
  deferred: { response?: () => any; cached: Record<string, any> | undefined };
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
            if (typeof value === 'object') {
              value = JSON.stringify(value);
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
  let { gun, seaAuth, ENV } = RemixGunContext(Gun, request);

  let namespace = params.namespace as string;

  let data = { host: ENV.DOMAIN, namespace };

  return json(data);
};
function SuspendedProfileInfo({ getData }: { getData: () => any }) {
  let log = console.log.bind(console);
  let data = getData();
  log(data);
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

export default function NameSpaceRoute() {
  let { namespace } = useParams();
  let { host } = useLoaderData();
  let deferred = useFetcherAsync(`/api/v1/gun/g?`, {
    params: { path: `${namespace}`, auth: 'true' },
  });
  const [value, setValue] = React.useState('');
  return (
    <>
      <Suspense fallback={<p>{JSON.stringify(deferred.cached)}</p>}>
        <SuspendedProfile response={deferred.response} />
        <SuspendedProfileInfo getData={deferred.response} />
      </Suspense>

      <Outlet />
    </>
  );
}
export type ProfileType = {
  title: string;
  description: string;
  profilePic: string;
  socials: {
    twitter: string;
    youtube: string;
    github: string;
    unsplash: string;
    instagram: string;
  };
};
export function SuspendedProfile({ response }: { response: () => any }) {
  let { title, description, profilePic } = response();
  console.log({ title, description, profilePic }, 'kjsdbkjsbdakj');

  return (
    <Profile
      title={title}
      description={description}
      profilePic={profilePic}
      button={[]}
      socials={
        [
          // {
          //   href: socials.twitter,
          //   title: 'Twitter',
          //   color: 'blue',
          //   svgPath:
          //     'M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z',
          // },
          // {
          //   href: socials.youtube,
          //   title: 'YouTube',
          //   color: 'red',
          //   svgPath:
          //     'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z',
          // },
          // {
          //   href: socials.instagram,
          //   title: 'Instagram',
          //   color: 'indigo',
          //   svgPath:
          //     'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z',
          // },
          // {
          //   href: socials.github,
          //   title: 'Unsplash',
          //   color: 'gray',
          //   svgPath:
          //     'M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm2.218 18.616c-.354.069-.468-.149-.468-.336v-1.921c0-.653-.229-1.079-.481-1.296 1.56-.173 3.198-.765 3.198-3.454 0-.765-.273-1.389-.721-1.879.072-.177.312-.889-.069-1.853 0 0-.587-.188-1.923.717-.561-.154-1.159-.231-1.754-.234-.595.003-1.193.08-1.753.235-1.337-.905-1.925-.717-1.925-.717-.379.964-.14 1.676-.067 1.852-.448.49-.722 1.114-.722 1.879 0 2.682 1.634 3.282 3.189 3.459-.2.175-.381.483-.444.936-.4.179-1.413.488-2.037-.582 0 0-.37-.672-1.073-.722 0 0-.683-.009-.048.426 0 0 .46.215.777 1.024 0 0 .405 1.25 2.353.826v1.303c0 .185-.113.402-.462.337-2.782-.925-4.788-3.549-4.788-6.641 0-3.867 3.135-7 7-7s7 3.133 7 7c0 3.091-2.003 5.715-4.782 6.641z',
          // },
          // {
          //   href: socials.unsplash,
          //   title: 'Unsplash',
          //   color: 'gray',
          //   svgPath:
          //     'M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z',
          // },
        ]
      }
    />
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
