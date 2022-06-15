import { createContext, useContext } from "react";
import type { FC } from "react";
import type { IGun } from "gun";
import { createBrowserLoader, Options } from "./browser";
import { EntryContext, RemixBrowser, RemixServer } from "remix";
import { LoadCtx } from "types";
import { createServerDataloader } from "./server";

export type ClientContext = {
  load: Load;
};
interface Load {
  (route: string, options?: Options): Promise<Response & any>;
}

export interface Submit {
  (options: Options): Promise<Response & any>;
}
let context = createContext<ClientContext | undefined>(undefined);

export let DataloaderProvider = ({
  children,
  dataloader,
}: {
  children: React.PropsWithChildren<any>;
  dataloader: ClientContext;
}) => {
  return <context.Provider value={dataloader}>{children}</context.Provider>;
};

export let useDataLoader = () => useContext(context);

export function EntryFactory() {
  return {
    Server({
      request,
      remixContext,
      context,
    }: {
      request: Request;
      remixContext: EntryContext;
      context: LoadCtx;
    }) {
      let dataloader = createServerDataloader(
        remixContext,
        request,
        {},
        context
      );
      return (
        <DataloaderProvider dataloader={dataloader}>
          <RemixServer context={remixContext} url={request.url} />
        </DataloaderProvider>
      );
    },
    Client() {
      let dataloader = createBrowserLoader();
      return (
        <DataloaderProvider dataloader={dataloader}>
          <RemixBrowser />
        </DataloaderProvider>
      );
    },
  };
}
