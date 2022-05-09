import { createContext, useContext } from "react";
import type { FC } from "react";


export type ClientContext = {
  load: (id: string, internalId: string) => Promise<Response>;
};
let context = createContext<ClientContext | undefined>(undefined);

export let DataloaderProvider: FC<{ dataloader: ClientContext }> = ({
  children,
  dataloader,
}) => {
  return <context.Provider value={dataloader}>{children}</context.Provider>;
};

export let useGunFetchLoader = () => useContext(context);
