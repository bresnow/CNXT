import {
  Form,
  json,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useMatches,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "remix";
import type {
  AppData,
  HtmlMetaDescriptor,
  LinkDescriptor,
  MetaDescriptor,
} from "@remix-run/server-runtime";

import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { LoadCtx, Nodevalues, RmxGunCtx } from "types";
import styles from "./tailwind.css";
import { ButtonHTMLAttributes, useId } from "react";
import { log } from "./lib/console-utils";
import Gun, { ISEAPair } from "gun";

import srStyles from "~/lib/SR/sr.css";
import { useSafeEffect } from "bresnow_utility-react-hooks";
import { matches } from "lodash";
import { useRouteData } from "~/lib/gun/hooks";
import { RouteHandle } from "@remix-run/react/routeModules";
import BDSLogo from "./components/svg/BDS";
import React from "react";
import useSticky from "./lib/utils/useSticky";
import {
  getClosest,
  getSiblings,
  slideToggle,
  slideUp,
} from "./lib/utils/mobile-nav-utils";
import Button from "./components/Button";
export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: srStyles },
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
  let meta = await graph.get(`pages.root.meta`).val();
  let peerList = {
    DOMAIN: `http://${ENV.DOMAIN}:${ENV.CLIENT}/gun`,
    PEER: `http://${ENV.PEER_DOMAIN}/gun`,
  };
  let gunOpts = {
    peers: [`${peerList.DOMAIN}`],
    radisk: true,
    localStorage: false,
  };

  return json({
    peers: [peerList.PEER, peerList.DOMAIN],
    meta,
    gunOpts,
    ENV,
    links: [
      {
        label: "Home",
        id: "home",
        link: "/",
      },
      {
        label: "Authentication",
        link: "/login",
        id: "login",
      },
    ],
  });
};
export type RootLoaderData = {
  peers: string[];
  meta: { title: string; description: string };
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
  links: MenuLinks;
};
export const meta: MetaFunction = () => {
  return { title: "Remix Gun", description: "Remix Gun" };
};
export type MenuLinks = {
  id?: string;
  link: string;
  label: string;
  submenu?: MenuLinks;
}[];
export const MainMenu = ({ data }: { data?: MenuLinks }) => {
  const menuarr = data;
  return (
    <ul className="lg:flex lg:items-center lg:w-auto lg:space-x-12">
      {menuarr?.map((menu) => {
        const submenu = menu.submenu;
        return (
          <li
            key={`menu-${menu.id}`}
            className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >
            <Link to={menu.link}>{menu.label}</Link>
            {!!submenu && (
              <ul className="submenu-nav block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                {submenu.map((submenu, i) => {
                  return (
                    <li key={`submenu${i}`}>
                      <Link
                        to={submenu.link}
                        className="menu-sub-item text-sm font-medium text-black block py-1 hover:text-primary"
                      >
                        {submenu.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};
export default function App() {
  let { links } = useLoaderData<RootLoaderData>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-200">
        <Header links={links} />
        <div className="pt-10">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export const Header = ({ links }: { links: MenuLinks }) => {
  // // Sticky Header
  // const { sticky, headerRef, fixedRef } = useSticky();

  // // OfCanvas Menu
  const [ofcanvasOpen, setOfcanvasOpen] = React.useState(false);

  // OfCanvas Menu Open & Remove
  const ofcanvasHandaler = () => {
    setOfcanvasOpen((prev) => !prev);
  };
  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Remix Gun Boilerplate
          </span>
        </Link>
        <button
          onClick={ofcanvasHandaler}
          data-collapse-toggle="mobile-menu"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <svg
            className="hidden w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <div
          className={`${
            !ofcanvasOpen ? "hidden" : ""
          } w-full md:block md:w-auto`}
          id="mobile-menu"
        >
          <MainMenu data={links} />
        </div>
      </div>
    </nav>
  );
};
