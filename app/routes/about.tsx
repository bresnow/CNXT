import { Suspense } from "react";
import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import Gun from "gun";
import { useGunFetcher } from "~/dataloader/lib";
import React from "react";
import { SecureFrameWrapper } from "~/lib/SR";

type LoaderData = {
  username: string;
};

export let loader: LoaderFunction = () => {
  return {
    username: "Remix",
  };
};

export default function Profile() {
  let { username } = useLoaderData<LoaderData>();
  // let postsLoader = useGunFetcher<any>("/api/gun/pages.index.meta");

  return (
    <>
      <pre>
        <code>{JSON.stringify(username, null, 2)}</code>
      </pre>
      <SecureFrameWrapper
        enableResizing={false}
        maxHeight={400}
        maxWidth={500}
        minHeight={500}
        minWidth={500}
      />
    </>
  );
}
