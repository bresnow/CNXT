import chalk from 'chalk';
import { error } from '../remix-gun-utility/gun/hooks/index';
import { Options } from 'redaxios';
let collapse = console.groupCollapsed.bind(console.trace);
type DebugOptions = Partial<{ off: boolean; devOnly: boolean }>;
interface Debug {
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  opt({ off, devOnly }: DebugOptions): Debug;
}

function debug({ off, devOnly = true }: DebugOptions): Debug {
  let isProd = process.env.NODE_ENV === 'production';
  return {
    log(...args: any[]) {
      ((devOnly && !isProd) || !devOnly) && console.log(chalk.green(...args));
    },
    warn(...args: any[]) {
      ((devOnly && !isProd) || !devOnly) &&
        console.log(chalk.yellow.italic(...args));
    },
    error(...args: any[]) {
      ((devOnly && !isProd) || !devOnly) &&
        console.log(chalk.red.bold(...args));
      ((devOnly && !isProd) || !devOnly) && collapse(chalk.italic(...args));
    },
    opt({ off, devOnly }: DebugOptions) {
      let thisFn = debug.bind(debug, { off, devOnly });
      return thisFn();
    },
  };
}

export default debug;
