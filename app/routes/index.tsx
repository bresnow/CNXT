import React, { Suspense } from "react";
import { useNodeFetcher, useRouteData, useSEAFetcher } from "~/gun/hooks";
import Gun, { GunOptions, IGun, IGunChain, IGunInstance, ISEA } from "gun";
import { LoaderFunction, useLoaderData } from "remix";
import { useGunFetcher } from "~/dataloader/lib";
import { useIsMounted, useSafeEffect } from "bresnow_utility-react-hooks";
type LoaderData = {
  username: string;
};

export let loader: LoaderFunction = () => {
  return {
    username: "Remix",
  };
};

function SuspendedData({ getData }: { getData: () => any }) {
  let posts = getData();

  return (
    <pre>
      <code>{JSON.stringify(posts, null, 2)}</code>
    </pre>
  );
}

export default function Profile() {
  let { username } = useLoaderData<LoaderData>();
  let postsLoader = useGunFetcher<any>("routes/api/gun/pages.index");
  useSafeEffect(() => {
    console.log("useEffect");
  }, []);
  return (
    <Suspense fallback="Loading Profile....">
      <SuspendedData getData={postsLoader.load} />
      <postsLoader.Component />
    </Suspense>
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
