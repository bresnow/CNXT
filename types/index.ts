import type {
  GunOptions,
  IGun,
  IGunChain,
  IGunInstance,
  IGunUserInstance,
} from 'gun/types';
import type { ISEAPair } from 'gun/types';
import type { ServerResponse } from 'http';
import { EntryContext } from 'remix';
export * from './loaders';

declare global {
  export interface Window {
    Gun: IGun;
    ENV: {
      DOMAIN: string | undefined;
      PEER_DOMAIN: string[] | undefined;
      CLIENT: string | undefined;
      APP_KEY_PAIR: ISEAPair;
    };
    __remixContext: EntryContext;
  }
}
export type NodeValues = Record<string, string>;
export interface CredentialsAuth {
  (alias: string, password: string): Promise<{
    user: IGunUserInstance;
  }>;
  (alias: string, password: string): Promise<{
    error: string;
  }>;
}
export interface Keydentials {
  (): Promise<{
    pair: ISEAPair;
  }>;
}

export interface SEAAuth {
  keypair: Keydentials;
  logout(): Promise<Response>;
  credentials: CredentialsAuth;
}

export type LoadCtx = { RemixGunContext: RmxGunCtx; res: ServerResponse };
export interface RmxGunCtx {
  (Gun: IGun, request: Request): {
    ENV: {
      DOMAIN: string | undefined;
      PEER_DOMAIN: string[] | undefined;
      CLIENT: string | undefined;
      APP_KEY_PAIR: ISEAPair;
    };
    gunOpts: {
      peers: string[];
      radisk: boolean;
      localStorage: boolean;
    };
    chainlocker(): Promise<IGunInstance<any>>;
    gun: IGunInstance;
    formData: () => Promise<Record<string, string>>;
  };
}
