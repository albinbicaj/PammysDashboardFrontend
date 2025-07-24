import React, { useState } from 'react';
import { Tabs, Tab, Switch, FormControlLabel, InputBase } from '@mui/material';
import { TabPanel } from '../../atoms';
import { productColumns } from '../../../context/productsColumns';
import { ProductsTable } from '../ProductsTable/ProductsTable';
import StockUpdateLogs from '../../../pages/Dashboard/StockUpdateLogs/StockUpdateLogs';

export const ProductTabContent = ({
  products,
  setFetchedProducts,
  fetchProducts,
  fetchProductsFromStore,
  loading,
  loadingTable,
  setLoadingTable,
  setLoadingFullTable,
  loadingFullTable,
}) => {
  return (
    <>
      <div className="pt-4">
        <ProductsTable
          rows={products}
          columns={productColumns}
          setRows={setFetchedProducts}
          fetchProducts={fetchProducts}
          fetchProductsFromStore={fetchProductsFromStore}
          loading={loading}
          loadingTable={loadingTable}
          setLoadingTable={setLoadingTable}
          setLoadingFullTable={setLoadingFullTable}
          loadingFullTable={loadingFullTable}
        />
      </div>
    </>
  );
};
