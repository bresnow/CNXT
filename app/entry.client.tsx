import * as ReactDOM from "react-dom";
import { RemixBrowser } from "remix";

import { createDeferedLoader } from "~/dataloader/browser";
import { DataloaderProvider } from "~/dataloader/lib";

let dataloader = createDeferedLoader();

ReactDOM.hydrateRoot(
  document,
  <DataloaderProvider dataloader={dataloader}>
    <RemixBrowser />
  </DataloaderProvider>
);
