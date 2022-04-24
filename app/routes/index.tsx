import React, { Suspense } from "react";
import { useNodeFetcher, useRouteData, useSEAFetcher } from "~/gun/hooks";
import Gun, { GunOptions, IGun, IGunChain, IGunInstance, ISEA } from "gun";
import { LoaderFunction, useLoaderData } from "remix";
import { useGunFetcher } from "~/dataloader/lib";
import {
  useIsMounted,
  useSafeCallback,
  useSafeEffect,
} from "bresnow_utility-react-hooks";
import { Container, LoginForm, PlayerCard } from "~/root";
import { SecureFrameWrapper } from "~/lib/SR";
import { log } from "~/lib/console-utils";
type LoaderData = {
  username: string;
};

export let loader: LoaderFunction = () => {
  return {
    username: "Remix",
  };
};

function SuspendedData({ getData }: { getData: () => any }) {
  let { title, textarea, pageTitle, src } = getData();
  let img = { src: "/github/rmix-gun.png", alt: "test" };
  return (
    <>
      <SectionTitle
        heading={pageTitle}
        description={textarea}
        align={"center"}
        color={"primary"}
        showDescription={true}
      />
      <PlayerCard image={img} name={pageTitle} label={title} />
    </>
  );
}
function SuspendedTest({ getData }: { getData: () => any }) {
  let data = getData();

  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}
export default function Profile() {
  let { username } = useLoaderData<LoaderData>();
  let postsLoader = useGunFetcher<any>("/api/gun/pages.index");
  const [gun, SEA] = useGunStatic(Gun);
  gun.get("posts").get("test").put({ hello: "world", username });

  let testLoader = useGunFetcher<any>("/api/gun/posts.test");
  useSafeEffect(() => {
    gun
      .get("pages")
      .get("index")
      .on(function (data) {
        console.log(data, "DATA");
      });
  }, []);
  return (
    <>
      {" "}
      <Container
        className={
          "bg-slate-900 grid mx-auto p-10 text-gray-400 w-1/2 border-neutral-900"
        }
      >
        <Suspense fallback="Loading Data...">
          <SuspendedData getData={postsLoader.load} />
          <postsLoader.Component />
        </Suspense>
      </Container>
      <Container rounded={true} className="bg-slate- grid grid-cols-2">
        <Container rounded={true} className="bg-slate- grid grid-cols">
          <Suspense fallback="Loading Data....">
            <SuspendedTest getData={testLoader.load} />
          </Suspense>
        </Container>
        <LoginForm />
      </Container>
    </>
  );
}
export function useGunStatic(
  Gun: IGun,
  opts?: GunOptions
): [instance: IGunInstance, sea: ISEA] {
  const { data } = useRouteData("/"),
    gunOptions = data.gunOpts;
  let [options] = React.useState<GunOptions>(opts ? opts : gunOptions);
  let gunInstance = Gun(options);
  let [instance] = React.useState(gunInstance);
  return [instance, Gun.SEA];
}

export function useNodeSubscribe(
  cb: (data: any) => void,
  [gunRef, ...dependencies]: [gunRef: IGunChain<any>, dependencies?: any],
  opts: { unsubscribe: boolean }
) {
  const subscribe = useSafeCallback(cb);
  const mounted = useIsMounted();
  const unsubscribe = useSafeCallback(() => {
    if (mounted.current) {
      (gunRef as IGunChain<any>).off();
    }
  });

  useSafeEffect(() => {
    (gunRef as IGunChain<any>).on(subscribe);
    if (opts.unsubscribe) {
      return unsubscribe;
    }
  }, [subscribe]);
}

export const SectionTitle = ({
  heading,
  description,
  align,
  color,
  showDescription,
}: TitleProps) => {
  const title = {
    showDescription: showDescription || false,
    align: align ? align : "center",
    color: color ? color : "primary",
  };
  return (
    <div className="section-title">
      <div className="container">
        <div className={`align-${title.align} mx-auto`}>
          <h2 className="font-bold max-w-3xl">{heading}</h2>
          {title.showDescription && (
            <p className="max-w-xl mt-2 leading-7 text-18base">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
type TitleProps = {
  heading: string;
  description: string;
  align?: "left" | "right" | "center";
  color?: "white" | "primary";
  showDescription: boolean;
};
