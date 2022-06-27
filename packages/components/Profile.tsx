import { ISEAPair } from 'gun';
import React, { ChangeEventHandler } from 'react';
import { Form, Link } from 'remix';
import { SubmitButton } from '~/app/routes/$namespace';
import { ImageCard } from '../app/routes/index';
import debug from '~/app/debug';
import { ContentEditable } from '~/components/ContentEditable';
let { log, error, opt, warn } = debug({ devOnly: true });
export type SocialLinkType = {
  href: string;
  color:
    | 'white'
    | 'gray'
    | 'red'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'indigo';
  title: string;
  svgPath: string;
}[];
type ColorChoice =
  | 'white'
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'indigo';
const colors = {
  white:
    'bg-white border border-cnxt_red shadow-sm hover:bg-gradient-to-t hover:from-cnxt_red hover:via-gray-100 hover:to-red-300 ',
  gray: 'bg-white border border-slate-800 shadow-sm hover:bg-gradient-to-t hover:from-slate-500 hover:via-gray-100 hover:to-slate-200 ',
  red: 'bg-white border border-cnxt_red shadow-sm hover:bg-gradient-to-t hover:from-cnxt_red hover:via-gray-100 hover:to-red-300 ',
  yellow:
    'bg-white border border-yellow-500 shadow-sm hover:bg-gradient-to-t hover:from-yellow-700 hover:via-gray-100 hover:to-yellow-300 ',
  green:
    'bg-white border border-green-500 shadow-sm hover:bg-gradient-to-t hover:from-green-700 hover:via-gray-100 hover:to-green-300 ',
  blue: 'bg-white border border-cnxt_blue shadow-sm hover:bg-gradient-to-t hover:from-cnxt_blue hover:via-gray-100 hover:to-blue-300 ',
  indigo:
    'bg-white border border-indigo-500 shadow-sm hover:bg-gradient-to-t hover:from-indigo-700 hover:via-gray-100 hover:to-indigo-300 ',
  purple:
    'bg-white border border-purple-500 shadow-sm hover:bg-gradient-to-t hover:from-purple-700 hover:via-gray-100 hover:to-purple-300 ',
  pink: 'bg-white border border-pink-500 shadow-sm hover:bg-gradient-to-t hover:from-pink-700 hover:via-gray-100 hover:to-pink-300 ',
};

export const TagTemplate = ({
  prefix,
  tag,
  color,
}: {
  prefix: string;
  tag: string;
  color: ColorChoice;
}) => (
  <>
    <code
      className={`${colors[color]} text-sm hover:shadow-md hover:shadow-gray-500 transition-all px-2 py-.5 rounded-md`}
    >
      <Link to={`/${tag}`}>
        <span
          key={prefix}
          className={`font-italic font-semibold  pr-1`}
        >{`${prefix}://`}</span>
        <span key={tag} className={`font-semibold `}>{`${tag}`}</span>
      </Link>
    </code>{' '}
  </>
);

export default function Profile({
  title,
  description,
  profilePic,
  onImageUpload,
  backgroundImage,
  button,
  keypair,
  socials,
}: {
  title: string;
  description: string;
  profilePic: string;
  backgroundImage?: string;
  button: {
    label: string;
    color:
      | 'white'
      | 'gray'
      | 'red'
      | 'yellow'
      | 'green'
      | 'blue'
      | 'purple'
      | 'pink'
      | 'indigo';
    to: string;
  }[];
  onImageUpload?: (e: Event) => void;
  keypair?: ISEAPair;
  socials: SocialLinkType;
}) {
  const [edit, setEdit] = React.useState(false);
  return (
    <div className=' font-sans antialiased bg-gradient-to-tr from-cnxt_red via-white to-transparent text-gray-900 leading-normal tracking-wider bg-cover'>
      <div className='p-5 font-sans antialiased bg-gradient-to-b from-cnxt_black via-blue-400 to-cnxt_blue text-gray-900 leading-normal tracking-wider bg-cover'>
        {' '}
        <div className='py-10 mt-10 font-sans antialiased bg-gradient-to-tr from-slate-900 via-transparent to-cnxt_red text-gray-900 leading-normal tracking-wider bg-cover'>
          <div className='max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0'>
            <div
              id='profile'
              className='w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0'
            >
              <div className='p-4 md:p-12 text-center lg:text-left'>
                <div
                  className='block lg:hidden rounded-lg  mx-auto -mt-16 h-48 w-48 bg-cover bg-center'
                  style={{
                    backgroundImage: `url(${profilePic})`,
                  }}
                ></div>

                <Form className='col-span-6 flex h-full flex-col items-center justify-center py-10 md:items-start md:py-20 xl:col-span-4'>
                  <button
                    onClick={() => setEdit(!edit)}
                    className={`${
                      edit ? 'bg-cnxt_blue' : 'bg-cnxt_red'
                    } text-light-200 text-xs transition-all px-2 py-.5 rounded-full`}
                  >
                    {edit ? 'Done' : 'Edit Title & Description'}
                  </button>
                  <ContentEditable
                    className={` mb-6 text-center text-5xl  md:text-left lg:text-6xl xl:text-7xl focus:border focus:border-rounded-md p-2 focus:font-italic focus:border-green-500 focus:outline-none`}
                    edit={edit}
                    name={`title`}
                    id={`PROFILE`}
                  >
                    {title}
                  </ContentEditable>

                  <ContentEditable
                    edit={edit}
                    name={'description'}
                    id={`PROFILE`}
                    className='mb-8 text-center text-lg md:text-left'
                  >
                    {description.split(' ' || '\n').map((curr) => {
                      let _p = curr.charAt(0);
                      let startsWith = (symbol: string) => _p === symbol;
                      let [prefix, namespace] = curr
                        .split(_p)
                        .map((s) => s.trim());

                      if (startsWith('@')) {
                        return (
                          <TagTemplate
                            prefix={'@'}
                            tag={namespace}
                            color='blue'
                          />
                        );
                      }
                      if (startsWith('#')) {
                        return (
                          <TagTemplate
                            prefix={'#'}
                            tag={namespace}
                            color='red'
                          />
                        );
                      }
                      if (startsWith('$')) {
                        return (
                          <TagTemplate
                            prefix={'$'}
                            tag={namespace}
                            color='green'
                          />
                        );
                      }
                      if (startsWith('!')) {
                        return (
                          <TagTemplate
                            prefix={'!'}
                            tag={namespace}
                            color='yellow'
                          />
                        );
                      }
                      if (startsWith('*')) {
                        return (
                          <TagTemplate
                            prefix={'*'}
                            tag={namespace}
                            color='indigo'
                          />
                        );
                      } else {
                        return curr + ' ';
                      }
                    })}
                  </ContentEditable>
                  <SubmitButton label={'Submit'} />
                  <div className='flex space-x-4'>
                    {button.map(({ to, label, color }) => (
                      <Link
                        to={to}
                        key={label}
                        className={` w-36 rounded-full py-3 px-8 text-center font-semibold text-white transition-all shadow-white-volume`}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </Form>

                <div className='mt-6 pb-16 lg:pb-0 w-4/5 lg:w-full mx-auto flex flex-wrap items-end justify-between'>
                  <SocialLinks socials={socials} />
                </div>
              </div>
            </div>

            <div className='w-full lg:w-2/5 pl-4'>
              <img
                src={profilePic}
                className='rounded-none lg:rounded-lg hidden lg:block'
              />
            </div>
          </div>
        </div>
      </div>
      <ImageCard src={backgroundImage} />
    </div>
  );
}

const hcolor = {
  white: 'hover:text-white-500',
  gray: 'hover:text-gray-200',
  red: 'hover:text-red-200',
  yellow: 'hover:text-yellow-200',
  green: 'hover:text-green-200',
  blue: 'hover:text-blue-500',
  indigo: 'hover:text-indigo-200',
  purple: 'hover:text-purple-200',
  pink: 'hover:text-pink-200',
};
export const SocialLinks = ({ socials }: { socials: SocialLinkType }) => {
  return (
    <>
      {socials.map(({ href, title, color, svgPath }) => {
        return (
          <li key={title}>
            <a href={href}>
              <svg
                className={`h-6 fill-current text-gray-600 ${hcolor[color]}`}
                role='img'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <title>{title}</title>
                <path d={svgPath} />
              </svg>
            </a>
          </li>
        );
      })}
      {/* <a className='link' href='http://twitter.com/bresnow'>
        <svg
          className='h-6 fill-current text-gray-600 hover:text-green-700'
          role='img'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <title>Twitter</title>
          <path d= />
        </svg>
      </a>

      <a className='link' href='#'>
        <svg
          className='h-6 fill-current text-gray-600 hover:text-green-700'
          role='img'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <title>Unsplash</title>
          <path d='M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z' />
        </svg>
      </a>
      <a className='link' href='#'>
        <svg
          className='h-6 fill-current text-gray-600 hover:text-green-700'
          role='img'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <title>Dribbble</title>
          <path d='M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z' />
        </svg>
      </a>
      <a className='link' href='#'>
        <svg
          className='h-6 fill-current text-gray-600 hover:text-green-700'
          role='img'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <title>Instagram</title>
          <path d='M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z' />
        </svg>
      </a>
      <a className='link' href='#'>
        <svg
          className='h-6 fill-current text-gray-600 hover:text-green-700'
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
        >
          <title>YouTube</title>
          <path d='M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' />
        </svg>
      </a> */}
    </>
  );
};
