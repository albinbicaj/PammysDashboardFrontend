import { returnTable, returnTabs } from '../../data/tables/returnTable';
import { Collapse } from '@mui/material';
import { PaymentMethodFilter } from '../../components/molecules/PaymentMethodFilter/PaymentMethodFilter';
import useReturnsFilter from '../../hooks/useReturnsFilter';
import FiltersSearchBar from '../Dashboard/components/ReturnFilters/FiltersSearchBar';
import SelectDateRange from '../Dashboard/components/ReturnFilters/SelectDateRange';
import { useAllOrders } from '../../apiHooks/useOrders';
import { returnQuery } from '../../utils/dashboard/returnFilterHelpers';
import ActiveFilters from '../Dashboard/components/ReturnFilters/ActiveFilters';
import { DynamicReturnTable } from '../Dashboard/components/DynamicReturnTable/DynamicReturnTable';
import CustomPaginationV2 from '../../components/molecules/CustomPagination/CustomPaginationV2';
import { ToggleFiltersButton } from '../../components/atoms/Buttons/ToggleFiltersButton';
import { TabContentV3 } from '../../components/molecules/TabContent/TabContentV3';
import DownloadCSVButton from '../../components/atoms/DownloadCSVButton/DownloadCSVButton';
import { hasActiveFilters } from '../../utils/helpers';

const DashboardReturnPageV2 = () => {
  const { filters, updateFilters, tempFilters, updateTempFilters, resetFilters, applyFilters } =
    useReturnsFilter();

  const queryString = returnQuery(filters);
  const { isLoading, isFetching, error, data } = useAllOrders(queryString);

  return (
    <div className="returns-container">
      <div className="  mb-4 flex justify-between border  bg-white p-4">
        <FiltersSearchBar updateFilters={updateFilters} />
        <div className="flex gap-4">
          <DownloadCSVButton
            text="Export CSV"
            endpoint="/dashboard/requested-orders-csv?"
            query={returnQuery(filters)}
            fileName="requested-orders"
            disabled={data?.requested_orders?.total === 0}
          />
          <ToggleFiltersButton filterOn={filters.filterOn} updateFilters={updateFilters} />
        </div>
      </div>
      <Collapse in={filters.filterOn} timeout="auto" unmountOnExit={false}>
        <div className="mb-4 border bg-white p-4">
          <div className="flex flex-col gap-8 xl:flex-row">
            <SelectDateRange tempFilters={tempFilters} updateTempFilters={updateTempFilters} />
            <PaymentMethodFilter filters={tempFilters} updateFilters={updateTempFilters} />
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
      <TabContentV3
        filters={filters}
        updateFilters={updateFilters}
        tabConfigurations={returnTabs}
      />
      {/* <div>
        <pre>{JSON.stringify(queryString)}</pre>
      </div> */}
      <DynamicReturnTable
        columns={returnTable}
        rows={data?.requested_orders?.data}
        loading={isLoading}
        isFetching={isFetching}
        filters={filters}
        updateFilters={updateFilters}
      />
      <div className="pt-5">
        <CustomPaginationV2
          filters={filters}
          updateFilters={updateFilters}
          total={data?.requested_orders?.total || 0}
        />
      </div>
    </div>
  );
};

export default DashboardReturnPageV2;
