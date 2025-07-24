import { FaShopify } from 'react-icons/fa';
import { BiSolidPackage } from 'react-icons/bi';
const size = 20;
export const generalAccessibility = [
  {
    id: 1,
    name: { en: 'Search return', de: 'Retoure suchen' },
    slug: 'general-search',
    shortcut: 'Ctrl + G',
    width: 200,
    icon: <BiSolidPackage size={size} />,
  },
  {
    id: 2,
    name: { en: 'Search shopify', de: 'Retoure suchen' },
    slug: 'general-search',
    shortcut: 'Ctrl + O',
    width: 200,
    icon: <FaShopify size={size} />,
  },
  // {
  //   id: -3,
  //   name: { en: 'Search return', de: 'Retoure suchen' },
  //   slug: 'general-search',
  //   shortcut: 'Ctrl + G',
  //   width: 200,
  //   icon: <FaShopify size={size} />,
  // },
  // {
  //   id: -4,
  //   name: { en: 'Search return', de: 'Retoure suchen' },
  //   slug: 'general-search',
  //   shortcut: 'Ctrl + G',
  //   width: 200,
  //   icon: <FaShopify size={size} />,
  // },
];
