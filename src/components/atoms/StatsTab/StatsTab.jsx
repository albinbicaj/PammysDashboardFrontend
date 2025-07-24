import { grey } from '@mui/material/colors';
export const StatsTab = ({ className, statName, statValue }) => (
  <div className="flex flex-col">
    <span className='font-semibold text-gray-500'>{statName}</span>
    <span className="font-bold text-xl">{statValue}</span>
  </div>
);
