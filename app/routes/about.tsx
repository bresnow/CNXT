import { useCatch, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { SecureFrameWrapper } from "~/lib/SR";
import Display from "~/components/DisplayHeading";

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
