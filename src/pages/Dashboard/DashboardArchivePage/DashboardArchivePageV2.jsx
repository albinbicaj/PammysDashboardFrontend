import { archiveTable } from '../../../data/tables/archiveTable';
import useReturnsFilter from '../../../hooks/useReturnsFilter';
import FiltersSearchBar from '../../Dashboard/components/ReturnFilters/FiltersSearchBar';
import { deletedRequestedOrders } from '../../../apiHooks/useOrders';
import { archivedQuery } from '../../../utils/dashboard/returnFilterHelpers';
import ActiveFilters from '../../Dashboard/components/ReturnFilters/ActiveFilters';
import { DynamicReturnTable } from '../../Dashboard/components/DynamicReturnTable/DynamicReturnTable';
import CustomPaginationV2 from '../../../components/molecules/CustomPagination/CustomPaginationV2';
import { archivedFilter } from '../../../data/schemas/returnsFilter';
import { hasActiveFilters } from '../../../utils/helpers';

const DashboardArchivePageV2 = () => {
  const { filters, updateFilters } = useReturnsFilter(archivedFilter);
  const queryString = archivedQuery(filters);
  const { isLoading, isFetching, error, data } = deletedRequestedOrders(queryString);

  return (
    <div className="returns-container">
      <div className="mb-4 flex justify-between border  bg-white p-4">
        <FiltersSearchBar updateFilters={updateFilters} />
      </div>
      {hasActiveFilters(filters) && (
        <ActiveFilters
          className="col-span-2 mb-4"
          filters={filters}
          updateFilters={updateFilters}
        />
      )}
      <DynamicReturnTable
        columns={archiveTable}
        rows={data?.deleted_requested_orders}
        loading={isLoading}
        isFetching={isFetching}
        filters={filters}
        updateFilters={updateFilters}
      />
      <div className="pt-5">
        <CustomPaginationV2 filters={filters} updateFilters={updateFilters} total={data?.total} />
      </div>
    </div>
  );
};

export default DashboardArchivePageV2;
