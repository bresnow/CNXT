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
import { error, log } from "~/lib/console-utils";
import { LoadCtx } from "types";
import { Card } from "~/components/Card";
import Container from "~/components/Container";
import LoginForm from "~/components/LoginForm";
import Display from "~/components/DisplayHeading";
import { useGunStatic } from "~/lib/gun/hooks";
import FormBuilder from "~/components/FormBuilder";
import { errorCheck } from "~/lib/utils/helpers";

// check if str meets the requirements
function validPropName(str: string) {
  return /^(?![0-9])[a-zA-Z0-9$_]+$/.test(str);
}
const noop = () => {};
type LoadError = { key?: string; value?: string; form?: string };
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { graph } = RemixGunContext(Gun, request);
  try {
    let data = await graph.get("pages.index").val();
    return json(data);
  } catch (error) {
    return json({ error });
  }
};
export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { formData } = RemixGunContext(Gun, request);
  let error: LoadError = {};
  try {
    let { key, value } = await formData();

    if (!validPropName(key)) {
      error.key =
        "Invalid property name : Follow Regex Pattern /^(?![0-9])[a-zA-Z0-9$_]+$/";
    }
    if (typeof value !== "string" || value.length < 1 || value.length > 240) {
      error.value =
        "Property values must be greater than 1 and less than 240 characters";
    }

    if (Object.keys(error).length > 0) {
      return json({ error });
    }
    return json({ [key]: value });
  } catch (err) {
    let error: LoadError = { form: "Form data not found" };
    return json({ error });
  }
};
function WelcomeCard() {
  let { title, textarea, pageTitle, src } = useLoaderData();
  let img = { src, alt: "RemixGun" };
  return (
    <Container
      className={
        "bg-slate-900 grid mx-auto p-10 text-gray-400 w-1/2 border-neutral-900"
      }
    >
      <SectionTitle
        heading={pageTitle}
        description={textarea}
        align={"center"}
        color={"primary"}
        showDescription={true}
      />
      <Card image={img} name={pageTitle} label={title} />
    </Container>
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
  let action = useActionData<
    | {
        error: { key?: string; value?: string };
      }
    | Record<string, string>
  >();
  let err = action && action.error ? true : false;
  const [gun] = useGunStatic(Gun);
  const Playground = FormBuilder();

  useIf([!err], () => {
    gun.get("posts").get("test").put(action);
  });
  let testLoader = useGunFetcher<any>("/api/gun/posts.test");
  return (
    <>
      <WelcomeCard />
      <Container
        className={
          "bg-slate-900 grid mx-auto p-10 text-gray-400 w-1/2 border-neutral-900"
        }
      >
        <Suspense fallback="Loading Data....">
          <SuspendedTest getData={testLoader.load} />
        </Suspense>
      </Container>

      <Container rounded={true} className="bg-slate-500 grid-cols-3">
        <Container rounded={true} className="bg-slate-500 grid-cols-1">
          <Container
            rounded={true}
            className="bg-slate-500 grid-cols-1 mx-auto"
          >
            <Playground.Form method={"post"}>
              <Playground.Input type="text" name="key" label="Key" />
              <Playground.Input type="text" name="value" label="Value" />
              <Playground.Submit label={"Submit"} onSubmit={noop} />
            </Playground.Form>
          </Container>
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
