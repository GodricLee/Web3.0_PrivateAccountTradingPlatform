import { Default } from 'components/layouts/Default';
import dynamic from 'next/dynamic';

const Waiting = dynamic(() => import('components/templates/Trade/TradeAsSeller/seller/Waiting').then((mod) => mod.Waiting), {
  ssr: false,
});

const WaitingPage = () => {
  return (
    <Default pageName="Trade As Seller: Waiting For Buyer Process">
      <Waiting />
    </Default>
  );
};

export default WaitingPage;
