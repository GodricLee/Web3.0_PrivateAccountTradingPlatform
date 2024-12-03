import { Default } from 'components/layouts/Default';
import dynamic from 'next/dynamic';

const TradeCancelled = dynamic(() => import('components/templates/Trade/TradeAsSeller/seller/TradeCancelled').then((mod) => mod.TradeCancelled), {
  ssr: false,
});

const TradeCancelledSellerPage = () => {
  return (
    <Default pageName="Trade As Seller: Trade Cancelled">
      <TradeCancelled />
    </Default>
  );
};

export default TradeCancelledSellerPage;
