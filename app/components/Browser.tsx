import { ISEAPair } from "gun/types";
import React from "react";
import { Form, FormProps, useFetcher } from "remix";
import { _Window } from "types";
import { MainMenu } from "~/root";
export function Lock() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

export function Refresh() {
  return (
    <button type="submit" className="color-transparent">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </button>
  );
}
export type BrowserWindowIframe = HTMLIFrameElement;
const links = [
  {
    label: "Home",
    id: "home",
    link: "/",
    icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
  },
  {
    label: "Authentication",
    link: "/login",
    id: "login",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
  {
    label: "CNXT",
    link: "/cnxt",
    id: "builder",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
];
export default function BrowserWindow({
  namespace,
  onLoad,
  onRefresh,
  onUnlock,
  encryption,
  ...props
}: Partial<{
  namespace: string;
  onLoad<T>(): T;
  onRefresh: () => void;
  encryption?: { key: ISEAPair };
  onUnlock: () => void;
}> &
  FormProps) {
  const [loading, setLoading] = React.useState(true);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  let fetcher = useFetcher();
  React.useEffect(() => {
    if (iframeRef.current && namespace) {
      let env = (window as any).ENV;
      console.log(env, "env");
      iframeRef.current.src = namespace;
    }
  }),
    [];
  return (
    <div className="p-8 w-full h-full flex items-center justify-center">
      <div className="w-full h-full overflow-hidden shadow-lg flex items-start justify-start flex-col border dark:border-gray-800 rounded-lg">
        <div className="w-full flex items-center justify-start relative p-1 border-b dark:border-gray-800">
          <div className="p-1 flex items-center justify-center">
            {/* <div className="bg-red-500 m-1 w-3 h-3 rounded-full" />
            <div className="bg-yellow-500 m-1 w-3 h-3 rounded-full" />
            <div className="bg-green-500 m-1 w-3 h-3 rounded-full" /> */}
          </div>
          <MainMenu links={links} />
          <div className="w-full flex items-center justify-center absolute left-0">
            <Form
              method="post"
              action={props.action}
              onSubmit={
                props.onSubmit
                  ? props.onSubmit
                  : ({ preventDefault, currentTarget }) => {
                      console.log(currentTarget, "FORM_ON_SUBMIT");
                    }
              }
              className="text-xs bg-gray-100 dark:bg-gray-900 w-1/2 rounded-lg py-1 flex justify-between items-center"
            >
              {/* <div className="flex items-center justify-center pl-4">
                <span className="text-green-500 w-4 h-4 mr-2">
                  <Lock />
                </span>
                <input
                  className=""
                  onChange={({ target }) => {
                    console.log(target.value);
                  }}
                />
              </div>
              <div className="flex pr-4">
                <span className="text-gray-500 w-4 h-4">
                  <Refresh />
                </span>
              </div> */}
            </Form>
          </div>
        </div>
        <div className="w-full h-full relative">
          <iframe
            ref={iframeRef}
            className={`w-full  h-full transition-opacity duration-200 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
            style={{ minWidth: "350px", minHeight: "350px" }}
            onLoad={({ target }) => {
              console.log(target, "IFRAME_ON_LOAD");
              setLoading(false);
            }}
            allowFullScreen
            referrerPolicy="no-referrer"
            // sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts"
            allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
          />
          {loading && (
            <div className="absolute w-full h-full top-0 left-0 animate-pulse bg-gray-100 dark:bg-gray-900" />
          )}
        </div>
      </div>
    </div>
  );
}
