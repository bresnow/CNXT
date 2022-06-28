let collapse = console.groupCollapsed.bind(console.trace);
type DebugOptions = Partial<{ off: boolean; dev: boolean }>;
interface Debug {
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  opt({ off, dev: devOnly }: DebugOptions): Debug;
}

function debug({ off = false, dev = true }: DebugOptions): Debug {
  let isProd = process.env.NODE_ENV === 'production';
  return {
    log(...args: any[]) {
      (dev && !isProd && !off) || (!dev && !off)
        ? args.forEach((arg) => {
            if (typeof arg === 'object') {
              arg = JSON.stringify(arg, null, 2);
              console.log(
                `%c${arg.toString()}`,
                'color:#f6f8ff;font-size:15px;font-weight:light;font-family:system-ui;font-style:semi-bold;'
              );
            }
          })
        : null;
    },
    warn(...args: any[]) {
      (dev && !isProd && !off) || (!dev && !off)
        ? args.forEach((arg) => {
            console.log(
              `%c${arg}`,
              'color:#f3a712;font-size:15px;font-weight:light;font-family:monospace;font-style:semibold;'
            );
          })
        : null;
    },
    error(...args: any[]) {
      (dev && !isProd && !off) || (!dev && !off)
        ? args.forEach((arg) => {
            console.log(
              `%c${arg}`,
              'color:red;font-size:15px;font-weight:light;font-family:monospace;font-style:bold;'
            );
          })
        : null;
    },
    opt({ off, dev }: DebugOptions) {
      let thisFn = debug.bind(debug, { off, dev });
      return thisFn();
    },
  };
}

export default debug;
