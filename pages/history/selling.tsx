import { Default } from 'components/layouts/Default';
import { SellingRecords } from 'components/templates/TradingHistory/SellingRecords';

const ERC20 = () => {
  return (
    <Default pageName="Selling History">
      <SellingRecords />
    </Default>
  );
};

export default ERC20;
