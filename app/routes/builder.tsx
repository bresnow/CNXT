import { json, LoaderFunction, useLoaderData } from "remix";
import Gun from "gun";
import { html } from "remix-utils";
import React from "react";
import jsesc from "jsesc";
import { LoadCtx } from "@/types";
import { useIf } from "bresnow_utility-react-hooks";
import { Navigation } from "~/root";
import SecureRender from "~/components/Browser";

export const loader: LoaderFunction = async ({ request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { ENV } = RemixGunContext(Gun, request);
  return json({ body: null });
};

export default function Test() {
  let data = useLoaderData();
  let [decrypted, decryptedSet] = React.useState<string | undefined>();
  React.useEffect(() => {
    let env = (window as any).ENV;
    //@ts-ignore
    Gun.SEA.decrypt(data.body, env.APP_KEY_PAIR, (data) => {
      if (data) {
        setTimeout(() => {
          decryptedSet(data);
        }, 1500);
      }
    });
  });

  return (
    <div className="h-screen flex overflow-hidden bg-gray-600">
      <SecureRender namespace="/demo" />
      {/* srcdoc={JSON.stringify(decrypted)} */}
    </div>
  );
}
