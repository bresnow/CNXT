import { Outlet } from 'remix';
import CNXTLogo from '~/components/svg/logos/CNXT';
import { Navigation } from '~/components/Navigator';
import { _Window } from '../../../types/index';

export default function AminionDemo() {
  return (
    <>
      <Outlet />
    </>
  );
}
