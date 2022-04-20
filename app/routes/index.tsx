import React, { Suspense } from "react";
import { useNodeFetcher, useRouteData, useSEAFetcher } from "~/gun/hooks";
import Gun, { GunOptions, IGun, IGunChain, IGunInstance, ISEA } from "gun";
import { LoaderFunction, useLoaderData } from "remix";
import { useGunFetcher } from "~/dataloader/lib";
import { useIsMounted, useSafeEffect } from "bresnow_utility-react-hooks";
import { Container, LoginForm, PlayerCard } from "~/root";
type LoaderData = {
  username: string;
};

export let loader: LoaderFunction = () => {
  return {
    username: "Remix",
  };
};

function SuspendedData({ getData }: { getData: () => any }) {
  let { title, description, pageTitle, src } = getData();
  let img = { src: "/github/rmix-gun.png", alt: "test" };
  return (
    <>
      <p>{description}</p>
      <PlayerCard image={img} name={pageTitle} label={title} />
    </>
  );
}

export default function Profile() {
  let { username } = useLoaderData<LoaderData>();
  let postsLoader = useGunFetcher<any>("/api/gun/pages.index");
  useSafeEffect(() => {
    console.log("useEffect");
  }, []);
  return (
    <>
      {" "}
      <Container
        className={
          "bg-gray-400 flex mx-auto p-10 text-gray-900 w-1/2 border-neutral-900"
        }
      >
        <Suspense fallback="Loading Profile....">
          <SuspendedData getData={postsLoader.load} />
          <postsLoader.Component />
        </Suspense>
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
  const subscribe = React.useCallback(cb, [dependencies]);
  const mounted = useIsMounted();
  const unsubscribe = React.useCallback(() => {
    if (mounted.current) {
      (gunRef as IGunChain<any>).off();
    }
  }, [gunRef, mounted]);

  useSafeEffect(() => {
    (gunRef as IGunChain<any>).on(subscribe);
    if (opts.unsubscribe) {
      return unsubscribe;
    }
  }, [subscribe]);
}
