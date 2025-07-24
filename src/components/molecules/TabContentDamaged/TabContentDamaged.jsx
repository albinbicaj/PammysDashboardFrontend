import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TabPanel } from '../../atoms';
import { CustomTableDamaged } from '../CustomTableDamaged/CustomTableDamaged';
import { CustomReturnsTable } from '../CustomReturnsTable/CustomReturnsTable';

export const TabContentDamaged = ({
  page,
  setPage,
  pageSize,
  setPageSize,
  activeTab,
  setActiveTab,
  orders,
  activeSubTab,
  setActiveSubTab,
  columns,
  loading,
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
      <div className="border-l-8 border-gray-400 ps-2">
        <Tabs
          className="flex w-full items-center border bg-white"
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
            className={`mr-10 w-max  text-sm font-medium normal-case leading-5 focus:outline-none`}
            label="Support bestätigt"
            value={'support'}
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
            label="Abgelehnt Support"
            value={'rejected_support'}
            sx={{
              textTransform: 'none',
            }}
          />
          <Tab
            className={`mr-10 w-max text-sm font-medium leading-5 focus:outline-none`}
            label="Abgelehnt Lager"
            value={'rejected_lager'}
            sx={{
              textTransform: 'none',
            }}
          />
        </Tabs>

        <TabPanel value={activeTab} index={'requested'} className="mt-2 border bg-white">
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
              label="Reklamation"
              value={'5'}
            />
            <Tab
              sx={{
                textTransform: 'none',
              }}
              className="normal-case"
              label="Falschlieferung"
              value={'7'}
            />
            <Tab
              sx={{
                textTransform: 'none',
              }}
              className="normal-case"
              label="Schadensanzeige"
              value={'package_damaged'}
            />
          </Tabs>
        </TabPanel>
        <TabPanel value={activeTab} index={'rejected_support'} className="mt-2 border bg-white">
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
              label="Reklamation"
              value={'5'}
            />
            <Tab
              sx={{
                textTransform: 'none',
              }}
              className="normal-case"
              label="Falschlieferung"
              value={'7'}
            />
          </Tabs>
        </TabPanel>
        <TabPanel value={activeTab} index={'rejected_lager'} className="mt-2 border bg-white">
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

        {/*
        #rgnpcrz #todo
         These tabs are commented to be deleted in the future it they are not needed
        they are used to create subTabs for selected main tab */}
        {/* <TabPanel value={activeTab} index={'support'} className="w-full"></TabPanel>
        <TabPanel value={activeTab} index={'approved'} className="w-full"></TabPanel>
        <TabPanel value={activeTab} index={'partially'} className="w-full"></TabPanel>
        <TabPanel value={activeTab} index={'refunded'} className="w-full"></TabPanel> */}
        <TabPanel value={activeTab} index={'rejected'} className="mt-2 border bg-white">
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
              label="Alle Abgelehnt"
              value={'all'}
            />
            <Tab
              sx={{
                textTransform: 'none',
              }}
              className="normal-case"
              label="Kunde kontaktiert"
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
              label="Donated"
              value={'donated'}
            />
          </Tabs>
        </TabPanel>
      </div>
      <CustomReturnsTable
        columns={columns}
        rows={orders?.requested_orders?.data || []}
        page={page}
        pageSize={pageSize}
        total={orders.requested_orders?.total || 0}
        setPage={setPage}
        setPageSize={setPageSize}
        loading={loading}
        filters={filters}
        updateFilters={updateFilters}
      />
    </div>
  );
};
