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
import { LoadCtx, NodeValues } from 'types';
import Display from '~/components/DisplayHeading';
import CNXTLogo from '~/components/svg/logos/CNXT';
import { Navigation } from '~/components/Navigator';
import Profile, { SocialLinkType } from '~/components/Profile';
import React from 'react';
import debug from '~/app/lib/debug';
import { useIff, Iff } from '~/app/lib/Iff';
import { ImageCard } from '.';
import { IGunUserInstance } from 'gun/types';
import LZString from 'lz-string';
import Button from '~/components/Button';
import SimpleSkeleton from '~/components/skeleton/SimpleSkeleton';

let { log, error, opt, warn } = debug({ dev: true });
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
type ProfileImages = { avatar: { src: string; alt: string } };

type ProfileData = {
  title: string;
  description: string;
  images: ProfileImages;
  external_links?: {
    href_links: SocialLinkType;
    social_links: SocialLinkType;
  };
};

export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { cnxtCtx } = RemixGunContext(Gun, request);

  let { tagNode } = await cnxtCtx.hashTagWork('#', params);
  let tagnodedata = await tagNode.then();
  let workhash = tagnodedata._['#'].split('hashed-tags/')[1];
  let found = await cnxtCtx.findTagFromHash(workhash);
  let profile = tagNode.get('profile');
  profile.get('external_links').get('social_links');
  profile.get('external_links').get('href_links');
  profile.get('images');

  return json(
    { hash: workhash },
    { headers: { 'X-Namespace-Hash': workhash } }
  );
};

export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, formData, ENV, user } = RemixGunContext(Gun, request);
  let { namespace } = params as { namespace: string };
  namespace = namespace.toLocaleLowerCase();

  let lex = user.get('hashed-tags');
  let nsNode = lex.get(namespace);
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
  let { hash } = useLoaderData();

  let { response, cached } = useFetcherAsync(`/api/v1/gun/o?`, {
    params: { path: `hashed-tags.${hash}` },
  });
  let actionData = useActionData();
  let [preview, previewSet] = React.useState<string>();

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
  } // le route
  let Post = useFetcherAsync(`/api/v1/gun/o?`, {
    // Body posts as formdata... if !body =>  get request
    body: {},
    //search params
    params: { path: `hashed-tags.${hash}` },
  });
  return (
    <>
      <Navigation logo={<CNXTLogo to='/' />} />

      <Post.Form>
        <Suspense fallback={<SimpleSkeleton />}>
          <SuspendedProfileInfo response={response} />
          <SuspendedTest response={response} />
        </Suspense>
      </Post.Form>

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
  delete res._;
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
  let { title, description } = data,
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

  return (
    <>
      <Profile
        title={title}
        description={description ?? '#available here'}
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
