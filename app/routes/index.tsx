import { Suspense } from "react";
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
import { Card } from "~/components/Card";
import Display from "~/components/DisplayHeading";
import { useGunStatic } from "~/lib/gun/hooks";
import FormBuilder from "~/components/FormBuilder";

const noop = () => {};
type ErrObj = {
  _key?: string | undefined;
  _value?: string | undefined;
  _form?: string | undefined;
};
type LoadError = {
  error: ErrObj;
};
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { graph } = RemixGunContext(Gun, request);
  let data;
  try {
    data = await graph.get("pages.index").val();
  } catch (error) {
    data = { error };
  }
  return json(data);
};
export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { formData } = RemixGunContext(Gun, request);
  let error: ErrObj = {};
  try {
    let { prop, value } = await formData();

    if (!/^(?![0-9])[a-zA-Z0-9$_]+$/.test(prop)) {
      error._key =
        "Invalid property name : Follow Regex Pattern /^(?![0-9])[a-zA-Z0-9$_]+$/";
    }
    if (typeof value !== "string" || value.length < 1 || value.length > 240) {
      error._value =
        "Property values must be greater than 1 and less than 240 characters";
    }

    if (Object.values(error).length > 0) {
      return json<LoadError>({ error });
    }
    return json({ [prop]: value });
  } catch (err) {
    error._form = err as string;
    return json<LoadError>({ error });
  }
};

function WelcomeCard() {
  let { title, pageText, pageTitle, src } = useLoaderData();
  let img = { src, alt: "RemixGun" };
  return (
    <div
      className="w-full mx-auto rounded-xl mt-5 p-5  relative"
      style={{
        minHeight: "320px",
        minWidth: "420px",
        maxWidth: "520px",
      }}
    >
      <SectionTitle
        heading={pageTitle}
        description={pageText}
        align={"center"}
        color={"primary"}
        showDescription={true}
      />
      <Card image={img} name={pageTitle} label={title} />
    </div>
  );
}
function SuspendedTest({
  getData,
  error,
}: {
  getData: () => any;
  error?: any;
}) {
  function RenderedData() {
    let data = getData();
    delete data._;

    return (
      <div>
        {error && (
          <div className="col-span-1">
            <h5>ERROR</h5>
            <pre className=" bg-red-500 text-secondary-100  text-sm rounded-md">
              <code>{JSON.stringify(error, null, 2)}</code>
            </pre>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 p-4">
          <div className="col-span-1">
            <h5>Node Metadata</h5>
            <pre className=" bg-orange-300 text-sm wrapped-text text-primary rounded-md"></pre>
          </div>
        </div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }
  return <RenderedData />;
}

export default function Index() {
  let action = useActionData<Record<string, string> | LoadError>();
  const [gun] = useGunStatic(Gun);
  const Playground = FormBuilder();
  useIf([action, !action?.error], () => {
    gun.get("posts").get("test").put(action);
  });

  let testLoader = useDeferedLoaderData<any>("/api/gun/posts.test");
  let [keyErr, valErr] = Object.values(action?.error ?? {});
  return (
    <>
      <WelcomeCard />
      <div
        className="w-full mx-auto rounded-xl gap-4  p-4 relative"
        style={{
          minHeight: "320px",
          minWidth: "420px",
          maxWidth: "520px",
        }}
      >
        <Playground.Form method={"post"}>
          <Playground.Input
            type="text"
            required
            name="prop"
            label={"Key"}
            error={keyErr}
          />
          <Playground.Input
            type="text"
            required
            name="value"
            label={"Value"}
            error={valErr}
          />
          <Playground.Submit label={"Submit"} />
        </Playground.Form>
        <Suspense fallback="Loading Data....">
          <SuspendedTest getData={testLoader.load} error={action?.error} />
        </Suspense>
      </div>
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
