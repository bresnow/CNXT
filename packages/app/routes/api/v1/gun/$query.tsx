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
  let url = new URL(request.url);
  let path = url.searchParams.get('path') as string;
  let { gun, user, ENV, formData } = RemixGunContext(Gun, request),
    db = user as unknown as IGunChain<any, any>;
  let { query } = params;
  let data;
  switch (query) {
    case QueryType.GET:
      data = await db.path(path).then();
      break;
    case QueryType.OPEN:
      data = await new Promise((res, _rej) => {
        db.load((data: any) => {
          res(data);
        });
      });
      break;
    case 'p':
      try {
        data = await formData();
      } catch (error) {
        data = error;
      }
      break;
    default:
      data = await db.path(path).then();
  }
  return json(data);
};

export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { formData, user } = RemixGunContext(Gun, request),
    db = user as unknown as IGunChain<any, any>;
  let url = new URL(request.url);
  let path = url.searchParams.get('path') as string;
  const handler = composeUploadHandlers(
    createFileUploadHandler({
      directory: './public/images',
      maxFileSize: 3000000000,
    }),
    createMemoryUploadHandler({ maxFileSize: 3000000000 })
  );

  let values;
  try {
    values = Object.fromEntries(await parseMultipartFormData(request, handler));
    let obj = recursiveCheck(values);
    await db.path(path).put(obj).then();
    values = { success: true, data: obj };
  } catch (error) {
    values = { error };
  }
  return json(values);
};

export function recursiveCheck(values: any): Record<string, any> {
  let obj: Record<string, any> = {};
  for (const prop in values) {
    let value = values[prop];
    if (typeof value === 'object') {
      return recursiveCheck(value as any);
    }
    if (typeof value === 'string') {
      Object.assign(obj, { [prop]: value });
    }
  }
  return obj;
}

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
