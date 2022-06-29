import {
  ActionFunction,
  json,
  LoaderFunction,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from 'remix';
import { LoadCtx } from 'types';
import Gun, { IGunChain, ISEAPair } from 'gun';
import LZString from 'lz-string';
import debug from '~/app/lib/debug';
import { createMemoryUploadHandler } from '@remix-run/node/upload/memoryUploadHandler';
import { parseMultipartFormData } from '@remix-run/node/parseMultipartFormData';
import { composeEventHandlers } from '@remix-run/react/components';
import { createFileUploadHandler } from '@remix-run/node/upload/fileUploadHandler';
import { UploadHandler } from '@remix-run/node/formData';
import { read, write } from '~/server/fs-util';
import fs from 'fs';
let { log, error, opt, warn } = debug({ dev: true });
let QueryType = {
  GET: 'g' || 'get',
  OPEN: 'o' || 'open',
};
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, user, ENV, formData } = RemixGunContext(Gun, request);
  let { query } = params;
  let url = new URL(request.url);
  let path = url.searchParams.get('path') as string;
  let data;
  switch (query) {
    case QueryType.GET:
      data = await gun.user().auth(ENV.APP_KEY_PAIR).path(path).then();
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
  return json(data);
};

export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { formData, user } = RemixGunContext(Gun, request);
  let url = new URL(request.url);
  let fname = url.searchParams.get('filename');
  let path = url.searchParams.get('path') as string;
  const handler = composeUploadHandlers(
    createFileUploadHandler({
      directory: './public/images',
      maxFileSize: 3000000000,
    }),
    createMemoryUploadHandler({ maxFileSize: 3000000000 })
  );

  let data;
  try {
    data = Object.fromEntries(await parseMultipartFormData(request, handler));
    let put = await (user as any).path(path).put(data).then();
    log(data, put);
  } catch (error) {
    data = error;
  }

  // let file = await read(`./tmp/${fname}`)
  // log(file)
  return json(data);
};
export function composeUploadHandlers(
  ...handlers: UploadHandler[]
): UploadHandler {
  return async (part) => {
    for (let handler of handlers) {
      let value = await handler(part);
      if (typeof value !== 'undefined' && value !== null) {
        return value;
      }
    }

    return undefined;
  };
}
export async function convertFileToBase64(file: File): Promise<string> {
  const fileReader = new FileReader();

  // We want to wrap this in a Promise
  // because the FileReader works asynchronously.
  return new Promise((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort();
      reject(new Error('Parse Failed.'));
    };

    // This method is called when the file is "readAsDataUrl"
    fileReader.onload = (fileLoadedEvent) => {
      const data = fileLoadedEvent.target?.result;

      if (!data) {
        return reject(new Error('Load Failed.'));
      }

      if (typeof data !== 'string') {
        return reject(new Error('Convert Failed.'));
      }

      resolve(data);
    };

    fileReader.readAsDataURL(file);
  });
}
