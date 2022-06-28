import { Suspense } from 'react';
import Gun from 'gun';
import {
  json,
  LoaderFunction,
  useLoaderData,
  useCatch,
  Outlet,
  Form,
  ActionFunction,
  useActionData,
  useFetcher,
  EntryContext,
} from 'remix';
import { useFetcherAsync } from '~/rmxgun-context/useFetcherAsync';
import { LoadCtx } from 'types';
import Display from '~/components/DisplayHeading';
import CNXTLogo from '~/components/svg/logos/CNXT';
import { Navigation } from '~/components/Navigator';
import Profile from '~/components/Profile';
import React from 'react';
import debug from '~/app/lib/debug';
import { useIff, Iff } from '~/app/lib/Iff';
import { ImageCard } from '.';
import { IGunUserInstance } from 'gun/types';
import LZString from 'lz-string';

let { log, error, opt, warn } = debug({ dev: false });
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

type LoaderData = {
  title: string;
  description: string;
  profilePic: string;
};
type Handle = {
  getMasterUser(window: Window): {
    user: IGunUserInstance;
  };
};
export let handle: Handle = {
  getMasterUser(window: Window) {
    let Gun = window.Gun;
    let root = ((window as any).__remixContext as EntryContext).routeData.root;
    let APP_KEYS = root.ENV.APP_KEY_PAIR;
    let opts = root.gunOpts;
    let gun = Gun(opts);
    let user = gun.user().auth(APP_KEYS, function (ack) {
      let err = (ack as any).err;
      if (err) {
        error(err);
      }
    });

    return { user };
  },
};
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, seaAuth, ENV } = RemixGunContext(Gun, request);
  let { namespace } = params as { namespace: string };
  namespace = namespace.toLocaleLowerCase();
  log(namespace);
  let nsNode = gun
    .user()
    .auth(ENV.APP_KEY_PAIR, function (ack) {
      let err = (ack as any).err;
      if (err) {
        console.error(err);
      }
    })
    .get('tags')
    .get(namespace);
  let data;
  let nodeData = await nsNode.then();
  if (!nodeData) {
    data = {
      title: namespace,
      description: `#${namespace} is an available namespace.`,
      profilePic: '/images/AppIcon.svg',
    };

    return json(data);
  }
  let { description, profilePic } = nodeData;
  return json({ title: namespace, description, profilePic });
};

export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, formData, ENV } = RemixGunContext(Gun, request);
  let { namespace } = params as { namespace: string };
  namespace = namespace.toLocaleLowerCase();
  log(namespace);
  let nsNode = gun
    .user()
    .auth(ENV.APP_KEY_PAIR, function (ack) {
      let err = (ack as any).err;
      if (err) {
        error(err);
      }
    })
    .get('tags')
    .get(namespace);
  let { title, description } = await formData();
  if (typeof description !== 'string' || description.length < 1) {
    return json(
      {
        error: 'Please add description',
      },
      { status: 301 }
    );
  }
  if (typeof title !== 'string' || title.length < 4) {
    return json(
      {
        error: 'Title must be at least 4 characters long.',
      },
      { status: 301 }
    );
  }
  let data = { namespace, title, description };
  nsNode.put(data);
  return json(data);
};
export default function NameSpaceRoute() {
  let { title, description, profilePic } = useLoaderData<LoaderData>();
  let { response, cached } = useFetcherAsync(`/api/v1/gun/o?`, {
    params: { path: `tags.${title}` },
  });
  let actionData = useActionData();
  let [preview, previewSet] = React.useState<string>();
  React.useEffect(() => {}, []);
  React.useEffect(() => {
    if (actionData) {
      warn('ACTION DATA');
      log(actionData);
    }
  }, [actionData]);

  function imgChange(e: React.ChangeEvent<HTMLInputElement>) {
    let file = (e?.target as any).files[0];
    var reader = new FileReader();

    reader.onload = ({ target }: ProgressEvent<FileReader>) => {
      let base64 = (target as FileReader).result as string;
      previewSet(base64);
    };
    reader.onerror = (r: any) => {
      error(r.target.result);
    };
    reader.readAsDataURL(file);
  }
  let post = useFetcherAsync(`/api/v1/gun/o?`, {
    body: { lemon: 'grab', fifty: 'shades' },
    params: { path: `tags.${title}` },
  });
  return (
    <>
      <Navigation logo={<CNXTLogo to='/' />} />
      <Form method={'post'}>
        <Suspense
          fallback={
            <Profile
              title={title}
              description={description}
              profilePic={profilePic}
              button={[]}
              socials={[
                {
                  href: 'https://twitter.com/bresnow',
                  title: 'Twitter',
                  color: 'white',
                  svgPath:
                    'M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z',
                },
              ]}
            />
          }
        >
          <SuspendedProfileInfo response={response} profilePreview={preview} />
        </Suspense>
      </Form>
      <Form method={'post'}>
        <div className='mb-6'>
          <label className='font-display text-jacarta-700 mb-2 block dark:text-white'>
            Image, Video, Audio, or 3D Model
            <span className='text-red'>*</span>
          </label>
          <p className='dark:text-jacarta-300 text-2xs mb-3'>
            Drag or choose your file to upload
          </p>

          <div className='group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center'>
            <div className='relative z-10 cursor-pointer'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='24'
                height='24'
                className='fill-jacarta-500 mb-4 inline-block dark:fill-white'
              >
                <path fill='none' d='M0 0h24v24H0z' />
                <path d='M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z' />
              </svg>
              <p className='dark:text-jacarta-300 mx-auto max-w-xs text-xs'>
                JPG, PNG, GIF, SVG, WEBP Max size: 100 MB
                {/* MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. */}
              </p>
            </div>
            <div className='absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100'></div>
            <input
              type='file'
              accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
              id='file-upload'
              name={'file'}
              onChange={imgChange}
              className='absolute inset-0 z-20 cursor-pointer opacity-0'
            />
          </div>
        </div>
        <button
          type={'submit'}
          name={'test'}
          id={'test-budden'}
          value={'butt-Mahm'}
        >
          {'TEST BUDDEN'}
        </button>
      </Form>

      <Outlet />
    </>
  );
}

interface SuspendedResponse<Return> {
  (): Return;
}
export function SuspendedTest({
  response,
}: {
  response: SuspendedResponse<any>;
}) {
  let res = response();
  return (
    <div
      className={`w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0`}
    >
      <pre>
        <code>{JSON.stringify(res, null, 2)}</code>
      </pre>
    </div>
  );
}
export function SuspendedProfileInfo({
  response,
  profilePreview,
}: {
  profilePreview?: string;
  response: SuspendedResponse<{
    title: string;
    description: string;
    avatar?: { image?: string; name?: string };
    _?: { ['#']: string };
  }>;
}) {
  let data = response();
  let { title, description, avatar } = data,
    profilePic = profilePreview;
  React.useEffect(() => {
    let { user } = handle.getMasterUser(window);
    let { pathname } = window.location,
      namespace = pathname.replace('/', '').toLocaleLowerCase();
    let node = user.get('tags').get(namespace),
      avinode = node.get('avatar');
    avinode.once((data) =>
      console.log(`%c${JSON.stringify(data, null, 2)}`, `color:#f89`)
    );
    node.on((data) => {
      data && log(data);
      if (profilePreview) {
        let compressed = LZString.compressToUTF16(profilePreview);
        console.log(`%c` + profilePreview, `color:#37F`);
        console.log(`%c${compressed}`, `color:#f83`);
        avinode.put(null);
        avinode.put(
          { image: profilePreview, name: `${namespace}-avi.jpg` },
          (put) => {
            console.log(`%c${JSON.stringify(put, null, 2)}`, `color:#178`);
          }
        );
      }
    });
  }, []);

  React.useEffect(() => {}, []);
  return (
    <>
      <Profile
        title={title}
        description={description}
        profilePic={
          avatar?.image
            ? avatar?.image
            : profilePic
            ? profilePic
            : '/images/AppIcon.svg'
        }
        button={[]}
        socials={[
          {
            href: 'https://twitter.com/bresnow',
            title: 'Twitter',
            color: 'white',
            svgPath:
              'M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z',
          },
        ]}
      />
    </>
  );
}

export function CatchBoundary() {
  let caught = useCatch();
  console.log('caught', JSON.stringify(caught));
  switch (caught.status) {
    case 401:
    case 403:
    case 404:
      return (
        <>
          <Navigation logo={<CNXTLogo to='/' />} />
          <Profile
            title={'Tag Available'}
            description={'Edit the tag to create a profile.'}
            profilePic={'/images/AppIcon.svg'}
            button={[]}
            socials={[
              {
                href: 'https://twitter.com/bresnow',
                title: 'Twitter',
                color: 'white',
                svgPath:
                  'M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z',
              },
            ]}
          />
        </>
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
