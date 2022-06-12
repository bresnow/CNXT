import { json, LoaderFunction, useLoaderData } from "remix";
import Gun from "gun";
import { html } from "remix-utils";
import React from "react";
import jsesc from "jsesc";
import { useIf } from "bresnow_utility-react-hooks";
import SecureRender from "~/components/Browser";
import { LoadCtx } from "types";
import { useGunStatic } from "~/lib/gun/hooks";

export const loader: LoaderFunction = async ({ request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { ENV } = RemixGunContext(Gun, request);
  return json({ body: null });
};

export default function Test() {
  let data = useLoaderData();
  let iframeRef = React.useRef<HTMLIFrameElement>(null);
  let [gun] = useGunStatic(Gun);

  let _data: any;
  (_data.demo.markup.html = ` <!DOCTYPE html>
<html>
<head>
<style>
body {background-color: powderblue;}
h1   {color: blue;}
p    {color: red;}
</style>
</head>
<body>

<h1>This is a heading... If im not mistaken</h1>
<p>This is a paragraph... I could be wrong tho</p>

</body>
</html>`),
    // This hook is peered to the http gun server and a few other peers.
    // We are gonna put the demo prop on the node "test" making the node path "test/demo/markup/html/"
    React.useEffect(() => {
      gun.get("test").put(_data);
    }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-600">
      <SecureRender namespace={"/api/gun/m?path=test"} refrence={iframeRef} />
      {/* srcdoc={JSON.stringify(decrypted)} */}
    </div>
  );
}
// let [decrypted, decryptedSet] = React.useState<string | undefined>();
// React.useEffect(() => {
//   let env = (window as any).ENV;
//   //@ts-ignore
//   Gun.SEA.decrypt(data.body, env.APP_KEY_PAIR, (data) => {
//     if (data) {
//       setTimeout(() => {
//         decryptedSet(data);
//       }, 1500);
//     }
//   });
// });
