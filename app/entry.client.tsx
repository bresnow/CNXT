import * as ReactDOM from "react-dom";
import { RemixBrowser } from "remix";

import { createGunFetchLoader, createGunPut } from "./dataloader/browser";
import { DataloaderProvider } from "./dataloader/lib";

let dataloader = { createGunFetchLoader, createGunPut };

ReactDOM.hydrateRoot(
  document,
  <DataloaderProvider dataloader={dataloader}>
    <RemixBrowser />
  </DataloaderProvider>
);
