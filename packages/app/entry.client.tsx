import * as ReactDOM from 'react-dom';
import { EntryFactory } from '~/rmxgun-context/context';

let RmxGun = EntryFactory();
// @ts-ignore
ReactDOM.hydrateRoot(document, <RmxGun.Client />);

if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  const Gun = window.Gun,
    gun = new Gun({ localStorage: false }),
    user = gun.user();
  // I just like using window with gun... makes me feel safe okay??
  let { routeData } = __remixContext,
    { root, gunOpts } = routeData.root,
    AppKeys = root.ENV.APP_KEY_PAIR;
  let peered = new Gun(gunOpts);
  gun.on('auth', (msg) => {
    console.log(`c%${msg}`, 'color: green; font-weight: bold;', msg);
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/entry.worker.js', { type: 'module' })
      .then(() => navigator.serviceWorker.ready)
      .then(() => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SYNC_REMIX_MANIFEST',
            manifest: window.__remixManifest,
          });
        } else {
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            navigator.serviceWorker.controller?.postMessage({
              type: 'SYNC_REMIX_MANIFEST',
              manifest: window.__remixManifest,
            });
          });
        }
      })
      .catch((error) => {
        console.error('Service worker registration failed', error);
      });
  });
}
