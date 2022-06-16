import { json, LoaderFunction } from 'remix';
import fs from 'fs';
import { html, pdf } from 'remix-utils';
import { Readable } from 'stream';
import { LoadCtx } from 'types';

export const loader: LoaderFunction = async ({ request, context }) => {
  return null
};
