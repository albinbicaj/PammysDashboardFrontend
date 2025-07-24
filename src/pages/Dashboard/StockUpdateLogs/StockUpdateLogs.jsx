import { IconArrowLeft, IconLoader2 } from '@tabler/icons-react';
import { useStockUpdateLogs } from '../../../apiHooks/useStockUpdateLogs';
import CustomPaginationV2 from '../../../components/molecules/CustomPagination/CustomPaginationV2';
import { Layout } from '../../../components/template';
import useFilters from '../../../hooks/useFilters';
import { filterQuery } from '../../../utils/dashboard/filterHelpers';
import { formatDate } from '../../../utils/dateAndTime/formatDate';
import { Link, useLocation } from 'react-router-dom';
import { useRef } from 'react';

const stockLogFilter = {
  page: 1, // Current page for pagination
  perPage: 10, // Items per page for pagination
  sku: '',
};

const StockUpdateLogs = () => {
  const location = useLocation();
  // Store the initial query string only once (first mount)
  const initialQueryStringRef = useRef(location?.state?.queryString || '');
  // This value will never change across re-renders
  const productsQuery = initialQueryStringRef.current;
  // const productsQuery = location?.state?.queryString || '';

  const { filters, updateFilters } = useFilters(stockLogFilter);
  const queryString = filterQuery(filters);
  console.log(queryString);
  const { isLoading, isFetching, error, data } = useStockUpdateLogs(queryString);

  const logs = data?.logs?.data || [];

  // if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong.</div>;

  return (
    <>
      <div className="border bg-white  shadow">
        <div className="flex items-center gap-5  p-4">
          <Link to={`/dashboard/products?${productsQuery}`}>
            <IconArrowLeft />
          </Link>
          <h1 className=" text-xl font-semibold">Stock Update Logs</h1>
          <p>{filters?.sku?.trim() !== '' ? filters?.sku : ''}</p>
          <div className="ml-auto">
            <IconLoader2
              className={`${isLoading || isFetching ? 'opacity-100' : 'opacity-0'} animate-spin duration-100`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {/* <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th> */}
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Item Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">SKU</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Changed on
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Adjustment
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Old Qty</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">New Qty</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Changed</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs?.map((log) => (
                <tr key={`DANOLIUUqwdoIUB-${log?.id}`}>
                  {/* <td className="px-4 py-2 text-sm">{log.id}</td> */}
                  <td className="px-4 py-2 text-sm">{log?.item_name}</td>
                  <td className="px-4 py-2 text-sm">{log?.sku}</td>
                  <td className="px-4 py-2 text-sm">{log?.update_target}</td>
                  <td className="px-4 py-2 text-sm capitalize">{log?.adjustment_type}</td>
                  <td className="px-4 py-2 text-sm">{log?.old_quantity}</td>
                  <td className="px-4 py-2 text-sm">{log?.new_quantity}</td>
                  <td className="px-4 py-2 text-sm">
                    {log?.quantity_change > 0 ? `+${log?.quantity_change}` : log?.quantity_change}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {log?.user?.first_name} {log?.user?.last_name?.slice(0, 1)}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {formatDate(log?.created_at, 'DD.MM.YYYY [um] HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CustomPaginationV2
        filters={filters}
        updateFilters={updateFilters}
        total={data?.logs?.total}
      />
    </>
  );
};

export default StockUpdateLogs;
