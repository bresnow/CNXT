import { createContext, useContext } from "react";
import type { FC } from "react";
import type { IGun } from "gun";
import { Options } from "./browser";

export type ClientContext = {
  load: Load;
};
interface Load {
  (route: string, options?: Options): Promise<Response & any>;
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

export let useDeferedLoadData = () => useContext(context);

export interface GunClientContext {
  (Gun: IGun): {
    get(nodePath: string): Promise<Response>;
  };
}
