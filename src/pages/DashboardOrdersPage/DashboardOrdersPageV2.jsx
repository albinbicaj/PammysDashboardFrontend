import { useState } from 'react';
import useDocumentTitle from '../../components/useDocumentTitle';
import axiosInstance from '../../utils/axios';
import showToast from '../../hooks/useToast';
import useFilters from '../../hooks/useFilters';
import CustomPaginationV2 from '../../components/molecules/CustomPagination/CustomPaginationV2';
import { useOrders } from '../../apiHooks/useOrders';
import { Checkbox, Collapse, Switch, Tooltip } from '@mui/material';
import DownloadCSVButton from '../../components/atoms/DownloadCSVButton/DownloadCSVButton';
import { DynamicOrdersTable } from '../Dashboard/components/Tables/DynamicOrdersTable/DynamicOrdersTable';
import SelectDateRange from '../Dashboard/components/ReturnFilters/SelectDateRange';
import { PaymentMethodFilter } from '../../components/molecules/PaymentMethodFilter/PaymentMethodFilter';
import { ordersFiltersQuery } from '../../utils/dashboard/ordersFiltersQuery';
import { Controller, useForm } from 'react-hook-form';
import { TagsStringFilter } from '../Dashboard/components/DynamicReturnTable/components/TagsStringFilter';
import { PaymentMethodArrayFilter } from '../Dashboard/components/DynamicReturnTable/components/PaymentMethodArrayFilter';
import { BarcodeListFilter } from '../Dashboard/components/DynamicReturnTable/components/BarcodeListFilter';
import { StatusArrayFilter } from '../Dashboard/components/DynamicReturnTable/components/StatusArrayFilter';

// const ordersFilters = {
//   filterOn: false,
//   page: 1, // Current page for pagination
//   perPage: 10, // Items per page for pagination
//   sortBy: 'asc', // Default sorting direction
//   sortWith: '', // Field to sort by
//   monitor: false,

//   order_name: '',
//   from: '',
//   costumer: '',
//   tags: '',
//   shipping_method: '',
//   status: '',
//   payment: '',

//   startDate: '',
//   endDate: '',
//   date_exclude: false,

//   tag_exclude: false,
//   barcode: '',
//   barcode_exclude: false,
//   barcode_strict: false,
//   filter_address: '',

//   payment_exclude: false,
//   address_exclude: false,
// };
const ordersFilters = {
  filterOn: false,
  page: 1, // Current page for pagination
  perPage: 10, // Items per page for pagination
  sortBy: 'asc', // Default sorting direction
  sortWith: '', // Field to sort by
  monitor: false,

  // table header
  order_name: '',
  from: '',
  costumer: '',
  // on table header and custom filter section
  // tags: '',

  //custom filters
  startDate: '',
  endDate: '',
  date_exclude: false,

  // tags
  tags: '',
  tag_exclude: false,

  // barcode
  barcode: '',
  barcode_exclude: false,
  barcode_strict: false,

  // filter addrese: true/false; 0/1
  filter_address: '',

  // filter inventory: true/false; 0/1
  filter_inventory: '',

  // payment_method
  paymentMethod: [],
  payment: '',
  payment_exclude: false,

  // status
  status: [],
  status_exclude: false,

  // shipping method
  shipping_method: '',
  shipping_method_exclude: false,

  // incoming inventory, pending
  incoming_inventory: '',

  address_exclude: false,
};

const filterAddressOptions = [
  { value: '', label: 'Alle' },
  { value: '1', label: 'Richtig' },
  { value: '0', label: 'Falsch' },
];
const shippingMethosOptions = [
  { value: '', label: 'Alle' },
  { value: 'dhl_paket', label: 'DHL Paket' },
  { value: 'dhl_paget_international', label: 'DHL Paket International' },
];

const DashboardOrdersPageV2 = () => {
  useDocumentTitle('Pammys | Dashboard Orders');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    filters: filtersV2,
    updateFilters,
    tempFilters,
    updateTempFilters,
    resetFilters,
    applyFilters,
  } = useFilters(ordersFilters);
  // const queryString = filterQueryV2(filtersV2);
  const queryString = ordersFiltersQuery(filtersV2);
  // console.log('queryString');
  // console.log(queryString);
  const { data = [], isLoading, isError, isFetching, refetch } = useOrders(queryString);

  const fetchOrdersFromStore = async () => {
    setLoading(true);
    // setLoadingFullTable(true);
    // setLoadingTable(true);
    try {
      const response = await axiosInstance
        .get(`/order/store-orders`)
        .then((response) => {
          showToast('Erfolgreich abgeholte Aufträge', 'success');
        })
        .catch((error) => {
          console.error(error);
          showToast('Etwas ist schief gelaufen', 'failure');
        });
    } catch (error) {
      console.error(error);
      showToast('Etwas ist schief gelaufen', 'failure');
      // setLoadingTable(false);
      // setLoadingFullTable(false);
    } finally {
      // setLoadingTable(false);
      setLoading(false);
      refetch();
    }
  };

  return (
    // <div className={loadingFullTable ? 'xentral-container relative' : 'xentral-container'}>
    <div className="xentral-container relative">
      <div className=" flex items-center justify-between border bg-white px-4 py-4">
        <div>
          {/* <PermissionCheck>
            <button disabled={loading} onClick={fetchOrdersFromStore} className="btn btn-primary">
              {loading ? 'Laden...' : 'Synchronisieren/Abrufen von Bestellungen aus dem Geschäft'}
            </button>
          </PermissionCheck> */}
        </div>
        <div className="flex items-center justify-around gap-6">
          <div className="flex items-center pl-3">
            <p>Monitor</p>
            <Switch
              type="checkbox"
              checked={filtersV2.monitor}
              onChange={() => updateFilters({ monitor: !filtersV2.monitor })}
            />
          </div>
          <DownloadCSVButton
            text="Download CSV"
            endpoint="order/get-orders-csv"
            query={queryString}
            fileName="orders"
            // disabled={orders?.orders?.data.length === 0}
            disabled={false}
          />
          <div
            className={`btn  ${filtersV2.filterOn ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => updateFilters({ filterOn: !filtersV2.filterOn })}
          >
            {filtersV2.filterOn ? 'Filter ausblenden' : 'Filter einblenden'}
          </div>
        </div>
      </div>
      <Collapse in={filtersV2.filterOn} timeout="auto" unmountOnExit={false}>
        <div className="mt-4 border bg-white p-4">
          <div className="mb-4 border bg-white p-4">
            <div className="flex flex-col flex-wrap gap-12 xl:flex-row">
              <SelectDateRange tempFilters={tempFilters} updateTempFilters={updateTempFilters} />
              <div className="flex min-w-[300px] max-w-[400px] flex-col gap-8">
                <div>
                  <TagsStringFilter filters={tempFilters} updateFilters={updateTempFilters} />
                  <div className="ml-2 flex items-center text-sm">
                    Exlude tags
                    <Tooltip title="ausschließen" placement="top" arrow>
                      <Checkbox
                        checked={tempFilters.tag_exclude ?? false}
                        onChange={(e) => updateTempFilters({ tag_exclude: e.target.checked })}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div>
                  <BarcodeListFilter filters={tempFilters} updateFilters={updateTempFilters} />
                  <div className="ml-2 flex items-center text-sm">
                    Exlude Artikel
                    <Tooltip title="ausschließen" placement="top" arrow>
                      <Checkbox
                        checked={tempFilters.barcode_exclude ?? false}
                        onChange={(e) => updateTempFilters({ barcode_exclude: e.target.checked })}
                      />
                    </Tooltip>
                  </div>
                  <div className="ml-2 flex items-center text-sm">
                    Strict Artikel
                    <Tooltip title="ausschließen" placement="top" arrow>
                      <Checkbox
                        checked={tempFilters.barcode_strict ?? false}
                        onChange={(e) => updateTempFilters({ barcode_strict: e.target.checked })}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="mt-2 flex-col items-center ">
                  <span className="pb-4 font-semibold">Adresse filtern:</span>
                  <div className="flex items-center">
                    <select
                      value={tempFilters.filter_address}
                      onChange={(e) => updateTempFilters({ filter_address: e.target.value })}
                      className="w-full rounded-md border p-2"
                    >
                      {filterAddressOptions.map((option) => (
                        <option key={`ad23454fduhif-${option.value}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {/* <div className="ml-2 flex items-center text-sm">
                    <Tooltip title="ausschließen" placement="top" arrow>
                      <Checkbox
                        checked={filtersV2.address_exclude ?? false}
                        onChange={(e) => updateFilters({ address_exclude: e.target.checked })}
                      />
                    </Tooltip>
                  </div> */}
                  </div>
                </div>
                <div className="mt-2 flex-col items-center ">
                  <span className="pb-4 font-semibold">Filterbestand:</span>
                  <div className="flex items-center">
                    <select
                      value={tempFilters.filter_inventory}
                      onChange={(e) => updateTempFilters({ filter_inventory: e.target.value })}
                      className="w-full rounded-md border p-2"
                    >
                      {filterAddressOptions.map((option) => (
                        <option key={`adqwpvpjduhif-${option.value}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex min-w-[300px] max-w-[400px] flex-col gap-8">
                <div>
                  <PaymentMethodArrayFilter
                    filters={tempFilters}
                    updateFilters={updateTempFilters}
                  />
                  <div className="ml-2 flex items-center text-sm">
                    Exlude Zahlungsmethode
                    <Tooltip title="ausschließen" placement="top" arrow>
                      <Checkbox
                        checked={tempFilters.payment_exclude ?? false}
                        onChange={(e) => updateTempFilters({ payment_exclude: e.target.checked })}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div>
                  <StatusArrayFilter filters={tempFilters} updateFilters={updateTempFilters} />
                  <div className="ml-2 flex items-center text-sm">
                    Exlude status
                    <Tooltip title="ausschließen" placement="top" arrow>
                      <Checkbox
                        checked={tempFilters.status_exclude ?? false}
                        onChange={(e) => updateTempFilters({ status_exclude: e.target.checked })}
                      />
                    </Tooltip>
                  </div>
                </div>
                {/* <div className="mt-2 flex-col items-center ">
                  <span className="pb-4 font-semibold">Status:</span>
                  <div className="flex items-center">
                    <select
                      value={tempFilters.status}
                      onChange={(e) => updateTempFilters({ status: e.target.value })}
                      className="rounded-md border p-2 w-full"
                    >
                      {statusOptions.map((option) => (
                        <option key={`adqwpvpjduhif-${option.value}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="ml-2 flex items-center text-sm">
                      <Tooltip title="ausschließen" placement="top" arrow>
                        <Checkbox
                          checked={tempFilters.status_exclude ?? false}
                          onChange={(e) => updateTempFilters({ status_exclude: e.target.checked })}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div> */}
                <div className="mt-2 flex-col items-center ">
                  <span className="pb-4 font-semibold">VersandartShipping method:</span>
                  <div className="flex items-center">
                    <select
                      value={tempFilters.shipping_method}
                      onChange={(e) => updateTempFilters({ shipping_method: e.target.value })}
                      className="w-full rounded-md border p-2"
                    >
                      {shippingMethosOptions.map((option) => (
                        <option key={`adqwpvpjduhif-${option.value}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center text-sm">
                    Exlude VersandartShipping
                    <Tooltip title="ausschließen" placement="top" arrow>
                      <Checkbox
                        checked={tempFilters.shipping_method_exclude ?? false}
                        onChange={(e) =>
                          updateTempFilters({ shipping_method_exclude: e.target.checked })
                        }
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="mt-2 flex-col items-center ">
                  <span className="pb-4 font-semibold">Eingehender Bestand:</span>
                  <div className="flex items-center">
                    <select
                      value={tempFilters.incoming_inventory}
                      onChange={(e) => updateTempFilters({ incoming_inventory: e.target.value })}
                      className="w-full rounded-md border p-2"
                    >
                      {filterAddressOptions.map((option) => (
                        <option key={`ad23454fduhif-${option.value}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* <div className="mt-2 flex-col items-center ">
                <span className="pb-4 font-semibold">Zahlungsmethode:</span>
                <div className="flex items-center">
                  <select
                    value={tempFilters.payment}
                    onChange={(e) => updateTempFilters({ payment: e.target.value })}
                    className="rounded-md border p-2 w-full"
                  >
                    {paymentOptions.map((option) => (
                      <option key={`adkfbjalfduhif-${option.value}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                
                  <div className="ml-2 flex items-center text-sm">
                    <Tooltip title="ausschließen" placement="top" arrow>
                      <Checkbox
                        checked={tempFilters.payment_exclude ?? false}
                        onChange={(e) => updateTempFilters({ payment_exclude: e.target.checked })}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div> */}
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
          <div></div>
          {/* <OrdersFormContentV3 filters={filtersV2} updateFilters={updateFilters} /> */}
        </div>
      </Collapse>
      <pre className="pt-4">{JSON.stringify(queryString, null, 2)}</pre>
      <div className="pt-4">
        <DynamicOrdersTable
          rows={data?.orders?.data || []}
          // columns={orderColumns}
          loading={isLoading}
          isLoading={isLoading}
          isFetching={isFetching}
          filters={filtersV2}
          updateFilters={updateFilters}
          refetch={refetch}
        />
      </div>
      <div className="pt-4">
        <CustomPaginationV2
          filters={filtersV2}
          updateFilters={updateFilters}
          total={data?.orders?.total || 0}
        />
      </div>
      {/* <div>
        <pre>{JSON.stringify(data?.orders?.data, null, 2)}</pre>
      </div> */}
      <div className="grid grid-cols-2">
        <div>
          Active
          <pre>{JSON.stringify(filtersV2, null, 2)}</pre>
        </div>
        <div>
          Temp
          <pre>{JSON.stringify(tempFilters, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
export default DashboardOrdersPageV2;
