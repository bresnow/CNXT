import {
  json,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useLocation,
  useMatches,
} from "remix";
import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { LoadCtx, NodeValues } from "types";
import styles from "./tailwind.css";
import Gun, { GunOptions, ISEAPair } from "gun";
import React from "react";
import { useRouteData } from "./lib/gun/hooks";
import { getDomain } from "./server";
import Display from "./components/DisplayHeading";
import CNXTLogo from "./components/svg/logos/CNXT";
import FMLogo from "./components/svg/logos/FltngMmth";
import jsesc from "jsesc";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css?family=Cantarell",
    },
  ];
};
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { ENV, graph } = RemixGunContext(Gun, request);
  let meta;
  try {
    meta = await graph.get(`pages.root.meta`).val();
  } catch (error) {}
  let peerList = {
    DOMAIN: getDomain(),
    PEER: `https://${ENV.PEER_DOMAIN}/gun`,
  };
  let gunOpts = {
    peers: [peerList.DOMAIN, peerList.PEER],
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
    PEER_DOMAIN: string | undefined;
    CLIENT: string | undefined;
    APP_KEY_PAIR: ISEAPair;
  };
};

/** Dynamically load meta tags from root loader*/
export const meta: MetaFunction = () => {
  const matches = useMatches();
  let root = matches.find((match) => match.id === "root");
  console.log(JSON.stringify(root?.data.ENV.APP_KEY_PAIR));
  const metaDoc: NodeValues = root?.data?.meta;
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
      label: "Home",
      id: "home",
      link: "/",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
    },
    {
      label: "Authentication",
      link: "/login",
      id: "login",
      icon: "M12.9 14.32a8 8 0 011.41-9.94l-1.42-1.42a6 6 0 00-9.18 9.19l1.42 1.42a8 8 0 01-9.94 1.42zM21.71 11.29A16 16 0 0112.9 20.32l-1.42-1.42a14 14 0 00-19.42-19.42l1.42-1.42a16 16 0 0121.71 11.29z",
    },
    {
      label: "CNXT",
      link: "/cnxt",
      id: "builder",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
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
    {
      label: "Object Builder",
      link: "/builder",
      id: "builder",
      icon: "M19.5 10.5c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM4 4h16v2H4zm14 8v-1.5c0-.83-.67-1.5-1.5-1.5.83 0 1.5-.67 1.5-1.5V7a2 2 0 00-2-2h-1v2h2a2 2 0 002-2zM2 17v2h16v-2a2 2 0 00-2-2h-2v2H4a2 2 0 00-2 2z",
    },
  ],
};
export const MainMenu = ({ links }: { links?: MenuLinks }) => {
  const menuarr = links;
  let { pathname } = useLocation();

  return (
    <nav className="flex-1 px-2 py-4 bg-gray-800">
      {menuarr?.map(({ link, icon, id, label }) => (
        <Link
          to={link}
          key={Math.random().toLocaleString() + id}
          className="mt-1 group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition ease-in-out duration-150"
        >
          <svg
            className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300 group-focus:text-gray-300 transition ease-in-out duration-150"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                icon ??
                "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              }
            />
          </svg>
          {label}
        </Link>
      ))}
    </nav>
  );
};
const ACTION_TYPE = {
  MENU_CLOSE: "MENU_CLOSE",
  MENU_COLLAPSE: "MENU_COLLAPSE",
  USER_MENU: "USER_MENU",
};
function reduce(
  state: any,
  { type }: { type: "MENU_CLOSE" | "MENU_COLLAPSE" | "USER_MENU" }
) {
  switch (type) {
    case ACTION_TYPE.MENU_CLOSE:
      return {
        ...state,
        menu_close: !state.menu_close,
      };
    case ACTION_TYPE.MENU_COLLAPSE:
      return {
        ...state,
        menu_collapse: !state.menu_collapse,
      };
    case ACTION_TYPE.USER_MENU:
      return {
        ...state,
        user_menu: !state.user_menu,
      };
    default:
      return state;
  }
}
export default function App() {
  let { ENV } = useLoaderData();
  let matches = useMatches();
  let root = matches.find((match) => match.pathname === "/"),
    links = root?.handle?.links;
  let cnxt = matches.find((match) => match.pathname === "/cnxt");
  const [ofcanvasOpen, ofcanvasDispatch] = React.useReducer(reduce, {
    menu_close: false,
    menu_collapse: false,
    user_menu: false,
  });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="h-screen flex overflow-hidden bg-cnxt_black">
          <div
            className={`${
              !!ofcanvasOpen.menu_close ? "flex" : "hidden"
            } transition-all duration-200 md:flex md:flex-shrink-0`}
          >
            <div className="flex flex-col max-w-64 min-w-60">
              <div className="flex items-center flex-shrink-0 px-4 py-2 bg-cnxt_navy">
                {" "}
                {cnxt ? <CNXTLogo /> : <FMLogo />}
              </div>
              <div className="h-0 flex-1 flex flex-col overflow-y-auto">
                {" "}
                <MainMenu links={links} />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-0 flex-1 overflow-hidden">
            <div className="relative z-10 flex-shrink-0 flex h-16 bg-primary-70 shadow">
              <button
                onClick={() => ofcanvasDispatch({ type: "MENU_CLOSE" })}
                className="px-4 z-20 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 md:hidden"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </button>
              <div className={`flex-1 px-4 flex justify-between`}>
                <div className="flex-1 flex">
                  <div className="w-full flex md:ml-0">
                    <label htmlFor="search_field" className="sr-only">
                      Search
                    </label>
                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          />
                        </svg>
                      </div>
                      <input
                        id="search_field"
                        className="block w-full h-full pl-8 pr-3 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm"
                        placeholder="Search"
                      />
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex items-center md:ml-6">
                  <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:shadow-outline focus:text-gray-500">
                    <svg
                      className="h-6 w-6"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </button>
                  <div className="ml-3 relative">
                    <div>
                      <button
                        onClick={() => ofcanvasDispatch({ type: "USER_MENU" })}
                        className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:shadow-outline"
                      >
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </button>
                    </div>
                    {!!ofcanvasOpen.user_menu && (
                      <div
                        className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg`}
                      >
                        <div className="py-1 rounded-md bg-white shadow-xs">
                          <Link
                            to="/"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                          >
                            Your Profile
                          </Link>
                          <Link
                            to="/"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                          >
                            Settings
                          </Link>
                          <Link
                            to="/"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                          >
                            Sign out
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <main
              className="flex-1 relative z-0 overflow-y-auto py-6 focus:outline-none"
              tabIndex={0}
            >
              <Outlet />
            </main>
          </div>
        </div>
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
