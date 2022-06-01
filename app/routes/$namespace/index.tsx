import { useIf } from "bresnow_utility-react-hooks";
import React from "react";
import { Suspense } from "react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  useActionData,
  useLoaderData,
} from "remix";
import { LoadCtx } from "types";
import SecureRender from "~/components/Browser";
import FormBuilder from "~/components/FormBuilder";
import { useDeferedLoaderData } from "~/dataloader/lib";
import { useGunStatic } from "~/lib/gun/hooks";
import { Navigation } from "~/root";
import { SectionTitle } from "..";
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  return {
    pageText: "PASSWORD: 'admin'",
    pageTitle: "Services Example",
    namespace: params.namespace,
  };
};
function WelcomeCard() {
  let { namespace, title, pageText, pageTitle, src } = useLoaderData();
  let img = { src, alt: "RemixGun" };
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-2xl font-extrabold leading-20 text-white sm:text-4xl sm:leading-20">
        {"#" + namespace}
      </h2>
      <p className="mt-3 text-base leading-7 sm:mt-4 text-white">
        {"Services Example"}
      </p>
    </div>
  );
}

export default function Index() {
  let [protocol, protocolSet] = React.useState("");
  React.useEffect(() => {
    let { protocol } = window.location;
    protocolSet(protocol);
  });
  return (
    <Navigation>
      <WelcomeCard />
      <SecureRender namespace={`${protocol}//survey.fltngmmth.com`} />
      <SecureRender namespace={`${protocol}//file-browser.fltngmmth.com`} />
      <SecureRender namespace={`${protocol}//n8n.fltngmmth.com`} />
    </Navigation>
  );
}

type TitleProps = {
  heading: string;
  description: string;
  align?: "left" | "right" | "center";
  color?: "white" | "primary";
  showDescription: boolean;
};
