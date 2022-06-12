/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: './packages/app',
  customServer: "./app/server.ts",
  ignoredRouteFiles: [".*"],
  devServerBroadcastDelay: 1000,
};
