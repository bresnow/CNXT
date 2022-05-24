import { useIf } from "bresnow_utility-react-hooks";
import { Suspense } from "react";
import { ActionFunction, json, useActionData } from "remix";
import { LoadCtx } from "types";
import FormBuilder from "~/components/FormBuilder";
import { useDeferedLoaderData } from "~/dataloader/lib";
import { useGunStatic } from "~/lib/gun/hooks";

export default function Index() {
  return (
    <>
      <div
        className="w-full mx-auto rounded-xl gap-4 bg-slate-50 p-4 relative"
        style={{
          minHeight: "320px",
          minWidth: "420px",
          maxWidth: "520px",
        }}
      >
        {/* <Playground.Form method={"post"}>
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
        </Playground.Form> */}
      </div>
    </>
  );
}

type TitleProps = {
  heading: string;
  description: string;
  align?: "left" | "right" | "center";
  color?: "white" | "primary";
  showDescription: boolean;
};
