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
        label: 'Trade Initialize',
        subLabel: 'Initialize or accept a trade, by generating or accepting a trade key',
        href: '/trade/initialize',
        logo: 'token',
      },
      {
        label: 'As Seller',
        subLabel: 'Sell any account you want, and make a guaranteed profit',
        href: '/trade/seller',
        logo: 'wizard',
      },
      {
        label: 'As Buyer',
        subLabel: 'Buy any account you want, and your funds would never be in vain',
        href: '/trade/buyer',
        logo: 'marketplace',
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
        logo: 'servers',
      },
      {
        label: 'Purchase Records',
        subLabel: 'Get your trading history as buyer',
        href: '/history/purchase',
        logo: 'documentation',
      },
    ],
  },
];

export default NAV_LINKS;
