import { refundColumns } from '../../data/tables/refundColumns';
import { Collapse } from '@mui/material';
import { PaymentMethodFilter } from '../../components/molecules/PaymentMethodFilter/PaymentMethodFilter';
import useReturnsFilter from '../../hooks/useReturnsFilter';
import FiltersSearchBar from '../Dashboard/components/ReturnFilters/FiltersSearchBar';
import SelectDateRange from '../Dashboard/components/ReturnFilters/SelectDateRange';
import { dashboardRefunds } from '../../apiHooks/useOrders';
import { refundQuery } from '../../utils/dashboard/returnFilterHelpers';
import ActiveFilters from '../Dashboard/components/ReturnFilters/ActiveFilters';
import { ToggleFiltersButton } from '../../components/atoms/Buttons/ToggleFiltersButton';
import { refundsFilter, returnsFilter } from '../../data/schemas/returnsFilter';
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { Box } from '@mui/material';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';
import { hasActiveFilters } from '../../utils/helpers';
// Components path might create an error here, convert it to componenets (C -> c) to fix the issue
import RefundButtons from '../Dashboard/components/ReturnFilters/RefundButtons';
import { DynamicReturnTable } from '../Dashboard/components/DynamicReturnTable/DynamicReturnTable';
import CustomPaginationV2 from '../../components/molecules/CustomPagination/CustomPaginationV2';
import showToast from '../../hooks/useToast';

const DashboardGiftCardsPageV2 = () => {
  const { filters, updateFilters, tempFilters, updateTempFilters, resetFilters, applyFilters } =
    useReturnsFilter(refundsFilter);
  const [selectedForRefund, setSelectedForRefund] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const queryString = refundQuery(filters);
  const { isLoading, isFetching, data, refetch } = dashboardRefunds(queryString);

  const handleCheckboxChange = (event, row) => {
    const selectedIndex = selectedForRefund.indexOf(row.barcode_number);
    let newSelected = [...selectedForRefund];
    if (selectedIndex === -1) {
      newSelected.push(row.barcode_number);
    } else {
      newSelected.splice(selectedIndex, 1);
    }
    setSelectedForRefund(newSelected);
  };

  const handleManuallRefund = async () => {
    setLoading(true);
    setLoadingMessage('Refunding orders manually');
    try {
      const barcodeNumbersString = selectedForRefund.join(',');
      const response = await axiosInstance.post(
        `/dashboard/change-status-to-refound?barcode_numbers[]=${barcodeNumbersString}`,
      );
      setSelectedForRefund([]);
      if (response.data.status_code === 200) {
        showToast(response.data.message, 'success');
        refetch();
      } else {
        handleBackendErrors(response);
      }
      setLoading(false);
      setLoadingMessage('');
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleBulkRefund = async () => {
    setLoading(true);
    setLoadingMessage('Refunding orders');
    try {
      const response = await axiosInstance.post('/dashboard/refund-requested-orders', {
        barcode_numbers: selectedForRefund,
      });
      setSelectedForRefund([]);
      if (response.data.status_code === 200) {
        showToast(response.data.message, 'success');
        refetch();
      } else {
        handleBackendErrors(response);
      }
      setLoading(false);
      setLoadingMessage('');
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleBackendErrors = (response) => {
    setLoading(false);
    setLoadingMessage('');
    const errorMessages =
      response.data.errors?.map((error) => error.errors.base[0]) ||
      response.data.message ||
      'An error occurred';
    showToast(Array.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages, 'failure');
  };

  const handleAxiosError = (error) => {
    setLoading(false);
    setLoadingMessage('');
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    showToast(errorMessage, 'failure');
  };

  const handleSelectAll = (event) => {
    const allRefundIds = data?.approved_orders?.data.map((refund) => refund.barcode_number) || [];
    if (selectedForRefund.length === allRefundIds.length) {
      setSelectedForRefund([]);
    } else {
      setSelectedForRefund(allRefundIds);
    }
  };

  useEffect(() => {
    setSelectedForRefund([]);
  }, [filters.page]);

  return (
    <div className="returns-container">
      <div className="mb-4 flex flex-wrap justify-between border bg-white p-4">
        <FiltersSearchBar updateFilters={updateFilters} />
        <div className="flex flex-wrap gap-4">
          <RefundButtons
            selectedForRefund={selectedForRefund}
            loading={loading}
            handleManuallRefund={handleManuallRefund}
            handleBulkRefund={handleBulkRefund}
          />
          <ToggleFiltersButton filterOn={filters.filterOn} updateFilters={updateFilters} />
        </div>
      </div>
      <Collapse in={filters.filterOn} timeout="auto" unmountOnExit={false}>
        <div className="mb-4 border bg-white p-4">
          <div className="flex flex-col gap-8 xl:flex-row">
            <SelectDateRange tempFilters={tempFilters} updateTempFilters={updateTempFilters} />
            <PaymentMethodFilter
              filters={tempFilters}
              updateFilters={updateTempFilters}
              hasTag={true}
            />
          </div>
          <div className=" flex justify-end space-x-2">
            <button className="btn btn-secondary" onClick={resetFilters}>
              Reset
            </button>
            <button className="btn btn-primary" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      </Collapse>

      {hasActiveFilters(filters) && (
        <div className="h-14 min-h-14 grid-cols-2 items-center gap-3">
          <ActiveFilters className="col-span-2" filters={filters} updateFilters={updateFilters} />
        </div>
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <p>{loadingMessage}</p>
          <Box>
            <PammysLoading />
          </Box>
        </div>
      ) : (
        <DynamicReturnTable
          columns={refundColumns}
          rows={data?.approved_orders?.data}
          loading={isLoading}
          isFetching={isFetching}
          filters={filters}
          updateFilters={updateFilters}
          selectedForRefund={selectedForRefund}
          handleCheck={handleCheckboxChange}
          handleCheckAll={handleSelectAll}
        />
      )}
      <div className="pt-5">
        <CustomPaginationV2
          filters={filters}
          updateFilters={updateFilters}
          total={data?.approved_orders?.total}
        />
      </div>
    </div>
  );
};

export default DashboardGiftCardsPageV2;
