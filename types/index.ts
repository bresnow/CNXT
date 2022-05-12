import type { GunOptions, IGun, IGunChain, IGunInstance } from "gun/types";
import type { ISEAPair } from "gun/types";
import type { Params } from "react-router";
import type { ServerResponse } from "http";
export * from "./loaders"


export type NodeValues = Record<string, string>
export interface ChainCtx {
    get: (path: string) => {
        val: () => Promise<NodeValues | undefined>, put: (data: NodeValues | IGunChain<Record<string, any>, any>) => Promise<string>, set: (data: NodeValues | IGunChain<Record<string, any>, any>) => Promise<string>, map: (callback?: (args?: any) => any) => Promise<NodeValues[] | undefined>
    },
    options: (peers: string | string[], remove?: boolean) => any,

}
export interface UserAuth {
    keyPairAuth: (pair: ISEAPair) => Promise<unknown>;
    credentials: (alias: string, password: string) => Promise<unknown>;
    logout(): Promise<Response>

}

export type LoadCtx = { RemixGunContext: (Gun: IGun, request: Request) => RmxGunCtx, res: ServerResponse }
export interface RmxGunCtx {
    ENV: {
        DOMAIN: string | undefined;
        PEER_DOMAIN: string | undefined;
        CLIENT: string | undefined;
        APP_KEY_PAIR: ISEAPair;
    },
    gunOpts: {
        peers: string[];
        radisk: boolean;
        localStorage: boolean;
    };
    gun: IGunInstance;
    graph: ChainCtx;
    user: UserAuth
    formData: () => Promise<Record<string, string>>;
    // createToken: (sessionKey?: string) => Promise<string>,
    // verifyToken: (request: Request, sessionKey?: string) => Promise<void>,
};

