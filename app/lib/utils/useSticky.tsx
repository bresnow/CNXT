import { useSafeEffect } from "bresnow_utility-react-hooks";
import React from "react";

const useSticky = () => {
  const [totalHeaderHeight, setTotalHeaderHeight] = React.useState(0);
  const [sticky, setSticky] = React.useState(false);
  const headerRef = React.useRef<any>(null);
  const fixedRef = React.useRef(null);

  useSafeEffect(() => {
    setTotalHeaderHeight(headerRef?.current?.clientHeight);
  }, [totalHeaderHeight]);

  useSafeEffect(() => {
    const scrollHandler = () => {
      let scrollPos = window.scrollY;
      if (scrollPos > totalHeaderHeight) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [sticky, totalHeaderHeight]);

  return { sticky, headerRef, fixedRef };
};

export default useSticky;
