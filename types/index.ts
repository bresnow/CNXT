import type { IGun, IGunChain } from "gun/types";
import type { ISEAPair } from "gun/types";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { ServerResponse } from "http";
export * from "./loaders"


export type Nodevalues = { [x: string | number]: any }
export interface ChainCtx {
    get: (path: string) => {
        val: () => Promise<Nodevalues | undefined>, put: (data: Nodevalues | IGunChain<Record<string, any>, any>) => Promise<{ ok: boolean; result: string }>, set: (data: Nodevalues | IGunChain<Record<string, any>, any>) => Promise<{ ok: boolean; result: string }>, map: (callback?: (args?: any) => any) => Promise<Nodevalues[] | undefined>
    },
    options: (peers: string | string[], remove?: {
        peers: string | string[];
    } | undefined) => any,

}

export type LoadCtx = { RemixGunContext: (Gun: IGun) => RmxGunCtx, res: ServerResponse }
export interface RmxGunCtx {
    ENV: {
        DOMAIN: string | undefined;
        PEER_DOMAIN: string | undefined;
        CLIENT: string | undefined;
        APP_KEY_PAIR: ISEAPair;
    },
    graph: ChainCtx;
    auth: (pair: ISEAPair) => Promise<{ ok: boolean; err: boolean; }>
    pair: () => Promise<ISEAPair>,
    formData: (request: any) => Promise<{ [x: string]: FormDataEntryValue }>,
    createToken: (sessionKey?: string) => Promise<string>,
    verifyToken: (request: Request, sessionKey?: string) => Promise<void>,
    getLoader: (args: DataFunctionArgs) => Promise<any>,
    putAction: (args: DataFunctionArgs) => Promise<any>,
};

