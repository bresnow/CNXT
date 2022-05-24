import { ISEAPair } from "gun/types";
import React from "react";
import { Form, FormProps, useFetcher } from "remix";
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
  return (
    <div className="p-8 w-full h-full flex items-center justify-center">
      <div className="w-full h-full overflow-hidden shadow-lg flex items-start justify-start flex-col border dark:border-gray-800 rounded-lg">
        <div className="w-full flex items-center justify-start relative p-1 border-b dark:border-gray-800">
          <div className="p-1 flex items-center justify-center">
            <div className="bg-red-500 m-1 w-3 h-3 rounded-full" />
            <div className="bg-yellow-500 m-1 w-3 h-3 rounded-full" />
            <div className="bg-green-500 m-1 w-3 h-3 rounded-full" />
          </div>
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
              <div className="flex items-center justify-center pl-4">
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
              </div>
            </Form>
          </div>
        </div>
        <div className="w-full h-full relative">
          <iframe
            ref={iframeRef}
            src={namespace ?? `https://remix.run`}
            className={`w-full h-full transition-opacity duration-200 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => {
              setLoading(false);
            }}
            sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation"
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
