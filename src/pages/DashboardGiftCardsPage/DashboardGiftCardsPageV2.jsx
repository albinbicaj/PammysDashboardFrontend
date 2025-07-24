import { giftCardTable, giftCardTabs } from '../../data/tables/giftCardTable';
import { Collapse } from '@mui/material';
import { PaymentMethodFilter } from '../../components/molecules/PaymentMethodFilter/PaymentMethodFilter';
import useReturnsFilter from '../../hooks/useReturnsFilter';
import FiltersSearchBar from '../Dashboard/components/ReturnFilters/FiltersSearchBar';
import SelectDateRange from '../Dashboard/components/ReturnFilters/SelectDateRange';
import { useAllOrders } from '../../apiHooks/useOrders';
import { giftCardQuery } from '../../utils/dashboard/returnFilterHelpers';
import ActiveFilters from '../Dashboard/components/ReturnFilters/ActiveFilters';
import { DynamicReturnTable } from '../Dashboard/components/DynamicReturnTable/DynamicReturnTable';
import CustomPaginationV2 from '../../components/molecules/CustomPagination/CustomPaginationV2';
import { ToggleFiltersButton } from '../../components/atoms/Buttons/ToggleFiltersButton';
import { TabContentV3 } from '../../components/molecules/TabContent/TabContentV3';
import { returnsGiftCardFilter } from '../../data/schemas/returnsFilter';
import { hasActiveFilters } from '../../utils/helpers';

const DashboardGiftCardsPageV2 = () => {
  const { filters, updateFilters, tempFilters, updateTempFilters, resetFilters, applyFilters } =
    useReturnsFilter(returnsGiftCardFilter);

  const queryString = giftCardQuery(filters);
  const { isLoading, isFetching, error, data } = useAllOrders(queryString);

  return (
    <div className="returns-container">
      <div className="  mb-4 flex justify-between border  bg-white p-4">
        <FiltersSearchBar updateFilters={updateFilters} />
        <ToggleFiltersButton filterOn={filters.filterOn} updateFilters={updateFilters} />
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
        tabConfigurations={giftCardTabs}
      />
      <DynamicReturnTable
        columns={giftCardTable}
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
          total={data?.requested_orders?.total}
        />
      </div>
    </div>
  );
};

export default DashboardGiftCardsPageV2;
