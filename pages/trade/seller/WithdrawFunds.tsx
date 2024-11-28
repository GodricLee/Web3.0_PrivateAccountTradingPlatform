import { Default } from 'components/layouts/Default';
import dynamic from 'next/dynamic';

const WithdrawFunds = dynamic(() => import('components/templates/Trade/TradeAsSeller/seller/WithdrawFunds').then((mod) => mod.WithdrawFunds), {
  ssr: false,
});

const WithdrawFundsPage = () => {
  return (
    <Default pageName="Trade As Seller: Withdraw Funds">
      <WithdrawFunds />
    </Default>
  );
};

export default WithdrawFundsPage;
