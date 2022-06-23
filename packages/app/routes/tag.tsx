import Gun from 'gun';
import {
  json,
  LoaderFunction,
  useLoaderData,
  useCatch,
  Outlet,
  useParams,
  Form,
} from 'remix';
import { useFetcherAsync } from '~/rmxgun-context/useFetcherAsync';
import { LoadCtx } from 'types';
import Display from '~/components/DisplayHeading';
import CNXTLogo from '~/components/svg/logos/CNXT';
import { Navigation } from '~/components/Navigator';
import Profile from '~/components/Profile';
import React, { Suspense } from 'react';
import { ImageCard } from './index';
import { SuspendedTest } from './$namespace/edit';

export default function NameSpaceRoute() {
  return (
    <>
      <Outlet />
    </>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 403:
    case 404:
      return (
        <div className='min-h-screen py-4 flex flex-col justify-center items-center'>
          <Display
            title={`${caught.status}`}
            titleColor='white'
            span={`${caught.statusText}`}
            spanColor='pink-500'
            description={`${caught.statusText}`}
          />
        </div>
      );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error.message);
  console.trace(error.message);
  return (
    <div className='min-h-screen py-4 flex flex-col justify-center items-center'>
      <Display
        title='Error:'
        titleColor='#cb2326'
        span={error.message}
        spanColor='#fff'
        description={`error`}
      />
    </div>
  );
}
