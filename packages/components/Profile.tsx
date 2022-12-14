import { ISEAPair } from 'gun';
import React, { ChangeEventHandler } from 'react';
import { Form, Link } from 'remix';
import { SubmitButton } from '~/app/routes/$namespace';
import { ImageCard } from '../app/routes/index';
import debug from '~/app/lib/debug';
import { ContentEditable } from '~/components/ContentEditable';
let { log, error, opt, warn } = debug({ dev: true });
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
      <Link to={`/${tag.replace(/[\!\$\#\$\%\^\&\*\:\/\\\?\&\=]/g, '')}`}>
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

          <div className='col-span-6 flex h-full flex-col items-center justify-center py-10 md:items-start md:py-20 xl:col-span-4'>
            <div
              onClick={() => setEdit(!edit)}
              className={`${
                edit ? 'bg-cnxt_blue' : 'bg-cnxt_red'
              } text-light-200 text-xs transition-all px-2 py-.5 rounded-full`}
            >
              {edit ? 'Done' : 'Edit Title & Description'}
            </div>
            <ContentEditable
              className={` mb-6 text-center text-5xl ${
                edit &&
                'bg-gray-300 font-italic rounded-md focus:border focus:border-rounded-md p-2 focus:border-green-500  focus:outline-none'
              } md:text-left lg:text-6xl xl:text-7xl`}
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
              className={`mb-8 text-center text-lg md:text-left ${
                edit &&
                'bg-gray-300 font-italic rounded-md focus:border focus:border-rounded-md p-2 focus:border-green-500  focus:outline-none'
              }`}
            >
              {description.split(' ' || '\n').map((curr) => {
                let _p = curr.charAt(0);
                let startsWith = (symbol: string) => _p === symbol;
                let [prefix, namespace] = curr.split(_p).map((s) => s.trim());

                if (startsWith('@')) {
                  return (
                    <TagTemplate
                      key={'@' + namespace}
                      prefix={'@'}
                      tag={namespace}
                      color='blue'
                    />
                  );
                }
                if (startsWith('#')) {
                  return (
                    <TagTemplate
                      key={'#' + namespace}
                      prefix={'#'}
                      tag={namespace}
                      color='red'
                    />
                  );
                }
                if (startsWith('$')) {
                  return (
                    <TagTemplate
                      key={'$' + namespace}
                      prefix={'$'}
                      tag={namespace}
                      color='green'
                    />
                  );
                }
                if (startsWith('!')) {
                  return (
                    <TagTemplate
                      key={'!' + namespace}
                      prefix={'!'}
                      tag={namespace}
                      color='yellow'
                    />
                  );
                }
                if (startsWith('*')) {
                  return (
                    <TagTemplate
                      key={'*' + namespace}
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

            {/* <picture className='pointer-events-none absolute inset-0 -z-10 dark:hidden'>
              <img
                src='/images/gradient1.webp'
                alt='gradient'
                className='h-full w-full'
              />
            </picture> */}
            <div className='container'>
              <h1 className='font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white'>
                {title}
              </h1>

              <div className='mx-auto max-w-[48.125rem]'>
                {/* <!-- File Upload --> */}

                <div className='mb-6'>
                  <label className='font-display text-jacarta-700 mb-2 block dark:text-white'>
                    Image, Video, Audio, or 3D Model
                    <span className='text-red'>*</span>
                  </label>
                  <p className='dark:text-jacarta-300 text-2xs mb-3'>
                    Drag or choose your file to upload
                  </p>

                  <div className='group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center'>
                    <div className='relative z-10 cursor-pointer'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='fill-jacarta-500 mb-4 inline-block dark:fill-white'
                      >
                        <path fill='none' d='M0 0h24v24H0z' />
                        <path d='M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z' />
                      </svg>
                      <p className='dark:text-jacarta-300 mx-auto max-w-xs text-xs'>
                        JPG, PNG, GIF, SVG, WEBP Max size: 100 MB
                        {/* MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. */}
                      </p>
                    </div>
                    <div className='absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100'></div>
                    <input
                      type='file'
                      accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                      id='file-upload'
                      className='absolute inset-0 z-20 cursor-pointer opacity-0'
                    />
                  </div>
                </div>
                <button
                  type={'submit'}
                  name={'test'}
                  id={'test-budden'}
                  value={'butt-Mahm'}
                >
                  {'TEST BUDDEN'}
                </button>

                {/* <!-- Name --> */}
                <div className='mb-6'>
                  <label className='font-display text-jacarta-700 mb-2 block dark:text-white'>
                    Name<span className='text-red'>*</span>
                  </label>
                  <input
                    type='text'
                    id='item-name'
                    className='hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white'
                    placeholder='Item name'
                    required
                  />
                </div>

                {/* <!-- External Link --> */}
                <div className='mb-6'>
                  <label className='font-display text-jacarta-700 mb-2 block dark:text-white'>
                    External link
                  </label>
                  <p className='dark:text-jacarta-300 text-2xs mb-3'>
                    We will include a link to this URL on this item's detail
                    page, so that users can click to learn more about it. You
                    are welcome to link to your own webpage with more details.
                  </p>
                  <input
                    type='url'
                    id='item-external-link'
                    className='hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white'
                    placeholder='https://yoursite.io/item/123'
                  />
                </div>

                {/* <!-- Description --> */}
                <div className='mb-6'>
                  <label className='font-display text-jacarta-700 mb-2 block dark:text-white'>
                    Description
                  </label>
                  <p className='dark:text-jacarta-300 text-2xs mb-3'>
                    The description will be included on the item's detail page
                    underneath its image. Markdown syntax is supported.
                  </p>
                  <textarea
                    id='item-description'
                    className='hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white'
                    rows={4}
                    required
                    placeholder='Provide a detailed description of your item.'
                  ></textarea>
                </div>

                {/* <!-- Collection --> */}
                <div className='relative'>
                  <div>
                    <label className='font-display text-jacarta-700 mb-2 block dark:text-white'>
                      Collection
                    </label>
                    <div className='mb-3 flex items-center space-x-2'>
                      <p className='dark:text-jacarta-300 text-2xs'>
                        This is the collection where your item will appear.
                        <span
                          className='inline-block'
                          data-tippy-content='Moving items to a different collection may take up to 30 minutes.'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            width='24'
                            height='24'
                            className='dark:fill-jacarta-300 fill-jacarta-500 ml-1 -mb-[3px] h-4 w-4'
                          >
                            <path fill='none' d='M0 0h24v24H0z'></path>
                            <path d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z'></path>
                          </svg>
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className='dropdown my-1 cursor-pointer'>
                    <div
                      className='jacarta-100 dark:border-jacarta-600 dark:text-jacarta-300 flex items-center justify-between rounded-lg border bg-white py-3 px-3'
                      role='button'
                      id='item-collection'
                      data-bs-toggle='dropdown'
                      aria-expanded='false'
                    >
                      <span className=''>Select collection</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='fill-jacarta-500 h-4 w-4 dark:fill-white'
                      >
                        <path fill='none' d='M0 0h24v24H0z' />
                        <path d='M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z' />
                      </svg>
                    </div>

                    <div
                      className='dropdown-menu -full whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl'
                      aria-labelledby='item-collection'
                    >
                      <ul className='scrollbar-custom flex max-h-48 flex-col overflow-y-auto'>
                        <li>
                          <a
                            href='#'
                            className='dropdown-item font-display dark:flex justify-between rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white'
                          >
                            <span className='flex items-center space-x-3'>
                              <img
                                src='/images/gradient.jpg'
                                className='h-8 w-8 rounded-full'
                                loading='lazy'
                                alt='avatar'
                              />
                              <span className='text-jacarta-700 dark:text-white'>
                                CryptoKitties
                              </span>
                            </span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 24 24'
                              width='24'
                              height='24'
                              className='fill-accent mb-[3px] h-4 w-4'
                            >
                              <path fill='none' d='M0 0h24v24H0z'></path>
                              <path d='M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z'></path>
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a
                            href='#'
                            className='dropdown-item font-display dark:flex rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white'
                          >
                            <span className='flex items-center space-x-3'>
                              <img
                                src='/images/gradient1.jpg'
                                className='h-8 w-8 rounded-full'
                                loading='lazy'
                                alt='avatar'
                              />
                              <span className='text-jacarta-700 dark:text-white'>
                                KaijuKings
                              </span>
                            </span>
                          </a>
                        </li>
                        <li>
                          <a
                            href='#'
                            className='dropdown-item font-display dark:flex rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white'
                          >
                            <span className='flex items-center space-x-3'>
                              <img
                                src='/images/gradient.jpg'
                                className='h-8 w-8 rounded-full'
                                loading='lazy'
                                alt='avatar'
                              />
                              <span className='text-jacarta-700 dark:text-white'>
                                Kumo x World
                              </span>
                            </span>
                          </a>
                        </li>
                        <li>
                          <a
                            href='#'
                            className='dropdown-item font-display dark:flex rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white'
                          >
                            <span className='flex items-center space-x-3'>
                              <img
                                src='/images/gradient1.jpg'
                                className='h-8 w-8 rounded-full'
                                loading='lazy'
                                alt='avatar'
                              />
                              <span className='text-jacarta-700 dark:text-white'>
                                Irene DAO
                              </span>
                            </span>
                          </a>
                        </li>
                        <li>
                          <a
                            href='#'
                            className='dropdown-item font-display dark:flex rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white'
                          >
                            <span className='flex items-center space-x-3'>
                              <img
                                src='img/avatars/collection_ava_5.png'
                                className='h-8 w-8 rounded-full'
                                loading='lazy'
                                alt='avatar'
                              />
                              <span className='text-jacarta-700 dark:text-white'>
                                GenerativeDungeon
                              </span>
                            </span>
                          </a>
                        </li>
                        <li>
                          <a
                            href='#'
                            className='dropdown-item font-display dark:flex rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white'
                          >
                            <span className='flex items-center space-x-3'>
                              <img
                                src='/images/gradient.jpg'
                                className='h-8 w-8 rounded-full'
                                loading='lazy'
                                alt='avatar'
                              />
                              <span className='text-jacarta-700 dark:text-white'>
                                ENS Domains
                              </span>
                            </span>
                          </a>
                        </li>
                        <li>
                          <a
                            href='#'
                            className='dropdown-item font-display dark:flex rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white'
                          >
                            <span className='flex items-center space-x-3'>
                              <img
                                src='img/avatars/collection_ava_7.png'
                                className='h-8 w-8 rounded-full'
                                loading='lazy'
                                alt='avatar'
                              />
                              <span className='text-jacarta-700 dark:text-white'>
                                Cozy Penguin
                              </span>
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* <!-- Properties --> */}
                <div className='dark:border-jacarta-600 border-jacarta-100 relative border-b py-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='fill-jacarta-700 mr-2 mt-px h-4 w-4 shrink-0 dark:fill-white'
                      >
                        <path fill='none' d='M0 0h24v24H0z' />
                        <path d='M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z' />
                      </svg>

                      <div>
                        <label className='font-display text-jacarta-700 block dark:text-white'>
                          Properties
                        </label>
                        <p className='dark:text-jacarta-300'>
                          Textual traits that show up as rectangles.
                        </p>
                      </div>
                    </div>
                    <button
                      className='group border-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-white hover:border-transparent'
                      type='button'
                      id='item-properties'
                      data-bs-toggle='modal'
                      data-bs-target='#propertiesModal'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='fill-accent group-hover:fill-white'
                      >
                        <path fill='none' d='M0 0h24v24H0z' />
                        <path d='M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z' />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* <!-- Levels --> */}
                <div className='dark:border-jacarta-600 border-jacarta-100 relative border-b py-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='fill-jacarta-700 mr-2 mt-px h-4 w-4 shrink-0 dark:fill-white'
                      >
                        <path fill='none' d='M0 0h24v24H0z' />
                        <path d='M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z' />
                      </svg>

                      <div>
                        <label className='font-display text-jacarta-700 block dark:text-white'>
                          Levels
                        </label>
                        <p className='dark:text-jacarta-300'>
                          Numerical traits that show as a progress bar.
                        </p>
                      </div>
                    </div>
                    <button
                      className='group border-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-white hover:border-transparent'
                      type='button'
                      id='item-levels'
                      data-bs-toggle='modal'
                      data-bs-target='#levelsModal'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='fill-accent group-hover:fill-white'
                      >
                        <path fill='none' d='M0 0h24v24H0z' />
                        <path d='M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z' />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* <!-- Stats --> */}
                <div className='dark:border-jacarta-600 border-jacarta-100 relative border-b py-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='fill-jacarta-700 mr-2 mt-px h-4 w-4 shrink-0 dark:fill-white'
                      >
                        <path fill='none' d='M0 0h24v24H0z' />
                        <path d='M2 13h6v8H2v-8zM9 3h6v18H9V3zm7 5h6v13h-6V8z' />
                      </svg>

                      <div>
                        <label className='font-display text-jacarta-700 block dark:text-white'>
                          Stats
                        </label>
                        <p className='dark:text-jacarta-300'>
                          Numerical traits that just show as numbers.
                        </p>
                      </div>
                    </div>
                    <button
                      className='group border-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-white hover:border-transparent'
                      type='button'
                      id='item-stats'
                      data-bs-toggle='modal'
                      data-bs-target='#levelsModal'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='fill-accent group-hover:fill-white'
                      >
                        <path fill='none' d='M0 0h24v24H0z' />
                        <path d='M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z' />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* <!-- Unlockable Content --> */}
                <div className='dark:border-jacarta-600 border-jacarta-100 relative border-b py-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='fill-accent mr-2 mt-px h-4 w-4 shrink-0'
                      >
                        <path fill='none' d='M0 0h24v24H0z' />
                        <path d='M7 10h13a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 0 1 13.262-3.131l-1.789.894A5 5 0 0 0 7 9v1zm-2 2v8h14v-8H5zm5 3h4v2h-4v-2z' />
                      </svg>

                      <div>
                        <label className='font-display text-jacarta-700 block dark:text-white'>
                          Unlockable Content
                        </label>
                        <p className='dark:text-jacarta-300'>
                          Include unlockable content that can only be revealed
                          by the owner of the item.
                        </p>
                      </div>
                    </div>
                    <input
                      type='checkbox'
                      value='checkbox'
                      name='check'
                      className='checked:bg-accent checked:focus:bg-accent checked:hover:bg-accent relative h-6 w-[2.625rem] cursor-pointer appearance-none rounded-full border-none after:absolute after:top-[0.1875rem] after:left-[0.1875rem] after:h-[1.125rem] after:w-[1.125rem] after:rounded-full after:transition-all checked:bg-none checked:after:left-[1.3125rem] checked:after:bg-white focus:ring-transparent focus:ring-offset-0'
                    />
                  </div>
                </div>

                {/* <!-- Explicit & Sensitive Content --> */}
                <div className='dark:border-jacarta-600 border-jacarta-100 relative mb-6 border-b py-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='fill-jacarta-700 mr-2 mt-px h-4 w-4 shrink-0 dark:fill-white'
                      >
                        <path fill='none' d='M0 0h24v24H0z' />
                        <path d='M12.866 3l9.526 16.5a1 1 0 0 1-.866 1.5H2.474a1 1 0 0 1-.866-1.5L11.134 3a1 1 0 0 1 1.732 0zM11 16v2h2v-2h-2zm0-7v5h2V9h-2z' />
                      </svg>

                      <div>
                        <label className='font-display text-jacarta-700 dark:text-white'>
                          Explicit & Sensitive Content
                        </label>

                        <p className='dark:text-jacarta-300'>
                          Set this item as explicit and sensitive content.
                          <span
                            className='inline-block'
                            data-tippy-content='Setting your asset as explicit and sensitive content, like pornography and other not safe for work (NSFW) content, will protect users with safe search while browsing Xhibiter.'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 24 24'
                              width='24'
                              height='24'
                              className='dark:fill-jacarta-300 fill-jacarta-500 ml-2 -mb-[2px] h-4 w-4'
                            >
                              <path fill='none' d='M0 0h24v24H0z'></path>
                              <path d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z'></path>
                            </svg>
                          </span>
                        </p>
                      </div>
                    </div>
                    <input
                      type='checkbox'
                      value='checkbox'
                      name='check'
                      className='checked:bg-accent checked:focus:bg-accent checked:hover:bg-accent relative h-6 w-[2.625rem] cursor-pointer appearance-none rounded-full border-none after:absolute after:top-[0.1875rem] after:left-[0.1875rem] after:h-[1.125rem] after:w-[1.125rem] after:rounded-full after:transition-all checked:bg-none checked:after:left-[1.3125rem] checked:after:bg-white focus:ring-transparent focus:ring-offset-0'
                    />
                  </div>
                </div>

                {/* <!-- Supply --> */}
                <div className='mb-6'>
                  <label className='font-display text-jacarta-700 mb-2 block dark:text-white'>
                    Supply
                  </label>

                  <div className='mb-3 flex items-center space-x-2'>
                    <p className='dark:text-jacarta-300 text-2xs'>
                      The number of items that can be minted. No gas cost to
                      you!
                      <span
                        className='inline-block'
                        data-tippy-content='Setting your asset as explicit and sensitive content, like pornography and other not safe for work (NSFW) content, will protect users with safe search while browsing Xhibiter.'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          width='24'
                          height='24'
                          className='dark:fill-jacarta-300 fill-jacarta-500 ml-1 -mb-[3px] h-4 w-4'
                        >
                          <path fill='none' d='M0 0h24v24H0z'></path>
                          <path d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z'></path>
                        </svg>
                      </span>
                    </p>
                  </div>

                  <input
                    type='text'
                    id='item-supply'
                    className='hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white'
                    placeholder='1'
                  />
                </div>

                {/* <!-- Blockchain --> */}
                <div className='mb-6'>
                  <label className='font-display text-jacarta-700 mb-2 block dark:text-white'>
                    Blockchain
                  </label>

                  <div className='dropdown relative mb-4 cursor-pointer'>
                    <div
                      className='jacarta-100 dark:border-jacarta-600 flex items-center justify-between rounded-lg border bg-white py-3.5 px-3 text-base dark:text-white'
                      role='button'
                      id='item-blockchain'
                      data-bs-toggle='dropdown'
                      aria-expanded='false'
                    >
                      <span className='flex items-center'>
                        <img
                          src='/images/gradient.jpg'
                          alt='eth'
                          className='mr-2 h-5 w-5 rounded-full'
                        />
                        Ethereum
                      </span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='fill-jacarta-500 h-4 w-4 dark:fill-white'
                      >
                        <path fill='none' d='M0 0h24v24H0z'></path>
                        <path d='M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z'></path>
                      </svg>
                    </div>

                    <div
                      className='dropdown-menu -full whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl'
                      aria-labelledby='item-blockchain'
                    >
                      <button className='dropdown-item text-jacarta-700 dark:flex justify-between rounded-xl px-5 py-2 text-left text-base transition-colors dark:text-white'>
                        <span className='flex items-center'>METRICTOKEN</span>
                      </button>
                      <button className='dropdown-item dark:flex justify-between rounded-xl px-5 py-2 text-left text-base transition-colors dark:text-white'>
                        <span className='flex items-center'>
                          <img
                            src='/images/gradient1.jpg'
                            alt='flow'
                            className='mr-2 h-5 w-5 rounded-full'
                          />
                          Stellar
                        </span>
                      </button>

                      <button className='dropdown-item dark:flex justify-between rounded-xl px-5 py-2 text-left text-base transition-colors dark:text-white'>
                        <span className='flex items-center'>
                          <img
                            src='/images/gradient.jpg'
                            alt='fusd'
                            className='mr-2 h-5 w-5 rounded-full'
                          />
                          AUSD
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* <!-- Freeze metadata --> */}
                <div className='mb-6'>
                  <div className='mb-2 flex items-center space-x-2'>
                    <label className='font-display text-jacarta-700 block dark:text-white'>
                      Freeze metadata
                    </label>
                    <span
                      className='inline-block'
                      data-tippy-content='Setting your asset as explicit and sensitive content, like pornography and other not safe for work (NSFW) content, will protect users with safe search while browsing Xhibiter.'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='dark:fill-jacarta-300 fill-jacarta-500 mb-[2px] h-5 w-5'
                      >
                        <path fill='none' d='M0 0h24v24H0z'></path>
                        <path d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z'></path>
                      </svg>
                    </span>
                  </div>

                  <p className='dark:text-jacarta-300 text-2xs mb-3'>
                    Freezing your metadata will allow you to permanently lock
                    and store all of this item's content in decentralized file
                    storage.
                  </p>

                  <input
                    type='text'
                    disabled
                    id='item-freeze-metadata'
                    className='border-jacarta-100 dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 dark:text-white'
                    placeholder='To freeze your metadata, you must create your item first.'
                  />
                </div>

                {/* <!-- Submit --> */}
                <button
                  disabled
                  className='bg-accent-lighter cursor-default rounded-full py-3 px-8 text-center font-semibold text-white transition-all'
                >
                  Create
                </button>
              </div>
            </div>

            <div className='flex space-x-4'>
              {button.map(({ to, label, color }) => (
                <Link
                  to={to}
                  key={label}
                  className={` w-36 rounded-full py-3 px-8 text-center font-semibold text-white transition-all shadow-white-volume`}
                >
                  <span className='flex items-center space-x-3'>
                    <img
                      src='/images/gradient.jpg'
                      className='h-8 w-8 rounded-full'
                      loading='lazy'
                      alt='avatar'
                    />
                    <span className='text-jacarta-700 dark:text-white'>
                      Development Environment
                    </span>
                  </span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    width='24'
                    height='24'
                    className='fill-accent mb-[3px] h-4 w-4'
                  >
                    <path fill='none' d='M0 0h24v24H0z'></path>
                    <path d='M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z'></path>
                  </svg>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {edit && (
            <button
              name={'submit'}
              className={`bg-cnxt_red text-light-200 text-md transition-all py-2 px-4 rounded-full`}
            >
              {'Submit'}
            </button>
          )}
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
            <svg
              className={`h-6 fill-current text-gray-600 ${hcolor[color]}`}
              role='img'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <title>{title}</title>
              <path d={svgPath} />
            </svg>
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
      </div>

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
      </div>
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
      </div>
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
      </div>
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
      </div> */}
    </>
  );
};
