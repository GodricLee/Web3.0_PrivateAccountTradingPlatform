import { Default } from 'components/layouts/Default';
import dynamic from 'next/dynamic';

const FundUpload = dynamic(() => import('components/templates/Trade/TradeAsBuyer/buyer/FundUpload').then((mod) => mod.FundUpload), {
  ssr: false,
});

const FundUploadPage = () => {
  return (
    <Default pageName="Trade As Buyer: Fund Upload">
      <FundUpload />
    </Default>
  );
};

export default FundUploadPage;
