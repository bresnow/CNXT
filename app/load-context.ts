import type { ChainCtx, RmxGunCtx, NodeValues } from "types";
import type { GunOptions, GunUser, IGun, IGunChain, IGunUserInstance, ISEAPair } from "gun/types";
import { destroySession, getSession } from "~/session.server";
import { errorCheck } from "./lib/utils/helpers";
import { redirect } from "remix";
import { Params } from "react-router";
import { getDomain } from "./server";
import { log } from "./lib/console-utils";
import { parseJSON } from "./lib/parseJSON";
export function RemixGunContext(Gun: IGun, request: Request) {
    // log((req), "Request")
    const ENV = {
        DOMAIN: process.env.DOMAIN,
        PEER_DOMAIN: process.env.PEER_DOMAIN,
        CLIENT: process.env.CLIENT_PORT,
        APP_KEY_PAIR: {
            pub: process.env.PUB,
            priv: process.env.PRIV,
            epub: process.env.EPUB,
            epriv: process.env.EPRIV,
        } as ISEAPair,
    };

    let peerList = {
        DOMAIN: getDomain(),
        PEER: `https://${ENV.PEER_DOMAIN}/gun`,
    };
    const gunOpts: {
        peers: string[];
        radisk: boolean;
        localStorage: boolean;
    } = {
        peers: [peerList.DOMAIN, peerList.PEER],
        localStorage: false,
        radisk: true,
    }
    let gun = Gun(gunOpts);
    let user: IGunUserInstance = gun.user().auth(ENV.APP_KEY_PAIR)
    /**
     * Upgrade from Gun's user api
     * sets pubkey and epub as user_info and SEA keypair in session storage ENCRYPTED with remix session api
     */


    const aliasAvailable = (alias: string) => {
        return new Promise((resolve, reject) => {
            gun.get(`~@${alias}`).once((exists) => {
                if (exists) {
                    resolve(false)
                }
                resolve(true)
            })
        })
    }
    type T = any
    const SEA = Gun.SEA
    const pair = SEA.pair, encrypt = SEA.encrypt, decrypt = SEA.decrypt, sign = SEA.sign, verify = SEA.verify, secret = SEA.secret, certify = SEA.certify;

    async function keyPairAuth(pair: ISEAPair) {
        let session = await getSession(request.headers.get("Cookie") ?? undefined);
        return new Promise((resolve, reject) => gun.user().auth(pair, (ack) => {
            if (errorCheck(ack)) {
                let err = (ack as any).err as string
                reject(err)
            } else {
                let sea = (ack as any).sea as ISEAPair
                let userInfo = (ack as any).put as GunUser
                session.set(`user_info`, JSON.stringify(userInfo))
                session.set(`key_pair`, sea)
                resolve(userInfo)
            }
        }))
    }
    /**
     * authenticate with username and password
     * If alias is available it automaticatically creates a new user... likewise reasoning for login
     */
    async function credentials(alias: string, password: string) {
        let session = await getSession(request.headers.get("Cookie"));
        return new Promise((resolve, reject) => gun.user().auth(alias, password, async (ack) => {
            if ((await aliasAvailable(alias))) {
                try {
                    let signUp = await createUser(alias, password)
                    resolve(signUp)
                } catch (error) {
                    reject(error)
                }
            }
            if (Object.getOwnPropertyNames(ack).includes('sea')) {
                let sea = (ack as any).sea as ISEAPair
                let userInfo = (ack as any).put as GunUser
                session.set(`user_info`, userInfo)
                session.set(`key_pair`, sea)
                resolve({ alias: userInfo.alias, pub: userInfo.pub, epub: userInfo.epub });
            }
            if (errorCheck(ack)) {
                let err = (ack as any).err as string
                reject(err)
            }
        }))
    }
    /**
     * 
   create user with alias and password then authenticate.
     */
    async function createUser(alias: string, password: string) {
        return new Promise((resolve, reject) => gun.user().create(alias, password, async (ack) => {
            if (!errorCheck(ack)) {
                resolve(ack)
            } else {
                let err = (ack as any).err as string
                reject(err)
            }
        }))
    }


    async function logout() {
        const session = await getSession(request.headers.get("Cookie"));
        return redirect(request.headers.get("Referer") ?? "/", {
            headers: {
                "Set-Cookie": await destroySession(session),
            },
        });
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
                            reject("No data found")
                        }
                        // delete data._
                        resolve(data)
                    })
                ),
                put: async (data: NodeValues | IGunChain<Record<string, any>, any>) => new Promise((resolve, reject) => {
                    chainref.put(data, (ack: any) => {
                        ack.ok ? resolve(`node ${path} -  values updated to ${data}`) : reject(ack.err);
                    })
                })
                ,
                set: async (data: NodeValues | IGunChain<Record<string, any>, any>) => new Promise((resolve, reject) => {
                    chainref.set(data, (ack: any) => {
                        ack.ok ? resolve(`node ${path} -  values updated to ${data}`) : reject(ack.err);
                    })
                })
                ,
                map: async (callback?: (args?: any) => any) => {

                    let object = await (chainref as any).then();

                    return new Promise(async (resolve, reject) => {
                        if (!object) {
                            reject("No data set");
                        }
                        let set: NodeValues[] = await Promise.all(
                            Object.keys(object).map(async (key) => {
                                // @ts-ignore
                                let data = await chainref.get({ "#": key });
                                return data
                            })
                        );
                        if (!set) {
                            reject("Error getting data - set is undefined");
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
                return { message: `Peers ${peers} removed` };
            }
            // Ask local peer to connect to another peer. //
            mesh.say({ dam: 'opt', opt: { peers: typeof peers === 'string' ? peers : peers.map((peer) => peer) } });
            return { message: `Peers ${peers} added` };
        }


    }




    return {
        ENV,
        gunOpts,
        gun,
        graph,
        user: { keyPairAuth, credentials, logout },
        formData: async () => {
            let values: Record<string, string> | Record<string, FormDataEntryValue>
            if (request.headers.get("Content-Type") === "application/json") {
                values = Object.fromEntries(await request.json())
            }
            values = Object.fromEntries(await request.formData())
            let obj: Record<string, string> = {}
            return new Promise((resolve, reject) => {
                for (const prop in values) {
                    Object.assign(obj, { [prop]: values[prop] as string });
                }
                resolve(obj)
            })
        }
        // createToken: async (sessionKey = "verify") => {
        //     let session = await getSession();
        //     let token = (await SEA.pair()).epub
        //     session.set(sessionKey, token);
        //     return token;
        // },
        // verifyToken: async (request: Request, sessionKey = "verify") => {

        //     if (request.bodyUsed) {
        //         throw new Error(
        //             "The body of the request was read before calling verifyToken. Ensure you clone it before reading it."
        //         );
        //     }
        //     let session = await getSession();
        //     let formData = await request.clone().formData();

        //     if (!session.has(sessionKey)) {
        //         throw unprocessableEntity({
        //             message: "Can't find token in session.",
        //         });
        //     }

        //     if (!formData.get(sessionKey)) {
        //         throw unprocessableEntity({
        //             message: "Can't find token in body.",
        //         });
        //     }

        //     if (formData.get(sessionKey) !== session.get(sessionKey)) {
        //         throw unprocessableEntity({
        //             message: "Can't verify token authenticity.",
        //         });
        //     }
        // },
    }

}