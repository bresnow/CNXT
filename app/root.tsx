import {
  Form,
  json,
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
import { LoadCtx, Nodevalues, RmxGunCtx } from "types";
import styles from "./tailwind.css";
import { ButtonHTMLAttributes, useId } from "react";
import { log } from "./lib/console-utils";
import Gun, { ISEAPair } from "gun";
import cn from "classnames";
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
  let { ENV, graph } = RemixGunContext(Gun);
  let meta = await graph.get(`pages/root/meta`).val();
  let peerList = {
    DOMAIN: `http://${ENV.DOMAIN}:${ENV.CLIENT}/gun`,
    PEER: `http://${ENV.PEER_DOMAIN}/gun`,
  };
  let gunOpts = {
    peers: [`${peerList.DOMAIN}`],
    radisk: true,
    localStorage: false,
  };

  return json<RootLoaderData>({
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
type RootLoaderData = {
  peers: string[];
  meta: Nodevalues | undefined;
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
      <body className="bg-red-500">
        <ul>
          {links.map(({ link, label }) => (
            <li key={label + useId()}>
              <Link to={link}>{label}</Link>
            </li>
          ))}
        </ul>
        <Container
          className={
            "bg-primary text-secondary-100 h-10 w-full border-neutral-900"
          }
        >
          <Outlet />
        </Container>
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
    slug: string;
    label: string;
    socials: { link: string; icon: string; id: string }[];
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
        {/* IMAGE */}
        <span className="w-full h-full absolute left-0 top-0 bg-gray-900 rounded-5xl opacity-0 group-hover:opacity-70"></span>

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

const LoginForm = () => {
  return (
    <Form className="form-login mt-10" method="post" action="#">
      <div className="single-fild">
        <input
          className="px-6 h-14 mb-6 border-secondary-90 bg-secondary-100 hover:border-primary transition-all border-2 border-solid block rounded-md w-full focus:outline-none"
          type="email"
          placeholder="E-mail"
        />
      </div>
      <div className="single-fild">
        <input
          className="px-6 h-14 mb-6 border-secondary-90 bg-secondary-100 hover:border-primary transition-all border-2 border-solid block rounded-md w-full focus:outline-none"
          type="password"
          placeholder="password"
        />
      </div>
      <div className="button text-center">
        <Button type={"button"} className="text-white">
          Login
        </Button>
      </div>
      <div className="account-text mt-5 text-center">
        <p>
          Do not have any account,{" "}
          <Link to="/register" className="text-yellow-400 font-semibold">
            Signup here
          </Link>
        </p>
      </div>
    </Form>
  );
};

interface ButtonType<ButtonProps = ButtonHTMLAttributes<any>> {
  (
    props: ButtonProps,
    {
      children,
      path,
      className,
      size,
      shape,
      color,
      image,
    }: {
      children:
        | string
        | JSX.Element[]
        | HTMLElement[]
        | JSX.Element
        | HTMLElement;
      path?: string;
      className?: string;
      size?: "md" | "lg" | "xl";
      shape?: "rounded" | "square" | "square20xl" | "square2xl" | "square22xl";
      color?: "primary" | "secondary";
      image?: { large?: string; small?: string };
    }
  ): JSX.Element;
}

export const Button: ButtonType<ButtonHTMLAttributes<any>> = (
  props,
  { children, path, className, size, shape, color, image }
) => {
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
    <button {...props} className={buttonClasses}>
      {children}
    </button>
  );
};
