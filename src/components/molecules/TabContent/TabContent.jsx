import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TabPanel } from '../../atoms';
import { CustomReturnsTable } from '../CustomReturnsTable/CustomReturnsTable';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';
// import { CustomTable } from '../CustomTable/CustomTable';

export const TabContent = ({
  page = 1,
  setPage = () => {},
  pageSize = 10,
  setPageSize = () => {},
  activeTab = 'all',
  setActiveTab = 'all',
  orders,
  activeSubTab,
  setActiveSubTab,
  columns,
  loading,
  isFetching = false,
  filters,
  updateFilters,
}) => {
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleSubTabChange = (event, newValue) => {
    setActiveSubTab(newValue);
  };
  return (
    <div className="">
      <div className="mb-5 border-l-8 border-gray-400 ps-2">
        <div className="flex justify-between border bg-white">
          <Tabs
            className="flex w-full items-center  "
            value={activeTab}
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
        <TabPanel value={activeTab} index={'rejected'} className=" mt-2 border bg-white">
          <Tabs
            onChange={handleSubTabChange}
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#4b5563' },
              '& .Mui-selected': { color: '#4b5563 !important;' },
            }}
            value={activeSubTab}
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

      <CustomReturnsTable
        columns={columns}
        rows={orders.requested_orders?.data || []}
        page={page}
        pageSize={pageSize}
        total={orders.requested_orders?.total || 0}
        setPage={setPage}
        setPageSize={setPageSize}
        loading={loading}
        isFetching={isFetching}
        filters={filters}
        updateFilters={updateFilters}
      />
    </div>
  );
};
