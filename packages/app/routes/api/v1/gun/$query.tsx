import { ActionFunction, json, LoaderFunction } from 'remix';
import { LoadCtx } from 'types';
import Gun, { ISEAPair } from 'gun';
import LZString from 'lz-string';
import debug from '~/app/lib/debug';

let { log, error, opt, warn } = debug({ dev: true });
let QueryType = {
  GET: 'g' || 'get',
  OPEN: 'o' || 'open',
};
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, ENV, formData } = RemixGunContext(Gun, request);
  let { query } = params;
  let url = new URL(request.url);
  let path = url.searchParams.get('path') as string;
  let data;
  // log(path, 'Path', query, 'Query');
  switch (query) {
    case QueryType.GET:
      data = await gun.user().auth(ENV.APP_KEY_PAIR).path(path).then();
      // log(data, 'GET');
      break;
    case QueryType.OPEN:
      data = await new Promise((res, _rej) => {
        gun
          .user()
          .auth(ENV.APP_KEY_PAIR)
          .path(path)
          .load((data: any) => {
            res(data);
          });
      });
      // log(data, 'OPEN');
      break;
    case 'p':
      try {
        data = await formData();
        log(request.body, 'FORMDATA');
      } catch (error) {
        data = error;
      }
      break;
    default:
      data = await gun.user().auth(ENV.APP_KEY_PAIR).path(path).then();
  }
  // log(data, 'Default');
  return json(data);
};

export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { formData } = RemixGunContext(Gun, request);
  let data;

  try {
    data = await formData();
    log(data);
  } catch (error) {
    data = error;
  }
  return json(data);
};
