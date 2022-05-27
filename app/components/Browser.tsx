import { ISEAPair } from "gun/types";
import React, { HTMLAttributes, Reducer } from "react";
import { Form, FormProps, Link, useFetcher } from "remix";
import { _Window } from "types";
import lz from "lz-string";

import { useIf, useSafeEffect } from "bresnow_utility-react-hooks";
import invariant from "@remix-run/react/invariant";
import { log } from "~/lib/console-utils";
import FormBuilder from "./FormBuilder";
import Iframe, { SandBox } from "./Iframe";
import { InputTextProps } from "./InputText";
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
    label: "Refresh",
    id: "Refresh",
    link: "#",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
  {
    label: "Lock",
    link: "#",
    id: "lock",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    label: "Search",
    link: "#",
    id: "search",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
];

type SecureRenderProps = {
  namespace: string;
  srcdoc?: string;
  allow?: string;
  onLoad?: () => any;
  search?: InputTextProps;
  onRefresh?: () => void;
  encryption?: { key: ISEAPair };
  onUnlock?: () => void;
  sandbox?: SandBox | string;
};
export default function SecureRender({
  namespace,
  onLoad,
  onRefresh,
  onUnlock,
  encryption,
  search,
  srcdoc,
  allow,
  sandbox,
}: SecureRenderProps) {
  const [loading, setLoading] = React.useState(true);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const [state, setState] = React.useState<string>();
  const menuarr = links;

  React.useEffect(() => {
    if (iframeRef.current && namespace) {
      let env = (window as any).ENV;
      iframeRef.current.src = namespace;
    }
  });
  React.useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = ({ target }) => {
        setLoading(false);
      };
    }
  });
  let WindowForm = FormBuilder();

  return (
    <div className="p-8 w-full h-full flex items-center justify-center">
      <div className="w-full h-full overflow-hidden shadow-lg flex items-start justify-start flex-col  rounded-lg">
        <div className="w-full flex items-center justify-start relative p-1 border-b bg-cnxt_black  dark:border-gray-800">
          <div className="p-1 flex items-center justify-center text-gray-300">
            <div className="relative flex items-center px-6 overflow-hidden border-0  h-28 rounded-2xl">
              <nav className="flex items-center justify-center gap-8">
                {menuarr?.map(({ link, icon, id, label }, index) => (
                  <Link
                    key={label + index}
                    to={link}
                    className="grid w-16 h-16 grid-cols-1 grid-rows-1"
                  >
                    <span className="sr-only">{label}</span>
                    <div
                      onClick={(e) => {
                        (
                          document.querySelector(
                            `#nav-indicator`
                          ) as HTMLElement
                        ).style.transform = `translateX(calc(${96 * index}px))`;
                      }}
                      className={`col-[1/1] row-[1/1] flex items-center justify-center w-16 h-16`}
                    >
                      <svg
                        className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300 group-focus:text-primary-80 transition ease-in-out duration-150"
                        stroke={"#053c9c"}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            icon ??
                            "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          }
                        />
                      </svg>
                    </div>
                    <div
                      className={`col-[1/1] row-[1/1] flex items-center justify-center w-16 h-16 transition-opacity duration-300`}
                      // ${
                      //   isActive(link)
                      //     ? "opacity-100 pointer-events-auto"
                      //     : "opacity-0 pointer-events-none"
                      // }
                    ></div>
                  </Link>
                ))}
              </nav>

              <div
                id="nav-indicator"
                className={`absolute w-6 h-8 transition-all duration-300 bg-cnxt_blue rounded-full -bottom-4  left-10`}
              >
                <div
                  style={{ boxShadow: "0 10px 0 #053c9c" }}
                  className="absolute w-5 h-5 bg-cnxt_black-left-4 bottom-1/2 rounded-br-3xl"
                ></div>
                <div
                  style={{ boxShadow: "0 10px 0 #053c9c" }}
                  className="absolute w-5 h-5 bg-cnxt_black-right-4 bottom-1/2 rounded-bl-3xl"
                ></div>
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-center absolute left-0">
            <div className="flex items-center justify-center pl-4">
              <WindowForm.Form
                method="post"
                className="text-xs bg-gray-300 dark:bg-gray-900 w-full rounded-lg py-1 flex justify-between items-center"
              >
                <WindowForm.Input
                  name={search?.name}
                  type="text"
                  label={search?.label}
                  placeholder={search?.placeholder}
                  className="w-full bg-gray-300 mb-3 flex"
                />
              </WindowForm.Form>
            </div>
            <div className="flex pr-4">
              <span className="text-gray-500 flex items-center justify-center"></span>
            </div>
          </div>
        </div>
        <div className="w-full h-full relative">
          <Iframe
            url={namespace}
            className={`w-full  h-full transition-opacity duration-200 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
            srcdocument={srcdoc}
            onLoad={() => {
              setLoading(false);
            }}
            styles={{ minWidth: "350px", minHeight: "350px" }}
            allowFullScreen
            referrerpolicy="same-origin"
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
