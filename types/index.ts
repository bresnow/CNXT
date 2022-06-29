import type {
  GunOptions,
  IGun,
  IGunChain,
  IGunInstance,
  IGunMeta,
  IGunUserInstance,
} from 'gun/types';
import type { ISEAPair } from 'gun/types';
import type { Params } from 'react-router';
import type { ServerResponse } from 'http';
import { FileUploadHandlerOptions } from '@remix-run/node/upload/fileUploadHandler';
import { MemoryUploadHandlerOptions } from '@remix-run/node/upload/memoryUploadHandler';
import { type } from 'os';
export * from './loaders';

export interface _Window extends Window {
  ENV: {
    DOMAIN: string | undefined;
    PEER_DOMAIN: string[] | undefined;
    CLIENT: string | undefined;
    APP_KEY_PAIR: ISEAPair;
  };
}
export type JSobject = {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | JSobject[]
    | JSobject;
};
export type NodeValues = IGunMeta<Record<string, string | JSobject>>;
export type FormDataOptions = MemoryUploadHandlerOptions;
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
    gun: IGunInstance;
    user: IGunUserInstance;
    formData: (options?: FormDataOptions) => Promise<Record<string, string>>;
    opt_mesh: (
      peers: string | string[],
      remove?: boolean
    ) => {
      message: string;
    };
  };
}
