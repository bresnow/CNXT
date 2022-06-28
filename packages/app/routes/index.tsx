import Gun from 'gun';
import { json, LoaderFunction, useLoaderData, useCatch } from 'remix';
import { LoadCtx } from 'types';
import Display from '~/components/DisplayHeading';

import React from 'react';
import CNXTLogo from '~/components/svg/logos/CNXT';
import FormBuilder from '~/components/FormBuilder';
import { Navigation } from '~/components/Navigator';
import Profile from '~/components/Profile';

type ErrObj = {
  _key?: string | undefined;
  _value?: string | undefined;
  _form?: string | undefined;
};

export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, ENV } = RemixGunContext(Gun, request);
  let user = gun.user();
  user.auth(ENV.APP_KEY_PAIR);
  let data;
  try {
    data = await user.get('pages').get('cnxt').then();
  } catch (error) {
    data = { error };
  }
  return json(data);
};

export default function Index() {
  let { host, text, page_title, profile } = useLoaderData();
  const info = FormBuilder();

  return (
    <>
      <Navigation logo={<CNXTLogo to='/' />} />
      <Profile
        title={page_title}
        description={text}
        profilePic={profile}
        button={[
          { label: 'Aminion', color: 'white', to: '/aminion/sandbox' },
          { label: 'Namespace', color: 'blue', to: '/namespace' },
        ]}
        socials={[
          {
            href: 'https://twitter.com/bresnow',
            title: 'Twitter',
            color: 'blue',
            svgPath:
              'M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z',
          },
        ]}
      />
    </>
  );
}

export function ImageCard({ src }: { src?: string }) {
  const [loading, setLoading] = React.useState(true);

  return (
    <div className='p-8 w-full min-h-full flex items-center justify-center'>
      <div className='w-full h-auto overflow-hidden shadow-lg flex items-start justify-start flex-col  rounded-lg'>
        <div className='w-full flex items-center justify-center border-b dark:border-gray-800 relative'>
          <img
            alt='Forest'
            src={src ?? 'https://source.unsplash.com/1200x630/?forest'}
            width='1200'
            height='630'
            className={`w-full h-auto transition-opacity duration-200 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => {
              setLoading(false);
            }}
          />
          <div className='absolute bg-gradient-to-b bg-opacity-60 from-transparent to-black w-full p-4 bottom-0'>
            <div className='flex justify-between'>
              <p className='text-sm text-gray-300 flex items-center'></p>
              <p className='text-sm text-gray-300 flex items-center'>
                <svg
                  width='10'
                  height='10'
                  fill='currentColor'
                  className='h-4 w-4'
                  viewBox='0 0 1792 1792'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z' />
                </svg>
                Designed By Bresnow
              </p>
            </div>
          </div>
          {loading && (
            <div className='absolute w-full h-full top-0 left-0 animate-pulse bg-gray-100 dark:bg-gray-900' />
          )}
        </div>
        <div className='p-4 w-full flex items-center justify-start flex-row-reverse'>
          <button
            type='button'
            className='bg-gray-800 py-2 px-4 text-white rounded-lg hover:bg-gray-700 active:bg-gray-600'
          >
            Action
          </button>
        </div>
      </div>
    </div>
  );
}
export function Tag({
  color,
  filled,
  label,
}: {
  color: 'red' | 'yellow' | 'green' | 'blue' | 'gray';
  filled: boolean;
  label: string;
}) {
  return (
    <div className='p-8 w-full h-full flex items-center justify-center flex-col'>
      <div className='flex items-center justify-start'>
        {filled ? (
          <div
            className={`m-2 border border-${color}-400 dark:border-${color}-500 rounded-full relative bg-${color}-200 dark:bg-${color}-700`}
          >
            <div
              className={`px-2 py-1 text-xs text-${color}-700 dark:text-${color}-200 font-semibold`}
            >
              {label}
            </div>
          </div>
        ) : (
          <div
            className={`m-2 border border-${color}-400 dark:border-${color}-500 rounded-full relative`}
          >
            <div
              className={`px-2 py-1 text-xs text-${color}-700 dark:text-${color}-200 font-semibold`}
            >
              {label}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export const SectionTitle = ({
  heading,
  description,
  align,
  color,
  showDescription,
  image,
  node,
}: TitleProps) => {
  const title = {
    showDescription: showDescription || false,
    align: align ? align : 'center',
    color: color ? color : 'primary',
  };
  return (
    <section className='max-w-screen-xl rounded-xl bg-primary px-4 py-12 mx-auto sm:py-16 sm:px-6 lg:px-8 lg:py-20'>
      <div className='overflow-hidden shadow-lg rounded-lg relative  mb-6 w-64 m-auto'>
        {/* <Avatar src={image.src} /> */}
        {image && <img alt='eggs' src={image?.src} className='rounded-lg' />}
      </div>
      <div className='max-w-4xl mx-auto text-center'>
        <h2 className='text-2xl font-extrabold leading-20 text-white sm:text-4xl sm:leading-20'>
          {heading}
        </h2>
        <p className='mt-3 text-base leading-7 sm:mt-4 text-white'>
          {description}
        </p>
      </div>
      {/* <div className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
        <div>
          <p className="text-5xl font-extrabold leading-none text-white">119</p>
          <p className="mt-2 text-base font-medium leading-6 text-white">
            Energy raters
          </p>
        </div>
        <div className="mt-10 sm:mt-0">
          <p className="text-5xl font-extrabold leading-none text-white">6</p>
          <p className="mt-2 text-base font-medium leading-6 text-white">
            Quotes on average
          </p>
        </div>
        <div className="mt-10 sm:mt-0">
          <p className="text-5xl font-extrabold leading-none text-white">
            24 hours
          </p>
          <p className="mt-2 text-base font-medium leading-6 text-white">
            Average turnaround
          </p>
        </div>
      </div> */}
      {/* <div className="w-52 mx-auto mt-4 p-4 flex">
        <button
          type="button"
          disabled
          className="py-2 px-4  bg-gradient-to-r from-green-400 to-green-400 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 "
        >
          Just Tag It
        </button>
      </div> */}
      <div
        className='w-full mx-auto rounded-xl gap-4  p-4 relative'
        style={{
          minHeight: '320px',
          minWidth: '420px',
          maxWidth: '650px',
        }}
      ></div>
      {node}
    </section>
  );
};
type TitleProps = {
  heading: string;
  description: string;
  align?: 'left' | 'right' | 'center';
  color?: 'white' | 'primary';
  showDescription: boolean;
  image?: { src: string; alt: string };
  node?: React.ReactNode;
};

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
  console.error(error);
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
