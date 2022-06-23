import { ActionFunction, json, LoaderFunction } from 'remix';
import { LoadCtx } from 'types';
import Gun, { ISEAPair } from 'gun';
import { getSession } from '../../../../session.server';
import LZString from 'lz-string';

let QueryType = {
  GET: 'g' || 'get',
  OPEN: 'o' || 'open',
};
type QueryHandler = Map<string, () => Promise<Record<string, any>>>;
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, ENV } = RemixGunContext(Gun, request);
  let url = new URL(request.url);
  let path = url.searchParams.get('path');
  let auth = url.searchParams.get('auth') === ('true' || true) ? true : false;
  let compressed =
    url.searchParams.get('compressed') === ('true' || true) ? true : false;
  let user = gun.user().auth(ENV.APP_KEY_PAIR, (ack) => {
    if ((ack as any).err) {
      console.log('error');
    }
  });
  // if (compressed && path) {
  //   path = LZString.decompressFromEncodedURIComponent(path);
  // }
  let queryHandler: QueryHandler = new Map([
    [
      QueryType.GET,
      async () => {
        let data = await gun
          .user()
          .auth(ENV.APP_KEY_PAIR, (ack) => {
            if ((ack as any).err) {
              console.log('error');
            }
          })
          .path((path as string).replace('/', '.'))
          .then();
        console.log(data);
        return data;
      },
    ],
    [
      QueryType.OPEN,
      async () =>
        new Promise((res, _rej) =>
          gun
            .user()
            .auth(ENV.APP_KEY_PAIR, (ack) => {
              if ((ack as any).err) {
                console.log('error');
              }
            })
            .path((path as string).replace('/', '.'))
            .open((data: any) => {
              res(data);
            })
        ),
    ],
  ]);
  let query = queryHandler.get(params.query as string),
    res = query && (await query());
  console.log(res);
  return json(res, { status: 200, headers: { 'FLTNGMMTH-DEV': 'true' } });
};
