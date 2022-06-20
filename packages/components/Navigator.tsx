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
    <header className='fixed top-0 z-20 w-full backdrop-blur bg-slate-400 bg-opacity-20 transition-colors'>
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
  );
}

export const Menu = ({ links }: { links?: MenuLinks }) => {
  return (
    <>
      {/* <!-- Primary Nav --> */}
      <nav className=' w-full'>
        <ul className='flex flex-col lg:flex-row'>
          <li className=' relative'>
            <a
              href='#'
              className=' flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5'
              id='navDropdown-1'
              aria-expanded='false'
              role='button'
              data-bs-toggle='dropdown'
            >
              Home
              <i className='lg:hidden'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                  className='h-4 w-4 dark:fill-white'
                >
                  <path fill='none' d='M0 0h24v24H0z' />
                  <path d='M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z' />
                </svg>
              </i>
            </a>
            <ul
              className='dropdown-menu dark:bg-jacarta-800 left-0 top-[85%] z-10 hidden min-w-[200px] gap-x-4 whitespace-nowrap rounded-xl bg-white transition-all will-change-transform group-hover:visible group-hover:opacity-100 lg:invisible lg:absolute lg:grid lg:translate-y-4 lg:py-4 lg:px-2 lg:opacity-0 lg:shadow-2xl lg:group-hover:translate-y-2'
              aria-labelledby='navDropdown-1'
            >
              <li>
                <a
                  href='index.html'
                  className='dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Home 1
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='home-2.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Home 2
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='home-3.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Home 3
                  </span>
                </a>
              </li>
            </ul>
          </li>
          <li className=' relative'>
            <a
              href='#'
              className='dropdown-toggle text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5'
              id='navDropdown-2'
              aria-expanded='false'
              role='button'
              data-bs-toggle='dropdown'
            >
              Pages
              <i className='lg:hidden'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                  className='h-4 w-4 dark:fill-white'
                >
                  <path fill='none' d='M0 0h24v24H0z' />
                  <path d='M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z' />
                </svg>
              </i>
            </a>
            <ul
              className='left-0 top-[85%] z-10 hidden min-w-[200px] gap-x-4 whitespace-nowrap rounded-xl bg-white transition-all will-change-transform group-hover:visible group-hover:opacity-100 lg:invisible lg:absolute lg:grid lg:translate-y-4 lg:py-4 lg:px-2 lg:opacity-0 lg:shadow-2xl lg:group-hover:translate-y-2'
              aria-labelledby='navDropdown-2'
            >
              <li>
                <a
                  href='item.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Item Details
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='collections.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Explore Collections
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='collection.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Collection
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='activity.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Activity
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='rankings.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Rankings
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='user.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    User
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='edit-profile.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Edit Profile
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='about.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    About
                  </span>
                </a>
              </li>

              <li>
                <a
                  href='contact.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Contact
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='wallet.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Wallet
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='login.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Login
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='404.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Page 404
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='tos.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Terms of Service
                  </span>
                </a>
              </li>
            </ul>
          </li>
          <li className='js-nav-dropdown nav-item dropdown group relative'>
            <a
              href='collections.html'
              className='dropdown-toggle text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5'
              id='navDropdown-3'
              aria-expanded='false'
              role='button'
              data-bs-toggle='dropdown'
            >
              Explore
              <i className='lg:hidden'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                  className='h-4 w-4 dark:fill-white'
                >
                  <path fill='none' d='M0 0h24v24H0z' />
                  <path d='M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z' />
                </svg>
              </i>
            </a>
            <ul
              className='dropdown-menu dark:bg-jacarta-800 -left-6 top-[85%] z-10 hidden grid-flow-col grid-rows-5 gap-x-4 whitespace-nowrap rounded-xl bg-white transition-all will-change-transform group-hover:visible group-hover:opacity-100 lg:invisible lg:absolute lg:!grid lg:translate-y-4 lg:py-8 lg:px-5 lg:opacity-0 lg:shadow-2xl lg:group-hover:translate-y-2'
              aria-labelledby='navDropdown-1'
            >
              <li>
                <a
                  href='collections.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='bg-light-base mr-3 rounded-xl p-[0.375rem]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      className='fill-jacarta-700 h-4 w-4'
                    >
                      <path fill='none' d='M0 0h24v24H0z' />
                      <path d='M22 12.999V20a1 1 0 0 1-1 1h-8v-8.001h9zm-11 0V21H3a1 1 0 0 1-1-1v-7.001h9zM11 3v7.999H2V4a1 1 0 0 1 1-1h8zm10 0a1 1 0 0 1 1 1v6.999h-9V3h8z' />
                    </svg>
                  </span>
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    All NFTs
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='collections.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='mr-3 rounded-xl bg-[#E4FCF4] p-[0.375rem]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      className='h-4 w-4 fill-[#10B981]'
                    >
                      <path fill='none' d='M0 0h24v24H0z' />
                      <path d='M12 2c5.522 0 10 3.978 10 8.889a5.558 5.558 0 0 1-5.556 5.555h-1.966c-.922 0-1.667.745-1.667 1.667 0 .422.167.811.422 1.1.267.3.434.689.434 1.122C13.667 21.256 12.9 22 12 22 6.478 22 2 17.522 2 12S6.478 2 12 2zm-1.189 16.111a3.664 3.664 0 0 1 3.667-3.667h1.966A3.558 3.558 0 0 0 20 10.89C20 7.139 16.468 4 12 4a8 8 0 0 0-.676 15.972 3.648 3.648 0 0 1-.513-1.86zM7.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM12 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z' />
                    </svg>
                  </span>
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Art
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='collections.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='mr-3 rounded-xl bg-[#FDF7EE] p-[0.375rem]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      className='h-4 w-4 fill-[#FEB240]'
                    >
                      <path fill='none' d='M0 0h24v24H0z' />
                      <path d='M17.5 2a4.5 4.5 0 0 1 2.951 7.897c.355.967.549 2.013.549 3.103A9 9 0 1 1 3.55 9.897a4.5 4.5 0 1 1 6.791-5.744 9.05 9.05 0 0 1 3.32 0A4.494 4.494 0 0 1 17.5 2zm0 2c-.823 0-1.575.4-2.038 1.052l-.095.144-.718 1.176-1.355-.253a7.05 7.05 0 0 0-2.267-.052l-.316.052-1.356.255-.72-1.176A2.5 2.5 0 1 0 4.73 8.265l.131.123 1.041.904-.475 1.295A7 7 0 1 0 19 13c0-.716-.107-1.416-.314-2.083l-.112-.33-.475-1.295 1.04-.904A2.5 2.5 0 0 0 17.5 4zM10 13a2 2 0 1 0 4 0h2a4 4 0 1 1-8 0h2z' />
                    </svg>
                  </span>
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Collectibles
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='collections.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='mr-3 rounded-xl bg-[#F2EEFF] p-[0.375rem]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      className='h-4 w-4 fill-[#8358FF]'
                    >
                      <path fill='none' d='M0 0h24v24H0z' />
                      <path d='M5 15v4h4v2H3v-6h2zm16 0v6h-6v-2h4v-4h2zm-8.001-9l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3H6.6l4.399-11h2zm-1 2.885L10.752 12h2.492l-1.245-3.115zM9 3v2H5v4H3V3h6zm12 0v6h-2V5h-4V3h6z' />
                    </svg>
                  </span>
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Domain Names
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='collections.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='mr-3 rounded-xl bg-[#FFEEFA] p-[0.375rem]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      className='h-4 w-4 fill-[#F35BC7]'
                    >
                      <path fill='none' d='M0 0h24v24H0z' />
                      <path d='M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z' />
                    </svg>
                  </span>
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Music
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='collections.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='mr-3 rounded-xl bg-[#EAF2FE] p-[0.375rem]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      className='h-4 w-4 fill-[#428AF8]'
                    >
                      <path fill='none' d='M0 0h24v24H0z' />
                      <path d='M2 6c0-.552.455-1 .992-1h18.016c.548 0 .992.445.992 1v14c0 .552-.455 1-.992 1H2.992A.994.994 0 0 1 2 20V6zm2 1v12h16V7H4zm10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2a5 5 0 1 1 0-10 5 5 0 0 1 0 10zM4 2h6v2H4V2z' />
                    </svg>
                  </span>
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Photography
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='collections.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='mr-3 rounded-xl bg-[#EBEDFF] p-[0.375rem]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      className='h-4 w-4 fill-[#737EF2]'
                    >
                      <path fill='none' d='M0 0h24v24H0z' />
                      <path d='M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm.366 11.366l-3.469 6.01a8.053 8.053 0 0 0 4.459.51 9.937 9.937 0 0 1 .784-5.494l-1.774-1.026zm3.518 2.031a7.956 7.956 0 0 0-.587 3.894 8.022 8.022 0 0 0 3.077-2.456l-2.49-1.438zm-7.025-4.055a9.95 9.95 0 0 1-4.365 3.428 8.01 8.01 0 0 0 2.671 3.604l3.469-6.008-1.775-1.024zm11.103-.13l-.258.12a7.947 7.947 0 0 0-2.82 2.333l2.492 1.439a7.975 7.975 0 0 0 .586-3.893zM4 12c0 .266.013.53.038.789a7.95 7.95 0 0 0 3.078-2.454L4.624 8.897A7.975 7.975 0 0 0 4 12zm12.835-6.374l-3.469 6.008 1.775 1.025a9.95 9.95 0 0 1 4.366-3.43 8.015 8.015 0 0 0-2.419-3.402l-.253-.201zM12 4c-.463 0-.916.04-1.357.115a9.928 9.928 0 0 1-.784 5.494l1.775 1.025 3.469-6.01A7.975 7.975 0 0 0 12 4zm-3.297.71l-.191.088a8.033 8.033 0 0 0-2.886 2.367l2.49 1.438a7.956 7.956 0 0 0 .587-3.893z' />
                    </svg>
                  </span>
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Sports
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='collections.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='mr-3 rounded-xl bg-[#F5FFED] p-[0.375rem]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      className='h-4 w-4 fill-[#8DD059]'
                    >
                      <path fill='none' d='M0 0h24v24H0z' />
                      <path d='M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM4 5v14h16V5H4zm2 2h6v6H6V7zm2 2v2h2V9H8zm-2 6h12v2H6v-2zm8-8h4v2h-4V7zm0 4h4v2h-4v-2z' />
                    </svg>
                  </span>
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Trading Cards
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='collections.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='mr-3 rounded-xl bg-[#FFEEEE] p-[0.375rem]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      className='h-4 w-4 fill-[#EF3D3D]'
                    >
                      <path fill='none' d='M0 0h24v24H0z' />
                      <path d='M22 7h1v10h-1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v3zm-2 10h-6a5 5 0 0 1 0-10h6V5H4v14h16v-2zm1-2V9h-7a3 3 0 0 0 0 6h7zm-7-4h3v2h-3v-2z' />
                    </svg>
                  </span>
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Utility
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='collections.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='mr-3 rounded-xl bg-[#EEFCFF] p-[0.375rem]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      className='h-4 w-4 fill-[#46C7E3]'
                    >
                      <path fill='none' d='M0 0h24v24H0z' />
                      <path d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-2.29-2.333A17.9 17.9 0 0 1 8.027 13H4.062a8.008 8.008 0 0 0 5.648 6.667zM10.03 13c.151 2.439.848 4.73 1.97 6.752A15.905 15.905 0 0 0 13.97 13h-3.94zm9.908 0h-3.965a17.9 17.9 0 0 1-1.683 6.667A8.008 8.008 0 0 0 19.938 13zM4.062 11h3.965A17.9 17.9 0 0 1 9.71 4.333 8.008 8.008 0 0 0 4.062 11zm5.969 0h3.938A15.905 15.905 0 0 0 12 4.248 15.905 15.905 0 0 0 10.03 11zm4.259-6.667A17.9 17.9 0 0 1 15.973 11h3.965a8.008 8.008 0 0 0-5.648-6.667z' />
                    </svg>
                  </span>
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Virtual Worlds
                  </span>
                </a>
              </li>
            </ul>
          </li>
          <li className=' relative'>
            <a
              href='#'
              className='dropdown-toggle text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5'
              id='navDropdown-4'
              aria-expanded='false'
              role='button'
              data-bs-toggle='dropdown'
            >
              Resources
              <i className='lg:hidden'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                  className='h-4 w-4 dark:fill-white'
                >
                  <path fill='none' d='M0 0h24v24H0z' />
                  <path d='M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z' />
                </svg>
              </i>
            </a>
            <ul
              className='dropdown-menu dark:bg-jacarta-800 left-0 top-[85%] z-10 hidden min-w-[200px] gap-x-4 whitespace-nowrap rounded-xl bg-white transition-all will-change-transform group-hover:visible group-hover:opacity-100 lg:invisible lg:absolute lg:grid lg:translate-y-4 lg:py-4 lg:px-2 lg:opacity-0 lg:shadow-2xl lg:group-hover:translate-y-2'
              aria-labelledby='navDropdown-4'
            >
              <li>
                <a
                  href='help-center.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Help Center
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='platform-status.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Platform Status
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='partners.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Partners
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='blog.html'
                  className=' flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Blog
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='single-post.html'
                  className='dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Single Post
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='newsletter.html'
                  className='dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center rounded-xl px-5 py-2 transition-colors'
                >
                  <span className='font-display text-jacarta-700 text-sm dark:text-white'>
                    Newsletter
                  </span>
                </a>
              </li>
            </ul>
          </li>
          <li className='group'>
            <a
              href='create.html'
              className='text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5'
            >
              Create
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};
