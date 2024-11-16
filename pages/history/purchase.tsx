import { Default } from 'components/layouts/Default';
import { NFTBalances } from 'components/templates/balances/NFT';

const NFT = () => {
  return (
    <Default pageName="Purchase History">
      <NFTBalances />
    </Default>
  );
};

export default NFT;
