import { Suspense } from "react";
import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import Gun from "gun";
import { useLoader } from "~/dataloader/lib";
import React from "react";

type LoaderData = {
  username: string;
};

export let loader: LoaderFunction = () => {
  return {
    username: "Remix",
  };
};

function SuspendedProfileInfo({ getData }: { getData: () => any }) {
  let data = getData();

  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

export default function Profile() {
  let { username } = useLoaderData<LoaderData>();
  let postsLoader = useLoader<any>("/routes/api/gun/pages/index");

  return (
    <>
      <h1>Profile: {username}</h1>
      <Suspense fallback="Loading Profile....">
        <SuspendedProfileInfo getData={postsLoader.load} />
        <postsLoader.Component />
      </Suspense>
    </>
  );
}
