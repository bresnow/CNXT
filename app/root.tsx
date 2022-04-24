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
import cn from "classnames";
import srStyles from "~/lib/SR/sr.css";
import { useSafeEffect } from "bresnow_utility-react-hooks";
import { matches } from "lodash";
import { useRouteData } from "./gun/hooks";
import { RouteHandle } from "@remix-run/react/routeModules";
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
  links: {
    label: string;
    link: string;
  }[];
};
export const meta: MetaFunction = () => {
  return { title: "Remix Gun", description: "Remix Gun" };
};
export type MenuLinks = {
  id?: string;
  link: string;
  label: string;
  submenu?: { link: string; label: string }[];
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
      <body className="bg-slate-300">
        <MainMenu data={links} />
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

export function Container({
  children,
  className,
  rounded,
}: {
  children: React.ReactNode;
  className?: string;
  rounded?: boolean;
}) {
  // main function
  return (
    <div
      className={`lg:col-span-4  ${
        rounded ?? "rounded-lg"
      } aspect-w-2 aspect-h-3 ${className}`}
    >
      <div className="">{children}</div>
    </div>
  );
}
type PlayerCardType = {
  ({
    image,
    name,
    slug,
    label,
    socials,
  }: {
    image: { src: string; alt: string };
    name: string;
    slug?: string;
    label: string;
    socials?: { link: string; icon: string; id: string }[];
  }): JSX.Element;
};

export const PlayerCard: PlayerCardType = ({
  image,
  name,
  slug,
  label,
  socials,
}) => {
  return (
    <div className="player-card relative group">
      <div className="player-thum relative z-20">
        <img
          className="align-middle ml-3 rounded-5xl transition-all group-hover:ml-5"
          src={image.src}
          alt={image.alt}
        />
        <span className="w-full h-full absolute left-0 top-0 bg-gray-900 rounded-5xl opacity-0 group-hover:opacity-70">
          {label}
        </span>

        <div className="social-link absolute left-0 text-center bottom-0 group-hover:bottom-8 w-full space-x-2 opacity-0 group-hover:opacity-100 transition-all z-20">
          {socials &&
            socials?.map(({ link, icon, id }) => (
              <li key={id} className="text-center inline-block">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-10 flex items-center justify-center bg-social-shape hover:bg-social-hover-shape transition-all bg-cover"
                >
                  <i className={icon}></i>
                </a>
              </li>
            ))}
        </div>
      </div>
      <div className="our-team-info py-5 xl:py-7 text-center transition-all mt-8 w-full z-10">
        <h3 className="uppercase font-bold mb-3">
          <Link to={`/players/${slug}`}>{name}</Link>
        </h3>
        <h5 className="text-white">{label}</h5>
      </div>
    </div>
  );
};

export const checkIf = {
  isObject: function (value: unknown) {
    return !!(value && typeof value === "object" && !Array.isArray(value));
  },
  isNumber: function (value: unknown) {
    return !isNaN(Number(value));
  },
  isBoolean: function (value: unknown) {
    if (
      value === "true" ||
      value === "false" ||
      value === true ||
      value === false
    ) {
      return true;
    }
  },
  isString: function (value: unknown) {
    return typeof value === "string";
  },
  isArray: function (value: unknown) {
    return Array.isArray(value);
  },

  isFn: function (value: unknown) {
    return typeof value === "function";
  },
};

export const LoginForm = () => {
  return (
    <Form className="form-login mt-10" method="post">
      <div className="single-fild">
        <input
          className="px-6 h-10 mb-6 border-secondary-90 bg-secondary-100 hover:border-primary transition-all border-2 border-solid block rounded-md w-full focus:outline-none"
          type="text"
          placeholder="Alias"
          name="alias"
        />
      </div>
      <div className="single-fild">
        <input
          className="px-6 h-10 mb-6 border-secondary-90 bg-secondary-100 hover:border-primary transition-all border-2 border-solid block rounded-md w-full focus:outline-none"
          type="password"
          name="password"
          placeholder="password"
        />
      </div>
      <div className="button text-center">
        <Button
          type={"button"}
          color={"primary"}
          shape={"square"}
          className="text-white"
        >
          Login
        </Button>
      </div>
      <div className="account-text mt-5 text-center">
        <p>
          Don‘t have account?
          <Link to="/register" className="text-yellow-400 font-semibold">
            Signup here
          </Link>
        </p>
      </div>
    </Form>
  );
};

export const SectionTitle = ({
  heading,
  description,
  align,
  color,
  showDescription,
}: SectionTitleType) => {
  const title = {
    showDescription: showDescription || false,
    align: align || "center",
    color: color || "primary",
  };
  return (
    <div className="section-title">
      <div className="container">
        <div className={`mx-auto align-${title.align}`}>
          <h2 className="font-bold max-w-3xl">{heading}</h2>
          {title.showDescription && (
            <p className="max-w-xl mt-2 leading-7 text-18base">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
export type SectionTitleType = {
  heading: string;
  description: string;
  align: "left" | "right" | "center";
  color: "white" | "primary";
  showDescription: boolean;
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

interface ButtonType<ButtonProps = ButtonHTMLAttributes<any>> {
  children: string | JSX.Element[] | HTMLElement[] | JSX.Element | HTMLElement;
  path?: string;
  type: "button" | "submit" | "reset";
  className?: string;
  size?: "md" | "lg" | "xl";
  shape?: "rounded" | "square" | "square20xl" | "square2xl" | "square22xl";
  color?: "primary" | "secondary";
  image?: { large?: string; small?: string };
}

export const Button = ({
  children,
  path,
  className,
  size,
  shape,
  color,
  image,
  type,
}: ButtonType) => {
  const btnstyle = {
    size: size || "md",
    shape: shape || "square22xl",
    color: color || "primary",
  };
  const sizeStyle = {
    md: `leading-11 h-12 w-32 sm:h-15 sm:w-40 sm:leading-12`,
    lg: `text-22base h-73 w-230 leading-73`,
    xl: `h-15 w-50 text-xl leading-3`,
  };
  const shapeStyle = {
    rounded: `rounded`,
    square: `rounded-4xl`,
    square20xl: `rounded-20`,
    square2xl: `rounded-2xl`,
    square22xl: `rounded-22`,
  };
  const colorStyle = {
    primary: `bg-primary`,
    secondary: `bg-secondary`,
  };

  const buttonClasses = cn(
    className,
    "font-exo",
    "inline-block",
    "text-center",
    "font-bold",
    "group",
    "hover:opacity-80",
    sizeStyle[btnstyle.size],
    shapeStyle[btnstyle.shape ?? "square22xl"],
    colorStyle[btnstyle.color ?? "primary"]
  );

  const btnImageSm = {
    backgroundImage: `url(${image?.small})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
  const btnImageLg = {
    backgroundImage: `url(${image?.large})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  if (path) {
    const internal = /^\/(?!\/)/.test(path);
    const isHash = path.startsWith("#");

    if (internal) {
      return (
        <Link
          to={path}
          style={size ? btnImageLg : btnImageSm}
          className={buttonClasses}
        >
          {children}
        </Link>
      );
    }
    if (isHash) {
      return (
        <a href={path}>
          <button
            type={type}
            style={size ? btnImageLg : btnImageSm}
            className={buttonClasses}
          >
            {children}
          </button>
        </a>
      );
    }
    return (
      <a
        href={path}
        target="_blank"
        style={size ? btnImageLg : btnImageSm}
        className={buttonClasses}
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={buttonClasses}>
      {children}
    </button>
  );
};
