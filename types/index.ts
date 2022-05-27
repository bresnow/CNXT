import type { GunOptions, IGun, IGunChain, IGunInstance, IGunUserInstance } from "gun/types";
import type { ISEAPair } from "gun/types";
import type { Params } from "react-router";
import type { ServerResponse } from "http";
export * from "./loaders"

export interface _Window extends Window {
    ENV: {
        DOMAIN: string | undefined;
        PEER_DOMAIN: string | undefined;
        CLIENT: string | undefined;
        APP_KEY_PAIR: ISEAPair;
    }

}
export type NodeValues = Record<string, string>
export interface ChainCtx {
    get: (path: string) => {
        val: (opts?: { open: boolean }) => Promise<NodeValues | undefined>, put: (data: NodeValues | IGunChain<Record<string, any>, any>) => Promise<string>, set: (data: NodeValues | IGunChain<Record<string, any>, any>) => Promise<string>, map: (callback?: (args?: any) => any) => Promise<NodeValues[] | undefined>
    },
    options: (peers: string | string[], remove?: boolean) => any,

}

export interface CredentialsAuth {
    (alias: string, password: string): Promise<{
        user: IGunUserInstance;
    }>
    (alias: string, password: string): Promise<{
        error: string;
    }>
}
export interface Keydentials {
    (pair?: ISEAPair | undefined): Promise<{ user?: undefined; }>
    (pair?: ISEAPair | undefined): Promise<{ error: { message: string | undefined; }; }>
}

export interface SEAAuth {
    keypair: Keydentials
    logout(): Promise<Response>
    credentials: CredentialsAuth;
}

export type LoadCtx = { RemixGunContext: RmxGunCtx, res: ServerResponse }
export interface RmxGunCtx {
    (Gun: IGun, request: Request): {
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
        seaAuth: SEAAuth
        formData: () => Promise<Record<string, string>>;
    }
    createToken: (sessionKey?: string) => Promise<string>,
    verifyToken: (request: Request, sessionKey?: string) => Promise<void>,
};

