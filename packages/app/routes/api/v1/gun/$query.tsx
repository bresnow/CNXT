import { ActionFunction, json, LoaderFunction } from 'remix';
import { LoadCtx } from 'types';
import Gun, { ISEAPair } from 'gun';
import LZString from 'lz-string';

let QueryType = {
  GET: 'g' || 'get',
  OPEN: 'o' || 'open',
};
type QueryHandler = Map<string, () => Promise<Record<string, any>>>;
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let log = console.log.bind(console);
  let { RemixGunContext } = context as LoadCtx;
  let { gun, ENV } = RemixGunContext(Gun, request);
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
  } catch (error) {
    data = error;
  }
  console.log(data, 'data_ACTION');
  return json(data, { headers: { 'X-Test': 'test' } });
};
