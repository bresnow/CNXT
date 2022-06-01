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
import InputText, { InputTextProps } from "./components/InputText";

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
      label: "HOME",
      id: "home",
      link: "/",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
    },
    {
      label: "DEMO",
      link: "/demo",
      id: "build",
      icon: "M12.9 14.32a8 8 0 011.41-9.94l-1.42-1.42a6 6 0 00-9.18 9.19l1.42 1.42a8 8 0 01-9.94 1.42zM21.71 11.29A16 16 0 0112.9 20.32l-1.42-1.42a14 14 0 00-19.42-19.42l1.42-1.42a16 16 0 0121.71 11.29z",
    },
    {
      label: "SERVICES",
      link: "/Services",
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
    // {
    //   label: "Object Builder",
    //   link: "/builder",
    //   id: "builder",
    //   icon: "M19.5 10.5c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM4 4h16v2H4zm14 8v-1.5c0-.83-.67-1.5-1.5-1.5.83 0 1.5-.67 1.5-1.5V7a2 2 0 00-2-2h-1v2h2a2 2 0 002-2zM2 17v2h16v-2a2 2 0 00-2-2h-2v2H4a2 2 0 00-2 2z",
    // },
  ],
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
export function Navigation({
  children,
  search,
  logo,
  links,
}: {
  children: React.PropsWithChildren<any>;
  logo?: JSX.Element;
  search?: InputTextProps;
  links?: MenuLinks;
}) {
  let matches = useMatches();
  let root = matches.find((match) => match.pathname === "/");
  const menuarr: MenuLinks = links || root?.handle?.links;
  let { pathname } = useLocation();
  const isActive = (link: string) => pathname === link;
  const [ofcanvasOpen, ofcanvasDispatch] = React.useReducer(reduce, {
    menu_close: false,
    menu_collapse: false,
    user_menu: false,
  });
  search = {
    type: "text",
    required: true,
    name: "path",
    shadow: true,

    ...search,
  } || { ...search };
  return (
    <div className="h-screen flex overflow-hidden ">
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative flex items-center px-6 overflow-hidden bg-cnxt_black border-0  h-28 rounded-b-2xl">
          <nav className="flex items-center justify-center gap-8">
            {logo}
            {menuarr?.map(({ link, icon, id, label }, index) => (
              <Link
                key={id}
                onMouseOver={(e) => {
                  let indicator = document.querySelector(
                    "#indicator"
                  ) as HTMLElement;
                  indicator.style.transform = `translateX(calc(${
                    96 * index
                  }px))`;
                }}
                to={link}
                className="grid w-16 h-16 grid-cols-1 grid-rows-1"
              >
                <div
                  className={`col-[1/1] row-[1/1] flex items-center justify-center w-16 h-16`}
                >
                  <label className="text-primary-70 text-sm hover:text-cnxt_blue">
                    {label}
                    <svg
                      className="mr-3 h-6 w-6 my-2  text-gray-400 group-hover:text-gray-300 group-focus:text-primary-80 transition ease-in-out duration-150"
                      stroke={isActive(link) ? "#053c9c" : "currentColor"}
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
                  </label>
                </div>
                <div
                  className={`col-[1/1] row-[1/1] flex items-center justify-center w-16 h-16 transition-opacity duration-300 ${
                    isActive(link)
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                ></div>
              </Link>
            ))}
          </nav>

          <div
            id="indicator"
            className={`absolute left-40 w-6 h-8 transition-all duration-300 bg-cnxt_blue rounded-full -bottom-4 `}
          >
            <div
              style={{ boxShadow: "0 10px 0 #053c9c" }}
              className="absolute w-5 h-5 bg-cnxt_black-left-4 bottom-1/2 rounded-br-3xl"
            ></div>
            <div
              style={{ boxShadow: "0 10px 0 #053c9c" }}
              className="absolute w-5 h-5 bg-cnxt_black-right-4 bottom-1/2 rounded-bl-3xl"
            ></div>
          </div>
          {search && (
            <div className="w-1/2 ml-8 hidden md:flex group-hover transition-all duration-350 bg-primary-80 hover:bg-primary-70 rounded-md flex-wrap  focus:shadow-md ring-1 ring-sky-500">
              <InputText {...search} />
            </div>
          )}
        </div>

        <main
          className="flex-1 relative z-0 overflow-y-auto py-6 focus:outline-none"
          tabIndex={0}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
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
