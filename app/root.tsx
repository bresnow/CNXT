import reset from '@unocss/reset/tailwind.css';
import unocss from 'app:uno.css';
import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useMatches,
} from 'remix';
import type { MetaFunction, LinksFunction, LoaderFunction } from 'remix';
import { LoadCtx } from 'types';
import Gun, { ISEAPair } from 'gun';
import Display from '~/lib/components/DisplayHeading';
import {
  ExternalScripts,
  ExternalScriptsFunction,
} from '~/lib/context/external-scripts';

import { HomeIcon } from '~/lib/components/svg/Icons';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: unocss,
    },
    {
      rel: 'stylesheet',
      href: reset,
    },
  ];
};
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { ENV, gun } = RemixGunContext(Gun, request);
  let user = gun.user();
  let url = new URL(request.url);
  let { protocol, host } = url;
  let meta;
  try {
    meta = await user.auth(ENV.APP_KEY_PAIR).path(`pages.root.meta`).then();
  } catch (error) {}
  let gunOpts = {
    peers: [`${protocol}//${host}/gun`],
    radisk: true,
    localStorage: false,
  };
  return json<RootLoaderData>({
    meta,
    gunOpts,
    ENV,
  });
};
export type RootLoaderData = {
  meta: Record<string, string> | undefined;
  gunOpts: {
    peers: string[];
    radisk: boolean;
    localStorage: boolean;
  };
  ENV?: {
    DOMAIN: string | undefined;
    PEER_DOMAIN: string[] | undefined;
    CLIENT: string | undefined;
    APP_KEY_PAIR?: ISEAPair | undefined;
  };
};

/** Dynamically load meta tags from root loader*/
export const meta: MetaFunction = () => {
  const matches = useMatches();
  let root = matches.find((match) => match.id === 'root');
  const metaDoc: Record<string, string> = root?.data?.meta;
  return metaDoc;
};
export type MenuLinks = {
  id: string;
  link: string;
  label: string;
  icon?: JSX.Element;
  subMenu?: MenuLinks;
}[];
export let handle: { links: MenuLinks; scripts: ExternalScriptsFunction } = {
  links: [
    {
      label: 'HOME',
      id: 'home',
      link: '/',
      icon: <HomeIcon />,
    },
  ],
  scripts: () => [],
};

export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='bg-dark-800'>
        <div className=' font-sans antialiased bg-gradient-to-tr from-cnxt_red via-white to-transparent text-gray-900 leading-normal tracking-wider bg-cover'>
          <div className='p-5 font-sans antialiased bg-gradient-to-b from-cnxt_black via-blue-400 to-cnxt_blue text-gray-900 leading-normal tracking-wider bg-cover'>
            {' '}
            <div className='py-10 mt-10 font-sans antialiased bg-gradient-to-tr from-slate-900 via-transparent to-cnxt_red text-gray-900 leading-normal tracking-wider bg-cover'>
              <Outlet />
            </div>
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <ExternalScripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
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
