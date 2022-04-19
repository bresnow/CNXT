import React, { Suspense } from "react";
import { useGunStatic, useNodeFetcher, useSEAFetcher } from "~/gun/hooks";
import Gun from "gun";
import { LoaderFunction, useLoaderData } from "remix";
import { useLoader } from "~/dataloader/lib";
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
  let postsLoader = useLoader<any>("routes/api/gun/pages.index");
  React.useEffect(() => {
    console.log("useEffect");
  }, []);
  return (
    <Suspense fallback="Loading Profile....">
      <SuspendedData getData={postsLoader.load} />
      <postsLoader.Component />
    </Suspense>
  );
}
