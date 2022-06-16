import React from 'react';
import { useMatches, useLocation, Link } from 'remix';
import { MenuLinks } from '~/root';
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
  children,
  search,
  logo,
  links,
}: {
  children: React.PropsWithChildren<any>;
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
    type: 'text',
    required: true,
    name: 'path',
    shadow: true,

    ...search,
  } || { ...search };
  return (
    <div className='h-screen flex overflow-hidden '>
      <div className='flex flex-col w-0 flex-1 overflow-hidden'>
        <div className='relative flex items-center px-6 overflow-hidden bg-cnxt_black border-0  h-28 rounded-b-2xl'>
          <nav className='flex items-center justify-center gap-8'>
            {logo}
            {menuarr?.map(({ link, icon, id, label }, index) => (
              <Link
                key={id}
                onMouseOver={(e) => {
                  let indicator = document.querySelector(
                    '#indicator'
                  ) as HTMLElement;
                  indicator.style.transform = `translateX(calc(${
                    96 * index
                  }px))`;
                }}
                to={link}
                className='grid w-16 h-16 grid-cols-1 grid-rows-1'
              >
                <div
                  className={`col-[1/1] row-[1/1] flex items-center justify-center w-16 h-16`}
                >
                  <label className='text-primary-70 text-sm hover:text-cnxt_blue'>
                    {label}
                    <svg
                      className='mr-3 h-6 w-6 my-2  text-gray-400 group-hover:text-gray-300 group-focus:text-primary-80 transition ease-in-out duration-150'
                      stroke={isActive(link) ? '#053c9c' : 'currentColor'}
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d={
                          icon ??
                          'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                        }
                      />
                    </svg>
                  </label>
                </div>
                <div
                  className={`col-[1/1] row-[1/1] flex items-center justify-center w-16 h-16 transition-opacity duration-300 ${
                    isActive(link)
                      ? 'opacity-100 pointer-events-auto'
                      : 'opacity-0 pointer-events-none'
                  }`}
                ></div>
              </Link>
            ))}
          </nav>

          <div
            id='indicator'
            className={`absolute left-40 w-6 h-8 transition-all duration-300 bg-cnxt_blue rounded-full -bottom-4 `}
          >
            <div
              style={{ boxShadow: '0 10px 0 #053c9c' }}
              className='absolute w-5 h-5 bg-cnxt_black-left-4 bottom-1/2 rounded-br-3xl'
            ></div>
            <div
              style={{ boxShadow: '0 10px 0 #053c9c' }}
              className='absolute w-5 h-5 bg-cnxt_black-right-4 bottom-1/2 rounded-bl-3xl'
            ></div>
          </div>
          {search && (
            <div className='w-1/2 ml-8 hidden md:flex group-hover transition-all duration-350 bg-primary-80 hover:bg-primary-70 rounded-md flex-wrap  focus:shadow-md ring-1 ring-sky-500'>
              <InputText {...search} />
            </div>
          )}
        </div>

        <main
          className='flex-1 relative z-0 overflow-y-auto py-6 focus:outline-none'
          tabIndex={0}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
