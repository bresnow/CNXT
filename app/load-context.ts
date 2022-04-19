import type { ChainCtx, RmxGunCtx, Nodevalues } from "types";
import type { GunOptions, IGun, IGunChain, ISEAPair } from "gun/types";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getSession } from "~/session.server";
import { parseJSON } from "~/lib/parseJSON";
import { unprocessableEntity } from "~/lib/responses";
import type { ServerResponse } from "http";
export function RemixGunContext(Gun: IGun): RmxGunCtx {

    // log((req), "Request")
    const ENV = {
        DOMAIN: process.env.DOMAIN,
        PEER_DOMAIN: process.env.PEER_DOMAIN,
        CLIENT: process.env.CLIENT_PORT,
        APP_KEY_PAIR: parseJSON(process.env.APP_KEY_PAIR as string) as ISEAPair,
    };
    const gunOpt: GunOptions = {
        peers: [`http://0.0.0.0:${ENV.CLIENT}/gun`],
        localStorage: false,
        radisk: true,
    }

    const gun = Gun(gunOpt);
    // form data values with string type check
    // async function 
    // async function getSessionKeyPair(request: Request) {
    //     let session = await getSession(request.headers.get("Cookie"));
    //     let keyPair = session.get("sea");
    //     if (keyPair) {
    //         let keys = parseJSON(keyPair);
    //         return keys as ISEAPair
    //     }
    // }
    type T = any
    const SEA = Gun.SEA
    const pair = async () => await SEA.pair()
    const auth = (pair: ISEAPair): Promise<{ ok: boolean; err: boolean; }> => {
        return new Promise((resolve, reject) => gun.user().auth(pair, (ack: any) => {
            if (Object.getOwnPropertyNames(ack).includes('id')) {
                resolve({ ok: true, err: false });
            } else {
                resolve({ ok: false, err: (ack).err })
            }
        }))
    }


    /**
     * * @param path - Path to the desired node. Each node label separated by forward slash  "path/to/the/node"
     * @param keys - optional Keypair to authorize node access
     * @returns - get: get data from node, map - map numerical sets as an array , put: update node with data with option to set data as a numerical set,
     */
    const graph: ChainCtx = {

        get: (path: string) => {

            let chainref: IGunChain<T>
            chainref = (gun as any).path(`${path}`)
            return {
                val: () => new Promise((resolve, reject) =>
                    chainref.once((data) => {
                        if (!data) {
                            resolve(undefined)
                        }
                        // let dcomped = lzObject.decompress(data, { output: "utf16" })
                        resolve(data)
                    })
                ),
                put: async (data: Nodevalues | IGunChain<Record<string, any>, any>) => new Promise((resolve, reject) => {
                    // let pressed = lzObject.compress(data, { output: "utf16" });
                    chainref.put(data, (ack: any) => {
                        ack.ok ? resolve({ ok: true, result: `node ${path} -  values updated to ${data}` }) : resolve({ ok: false, result: ack.err });
                    })
                })
                ,
                set: async (data: Nodevalues | IGunChain<Record<string, any>, any>) => new Promise((resolve, reject) => {
                    // let pressed = lzObject.compress(data, { output: "utf16" });
                    chainref.set(data, (ack: any) => {
                        ack.ok ? resolve({ ok: true, result: `node ${path} -  values updated to ${data}` }) : resolve({ ok: false, result: ack.err });
                    })
                })
                ,
                map: async (callback?: (args?: any) => any) => {

                    let object = await (chainref as any).then();

                    return new Promise(async (resolve, reject) => {
                        if (!object) {
                            resolve(undefined);
                        }
                        let set = await Promise.all(
                            Object.keys(object).map(async (key) => {
                                // @ts-ignore
                                let data = await chainref.get({ "#": key });
                                // let dcomped = lzObject.decompress(data, { output: "utf16" })
                                return data
                            })
                        );
                        if (!set) {
                            resolve(undefined);
                        }
                        if (callback) {
                            let cbd = callback(set)
                            resolve(cbd)
                        }
                        resolve([...new Set(set)]);

                    })
                },
            }
        },


        /**
         * add or remove peer addresses 
         * @param peers 
         * @param remove 
         * @returns 
         */
        options: (peers: string | string[], remove?: {
            peers: string | string[];
        } | undefined) => {
            var peerOpt = (gun as any).back('opt.peers');
            var mesh = (gun as any).back('opt.mesh');  // DAM

            if (remove !== undefined) {
                if (typeof remove.peers === 'string') {
                    mesh.bye(remove.peers);
                }
                Object.values(peerOpt).forEach(value => mesh.bye(value));
            }
            // Ask local peer to connect to another peer. //
            mesh.say({ dam: 'opt', opt: { peers: typeof peers === 'string' ? peers : peers.map((peer) => peer) } });

        }


    }




    return {
        ENV,
        graph,
        pair,
        auth,
        formData: async (request: Request) => {
            let formData = Object.fromEntries(await request.formData())

            return formData;
        },
        createToken: async (sessionKey = "verify") => {
            let session = await getSession();
            let token = (await SEA.pair()).epub
            session.set(sessionKey, token);
            return token;
        },
        verifyToken: async (request: Request, sessionKey = "verify") => {

            if (request.bodyUsed) {
                throw new Error(
                    "The body of the request was read before calling verifyToken. Ensure you clone it before reading it."
                );
            }
            let session = await getSession();
            // We clone the request to ensure we don't modify the original request.
            // This allow us to parse the body of the request and let the original request
            // still be used and parsed without errors.
            let formData = await request.clone().formData();

            // if the session doesn't have a csrf token, throw an error
            if (!session.has(sessionKey)) {
                throw unprocessableEntity({
                    message: "Can't find token in session.",
                });
            }

            // if the body doesn't have a csrf token, throw an error
            if (!formData.get(sessionKey)) {
                throw unprocessableEntity({
                    message: "Can't find token in body.",
                });
            }

            // if the body csrf token doesn't match the session csrf token, throw an
            // error
            if (formData.get(sessionKey) !== session.get(sessionKey)) {
                throw unprocessableEntity({
                    message: "Can't verify token authenticity.",
                });
            }
        },
        getLoader: async (args: DataFunctionArgs) => {
            return null
        },
        putAction: async ({ params, context, request }: DataFunctionArgs) => {
            // let keys = await getSessionKeyPair(request)
            let { formData, graph } = context as RmxGunCtx;
            let path = params.path;
            let values = await formData(request);
            let obj = {}
            if (typeof path === "string") {
                for (var key in values) {
                    if (typeof values[key] !== 'string') {
                        return json({ err: ` Invalid entry at: ${key}` });
                    } Object.assign(obj, { [key]: values[key] })
                }


                if (Object.values(obj).length > 0) {
                    let { ok } = await graph.get(`${path}`).put(obj);
                    if (ok) {
                        return json({ put: obj });
                    }
                    throw new Error("put failed");
                }
                throw new Error("no values to put")
            }
            throw new Error("node path invalid")
        }

    }
}
