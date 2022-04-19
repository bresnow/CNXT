import * as ReactDOM from "react-dom";
import { RemixBrowser } from "remix";

import { createGunClientLoader } from "./dataloader/browser";
import { DataloaderProvider } from "./dataloader/lib";

let dataloader = createGunClientLoader();

ReactDOM.hydrateRoot(
  document,
  <DataloaderProvider dataloader={dataloader}>
    <RemixBrowser />
  </DataloaderProvider>
);
