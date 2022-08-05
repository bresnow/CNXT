import type { RmxGunCtx } from 'types';
import type {
  GunOptions,
  GunUser,
  IGun,
  IGunChain,
  IGunUserInstance,
  ISEAPair,
} from 'gun/types';
import { destroySession, getSession } from '../app/session.server';

import { redirect } from 'remix';
import { host } from '.';

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
  let _gun = Gun(gunOpts);
  async function chainlocker() {
    await import('chainlocker');

    let keypair = await _gun.keys();
    console.log(keypair);
    let vault = _gun.vault(host(), keypair);
    return { gun: _gun, vault };
  }
  let user = chainlocker().then(({ vault }) => {
    return vault;
  });
  let gun = chainlocker().then(({ gun }) => {
    return gun;
  });
  //     /**
  //      * add or remove peer addresses
  //      * @param peers
  //      * @param remove
  //      * @returns
  //      */
  const gunServerMesh = (peers: string | string[], remove?: boolean) => {
    var peerOpt = (_gun as any).back('opt.peers');
    var mesh = (_gun as any).back('opt.mesh'); // DAM
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
    chainlocker,
    gun,
    user,
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
  };
}
