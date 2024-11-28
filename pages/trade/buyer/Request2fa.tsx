import { Default } from 'components/layouts/Default';
import dynamic from 'next/dynamic';

const Request2fa = dynamic(() => import('components/templates/Trade/TradeAsBuyer/buyer/Request2fa').then((mod) => mod.Request2fa), {
  ssr: false,
});

const Request2faPage = () => {
  return (
    <Default pageName="Trade As Buyer: Request 2FA">
      <Request2fa />
    </Default>
  );
};

export default Request2faPage;
