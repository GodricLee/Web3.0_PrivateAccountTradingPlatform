import { Default } from 'components/layouts/Default';
import { ERC20Balances } from 'components/templates/balances/ERC20';

const ERC20 = () => {
  return (
    <Default pageName="Selling History">
      <ERC20Balances />
    </Default>
  );
};

export default ERC20;
