import { json, LoaderFunction } from 'remix';
import { LoadCtx } from 'types';
import { commitSession, getSession } from '../../../../session.server';
import Gun, { ISEAPair } from 'gun';

export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let ctx = RemixGunContext(Gun, request);
  let method = params.method;
  let keys: ISEAPair;
  return null;
};
