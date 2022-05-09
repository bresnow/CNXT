import type { IGun, IGunChain } from "gun/types";
import type { ISEAPair } from "gun/types";
import type { Params } from "react-router";
import type { ServerResponse } from "http";
export * from "./loaders"


export type Nodevalues = { [x: string | number]: any }
export interface ChainCtx {
    get: (path: string) => {
        val: () => Promise<Nodevalues | undefined>, put: (data: Nodevalues | IGunChain<Record<string, any>, any>) => Promise<{ result: string }>, set: (data: Nodevalues | IGunChain<Record<string, any>, any>) => Promise<{ result: string }>, map: (callback?: (args?: any) => any) => Promise<Nodevalues[] | undefined>
    },
    options: (peers: string | string[], remove?: boolean) => any,

}
export interface UserAuth {
    keyPairAuth: (pair: ISEAPair) => Promise<unknown>;
    credentials: (alias: string, password: string) => Promise<unknown>;
    logout(): Promise<Response>

}

export type LoadCtx = { RemixGunContext: (Gun: IGun, { request, params }: { request: Request, params: Params }) => RmxGunCtx, res: ServerResponse }
export interface RmxGunCtx {
    ENV: {
        DOMAIN: string | undefined;
        PEER_DOMAIN: string | undefined;
        CLIENT: string | undefined;
        APP_KEY_PAIR: ISEAPair;
    },
    graph: ChainCtx;
    user: UserAuth
    formData: () => Promise<Record<string, string>>;
    // createToken: (sessionKey?: string) => Promise<string>,
    // verifyToken: (request: Request, sessionKey?: string) => Promise<void>,
};

