import * as ReactDOM from "react-dom";
import { RemixBrowser } from "remix";

import { createDeferedLoader } from "~/client-context/browser";
import { DataloaderProvider } from "~/client-context/lib";

let dataloader = createDeferedLoader();
// @ts-ignore
ReactDOM.hydrateRoot(
  document,
  <DataloaderProvider dataloader={dataloader}>
    <RemixBrowser />
  </DataloaderProvider>
);
