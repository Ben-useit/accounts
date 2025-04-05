import {
  DocumentTextIcon,
  HomeIcon,
  BanknotesIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  UserPlusIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';

export const sideBarItems = [
  {
    icon: <HomeIcon />,
    text: 'Home',
    url: '/',
  },
  {
    icon: <BanknotesIcon />,
    text: 'Sales',
    subMenu: [
      {
        icon: <DocumentTextIcon />,
        text: 'Invoice',
        url: '/sales/invoice',
      },
    ],
  },
  {
    icon: <ShoppingCartIcon />,
    text: 'Purchases',
    subMenu: [
      {
        icon: <DocumentTextIcon />,
        text: 'Vat Purchase',
        url: '/purchases/vat',
      },
      {
        icon: <BanknotesIcon />,
        text: 'Withdrawal',
        url: '/purchases/withdrawal',
      },
    ],
  },
  {
    icon: <UserGroupIcon />,
    subMenu: [
      {
        icon: <UserPlusIcon />,
        text: 'New Client',
        url: '/client/new',
      },
      {
        icon: <ListBulletIcon />,
        text: 'List Clients',
        url: '/client/list',
      },
    ],
    text: 'Clients',
  },
];
