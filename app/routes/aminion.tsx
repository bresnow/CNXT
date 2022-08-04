import { Outlet } from 'remix';
import CNXTLogo from '~/lib/components/svg/logos/CNXT';
import { Navigation } from '~/lib/components/Navigator';

export default function AminionDemo() {
  return (
    <>
      <Outlet />
    </>
  );
}
