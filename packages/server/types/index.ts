import type {
  IGun,
  IGunChain,
  IGunInstance,
  IGunMeta,
  IGunUserInstance,
} from 'gun/types';
import type { ISEAPair } from 'gun/types';
import type { ServerResponse } from 'http';
import { Params } from 'react-router';
import { MemoryUploadHandlerOptions } from '@remix-run/node/upload/memoryUploadHandler';
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
export type NodeValues = IGunMeta<Record<string, any> & JSobject>;
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
    formData: (
      options?: FormDataOptions
    ) => Promise<Record<string, FormDataEntryValue>>;
    opt_mesh: (
      peers: string | string[],
      remove?: boolean
    ) => {
      message: string;
    };
    cnxtCtx: {
      findTagFromHash: (hash: HashedTag) => Promise<{
        namespace: string;
        delimiter: string;
      }>;
      hashTagWork: (
        delimiter: TagDelimiter,
        params: Params<'namespace'>
      ) => Promise<{
        tagNode: IGunChain<
          any,
          IGunChain<any, any, any, 'hashed-tags'>,
          any,
          string
        >;
      }>;
    };
  };
}

export type TagDelimiter = '!' | '@' | '#' | '$' | '%' | '^' | '&' | '*';
export type UnHashedTag = { delimiter: TagDelimiter; namespace: string };
export type HashedTag = string;
