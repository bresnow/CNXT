import chalk from 'chalk';
let collapse = console.groupCollapsed.bind(console.trace);
export default function debug() {
  if (process.env.NODE_ENV !== 'production')
    return {
      log(...args) {
        console.log(chalk.green(...args));
      },
      warn(...args) {
        console.warn(chalk.yellow.italic(...args));
      },
      error(...args) {
        console.error(chalk.red.bold(...args));
        collapse(chalk.italic(...args));
      },
    };
}
