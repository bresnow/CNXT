import type { HashedTag, RmxGunCtx, TagDelimiter } from 'types';
import type { IGun, IGunChain, ISEAPair } from 'gun/types';
import { getDomain } from '.';
import { parseMultipartFormData } from '@remix-run/node/parseMultipartFormData';
import { createMemoryUploadHandler } from '@remix-run/node/upload/memoryUploadHandler';
import { Params } from 'react-router';
import debug from '~/app/lib/debug';

let { log, error, opt, warn } = debug({ dev: true });
export function RemixGunContext(
  Gun: IGun,
  request: Request
): ReturnType<RmxGunCtx> {
  const ENV = {
    DOMAIN: process.env.DOMAIN,
    PEER_DOMAIN: process.env.PEER_DOMAIN?.split(', ' || ' ' || '/' || ''),
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
    PEERS: (ENV.PEER_DOMAIN as string[]).map(
      (domain) => `https://${domain}/gun`
    ),
  };
  peerList.PEERS && peerList.PEERS.push(peerList.DOMAIN);
  const gunOpts = {
    peers: [peerList.DOMAIN, ...peerList.PEERS],
    localStorage: false,
    radisk: true,
  };
  let gun = Gun(gunOpts),
    user = gun.user();
  user.auth(ENV.APP_KEY_PAIR, function (ack) {
    let err = (ack as any).err;
    if (err) {
      console.error(err);
      throw new Error(err + ' App Authentication at LoadCtx');
    }
  });
  const opt_mesh = (peers: string | string[], remove?: boolean) => {
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
  let lex = user.get('hashed-tags');

  const hashTagWork = async (
    delimiter: TagDelimiter,
    params: Params<string>
  ) => {
    let { namespace } = params as { namespace: string };
    var peerOpt = (gun as any).back('opt.peers');
    return {
      tagNode: lex
        .get(
          `${await Gun.SEA.work(
            { delimiter, namespace },
            ENV.APP_KEY_PAIR,
            null,
            { name: 'SHA-256', length: 12 }
          )}`
        )
        .put({
          delimiter,
          namespace,
          peer: { origin: ENV.DOMAIN, mesh: peerOpt },
        }),
    };
  };
  const findTagFromHash = async (hash: HashedTag) => {
    let { namespace, delimiter } = await lex.get(hash).then();
    // let work = await Gun.SEA.work(
    //   { delimiter, namespace },
    //   ENV.APP_KEY_PAIR,
    //   null,
    //   { name: 'SHA-256', length: 12 }
    // );
    return { namespace, delimiter };
  };
  return {
    ENV,
    gunOpts,
    gun,
    user,
    formData: async (options) => {
      const handler = createMemoryUploadHandler(options ?? {});
      let values = Object.fromEntries(
        await parseMultipartFormData(request, handler)
      );
      let obj: Record<string, string> = {};
      return new Promise((resolve, _reject) => {
        for (const prop in values) {
          let value = values[prop];
          if (typeof value !== 'string') {
            value = JSON.stringify(value);
          }
          Object.assign(obj, { [prop]: value });
        }
        resolve(obj);
      });
    },
    opt_mesh,
    cnxtCtx: {
      findTagFromHash,
      hashTagWork,
    },
  };
}
