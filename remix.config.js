/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  customServer: 'server/index.ts',
  ignoredRouteFiles: ['.*'],
  devServerBroadcastDelay: 500,
  devServerPort: 9000,
};
