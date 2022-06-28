import React from 'react';
import { useMatches, useLocation, NavLink, Link, Form } from 'remix';
import { MenuLinks } from '@/root';
import InputText, { InputTextProps } from './InputText';

const ACTION_TYPE = {
  MENU_CLOSE: 'MENU_CLOSE',
  MENU_COLLAPSE: 'MENU_COLLAPSE',
  USER_MENU: 'USER_MENU',
};
function reduce(
  state: any,
  { type }: { type: 'MENU_CLOSE' | 'MENU_COLLAPSE' | 'USER_MENU' }
) {
  switch (type) {
    case ACTION_TYPE.MENU_CLOSE:
      return {
        ...state,
        menu_close: !state.menu_close,
      };
    case ACTION_TYPE.MENU_COLLAPSE:
      return {
        ...state,
        menu_collapse: !state.menu_collapse,
      };
    case ACTION_TYPE.USER_MENU:
      return {
        ...state,
        user_menu: !state.user_menu,
      };
    default:
      return state;
  }
}
export function Navigation({
  search,
  logo,
  links,
}: {
  logo?: JSX.Element;
  search?: InputTextProps;
  links?: MenuLinks;
}) {
  let matches = useMatches();
  let root = matches.find((match) => match.pathname === '/');
  const menuarr: MenuLinks = links || root?.handle?.links;
  let { pathname } = useLocation();
  const isActive = (link: string) => pathname === link;
  const [ofcanvasOpen, ofcanvasDispatch] = React.useReducer(reduce, {
    menu_close: false,
    menu_collapse: false,
    user_menu: false,
  });
  search = {
    type: 'search',
    required: true,
    name: 'path',
    shadow: true,

    ...search,
  } || { ...search };
  return (
    <header className='fixed top-0 z-20 w-full backdrop-blur bg-opacity-20 transition-colors'>
      <div className='flex items-center px-6 py-6 xl:px-24'>
        {/* <!-- Logo --> */}
        {logo}

        {/* <!-- Search --> */}
        <Form
          method={'get'}
          action='search'
          className='relative ml-12 mr-8 hidden basis-3/12 lg:block xl:ml-[8%]'
        >
          <input
            className='text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-[0.6875rem] px-4 pl-10 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white'
            placeholder='Search'
          />
          <span className='absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='24'
              height='24'
              className=' h-4 w-4 dark:fill-white'
            >
              <path fill='none' d='M0 0h24v24H0z' />
              <path d='M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z' />
            </svg>
          </span>
        </Form>

        {/* <!-- Menu / Actions --> */}
        <div className=' invisible fixed inset-0 z-10 ml-auto items-center bg-white opacity-0 lg:visible lg:relative lg:inset-auto lg:flex lg:bg-transparent lg:opacity-100 dark:lg:bg-transparent'>
          {/* <!-- Mobile Logo / Menu Close --> */}
          <div className=' fixed left-0 z-10 flex w-full items-center justify-between bg-white p-6 lg:hidden'>
            {/* <!-- Mobile Logo --> */}

            {logo}

            {/* <!-- Mobile Menu Close --> */}
            <button
              className='js-mobile-close border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]'
              aria-label='close mobile menu'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='24'
                height='24'
                className='fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white'
              >
                <path fill='none' d='M0 0h24v24H0z' />
                <path d='M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z' />
              </svg>
            </button>
          </div>

          {/* <!-- Mobile Search --> */}
          <form
            action='search'
            className='relative mt-24 mb-8 w-full lg:hidden'
          >
            <input
              type='search'
              className='text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-3 px-4 pl-10 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white'
              placeholder='Search'
            />
            <span className='absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='24'
                height='24'
                className='fill-jacarta-500 h-4 w-4 dark:fill-white'
              >
                <path fill='none' d='M0 0h24v24H0z' />
                <path d='M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z' />
              </svg>
            </span>
          </form>

          {/* <!-- Actions --> */}
          <div className='ml-8 hidden lg:flex xl:ml-12'>
            {/* <!-- Wallet --> */}
            <a
              href='#'
              className='js-wallet border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]'
              data-bs-toggle='modal'
              data-bs-target='#walletModal'
              aria-label='wallet'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='24'
                height='24'
                className='fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white'
              >
                <path fill='none' d='M0 0h24v24H0z' />
                <path d='M22 6h-7a6 6 0 1 0 0 12h7v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2zm-7 2h8v8h-8a4 4 0 1 1 0-8zm0 3v2h3v-2h-3z' />
              </svg>
            </a>

            {/* <!-- Profile --> */}
            <div className='js-nav-dropdown group-dropdown relative'>
              <button
                className='dropdown-toggle border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]'
                id='profileDropdown'
                aria-expanded='false'
                aria-label='profile'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                  className='fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white'
                >
                  <path fill='none' d='M0 0h24v24H0z' />
                  <path d='M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z' />
                </svg>
              </button>
              <div
                className='dropdown-menu dark:bg-jacarta-800 group-dropdown-hover:opacity-100 group-dropdown-hover:visible !-right-4 !top-[85%] !left-auto z-10 hidden min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:invisible lg:absolute lg:grid lg:!translate-y-4 lg:py-4 lg:px-2 lg:opacity-0 lg:shadow-2xl'
                aria-labelledby='profileDropdown'
              >
                <button
                  className='js-copy-clipboard font-display text-jacarta-700 my-4 flex select-none items-center whitespace-nowrap px-5 leading-none dark:text-white'
                  data-tippy-content='Copy'
                >
                  <span className='max-w-[10rem] overflow-hidden text-ellipsis'>
                    0x7a86c0b064171007716bbd6af96676935799a63e
                  </span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    width='24'
                    height='24'
                    className='dark:fill-jacarta-300 fill-jacarta-500 ml-1 mb-px h-4 w-4'
                  >
                    <path fill='none' d='M0 0h24v24H0z' />
                    <path d='M7 7V3a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-4v3.993c0 .556-.449 1.007-1.007 1.007H3.007A1.006 1.006 0 0 1 2 20.993l.003-12.986C2.003 7.451 2.452 7 3.01 7H7zm2 0h6.993C16.549 7 17 7.449 17 8.007V15h3V4H9v3zM4.003 9L4 20h11V9H4.003z' />
                  </svg>
                </button>

                <div className='dark:border-jacarta-600 border-jacarta-100 mx-5 mb-6 rounded-lg border p-4'>
                  <span className='dark:text-jacarta-200 text-sm font-medium tracking-tight'>
                    Balance
                  </span>
                  <div className='flex items-center'>
                    <svg
                      version='1.1'
                      xmlns='http://www.w3.org/2000/svg'
                      x='0'
                      y='0'
                      viewBox='0 0 1920 1920'
                      xmlSpace='preserve'
                      className='-ml-1 mr-1 h-[1.125rem] w-[1.125rem]'
                    >
                      <path
                        fill='#8A92B2'
                        d='M959.8 80.7L420.1 976.3 959.8 731z'
                      ></path>
                      <path
                        fill='#62688F'
                        d='M959.8 731L420.1 976.3l539.7 319.1zm539.8 245.3L959.8 80.7V731z'
                      ></path>
                      <path
                        fill='#454A75'
                        d='M959.8 1295.4l539.8-319.1L959.8 731z'
                      ></path>
                      <path
                        fill='#8A92B2'
                        d='M420.1 1078.7l539.7 760.6v-441.7z'
                      ></path>
                      <path
                        fill='#62688F'
                        d='M959.8 1397.6v441.7l540.1-760.6z'
                      ></path>
                    </svg>
                    <span className='text-green text-lg font-bold'>10 ETH</span>
                  </div>
                </div>
                <a
                  href='user.html'
                  className='dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    width='24'
                    height='24'
                    className='fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white'
                  >
                    <path fill='none' d='M0 0h24v24H0z'></path>
                    <path d='M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z'></path>
                  </svg>
                  <span className='font-display text-jacarta-700 mt-1 text-sm dark:text-white'>
                    My Profile
                  </span>
                </a>
                <a
                  href='edit-profile.html'
                  className='dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    width='24'
                    height='24'
                    className='fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white'
                  >
                    <path fill='none' d='M0 0h24v24H0z' />
                    <path d='M9.954 2.21a9.99 9.99 0 0 1 4.091-.002A3.993 3.993 0 0 0 16 5.07a3.993 3.993 0 0 0 3.457.261A9.99 9.99 0 0 1 21.5 8.876 3.993 3.993 0 0 0 20 12c0 1.264.586 2.391 1.502 3.124a10.043 10.043 0 0 1-2.046 3.543 3.993 3.993 0 0 0-3.456.261 3.993 3.993 0 0 0-1.954 2.86 9.99 9.99 0 0 1-4.091.004A3.993 3.993 0 0 0 8 18.927a3.993 3.993 0 0 0-3.457-.26A9.99 9.99 0 0 1 2.5 15.121 3.993 3.993 0 0 0 4 11.999a3.993 3.993 0 0 0-1.502-3.124 10.043 10.043 0 0 1 2.046-3.543A3.993 3.993 0 0 0 8 5.071a3.993 3.993 0 0 0 1.954-2.86zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' />
                  </svg>
                  <span className='font-display text-jacarta-700 mt-1 text-sm dark:text-white'>
                    Edit Profile
                  </span>
                </a>
                <a
                  href='#'
                  className='dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    width='24'
                    height='24'
                    className='fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white'
                  >
                    <path fill='none' d='M0 0h24v24H0z' />
                    <path d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM7 11V8l-5 4 5 4v-3h8v-2H7z' />
                  </svg>
                  <span className='font-display text-jacarta-700 mt-1 text-sm dark:text-white'>
                    Sign out
                  </span>
                </a>
              </div>
            </div>

            {/* <!-- Dark Mode --> */}
            <a
              href='#'
              className='border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent js-dark-mode-trigger ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='24'
                height='24'
                className='fill-jacarta-700 dark-mode-light h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:hidden'
              >
                <path fill='none' d='M0 0h24v24H0z' />
                <path d='M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z' />
              </svg>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='24'
                height='24'
                className='fill-jacarta-700 dark-mode-dark hidden h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:block dark:fill-white'
              >
                <path fill='none' d='M0 0h24v24H0z' />
                <path d='M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z' />
              </svg>
            </a>
          </div>
        </div>

        {/* <!-- Mobile Menu Actions --> */}
        <div className='ml-auto flex lg:hidden'>
          {/* <!-- Profile --> */}
          <a
            href='edit-profile.html'
            className='border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]'
            aria-label='profile'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='24'
              height='24'
              className='fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white'
            >
              <path fill='none' d='M0 0h24v24H0z' />
              <path d='M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z' />
            </svg>
          </a>

          {/* <!-- Dark Mode --> */}
          <a
            href='#'
            className='js-dark-mode-trigger border-jacarta-100 hover:bg-accent dark:hover:bg-accent focus:bg-accent group ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='24'
              height='24'
              className='fill-jacarta-700 dark-mode-light h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:hidden'
            >
              <path fill='none' d='M0 0h24v24H0z' />
              <path d='M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z' />
            </svg>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='24'
              height='24'
              className='fill-jacarta-700 dark-mode-dark hidden h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:block dark:fill-white'
            >
              <path fill='none' d='M0 0h24v24H0z' />
              <path d='M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z' />
            </svg>
          </a>

          {/* <!-- Mobile Menu Toggle --> */}
          <button
            className='js-mobile-toggle border-jacarta-100 hover:bg-accent dark:hover:bg-accent focus:bg-accent group ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]'
            aria-label='open mobile menu'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='24'
              height='24'
              className='fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white'
            >
              <path fill='none' d='M0 0h24v24H0z' />
              <path d='M18 18v2H6v-2h12zm3-7v2H3v-2h18zm-3-7v2H6V4h12z' />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
}