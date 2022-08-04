import { Suspense } from 'react';
import Gun from 'gun';
import {
  ActionFunction,
  json,
  LoaderFunction,
  useActionData,
  useCatch,
  useParams,
} from 'remix';
import { DeferedData, useFetcherAsync } from '~/lib/context/useFetcherAsync';
import { useIf } from 'bresnow_utility-react-hooks';
import { LoadCtx } from 'types';
import Display from '~/lib/components/DisplayHeading';
import FormBuilder from '~/lib/components/FormBuilder';
import invariant from '@remix-run/react/invariant';

type ErrObj = {
  path?: string;
  key?: string;
  value?: string;
  form?: string;
};
type LoadError = {
  error: ErrObj;
};
export let loader: LoaderFunction = async ({ request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun, ENV } = RemixGunContext(Gun, request);
  let user = gun.user();
  user.auth(ENV.APP_KEY_PAIR);
  let data;
  try {
    data = await user.get('pages').get('builder').then();
  } catch (error) {
    data = { error };
  }
  return json(data);
};
export let action: ActionFunction = async ({ request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { formData, ENV } = RemixGunContext(Gun, request);

  let error: ErrObj = {};
  try {
    let { prop, _value, path } = await formData();
    if (!path) {
      error.path = 'Namespace is required';
    }
    if (!/^(?![0-9])[a-zA-Z0-9$_]+$/.test(prop)) {
      error.key =
        'Invalid property name : Follow Regex Pattern /^(?![0-9])[a-zA-Z0-9$_]+$/';
    }
    if (
      typeof _value !== 'string' ||
      _value.length < 1 ||
      _value.length > 240
    ) {
      error.value =
        'Property values must be greater than 1 and less than 240 characters';
    }

    if (Object.values(error).length > 0) {
      return json<LoadError>({ error });
    }
    return json({ path, data: { [prop]: _value } });
  } catch (err) {
    error.form = err as string;
    return json<LoadError>({ error });
  }
};

export function SuspendedTest({ load }: { load: () => Record<string, any> }) {
  function RenderedData() {
    let data = load();
    if (data.error) {
      return <></>;
    }
    let path = data._ ? data._['#'] : '';
    return (
      <div className='grid grid-cols-1 gap-4 p-4'>
        <div className='col-span-1'>
          <h5>
            Fetched data at document path <pre>{path}</pre>
          </h5>
          {data &&
            Object.entries(data).map((val) => {
              let [key, value] = val;
              if (key === '_') {
                return;
              }
              return (
                <div
                  key={key}
                  className='flex flex-row items-center space-y-5 justify-center space-x-5'
                >
                  <div className='w-1/3 p-5 rounded-md '>{key}</div>
                  <div className='w-1/2 bg-gray-300 p-5 rounded-md flex-wrap'>
                    {`${value}`}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
  return <RenderedData />;
}
type LoadAction = {
  path: string;
  data: Record<string, string>;
};
export default function BuilderRoute() {
  let action = useActionData<LoadAction | LoadError>(),
    error = action && (action as LoadError).error,
    ackData = action && (action as LoadAction).data;

  let namespace = useParams().namespace as string;
  const ObjectBuilder = FormBuilder();
  useIf([ackData, !error], () => {
    invariant(ackData, 'ackData is undefined');
  });
  let buildLoader = useFetcherAsync(`/api/gun/q`, {
    params: { path: namespace },
  });
  let searchProps = {
    value: namespace,
    placeholder: namespace,
    name: 'path',
  };
  return (
    <ObjectBuilder.Form
      className='grid grid-cols-1  gap-3 px-3'
      method={'post'}
    >
      <input type='hidden' {...searchProps} />
      <div className='col-span-1'>
        <div className='flex flex-col lg:flex-row items-center space-y-5 justify-center space-x-5'>
          <div className='w-1/3 p-5 rounded-md '>
            <ObjectBuilder.Input
              type='text'
              required
              name='prop'
              label={'Key'}
              shadow={true}
              className={
                'w-full bg-primary-80 hover:bg-primary-70 py-2 focus:outline-none  rounded-md flex'
              }
              error={error?.key}
            />
          </div>
          <div className='w-1/2 bg-primary-80  hover:bg-primary-70 rounded-md flex-wrap'>
            <ObjectBuilder.Input
              type='text'
              required
              name='_value'
              label={'Value'}
              shadow={true}
              textArea={true}
              className={
                'w-full bg-primary-80 hover:bg-primary-70 focus:outline-none mb-5 flex'
              }
              error={error?.value}
            />
          </div>
        </div>
      </div>
      <ObjectBuilder.Submit label={'Submit'} />
    </ObjectBuilder.Form>
  );
}

export const SectionTitle = ({
  heading,
  description,
  align,
  color,
  showDescription,
}: TitleProps) => {
  const title = {
    showDescription: showDescription || false,
    align: align ? align : 'center',
    color: color ? color : 'primary',
  };
  return (
    <div className='section-title'>
      <div className='container'>
        <div className={`align-${title.align} mx-auto`}>
          <h2 className='font-bold max-w-3xl'>{heading}</h2>
          {title.showDescription && (
            <p className='max-w-xl mt-2 leading-7 text-18base'>{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
type TitleProps = {
  heading: string;
  description: string;
  align?: 'left' | 'right' | 'center';
  color?: 'white' | 'primary';
  showDescription: boolean;
};

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
  console.error(error);
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
