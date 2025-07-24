import React from 'react';
import { Checkbox } from '@mui/material';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { convertToDE } from '../../../../utils';
import { TypeEnum } from '../../../../enums/Type.enum';
import { getStatusDE } from '../../../../utils/getStatusDE';
import { LoadingTablePlaceholder } from './components/LoadingTablePlaceholder';
import { SortButtons } from './components/SortButtons';
import { IconZoomExclamationFilled } from '@tabler/icons-react';

const checkItemReasons = (itemReasons) => {
  const reasonsArray = itemReasons.split(',').map(Number);
  const has5 = reasonsArray.includes(5);
  const has7 = reasonsArray.includes(7);

  if (has5 && has7) {
    return 'FL / RE';
  } else if (has5) {
    return 'RE';
  } else if (has7) {
    return 'FL';
  } else {
    return '';
  }
};

// Helper function to get class name for status
const getStatusClassName = (status = '') => {
  const switchStatus = status.toLowerCase();
  switch (switchStatus) {
    case 'requested':
      return 'bg-yellow-200 text-yellow-700';
    case 'partially':
      return 'bg-purple-200 text-purple-600';
    case 'approved':
      return 'bg-green-200 text-green-700';
    case 'rejected':
      return 'bg-red-200 text-red-600';
    case 'archived':
      return 'bg-gray-200 text-gray-600';
    default:
      return 'bg-green-200 text-green-700';
  }
};

export const DynamicReturnTable = ({
  columns = [],
  rows = [],
  loading = true,
  isFetching = false,
  selectedForRefund,
  handleCheck = () => {},
  handleCheckAll = () => {},
  filters = {},
  updateFilters = () => {},
}) => {
  const renderColumnField = (column, row, index) => {
    switch (column.field) {
      case 'action':
        return (
          <div className="px-4">
            <Checkbox
              onChange={(e) => handleCheck(e, row)}
              checked={selectedForRefund.includes(row.barcode_number)}
            />
          </div>
        );
      case 'refund_created_at':
        return (
          <Link to={`/dashboard/order?return_id=${row.barcode_number}`} className="drt-td">
            <div className="text-nowrap">
              {dayjs(row.refund_created_at).format('DD.MM.YYYY [um] HH:mm')}
            </div>
          </Link>
        );
      case 'created_at':
        return (
          <Link to={`/dashboard/order?return_id=${row.barcode_number}`} className="drt-td">
            <div className="text-nowrap">
              {dayjs(row.created_at).format('DD.MM.YYYY [um] HH:mm')}
            </div>
          </Link>
        );
      case 'barcode_number':
        return (
          <Link
            to={`/dashboard/order?return_id=${row[column.field]}`}
            target="_blank"
            className="drt-td"
          >
            {row[column.field]}
          </Link>
        );
      case 'order_number':
        return (
          <Link to={`${row.shopify_order_path}`} target="_blank" className="drt-td">
            {row[column.field]}
          </Link>
        );
      case 'total_price':
        return (
          <Link to={`/dashboard/order?return_id=${row.barcode_number}`} className="p-4">
            {convertToDE(row.total_price)}
          </Link>
        );
      case 'status':
        return (
          <Link to={`/dashboard/order?return_id=${row.barcode_number}`} className="drt-td">
            <div className={`w-max ${getStatusClassName(row[column.field])} badge`}>
              <span>{getStatusDE(row[column.field])}</span>
            </div>
          </Link>
        );
      case 'type':
        return (
          <Link to={`/dashboard/order?return_id=${row.barcode_number}`} className="drt-td">
            <div className="badge-neutral">
              {row[column.field] === TypeEnum.RETURN ? (
                <>Rückgabe</>
              ) : row[column.field] === TypeEnum.EXCHANGE ? (
                checkItemReasons(row?.item_reasons || '').includes('RE') ||
                checkItemReasons(row?.item_reasons || '').includes('FL') ? (
                  <>Ersatzlieferung</>
                ) : (
                  <>Umtausch</>
                )
              ) : (
                <>Rückgabe & Umtausch</>
              )}{' '}
              {checkItemReasons(row?.item_reasons || '')}
            </div>
          </Link>
        );
      case 'refund_type':
        return (
          <Link to={`/dashboard/order?return_id=${row.barcode_number}`} className="drt-td">
            {row[column.field] === 'Gift Card' ? (
              <span className={`${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                Geschenkcode
              </span>
            ) : (
              <span className={`${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                Rückerstattung
              </span>
            )}
          </Link>
        );
      default:
        return (
          <Link
            to={`/dashboard/order?return_id=${row.barcode_number}`}
            className={`drt-td ${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}
          >
            {row[column.field]}
          </Link>
        );
    }
  };

  return (
    <div className="overflow-x-auto overflow-y-hidden ">
      <table className="w-full border-collapse  border bg-white text-sm">
        <thead className="border-b">
          <tr>
            {columns.map((column, id) =>
              column.field === 'action' ? (
                <th className="custom-header px-4 text-left" key={`IkicnkoF-${id}`}>
                  <Checkbox
                    indeterminate={
                      selectedForRefund.length > 0 && selectedForRefund.length < rows.length
                    }
                    onChange={handleCheckAll}
                    checked={rows.length > 0 && rows.length === selectedForRefund.length}
                  />
                </th>
              ) : (
                <th className="custom-header text-gray border-2 px-3 py-2" key={`IkicnkoF-${id}`}>
                  <div className=" flex items-center justify-between gap-3">
                    <p>{column.headerName}</p>
                    {column.sort === true ? (
                      <SortButtons
                        filters={filters}
                        updateFilters={updateFilters}
                        column={column}
                      />
                    ) : null}
                  </div>
                </th>
              ),
            )}
          </tr>
        </thead>

        {loading || isFetching ? (
          <LoadingTablePlaceholder perPage={filters.perPage || 10} colspan={columns.length} />
        ) : rows.length === 0 ? (
          <tbody>
            <tr key="awfeiuqodnbaut" style={{ height: `${filters.perPage * 43}px` }}>
              <td colSpan={columns.length}>
                <div className="flex flex-col items-center justify-center gap-5 text-center text-xl">
                  <IconZoomExclamationFilled size={64} className="text-gray-300" />
                  <p> Keine Artikel entsprechen Ihrer Suche.</p>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {rows.map((row) => (
              <tr className="cursor-pointer border-b" key={row.barcode_number}>
                {columns.map((column) => (
                  <td key={column.field}>{renderColumnField(column, row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};
