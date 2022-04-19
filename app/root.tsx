import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { LoadCtx, RmxGunCtx } from "types";
import styles from "./tailwind.css";
import { useId } from "react";
import { log } from "./lib/console-utils";
import Gun, { ISEAPair } from "gun";
import { useSafeEffect } from "bresnow_utility-react-hooks";
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
  let { ENV } = RemixGunContext(Gun);
  return {
    ENV,
    links: [
      {
        label: "Home",
        link: "/",
      },
      {
        label: "About",
        link: "/about",
      },
      {
        label: "Profile",
        link: "/profile",
      },
    ],
  };
};
type RootLoaderData = {
  ENV: {
    DOMAIN: string | undefined;
    PEER_DOMAIN: string | undefined;
    CLIENT: string | undefined;
    APP_KEY_PAIR: ISEAPair;
  };
  links: {
    label: string;
    link: string;
  }[];
};
export const meta: MetaFunction = () => {
  return { title: "Remix_Gun" };
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
      <body>
        <ul>
          {links.map(({ link, label }) => (
            <li key={label + useId()}>
              <Link to={link}>{label}</Link>
            </li>
          ))}
        </ul>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
