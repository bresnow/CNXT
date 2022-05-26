import { DetailedHTMLProps, ScriptHTMLAttributes, Suspense } from "react";
import Gun from "gun";
import {
  ActionFunction,
  json,
  LoaderFunction,
  useLoaderData,
  useActionData,
  useCatch,
} from "remix";
import { useDeferedLoaderData } from "~/dataloader/lib";
import { useIf } from "bresnow_utility-react-hooks";
import { LoadCtx } from "types";
import Display from "~/components/DisplayHeading";
import { useGunStatic } from "~/lib/gun/hooks";
import FormBuilder from "~/components/FormBuilder";
import invariant from "@remix-run/react/invariant";
import React from "react";

type ErrObj = {
  path?: string;
  key?: string;
  value?: string;
  form?: string;
};
type LoadError = {
  error: ErrObj;
};
export let loader: LoaderFunction = async ({ request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun } = RemixGunContext(Gun, request);
  let data;
  try {
    data = await gun.path("pages.builder").then();
  } catch (error) {
    data = { error };
  }
  return json(data);
};
export let action: ActionFunction = async ({ request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { formData } = RemixGunContext(Gun, request);
  let error: ErrObj = {};
  try {
    let { prop, value, path } = await formData();
    console.log(path, prop, value, "prop, value");

    if (!/^(?![0-9])[a-zA-Z0-9$_]+$/.test(prop)) {
      error.key =
        "Invalid property name : Follow Regex Pattern /^(?![0-9])[a-zA-Z0-9$_]+$/";
    }
    if (typeof value !== "string" || value.length < 1 || value.length > 240) {
      error.value =
        "Property values must be greater than 1 and less than 240 characters";
    }

    if (Object.values(error).length > 0) {
      return json<LoadError>({ error });
    }
    return json({ path, data: { [prop]: value } });
  } catch (err) {
    error.form = err as string;
    return json<LoadError>({ error });
  }
};

function SuspendedTest({ getData }: { getData(): Record<string, any> }) {
  function RenderedData() {
    let data = getData();
    if (data.error) {
      return <></>;
    }
    let path = data._["#"];
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="col-span-1">
          <h5>
            Fetched data at document path <pre>{path}</pre>
          </h5>
          {data &&
            Object.entries(data).map((val) => {
              let [key, value] = val;
              if (key === "_") {
                return;
              }
              return (
                <div className="flex flex-row items-center space-y-5 justify-center space-x-5">
                  <div className="w-1/3 p-5 rounded-md ">{key}</div>
                  <div className="w-1/2 bg-gray-300 p-5 rounded-md flex-wrap">
                    {`${value}`}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
  return <RenderedData />;
}
type LoadAction = {
  path: string;
  data: Record<string, string>;
};
export default function BuilderRoute() {
  let action = useActionData<LoadAction | LoadError>(),
    error = action && (action as LoadError).error,
    ackData = action && (action as LoadAction).data,
    path = action && (action as LoadAction).path;
  const [gun] = useGunStatic(Gun);
  const ObjectBuilder = FormBuilder();
  useIf([ackData, !error], () => {
    invariant(ackData, "ackData is undefined");
    invariant(path, "path is undefined");
    gun.path(path).put(ackData);
  });
  let testLoader = useDeferedLoaderData<any>(`/api/gun/pages.builder`);
  let { text, page_title } = useLoaderData();

  return (
    <>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 p-4">
            <div className="col-span-1">
              <h5>Cached Data From Radisk/ IndexedDB</h5>
              {testLoader.cachedData &&
                Object.entries(testLoader.cachedData).map((val) => {
                  let [key, value] = val;
                  if (key === "_") {
                    return;
                  }
                  return (
                    <div className="flex animate-pulse flex-row items-center space-y-5 justify-center space-x-5">
                      <div className="w-1/3 p-5 rounded-md ">{key}</div>
                      <div className="w-1/2 bg-gray-300 p-5 rounded-md flex-wrap">
                        {`${value}`}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        }
      >
        <SuspendedTest getData={testLoader.load} />
      </Suspense>

      <ObjectBuilder.Form
        className="grid grid-cols-1 gap-4 p-4"
        method={"post"}
      >
        <div className="flex flex-row items-center space-y-5 justify-center space-x-5">
          <ObjectBuilder.Input
            type="text"
            required
            name="prop"
            label={"Key"}
            className={"w-full bg-gray-300 py-2 px-8 rounded-md flex"}
            error={error?.key}
          />
          <ObjectBuilder.Input
            type="text"
            required
            name="value"
            label={"Value"}
            textArea={true}
            className={"w-full bg-gray-300 py-5 px-8 rounded-md flex"}
            error={error?.value}
          />
        </div>
        <ObjectBuilder.Submit label={"Submit"} />
      </ObjectBuilder.Form>

      {/* <script
        key={"USE_FX"}
        dangerouslySetInnerHTML={{
          __html: `
            ${jsesc(
              (function () {
                var gun = new Gun("http://localhost:3335/gun");
                gun.on("hi", function (peer) {
                  // console.log("hi", peer);
                });
                gun.on("bye", function (peer) {
                  // console.log("bye", peer);
                });
                gun.on("put", function (data) {
                  // console.log("put", data);
                });
                gun.on("get", function (data) {
                  // console.log("get", data);
                });
                gun.on("auth", function (data) {
                  console.log("auth", data);
                });
              })()
            )}
            `,
        }}
      /> */}
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
