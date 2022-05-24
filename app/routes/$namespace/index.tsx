import { useIf } from "bresnow_utility-react-hooks";
import { Suspense } from "react";
import { ActionFunction, json, useActionData } from "remix";
import { LoadCtx } from "types";
import BrowserWindow from "~/components/Browser";
import FormBuilder from "~/components/FormBuilder";
import { useDeferedLoaderData } from "~/dataloader/lib";
import { useGunStatic } from "~/lib/gun/hooks";

export default function Index() {
  return (
    <>
      <BrowserWindow namespace="https://survey.fltngmmth.com" />
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
