import type { ChainCtx, RmxGunCtx, Nodevalues } from "types";
import type { GunCallbackUserCreate, GunOptions, IGun, IGunChain, ISEAPair } from "gun/types";
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

    const createUser = async (username: string, password: string): Promise<{ result: string }> =>
        new Promise((resolve, reject) => gun.user().create(username, password, (ack) => {
            console.log(ack)
            if (Object.getOwnPropertyNames(ack).includes('ok')) {
                resolve({ result: 'ok' })
            } else {
                reject({ result: JSON.parse(JSON.stringify(ack)).err })
            }
        }));
    type T = any
    const SEA = Gun.SEA
    const pair = async () => await SEA.pair()
    const auth = {

        pair: (pair: ISEAPair): Promise<{ ok: any; err: boolean; }> => {
            return new Promise((resolve, reject) => gun.user().auth(pair, (ack) => {
                if (Object.getOwnPropertyNames(ack).includes('id')) {
                    resolve({ ok: ack, err: false });
                } else {
                    resolve({ ok: false, err: (ack as any).err })
                }
            }))

        },

        password: (alias: string, password: string): Promise<{ ok: boolean; err: boolean; }> => {
            return new Promise((resolve, reject) => gun.user().auth(alias, password, (ack) => {
                if (Object.getOwnPropertyNames(ack).includes('id')) {
                    resolve({ ok: true, err: false });
                } else {
                    resolve({ ok: false, err: (ack as any).err })
                }
            }))
        }

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
        options: (peers: string | string[], remove?: boolean) => {
            var peerOpt = (gun as any).back('opt.peers');
            var mesh = (gun as any).back('opt.mesh');  // DAM
            if (remove) {
                if (Array.isArray(peers)) {
                    peers.forEach((peer) => {
                        mesh.bye(peer);
                    });
                } mesh.bye(peers);
                return json({ message: `Peers ${peers} removed` });
            }
            // Ask local peer to connect to another peer. //
            mesh.say({ dam: 'opt', opt: { peers: typeof peers === 'string' ? peers : peers.map((peer) => peer) } });
            return json({ message: `Peers ${peers} added` });
        }


    }




    return {
        ENV,
        createUser,
        graph,
        pair,
        auth,
        formData: async (request: Request) => {
            return Object.fromEntries(await request.formData())

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
            let formData = await request.clone().formData();

            if (!session.has(sessionKey)) {
                throw unprocessableEntity({
                    message: "Can't find token in session.",
                });
            }

            if (!formData.get(sessionKey)) {
                throw unprocessableEntity({
                    message: "Can't find token in body.",
                });
            }

            if (formData.get(sessionKey) !== session.get(sessionKey)) {
                throw unprocessableEntity({
                    message: "Can't verify token authenticity.",
                });
            }
        },
    }
}
