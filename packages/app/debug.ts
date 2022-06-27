let collapse = console.groupCollapsed.bind(console.trace);
type DebugOptions = Partial<{ off: boolean; devOnly: boolean }>;
interface Debug {
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  opt({ off, devOnly }: DebugOptions): Debug;
}

function debug({ off = false, devOnly = true }: DebugOptions): Debug {
  let isProd = process.env.NODE_ENV === 'production';
  return {
    log(...args: any[]) {
      (devOnly && !isProd && !off) || (!devOnly && !off)
        ? args.forEach((arg) => {
            console.log(
              `%c${arg}`,
              'color:#42bfdd;font-size:15px;font-weight:light;font-family:system-ui;font-style:italic;'
            );
          })
        : null;
    },
    warn(...args: any[]) {
      (devOnly && !isProd && !off) || (!devOnly && !off)
        ? args.forEach((arg) => {
            console.log(
              `%c${arg}`,
              'color:#f3a712;font-size:15px;font-weight:light;font-family:monospace;font-style:semibold;'
            );
          })
        : null;
    },
    error(...args: any[]) {
      (devOnly && !isProd && !off) || (!devOnly && !off)
        ? args.forEach((arg) => {
            console.log(
              `%c${arg}`,
              'color:red;font-size:15px;font-weight:light;font-family:monospace;font-style:bold;'
            );
          })
        : null;
    },
    opt({ off, devOnly }: DebugOptions) {
      let thisFn = debug.bind(debug, { off, devOnly });
      return thisFn();
    },
  };
}

export default debug;
