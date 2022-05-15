import { useIf } from "bresnow_utility-react-hooks";
import { Suspense } from "react";
import { ActionFunction, json, useActionData } from "remix";
import { LoadCtx } from "types";
import FormBuilder from "~/components/FormBuilder";
import { useDeferedLoaderData } from "~/dataloader/lib";
import { useGunStatic } from "~/lib/gun/hooks";
type ErrObj = {
  _key?: string | undefined;
  _value?: string | undefined;
  _form?: string | undefined;
};
type LoadError = {
  error: ErrObj;
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

export default function Index() {
  let action = useActionData<Record<string, string> | LoadError>();
  const [gun] = useGunStatic(Gun);
  const Playground = FormBuilder();
  useIf([action, !action?.error], () => {
    gun.get("posts").get("test").put(action);
  });

  let testLoader = useDeferedLoaderData<any>("/api/gun/posts.test");
  let [keyErr, valErr] = Object.values(action?.error ?? {});
  useIf([testLoader.cachedData],()=>{
    console.log(testLoader.cachedData)
  })
  return (
    <>
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
        <Suspense fallback="Loading Data...."></Suspense>
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
