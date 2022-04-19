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
        console.group("........." + `${key}` + ".........");
        console.groupCollapsed();
        console.log(args[i]);
        console.groupCollapsed();
        console.groupEnd();
        console.groupCollapsed();
        console.group("––––––––– TRACE ––––––––");
        console.groupCollapsed();
        console.trace();
        console.groupCollapsed();
        console.groupEnd();
      }
    }
  }
  console.clear();
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
      console.trace();
      console.groupEnd();
    }
  }
  console.clear();
};
