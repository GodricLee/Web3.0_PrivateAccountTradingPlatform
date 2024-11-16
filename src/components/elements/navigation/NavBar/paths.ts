import { ISubNav } from '../SubNav/SubNav';

const NAV_LINKS: ISubNav[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Learn About Us',
    href: '/learn',
  },
  {
    label: 'Trade',
    href: '/trade',
    children: [
      {
        label: 'As Seller',
        subLabel: 'Sell any account you want, and make a guaranteed profit',
        href: '/trade/seller',
        logo: 'token',
      },
      {
        label: 'As Buyer',
        subLabel: 'Buy any account you want, and your funds would never be in vain',
        href: '/trade/buyer',
        logo: 'lazyNft',
      },
    ],
  },
  {
    label: 'Trading History',
    href: '/history',
    children: [
      {
        label: 'Selling Records',
        subLabel: 'Get your trading history as seller',
        href: '/history/selling',
        logo: 'token',
      },
      {
        label: 'Purchase Records',
        subLabel: 'Get your trading history as buyer',
        href: '/history/purchase',
        logo: 'pack',
      },
    ],
  },
];

export default NAV_LINKS;
