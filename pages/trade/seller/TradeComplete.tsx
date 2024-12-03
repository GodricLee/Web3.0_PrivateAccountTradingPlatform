import { Default } from 'components/layouts/Default';
import dynamic from 'next/dynamic';

const TradeComplete = dynamic(() => import('components/templates/Trade/TradeAsSeller/seller/TradeComplete').then((mod) => mod.TradeComplete), {
  ssr: false,
});

const TradeCompleteSellerPage = () => {
  return (
    <Default pageName="Trade As Buyer: Trade Complete">
      <TradeComplete />
    </Default>
  );
};

export default TradeCompleteSellerPage;
