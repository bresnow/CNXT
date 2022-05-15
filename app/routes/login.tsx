import { ActionFunction, json, useActionData, useCatch } from "remix";
import Gun from "gun";
import Display from "~/components/DisplayHeading";
import { LoadCtx } from "types";
import FormBuilder from "~/components/FormBuilder";
import React from "react";

type BlogNoSideBar = {
  sectionTitle: {
    heading: string;
  };
  items: {
    title: string;
    author: string;
    postedAt: { date: string; slug: string };
    slug: string;
    image: { src: string };
  }[];
};

export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { formData, user } = RemixGunContext(Gun, request);
  let { alias, password } = await formData();
  if (typeof alias !== "string") {
    return json({ error: "Invalid alias entry" });
  }
  if (typeof password !== "string") {
    return json({ error: "Invalid password entry" });
  }
  try {
    let result = await user.credentials(alias, password);
    return json(result);
  } catch (error) {
    return json({ error });
  }
};
function AuthResponse({ useActionData }: { useActionData: () => any }) {
  let data = useActionData();
  let Logout = FormBuilder();
  if (data && data.error) {
    return (
      <div
        className="w-full mx-auto rounded-xl gap-4  p-4 relative"
        style={{
          minHeight: "320px",
          minWidth: "420px",
          maxWidth: "520px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          fill="currentColor"
          className="absolute text-red-500 right-2 bottom-3 top-1"
          viewBox="0 0 1792 1792"
        >
          <path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z" />
        </svg>

        <p className=" text-sm text-red-500 -bottom-6">{data.error}</p>
      </div>
    );
  }
  return (
    data && (
      <div
        className="w-full mx-auto rounded-xl gap-4  p-4 relative"
        style={{
          minHeight: "320px",
          minWidth: "420px",
          maxWidth: "520px",
        }}
      >
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
        <Logout.Form method={"post"}>
          <Logout.Submit label="Logout" />
        </Logout.Form>
      </div>
    )
  );
}

export default function Login() {
  let Login = FormBuilder();
  let [switchFlip, switchSet] = React.useState({
    authType: true,
  });
  return (
    <div
      className="w-full mx-auto rounded-xl gap-4  p-4 relative"
      style={{
        minHeight: "320px",
        minWidth: "420px",
        maxWidth: "650px",
      }}
    >
      <Login.Form method={"post"}>
        <Login.Input type="text" name="alias" label="Alias" />
        <Login.Input type="password" name="password" label="Password" />
        <Login.Submit label={"Authenticate"} />
      </Login.Form>
      <AuthResponse useActionData={useActionData} />
      <Login.Switch
        name={"authType"}
        value={switchFlip.authType ? "password" : "keypair"}
        state={switchFlip.authType}
        onClick={(state: any) => {
          switchSet({ ...state, authType: !switchFlip.authType });
        }}
        rounded
        label={switchFlip.authType ? "Password" : "Keypair"}
      />
    </div>
  );
}

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
