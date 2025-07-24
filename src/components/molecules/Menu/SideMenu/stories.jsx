import { HiOutlinePresentationChartLine, HiOutlinePresentationChartBar } from 'react-icons/hi';
import { SvgIcon } from '@mui/material';

export const Items = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: (
      <SvgIcon fontSize="small">
        <HiOutlinePresentationChartLine size={20} />
      </SvgIcon>
    ),
  },
  {
    title: 'Performance',
    path: '/performance',
    icon: (
      <SvgIcon fontSize="small">
        <HiOutlinePresentationChartBar size={20} />
      </SvgIcon>
    ),
  },
  {
    title: 'Bestellungen',
    path: '/performance',
    icon: (
      <SvgIcon fontSize="small">
        <HiOutlinePresentationChartBar size={20} />
      </SvgIcon>
    ),
  },
  {
    title: 'Returns',
    path: '/performance',
    icon: (
      <SvgIcon fontSize="small">
        <HiOutlinePresentationChartBar size={20} />
      </SvgIcon>
    ),
  },
  {
    title: 'Exchanges',
    path: '/performance',
    icon: (
      <SvgIcon fontSize="small">
        <HiOutlinePresentationChartBar size={20} />
      </SvgIcon>
    ),
  },
];

export default Items;
