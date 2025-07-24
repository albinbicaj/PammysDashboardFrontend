import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TabPanel } from '../../atoms';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';

// const validTabValues = [
//   'all',
//   'requested',
//   'in progress',
//   'approved',
//   'refunded',
//   'rejected',
//   'exchanged',
//   'canceled',
//   'partially',
// ];
// const validSubTabValue = [
//   'all',
//   'customer_contacted',
//   'sent_back_to_customer',
//   'donated',
//   'returned',
// ];

export const TabContentV2 = ({ isFetching = false, filters = {}, updateFilters = () => {} }) => {
  const handleChange = (_event, newValue) => {
    // setActiveTab(newValue);
    updateFilters({ activeTab: newValue, page: 1 });
  };
  const handleSubTabChange = (_event, newValue) => {
    // setActiveSubTab(newValue);
    updateFilters({ activeSubTab: newValue, page: 1 });
  };
  return (
    <div className="">
      <div className="mb-5 border-l-8 border-gray-400 ps-2">
        <div className="flex justify-between border bg-white">
          <Tabs
            className="flex w-full items-center  "
            value={filters.activeTab || 'all'}
            onChange={handleChange}
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#4b5563' },
              '& .Mui-selected': { color: '#4b5563 !important;' },
            }}
          >
            <Tab
              className={`mr-10 w-max  text-sm font-medium normal-case leading-5 focus:outline-none`}
              label="Alle"
              value={'all'}
              sx={{
                textTransform: 'none',
              }}
            />
            <Tab
              className={`mr-10 w-max  text-sm font-medium normal-case leading-5 focus:outline-none`}
              label="Offen"
              value={'requested'}
              sx={{
                textTransform: 'none',
              }}
            />
            <Tab
              className={`mr-10  w-max text-sm font-medium leading-5 focus:outline-none`}
              label="Akzeptiert"
              value={'approved'}
              sx={{
                textTransform: 'none',
              }}
            />
            <Tab
              className={`mr-10  w-max text-sm font-medium leading-5 focus:outline-none`}
              label="Teilweise Akzeptiert"
              value={'partially'}
              sx={{
                textTransform: 'none',
              }}
            />
            <Tab
              className={`font-mediumfocus:outline-none mr-10 w-max text-sm leading-5`}
              label="Erstattet"
              value={'refunded'}
              sx={{
                textTransform: 'none',
              }}
            />
            <Tab
              className={`mr-10 w-max text-sm font-medium leading-5 focus:outline-none`}
              label="Abgelehnt"
              value={'rejected'}
              sx={{
                textTransform: 'none',
              }}
            />
          </Tabs>
          <div
            className={`transition-opacity duration-300 ${isFetching ? 'opacity-100' : 'opacity-0'}`}
          >
            <PammysLoading />
          </div>
        </div>
        <TabPanel value={filters.activeTab} index={'rejected'} className=" mt-2 border bg-white">
          <Tabs
            onChange={handleSubTabChange}
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#4b5563' },
              '& .Mui-selected': { color: '#4b5563 !important;' },
            }}
            value={filters.activeSubTab || 'all'}
          >
            <Tab
              onChange={handleSubTabChange}
              sx={{
                textTransform: 'none',
              }}
              label="Kunde kontaktiert"
              value={'all'}
            />
            <Tab
              sx={{
                textTransform: 'none',
              }}
              className="normal-case"
              label="an Kunden senden"
              value={'customer_contacted'}
            />
            <Tab
              sx={{
                textTransform: 'none',
              }}
              label="An Kunden zurückgesendet"
              value={'sent_back_to_customer'}
            />
            <Tab
              sx={{
                textTransform: 'none',
              }}
              label="Gespendet"
              value={'donated'}
            />
          </Tabs>
        </TabPanel>
      </div>
    </div>
  );
};
