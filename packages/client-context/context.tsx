import { createContext, useContext } from "react";
import type { FC } from "react";
import type { IGun } from "gun";
import { Options } from "./browser";

export type ClientContext = {
  load: Load;
};

interface DataFetcher {
  load: Load;
  submit: Submit;
}
interface Load {
  (route: string, options?: Options): Promise<Response & any>;
}

interface Submit {
  (data: FormData | Record<string, any> | JSON, options?: Options): Promise<
    Response & any
  >;
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
