import React, { ReactElement, Reducer } from "react";
import ReactDOM from "react-dom";
import invariant from "@remix-run/react/invariant";
import { useIf } from "bresnow_utility-react-hooks";
import { log } from "../console-utils";
type PayloadType = Partial<{
  container: null | HTMLElement;
  width: number;
  height: number;
  isResizing: boolean;
  direction: string;
}>;
type Props = {
  enableResizing: boolean;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
};

type TWClass = {
  playground: string;
  iframe: string;
  resizeController: {
    default: string;
    before: string;
    after: string;
  };
  heightResizeController: {
    default: string;
    before: string;
    after: string;
  };
  widthResizeController: {
    default: string;
    before: string;
    after: string;
  };
};

const tailwindHandle: TWClass = {
  playground: "w-full h-full relative",

  iframe: "w-full border-0",

  resizeController: {
    default:
      "bg-[#ebeef3] border-[1px] border-solid border-[#d7dce4] absolute flex align-items-center justify-content-center",
    before: "content-none before:bg-[#bfc7d4] before:m-[2px] ",
    after: "content-none after:bg-[#bfc7d4] after:m-[2px] ",
  },
  heightResizeController: {
    default: "h-[20px] b-0 l-0 flex-col transform-translate-y-[25px]",
    before: "bfore:h-[2px] before:w-[2px]",
    after: "after:h-[2px] after:w-[2px]",
  },
  widthResizeController: {
    default:
      "w-[20px] h-full t-0 flex-row transform-translate-x-[10px] cursor-col-resize",
    before: "before:w-[2px] before:h-[25px]",
    after: "after:w-[2px] after:h-[25px]",
  },
};

export function changeState(stateKey: string) {
  return function (state: { [stateKey: string]: any }, payload: PayloadType) {
    return {
      ...state,
      [stateKey]: payload,
    };
  };
}

export function SecureFrameWrapper({
  enableResizing,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
}: Props): JSX.Element {
  const initState = {
    container: null, // container within which the user content should be rendered
    width: 0, // iframe width
    height: 0, // iframe height
    isResizing: false, // is the user currently resizing IFramePlayground?
    direction: "horizontal",
  }; // resizing direction
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null); // <iframe> ref
  const [state, dispatcher] = React.useReducer<Reducer<any, PayloadType>>(
    changeState,
    initState
  );

  function copyStyles(iframeNode: HTMLIFrameElement) {
    const links = Array.from(document.getElementsByTagName("link"));
    links.forEach((link) => {
      if (link.rel === "stylesheet") {
        iframeNode?.contentDocument?.head.appendChild(link.cloneNode(true));
      }
    });
  }

  function setSize(iframeNode: HTMLIFrameElement) {
    // Determine width
    const parentNode = iframeNode.parentElement as HTMLElement;
    const parentWidth = parentNode?.offsetWidth;
    let width: number | "100%";
    if (enableResizing === true) {
      parentWidth <= minWidth
        ? (width = minWidth)
        : maxWidth && parentWidth > maxWidth
        ? maxWidth
        : parentWidth;
    } else {
      width = maxWidth;
    }
    // Determine height
    // invariant(iframeNode, 'iframeNode is not defined');
    let children = Array.from(
      iframeNode.contentDocument?.body.children as HTMLCollectionOf<HTMLElement>
    );

    const height = children?.reduce(
      (prevVal, child) => prevVal + child.offsetHeight,
      0
    );
  }
  const handleLoad = () => {
    let iframeNode = iframeRef.current;
    if (
      iframeNode &&
      iframeNode.contentDocument &&
      iframeNode.contentDocument.body
    ) {
      dispatcher({
        container: iframeNode.contentDocument.body,
      });
      copyStyles(iframeNode);
      setSize(iframeNode);
    }
  };

  const handleResizeStart = (
    e: { preventDefault: () => void },
    direction: "horizontal" | "vertical"
  ) => {
    e.preventDefault();
    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", handleResizeStop);
    dispatcher({
      isResizing: true,
      direction,
    });
  };

  const handleResize = (e: { movementY: number; movementX: number }) => {
    const { direction, width, height } = state;

    if (direction === "vertical") {
      const newHeight = height + e.movementY;
      dispatcher({
        height:
          newHeight < minHeight
            ? minHeight
            : maxHeight || newHeight > maxHeight
            ? maxHeight
            : newHeight,
      });
    } else {
      const iframeNode = iframeRef.current as HTMLElement;
      if (iframeNode) {
        const newWidth = width + e.movementX;
        const newMaxWidth =
          maxWidth ||
          (iframeNode?.parentNode?.parentNode as HTMLElement).offsetWidth;
        dispatcher({
          width:
            newWidth < minWidth
              ? minWidth
              : newWidth > newMaxWidth
              ? newMaxWidth
              : newWidth,
        });
      }
    }
  };
  const removeEventListeners = () => {
    window.removeEventListener("mousemove", handleResize);
    window.removeEventListener("mouseup", handleResizeStop);
  };
  function handleResizeStop() {
    removeEventListeners();
    dispatcher({
      isResizing: false,
    });
  }

  useIf(
    [iframeRef.current],
    () => {
      let iframeNode = iframeRef.current;
      iframeNode?.addEventListener("load", handleLoad);
    },
    {
      else: () => {
        removeEventListeners();
      },
    }
  );
  console.log(state, "State");

  const {
    container,
    width,
    height, // iframe height
    isResizing, // is the user currently resizing IFramePlayground?
  } = state;
  log(iframeRef.current);
  return (
    <div
      className={"playground"}
      style={{ minWidth, minHeight, maxWidth, maxHeight }}
    >
      {enableResizing && (
        <div
          className={"resize-controller height-resize-controller"}
          onMouseDown={(e) => handleResizeStart(e, "vertical")}
          style={{ width }}
        />
      )}
      <iframe
        sandbox="allow-same-origin"
        ref={iframeRef}
        srcDoc={`<!DOCTYPE html> <h1>djfiajfisdjpfsdjpofjasdopfjasodpfjsp</h1>`}
        className={"iframe"}
        style={{ width: "100%", height: "100%" }}
      ></iframe>

      {enableResizing && (
        <div
          className={"resize-controller width-resize-controller"}
          onMouseDown={(e) => handleResizeStart(e, "horizontal")}
          style={{
            left: width,
          }}
        />
      )}
    </div>
  );
}
