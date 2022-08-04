import type { RmxGunCtx } from 'types';
import type { GunOptions, GunUser, IGun, IGunChain, ISEAPair } from 'gun/types';
import { destroySession, getSession } from '../app/session.server';

import { redirect } from 'remix';
import { Params } from 'react-router';
import { host } from '.';
import { unprocessableEntity } from 'remix-utils';
import objectAssign from 'object-assign';

export const errorCheck = (promise: any) => {
  let prop = 'err' || 'ERR' || 'error' || 'ERROR';
  if (Object.getOwnPropertyNames(promise).includes(prop)) {
    return true;
  }
  return false;
};
export const checkIf = {
  isObject: function (value: unknown) {
    return !!(value && typeof value === 'object' && !Array.isArray(value));
  },
  isNumber: function (value: unknown) {
    return !isNaN(Number(value));
  },
  isBoolean: function (value: unknown) {
    if (
      value === 'true' ||
      value === 'false' ||
      value === true ||
      value === false
    ) {
      return true;
    }
  },
  isString: function (value: unknown) {
    return typeof value === 'string';
  },
  isArray: function (value: unknown) {
    return Array.isArray(value);
  },

  isFn: function (value: unknown) {
    return typeof value === 'function';
  },
};
export function RemixGunContext(Gun: IGun, request: Request) {
  const ENV = {
    DOMAIN: process.env.DOMAIN,
    PEER_DOMAIN: process.env.PEER_DOMAIN?.split(', ' || ' ' || '/' || ''),
    CLIENT: process.env.PORT,
    APP_KEY_PAIR: {
      pub: process.env.PUB,
      priv: process.env.PRIV,
      epub: process.env.EPUB,
      epriv: process.env.EPRIV,
    },
  };

  let peerList = {
    DOMAIN: host(),
    PEERS: (ENV.PEER_DOMAIN as string[]).map(
      (domain) => `https://${domain}/gun`
    ),
  };
  peerList.PEERS && peerList.PEERS.push(peerList.DOMAIN);
  const gunOpts: GunOptions = {
    peers: [peerList.DOMAIN, ...peerList.PEERS],
    localStorage: false,
    radisk: true,
  };
  let gun = Gun(gunOpts);
  /**
   * Upgrade from Gun's user api
   * sets pubkey and epub as user_info and SEA keypair in session storage ENCRYPTED with remix session api
   */

  const aliasAvailable = (alias: string) => {
    return new Promise((resolve, reject) => {
      gun.get(`~@${alias}`).once((exists) => {
        if (exists) {
          resolve(false);
        }
        resolve(true);
      });
    });
  };
  type T = any;
  const SEA = Gun.SEA;
  async function keypair() {
    let session = await getSession();
    let pair, _pair;

    if (!session.get('key_pair')) {
      session.set('key_pair', JSON.stringify(await SEA.pair()));
    }

    // pair = JSON.parse(session.get('key_pair'))

    // console.log('new keypair', session.get('key_pair'))
    return { pair: JSON.parse(session.get('key_pair')) };
  }
  /**
   * authenticate with username and password
   * If alias is available it automaticatically creates a new user... likewise reasoning for login
   */
  async function credentials(alias: string, password: string) {
    let session = await getSession();
    if (await aliasAvailable(alias)) {
      try {
        await createUser(alias, password);
      } catch (error) {
        return { error };
      }
    }
    return {
      user: gun.user().auth(alias, password, (ack) => {
        if (Object.getOwnPropertyNames(ack).includes('sea')) {
          let sea = (ack as any).sea as ISEAPair;
          let userInfo = (ack as any).put as GunUser;
          session.set(`user_info`, userInfo);
          session.set(`key_pair`, sea);
        }
        console.log(session.get('user_info'));
        console.log(session.get('key_pair'));
        if (errorCheck(ack)) {
          let err = (ack as any).err as string;
          console.error(err);
        }
      }),
    };
  }
  /**
     * 
   create user with alias and password then authenticate.
     */
  async function createUser(alias: string, password: string) {
    return new Promise((resolve, reject) =>
      gun.user().create(alias, password, async (ack) => {
        if (!errorCheck(ack)) {
          resolve(ack);
        } else {
          let err = (ack as any).err as string;
          reject(err);
        }
      })
    );
  }

  async function logout() {
    const session = await getSession(request.headers.get('Cookie'));
    return redirect(request.headers.get('Referer') ?? '/', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }

  //     /**
  //      * add or remove peer addresses
  //      * @param peers
  //      * @param remove
  //      * @returns
  //      */
  const gunServerMesh = (peers: string | string[], remove?: boolean) => {
    var peerOpt = (gun as any).back('opt.peers');
    var mesh = (gun as any).back('opt.mesh'); // DAM
    if (remove) {
      if (Array.isArray(peers)) {
        peers.forEach((peer) => {
          mesh.bye(peer);
        });
      }
      mesh.bye(peers);
      return { message: `Peers ${peers} removed` };
    }
    // Ask local peer to connect to another peer. //
    mesh.say({
      dam: 'opt',
      opt: {
        peers: typeof peers === 'string' ? peers : peers.map((peer) => peer),
      },
    });
    return { message: `Peers ${peers} added` };
  };

  // }

  return {
    ENV,
    gunOpts,
    gun,
    // graph,
    seaAuth: { keypair, credentials, logout },
    formData: async () => {
      let values: Record<string, any> | Record<string, FormDataEntryValue>;
      if (request.headers.get('Content-Type') === 'application/json') {
        values = Object.fromEntries(await request.json());
      }

      values = Object.fromEntries(await request.formData());
      let obj: Record<string, string> = {};
      return new Promise((resolve, reject) => {
        for (const prop in values) {
          Object.assign(obj, { [prop]: values[prop] as string });
        }
        resolve(obj);
      });
    },
    createToken: async (sessionKey = 'verify') => {
      let session = await getSession();
      let token = (await SEA.pair()).epub;
      session.set(sessionKey, token);
      return token;
    },
    verifyToken: async (request: Request, sessionKey = 'verify') => {
      if (request.bodyUsed) {
        throw new Error(
          'The body of the request was read before calling verifyToken. Ensure you clone it before reading it.'
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
  };
}
