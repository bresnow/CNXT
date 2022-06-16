//@ts-expect-error
import { renderToPipeableStream } from 'react-dom/server';
import { RemixServer } from 'remix';
import type { EntryContext } from 'remix';
import type { ServerResponse } from 'http';
import { DataloaderProvider } from '~/rmxgun-context/useFetcherAsync';
import { createServerDataloader } from '~/rmxgun-context/server';
import { LoadCtx, RmxGunCtx } from 'types';
import { EntryFactory } from '~/rmxgun-context/context';
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: LoadCtx
) {
  let { res } = context;
  let RmxGun = EntryFactory();
  responseHeaders.set('Content-Type', 'text/html; charset=UTF-8');
  responseHeaders.set('Transfer-Encoding', 'chunked');

  return new Promise<void>((resolve, reject) => {
    let didError = false;
    const { pipe, abort } = renderToPipeableStream(
      <RmxGun.Server
        request={request}
        remixContext={remixContext}
        context={context}
      />,
      {
        onCompleteShell() {
          let statusCode = didError ? 500 : responseStatusCode;
          let headers: Record<string, string | string[]> = {};
          for (const [key, value] of responseHeaders) {
            if (typeof headers[key] === 'string') {
              headers[key] = [headers[key] as string, value];
            } else if (Array.isArray(headers[key])) {
              (headers[key] as string[]).push(value);
            } else {
              headers[key] = value;
            }
          }
          res.writeHead(statusCode, headers);
          pipe(res);

          resolve();
        },
        onShellError(err: Error) {
          reject(err);
        },
        onError(err: Error) {
          didError = true;
        },
      }
    );

    setTimeout(abort, 2000);
  });
}
