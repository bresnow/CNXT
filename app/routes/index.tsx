import React, { Suspense } from "react";
import { useNodeFetcher, useRouteData, useSEAFetcher } from "~/lib/gun/hooks";
import Gun, {
  GunOptions,
  IGun,
  IGunChain,
  IGunInstance,
  ISEA,
  ISEAPair,
} from "gun";
import {
  ActionFunction,
  json,
  LoaderFunction,
  useLoaderData,
  useActionData,
  useCatch,
} from "remix";
import { useGunFetcher } from "~/dataloader/lib";
import {
  useIf,
  useIsMounted,
  useSafeCallback,
  useSafeEffect,
} from "bresnow_utility-react-hooks";
import { SecureFrameWrapper } from "~/lib/SR";
import { log } from "~/lib/console-utils";
import { LoadCtx } from "types";
import { Card } from "~/components/Card";
import Container from "~/components/Container";
import LoginForm from "~/components/LoginForm";
import Display from "~/components/DisplayHeading";
import { useGunStatic } from "~/lib/gun/hooks";
type LoaderData = {
  username: string;
};

export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { graph } = RemixGunContext(Gun, { request, params });
  return null;
};

export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { graph, formData } = RemixGunContext(Gun, { request, params });
  return null;
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
      <Card image={img} name={pageTitle} label={title} />
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
  let ack = useActionData<{
    ok: boolean;
    message: string | ISEAPair;
  }>();

  useIf([ack], () => {
    log(ack, "ACK");
  });
  let postsLoader = useGunFetcher<any>("/api/gun/pages.index");
  const [gun] = useGunStatic(Gun);

  gun
    .get("posts")
    .get("test")
    .put({ hello: "world", username, hello_again: "worldFAMAMMA" });

  let testLoader = useGunFetcher<any>("/api/gun/posts.test");
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
      </Container>
    </>
  );
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
