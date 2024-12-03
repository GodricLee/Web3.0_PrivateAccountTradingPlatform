import { Default } from 'components/layouts/Default';
import dynamic from 'next/dynamic';

const WaitingSeller = dynamic(() => import('components/templates/Trade/TradeAsBuyer/buyer/WaitingSeller').then((mod) => mod.WaitingSeller), {
  ssr: false,
});

const WaitingSellerPage = () => {
  return (
    <Default pageName="Trade As Buyer: Waiting Seller">
      <WaitingSeller />
    </Default>
  );
};

export default WaitingSellerPage;
