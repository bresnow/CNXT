import * as ReactDOM from 'react-dom';
import { EntryFactory } from '~/lib/context/context';

let RmxGun = EntryFactory();
// @ts-ignore
ReactDOM.hydrateRoot(document, <RmxGun.Client />);

if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
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
