import { Default } from 'components/layouts/Default';
import dynamic from 'next/dynamic';

const TradeComplete = dynamic(() => import('components/templates/Trade/TradeAsBuyer/buyer/TradeComplete').then((mod) => mod.TradeComplete), {
  ssr: false,
});

const TradeCompletePage = () => {
  return (
    <Default pageName="Trade As Buyer: Trade Complete">
      <TradeComplete />
    </Default>
  );
};

export default TradeCompletePage;
