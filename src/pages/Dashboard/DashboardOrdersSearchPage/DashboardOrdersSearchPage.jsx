import axios from '../../../utils/axios';
import queryString from 'query-string';
import useDocumentTitle from '../../../components/useDocumentTitle';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { PammysLoading } from '../../../components/atoms/PammysLoading/PammysLoading';
import axiosInstance from '../../../utils/axios';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { IconCash, IconPackage, IconScan, IconUserCircle } from '@tabler/icons-react';

const DashboardOrdersSearchPage = () => {
  const query = useQueryParams();
  const searchValue = query.get('searchValue');
  const navigate = useNavigate();
  // useDocumentTitle('Pummys | Archiv');

  // const location = useLocation();

  // Extract query parameters from the URL
  // const parsed = queryString.parse(location.search);

  const { isLoading, error, data } = useQuery({
    queryKey: ['dashboardStats', searchValue],
    queryFn: () => axiosInstance.get(`/search-requested-orders?search=${searchValue}`),
  });

  if (isLoading) {
    return <PammysLoading />;
  }
  if (data.data.status_code === 404) {
    console.log(error);
    return <>No orderd found</>;
  }
  if (data?.data?.orders?.length === 1) {
    navigate(`/dashboard/order?return_id=${data?.data?.orders[0].barcode_number}`);
    console.log(data?.data?.orders.length);
  }
  return (
    <div className="search-container space-y-5">
      <div className="card ">
        <p className="text-xl font-bold">DHL Label Search results</p>
        <p className="">barcode: {searchValue}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 ">
        {data?.data?.orders.map((item, index) => (
          <Link
            to={`/dashboard/order?return_id=${item.barcode_number}`}
            key={`R07MghvxXs7lIRvE${item.id}`}
            className="btn group overflow-hidden rounded-lg bg-white p-3 text-sm drop-shadow hover:drop-shadow-md"
          >
            <div className=" flex items-center gap-2">
              <IconUserCircle className="min-w-4 text-orange-300" size={16} />
              <p className=" font-semibold">{item.full_name}</p>
            </div>
            <div className=" flex items-center gap-2">
              <IconPackage className="min-w-4 text-orange-300" size={16} />
              <p className=" ">{item.barcode_number}</p>
            </div>
            <div className=" flex items-center gap-2">
              <IconScan className="min-w-4 text-orange-300" size={16} />
              <p className=" ">{item.order_number}</p>
            </div>
            <div className=" flex items-center gap-2">
              <IconCash className="min-w-4 text-orange-300" size={16} />
              <p className=" ">{item.payment_method}</p>
            </div>
          </Link>
        ))}
      </div>
      {/* <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default DashboardOrdersSearchPage;
