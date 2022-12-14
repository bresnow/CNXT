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
              'color:#f6f8ff;font-family:system-ui;font-size:25px;font-weight:light;'
            );
          })
        : null;
    },
    warn(...args: any[]) {
      ((devOnly && !isProd) || !devOnly) && console.log(...args);
    },
    error(...args: any[]) {
      ((devOnly && !isProd) || !devOnly) && console.log(...args);
      ((devOnly && !isProd) || !devOnly) && collapse(...args);
    },
    opt({ off, devOnly }: DebugOptions) {
      let thisFn = debug.bind(debug, { off, devOnly });
      return thisFn();
    },
  };
}

export default debug;
