import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { giftCardTable } from '../../../data/tables/giftCardTable';
import { CustomReturnsTable } from '../CustomReturnsTable/CustomReturnsTable';

export const GiftCardTabContent = ({
  page,
  setPage,
  pageSize,
  setPageSize,
  activeTab,
  setActiveTab,
  orders,
  loading,
  filters,
  updateFilters,
}) => {
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  return (
    <div>
      <div className="border-l-8 border-gray-400 ps-2">
        <Tabs
          className="border bg-white"
          value={activeTab}
          onChange={handleChange}
          zIndex={0}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#4b5563', zIndex: 1 },
            '& .Mui-selected': { color: '#4b5563 !important;', zIndex: 1 },
          }}
        >
          {/* <Tab label="Alle" value={'all'} /> */}
          <Tab label="Approved" value={'approved'} />
          <Tab label="Partially approved" value={'partially'} />
        </Tabs>
      </div>

      {/* <div className="mt-5 border bg-white">
        <CustomTable
          columns={columns}
          rows={orders.requested_orders || []}
          page={page}
          pageSize={pageSize}
          total={orders.total || 0}
          setPage={setPage}
          setPageSize={setPageSize}
          loading={loading}
        />
      </div> */}
      <CustomReturnsTable
        columns={giftCardTable}
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
