import { Default } from 'components/layouts/Default';
import dynamic from 'next/dynamic';

const PasswordChange = dynamic(() => import('components/templates/Trade/TradeAsBuyer/buyer/PasswordChange').then((mod) => mod.PasswordChange), {
  ssr: false,
});

const PasswordChangePage = () => {
  return (
    <Default pageName="Trade As Buyer: Password Change">
      <PasswordChange />
    </Default>
  );
};

export default PasswordChangePage;
