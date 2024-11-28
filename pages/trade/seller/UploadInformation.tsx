import { Default } from 'components/layouts/Default';
import dynamic from 'next/dynamic';

const UploadInformation = dynamic(() => import('components/templates/Trade/TradeAsSeller/seller/UploadInformation').then((mod) => mod.UploadInformation), {
  ssr: false,
});

const UploadInformationPage = () => {
  return (
    <Default pageName="Trade As Seller: Upload Information">
      <UploadInformation />
    </Default>
  );
};

export default UploadInformationPage;
