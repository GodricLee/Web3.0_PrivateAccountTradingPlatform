import { Default } from 'components/layouts/Default';
import dynamic from 'next/dynamic';

const TradeCancelled = dynamic(() => import('components/templates/Trade/TradeAsBuyer/buyer/TradeCancelled').then((mod) => mod.TradeCancelled), {
  ssr: false,
});

const TradeCancelledPage = () => {
  return (
    <Default pageName="Trade As Buyer: Trade Cancelled">
      <TradeCancelled />
    </Default>
  );
};

export default TradeCancelledPage;
