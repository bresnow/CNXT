import { createContext, useContext } from "react";
import type { FC } from "react";
import type { ISEAPair } from "gun";
import { useContextReducer } from "bresnow_utility-react-hooks";

export type ClientContext = {
  createGunFetchLoader: () => {
    load(id: string, internalId: string): Promise<Response>;
  };
  createGunPut: () => {
    put(
      path: string,
      obj: {
        [key: string]: any;
      }
    ): Promise<unknown>;
  };
};
let context = createContext<ClientContext | undefined>(undefined);

export let DataloaderProvider: FC<{ dataloader: ClientContext }> = ({
  children,
  dataloader,
}) => {
  return <context.Provider value={dataloader}>{children}</context.Provider>;
};

const initialGunState = {
  load: () => {},
  put: () => {},
};
const [gunState, gunDispatch, GunProvider] = useContextReducer(() => {
  return { load: () => {}, put: () => {} };
}, initialGunState);

export let useGunLoader = () => useContext(context);
