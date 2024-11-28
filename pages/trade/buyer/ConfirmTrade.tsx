import { Default } from 'components/layouts/Default';
import dynamic from 'next/dynamic';

const ConfirmTrade = dynamic(() => import('components/templates/Trade/TradeAsBuyer/buyer/ConfirmTrade').then((mod) => mod.ConfirmTrade), {
  ssr: false,
});

const ConfirmTradePage = () => {
  return (
    <Default pageName="Trade As Buyer: Confirm Trade">
      <ConfirmTrade />
    </Default>
  );
};

export default ConfirmTradePage;
