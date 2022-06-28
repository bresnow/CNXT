import { Suspense } from 'react';
import { Form, Link, useLoaderData, useActionData } from 'remix';
import type { LoaderFunction } from 'remix';
import Gun from 'gun';
import { useFetcherAsync } from '~/rmxgun-context/useFetcherAsync';
import React from 'react';
import Profile from '~/components/Profile';
type LoaderData = {
  username: string;
};
type IGetItem = () => {
  title: string;
  author: string;
  postedAt: { date: string; slug: string };
  slug: string;
  image: { src: string };
}[];

export let loader: LoaderFunction = () => {
  return {
    username: 'Remix',
  };
};

function SuspendedProfileInfo({ getData }: { getData: () => any }) {
  let data = getData();

  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

export default function ProfileRoute() {
  let { username } = useLoaderData<LoaderData>();

  return (
    <>
      <BlogCard />
    </>
  );
}

type BlogCard = {
  title: string;
  author: string;
  date: string;
  slug: string;
  dateSlug: string;
  image: string;
};

export const BlogCard = () => {
  let action = useActionData();
  React.useEffect(() => {
    if (action) {
      console.log(action);
    }
  }, [action]);
  return (
    <div className='mt-10 font-sans antialiased bg-gradient-to-tr from-red-600  via-white to-transparent text-gray-900 leading-normal tracking-wider bg-cover'>
      <div className='p-5 font-sans antialiased bg-gradient-to-l from-transparent via-white to-blue-500 text-gray-900 leading-normal tracking-wider bg-cover'>
        {' '}
        <div className='p-5 font-sans antialiased bg-gradient-to-br from-slate-900 via-transparent to-red-600 text-gray-900 leading-normal tracking-wider bg-cover'>
          {/* <!-- Create --> */}
          <section className='relative py-24'>
            <picture className='pointer-events-none absolute inset-0 -z-10 dark:hidden'>
              <img
                src='/images/gradient1.webp'
                alt='gradient'
                className='h-full w-full'
              />
            </picture>
            <div className='container'>
              <h1 className='font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white'>
                Create
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
          </section>
          {/* <!-- end create --> */}
        </div>
      </div>
    </div>
  );
};
