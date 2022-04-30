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
import { useRouteData } from "./gun/hooks";
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
  let { ENV, graph } = RemixGunContext(Gun);
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
        label: "About",
        link: "/about",
        id: "about",
      },
      {
        label: "Profile",
        link: "/profile",
        id: "profile",
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
    <ul className="hidden lg:flex lg:items-center lg:w-auto lg:space-x-12">
      {menuarr?.map((menu) => {
        const submenu = menu.submenu;
        return (
          <li
            key={`menu-${menu.id}`}
            className={`${
              !!submenu ? "has-submenu" : ""
            } group relative pt-4 pb-4 cursor-pointer text-white font-bold z-10 before:bg-nav-shape before:empty-content before:absolute before:w-23.5 before:h-11 before:z-n1 before:top-1/2 before:left-1/2 before:transform before:-translate-x-2/4 before:-translate-y-2/4 before:transition-all before:opacity-0 hover:before:opacity-100`}
          >
            <Link to={menu.link} className="font-semibold uppercase">
              {menu.label}
            </Link>
            {!!submenu && (
              <ul className="submenu-nav absolute left-0 z-50 bg-white rounded-lg mt-14 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-4 transition-all duration-500 min-w-200 p-4 border border-gray-100 w-64">
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
        <div className="pt-60">
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
  // Sticky Header
  const { sticky, headerRef, fixedRef } = useSticky();

  // OfCanvas Menu
  const [ofcanvasOpen, setOfcanvasOpen] = React.useState(false);

  // OfCanvas Menu Open & Remove
  const ofcanvasHandaler = () => {
    setOfcanvasOpen((prev) => !prev);
  };
  return (
    <header
      ref={headerRef}
      className="bg-transparent absolute w-full mx-auto z-40"
    >
      <div
        ref={fixedRef}
        className={`header-top ${
          sticky ? "fixed top-0 bg-secondary-100 opacity-90 w-full" : ""
        }`}
      >
        <div className="container px-4">
          <nav className="bg-transparent flex justify-between items-center py-3">
            <div className="text-3xl font-semibold leading-none">
              {"REMIX GUN"}
            </div>
            {/* <BDSLogo /> */}
            <MainMenu data={links} />
            <div className="header-right-action flex items-center">
              <Button
                path="/login"
                shape="square"
                size="md"
                type="button"
                className="text-white hidden xs:block"
              >
                <p>SIGN UP</p>
                <img
                  className="align-middle ml-3"
                  src="../../data/images/icons/arrrow-icon2.webp"
                  alt=""
                />
              </Button>
              <button
                onClick={ofcanvasHandaler}
                onKeyDown={ofcanvasHandaler}
                className="flex flex-col space-y-1.5 ml-8 lg:hidden"
              >
                <span className="line h-0.5 w-6 inline-block bg-white"></span>
                <span className="line h-0.5 w-6 inline-block bg-white"></span>
                <span className="line h-0.5 w-6 inline-block bg-white"></span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export const Search = ({
  method,
  action,
}: {
  method: "get" | "post";
  action: string;
}) => {
  return (
    <Form method={method} action={action} className="relative">
      <input
        className="px-5 h-14 border-secondary-90 bg-secondary-100 border-2 border-solid rounded-md w-full focus:outline-none"
        placeholder="Search here"
        type="text"
      />
      <button
        type="submit"
        className="absolute px-5 top-0 right-0 bg-primary hover:bg-primary-90 transition-all rounded-md inline-block h-full"
      >
        <i className="icofont-search-1"></i>
      </button>
    </Form>
  );
};
