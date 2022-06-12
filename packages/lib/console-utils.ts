export const isDev = () => {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  return false;
};
export const log = (...args: any[]) => {
  if (isDev()) {
    for (let i = 0; i < args.length; i++) {
      for (var key in args[i]) {
        console.group("........." + ".........");
        console.log(args[i]);
        console.groupEnd();
        console.groupCollapsed("........." + `TRACE` + ".........");
        console.groupEnd();
      }
    }
  }
};
export const error = (...args: any[]) => {
  if (isDev()) {
    for (let i = 0; i < args.length; i++) {
      for (var key in args[i]) {
        console.group("!!!!!!!!!!!!-ERROR" + `${key}` + "!!!!!!!!!!!!");
        console.log(args[i]);
        console.trace();
        console.groupEnd();
      }
      console.error(args[i]);
      console.groupEnd();
    }
  }
};
