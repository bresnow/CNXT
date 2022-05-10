import { Suspense } from "react";
import {
  ActionFunction,
  json,
  Link,
  useActionData,
  useCatch,
  useLoaderData,
} from "remix";
import type { LoaderFunction } from "remix";
import Gun from "gun";
import { useGunFetcher } from "~/dataloader/lib";
import React from "react";
import Display from "~/components/DisplayHeading";
import { LoadCtx } from "types";
import LoginForm from "~/components/LoginForm";
import { errorCheck } from "~/lib/utils/helpers";
import { parseJSON } from "~/lib/parseJSON";

type BlogNoSideBar = {
  sectionTitle: {
    heading: string;
  };
  items: {
    title: string;
    author: string;
    postedAt: { date: string; slug: string };
    slug: string;
    image: { src: string };
  }[];
};

export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { formData, user } = RemixGunContext(Gun, request);
  let { alias, password } = await formData();
  if (typeof alias !== "string") {
    return json({ err: "Invalid alias entry" });
  }
  if (typeof password !== "string") {
    return json({ err: "Invalid password entry" });
  }
  try {
    let result = await user.credentials(alias, password);
    return json(result);
  } catch (error) {
    return json({ err: error });
  }
};
function AuthResponse({ useActionData }: { useActionData: () => any }) {
  let data = useActionData();
  return (
    data && (
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    )
  );
}

export default function Login() {
  return (
    <>
      <LoginForm />
      <AuthResponse useActionData={useActionData} />
    </>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 403:
    case 404:
      return (
        <div className="min-h-screen py-4 flex flex-col justify-center items-center">
          <Display
            title={`${caught.status}`}
            titleColor="white"
            span={`${caught.statusText}`}
            spanColor="pink-500"
            description={`${caught.statusText}`}
          />
        </div>
      );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="min-h-screen py-4 flex flex-col justify-center items-center">
      <Display
        title="Error:"
        titleColor="#cb2326"
        span={error.message}
        spanColor="#fff"
        description={`error`}
      />
    </div>
  );
}
