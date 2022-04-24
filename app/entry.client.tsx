import * as ReactDOM from "react-dom";
import { RemixBrowser } from "remix";

import { createGunFetchLoader } from "./dataloader/browser";
import { DataloaderProvider } from "./dataloader/lib";

let dataloader = createGunFetchLoader();

ReactDOM.hydrateRoot(
  document,
  <DataloaderProvider dataloader={dataloader}>
    <RemixBrowser />
  </DataloaderProvider>
);
