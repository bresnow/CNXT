import reset from "@unocss/reset/tailwind.css";
import unocss from "~/uno.css";
import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useMatches,
} from "remix";
import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { LoadCtx } from "types";
import Gun, { ISEAPair } from "gun";
import Display from "../components/DisplayHeading";
import jsesc from "jsesc";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: unocss,
    },
    {
      rel: "stylesheet",
      href: reset,
    },
  ];
};
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { ENV, gun } = RemixGunContext(Gun, request);
  let user = gun.user();

  let meta;
  try {
    meta = await user.auth(ENV.APP_KEY_PAIR).path(`pages.root.meta`).then();
  } catch (error) {}
  let gunOpts = {
    peers: (ENV.PEER_DOMAIN as string[]).map((peer) => `https://${peer}/gun`),
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
  ENV: {
    DOMAIN: string | undefined;
    PEER_DOMAIN: string[] | undefined;
    CLIENT: string | undefined;
    APP_KEY_PAIR: ISEAPair;
  };
};

/** Dynamically load meta tags from root loader*/
export const meta: MetaFunction = () => {
  const matches = useMatches();
  let root = matches.find((match) => match.id === "root");
  const metaDoc: Record<string, string> = root?.data?.meta;
  return metaDoc;
};
export type MenuLinks = {
  id: string;
  link: string;
  label: string;
  icon?: string;
}[];
export let handle = {
  links: [
    {
      label: "HOME",
      id: "home",
      link: "/",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
    },
    // {
    //   label: "test2",
    //   link: "/builder",
    //   id: "builder",
    //   icon: "M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10M9 21h6",
    // },
    // {
    //   label: "test3",
    //   link: "/builder",
    //   id: "builder",
    //   icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    // },
    // {
    //   label: "Object Builder",
    //   link: "/builder",
    //   id: "builder",
    //   icon: "M19.5 10.5c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM4 4h16v2H4zm14 8v-1.5c0-.83-.67-1.5-1.5-1.5.83 0 1.5-.67 1.5-1.5V7a2 2 0 00-2-2h-1v2h2a2 2 0 002-2zM2 17v2h16v-2a2 2 0 00-2-2h-2v2H4a2 2 0 00-2 2z",
    // },
  ],
};

export default function App() {
  let { ENV } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />

        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${jsesc(ENV)};`,
          }}
        />

        <Scripts />

        {process.env.NODE_ENV === "development" && <LiveReload />}
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
        <div className="min-h-screen py-4 flex flex-col justify-center items-center">
          <Display
            title={`${caught.status}`}
            titleColor="white"
            span={`${caught.statusText}`}
            spanColor="pink-500"
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
    <div className="min-h-screen py-4 flex flex-col justify-center items-center">
      <Display
        title="Error:"
        titleColor="#cb2326"
        span={error.message}
        spanColor="#fff"
        description={`error`}
      />
    </div>
  );
}
