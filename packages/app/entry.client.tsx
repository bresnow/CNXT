import * as ReactDOM from "react-dom";
import { RemixBrowser } from "remix";

import { createBrowserLoader } from "~/client-context/browser";
import { DataloaderProvider } from "~/client-context/lib";

let dataloader = createBrowserLoader();
// @ts-ignore
ReactDOM.hydrateRoot(
  document,
  <DataloaderProvider dataloader={dataloader}>
    <RemixBrowser />
  </DataloaderProvider>
);
