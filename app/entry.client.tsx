import * as ReactDOM from "react-dom";
import { RemixBrowser } from "remix";

import { createBrowserDataloader } from "./dataloader/browser";
import { DataloaderProvider } from "./dataloader/lib";

let dataloader = createBrowserDataloader();

ReactDOM.hydrateRoot(
  document,
  <DataloaderProvider dataloader={dataloader}>
    <RemixBrowser />
  </DataloaderProvider>
);
