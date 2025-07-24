import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';

export const CustomDatePickerV2 = ({ filters, updateFilters }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (ranges) => {
    const { selection } = ranges;
    updateFilters({ startDate: selection.startDate, endDate: selection.endDate });
  };

  const formattedDateRange =
    filters.startDate && filters.endDate
      ? `${dayjs(filters.startDate).format('DD.MM.YYYY')} - ${dayjs(filters.endDate).format('DD.MM.YYYY')}`
      : 'Nach datum filtern';

  return (
    <div className="flex items-center rounded-md border-2 bg-white px-3 py-1 ">
      {/* <Switch
        color="primary"
        checked={filters.filterDate}
        onClick={() => updateFilters({ filterDate: !filters.filterDate })}
        inputProps={{ 'aria-label': 'Toggle switch' }}
      /> */}
      <div className="relative">
        {open && (
          <div className="fixed inset-0  z-40 opacity-50" onClick={() => setOpen(false)}></div>
        )}
        {open && (
          <div className="absolute left-0 top-0 z-50 mt-8 overflow-hidden rounded-xl border-2   shadow-md">
            <DateRangePicker
              ranges={[
                { startDate: filters.startDate, endDate: filters.endDate, key: 'selection' },
              ]}
              onChange={handleSelect}
            />
          </div>
        )}
        <div onClick={() => setOpen(!open)} className="flex cursor-pointer items-center p-1">
          <span className="mr-4">{formattedDateRange || 'Nach datum filtern'} </span>
          <CalendarMonthIcon />
        </div>
      </div>
    </div>
  );
};

// export const CustomDatePickerV2 = ({
//   startDate = '',
//   endDate = '',
//   setStartDate = '',
//   setEndDate = '',
//   filters,
//   updateFilters,
//   setDatePickerChange = '',
// }) => {
//   console.log('FILTERS:', filters);
//   const greyColor = grey[400];
//   const [open, setOpen] = useState(false);

//   const handleSelect = (date) => {
//     // Update the external state using the provided setStartDate and setEndDate functions
//     updateFilters({ startDate: date.selection.startDate, endDate: date.selection.endDate });
//     // setStartDate(date.selection.startDate);
//     // setEndDate(date.selection.endDate);
//   };
//   const formattedDateRange =
//     startDate && endDate
//       ? `${dayjs(startDate).format('DD.MM.YYYY')} - ${dayjs(endDate).format('DD.MM.YYYY')}`
//       : '';
//   return (
//     <div className="flex items-center rounded-md border-2 bg-white px-1 ">
//       <Switch
//         color="primary"
//         checked={filters.filterDate}
//         onClick={() => {
//           updateFilters({ filterDate: !filters.filterDate });
//         }}
//         inputProps={{ 'aria-label': 'Toggle switch' }}
//       />
//       <div className="relative">
//         {open && (
//           <div className="fixed inset-0  z-40 opacity-50" onClick={() => setOpen(false)}></div>
//         )}
//         {open && (
//           <div className="absolute left-0 top-0 z-50 mt-8">
//             <DateRangePicker
//               ranges={[
//                 { startDate: filters.startDate, endDate: filters.endDate, key: 'selection' },
//               ]}
//               onChange={handleSelect}
//             />
//           </div>
//         )}
//         <div onClick={() => setOpen(!open)} className="flex cursor-pointer items-center p-1">
//           <span className="mr-4">{formattedDateRange || 'Nach datum filtern'} </span>
//           <CalendarMonthIcon color={greyColor} />
//         </div>
//       </div>
//     </div>
//   );
// };
