import { LoadingTablePlaceholder } from '../components/LoadingTablePlaceholder';
import { SortButtons } from '../components/SortButtons';
import { IconChevronDown, IconEdit, IconPencil, IconPencilCog, IconX } from '@tabler/icons-react';

import { orderColumns } from '../../../../../context/ordersColumns';
import { ordersColumnsV2 } from '../../../../../context/ordersColumnsV2';
import { useState } from 'react';
import { OrderDetailsRow } from './OrderDetailsRow';
import { formatDate } from '../../../../../utils/dateAndTime/formatDate';

import { Box, Checkbox, FormControlLabel, Modal, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { CheckMark, ShippingOrderIcon } from '../../../../../components/atoms';
import axiosInstance from '../../../../../utils/axios';

const getStatusBadgeData = (status) => {
  const lowerCaseStatus = status.trim().toLowerCase();
  switch (lowerCaseStatus) {
    case 'completed':
      return { classes: 'bg-green-200 text-green-700', text: 'Abgeschlossen' };
    case 'open':
      return { classes: 'bg-purple-200 text-purple-600', text: 'Offen' };
    case 'canceled':
      return { classes: 'bg-red-200 text-red-600', text: 'Abgebrochen' };
    case 'in_progress':
      return { classes: 'bg-yellow-200 text-yellow-700', text: 'In Bearbeitung' };
    default:
      return { classes: '', text: '' };
  }
};

export const DynamicOrdersTable = ({
  columns = [],
  rows = [],
  loading = true,
  isLoading = true,
  isFetching = false,
  selectedForRefund,
  handleCheck = () => {},
  handleCheckAll = () => {},
  filters = {},
  updateFilters = () => {},
  refetch = () => {},
}) => {
  const [expandedRows, setExpandedRows] = useState({});

  const [isModalLoading, setIsModalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [skipAddressValidation, setSkipAddressValidation] = useState(0);
  const [costumerUpdate, setCostumerUpdate] = useState(false);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalAmount = rows?.reduce((sum, row) => sum + parseFloat(row?.amount || 0), 0);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsModalLoading(true);
    data.skip_address_validation = skipAddressValidation ? 1 : 0;
    data.costumer_update = costumerUpdate ? true : false;
    try {
      console.log('function triggered');
      const response = await axiosInstance.post('order/update-shipping-address', data);
      console.log('THI GETS EXECUTED ONLY ON 200');
      if (response?.data?.error) {
        // // setSkipAddressValidation(false);
      } else {
        // setSnackbarMessage('Adresse erfolgreich aktualisiert');
        // setSnackbarSeverity('error');
        // setOpenModal(false);
        // setOpen(true);
        // // setSkipAddressValidation(false);
      }
      showToast('Adresse erfolgreich aktualisiert', 'success');
      console.log('patload:', response);
      console.log('patload:', response.status);
      // setSnackbarMessage('Adresse erfolgreich aktualisiert');
      // setSnackbarSeverity('error');
      // setOpenModal(false);
      // setOpen(true);

      refetch();

      // const cleanedQuery = removePageAndPaginate(saveQueryTable);
      // fetchOrders(
      //   true,
      //   `page=${page + 1}&paginate=${rowsPerPage}&${cleanedQuery}&monitor=${monitor}${saveTableParam}`,
      // );
    } catch (error) {
      showToast(error?.response?.data?.message, 'failure');
      // setSnackbarMessage(error?.response?.data?.message);
      // setSnackbarSeverity('error');
      // setOpenModal(false);
      // setOpen(true);

      console.error('Error submitting form:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
      }
    } finally {
      setOpenModal(false);
      setIsModalLoading(false);
      setSkipAddressValidation(false);
      setCostumerUpdate(false);
    }
  };

  const updateOrder = (row) => {
    reset({
      country: row?.country,
      shipping_address_country: row?.shipping_address_country,
      first_name: row?.shipping_address_first_name,
      last_name: row?.shipping_address_last_name,
      address1: row?.shipping_address_address1,
      address2: row?.shipping_address_address2,
      city: row?.shipping_address_city,
      zip: row?.shipping_address_zip,
      company: row?.shipping_address_company,
      country_code: row?.country_code,
      order_shopify_id: row?.shopify_order_id,
      costumer_update: row?.costumer_update,
      // skip_address_validation: row?.skip_address_validation,
    });
    setSkipAddressValidation(row?.skip_address_validation);
    setCostumerUpdate(row?.costumer_update);
    setOpenModal(true);
  };

  return (
    <>
      <div className="overflow-x-auto overflow-y-hidden ">
        <table className="w-full border-collapse  border bg-white text-sm">
          <thead>
            <tr>
              {ordersColumnsV2?.map((column) => (
                <th className="border">
                  <div className=" flex  flex-col gap-2  ">
                    <div className="flex  items-center justify-between px-2 pt-1 ">
                      <span
                        style={{
                          width: `${column.width}`,
                          margin: '0px',
                        }}
                        className="text-xs  text-black"
                      >
                        {column.headerName}
                      </span>
                      {column.sort === true ? (
                        <SortButtons
                          filters={filters}
                          updateFilters={updateFilters}
                          column={column}
                        />
                      ) : null}
                    </div>

                    {/* {column.field != 'expand_action' &&
                      column.field != 'actions' &&
                      column.field != 'unlimited_check' && (
                        <input
                          type="text"
                          placeholder={`Filter ${column.headerName}`}
                          value={columnFilters[column.field] || ''}
                          onChange={(e) => handleFilterChange(column, e.target.value)}
                          className="w-[80%] rounded-lg border border-gray-300 pl-2 "
                        />
                      )} */}
                    <div>
                      {column.search === true ? (
                        <div className="relative max-w-full border-t-2  text-gray-500 ">
                          <input
                            type="text"
                            placeholder={`Search field`}
                            value={filters[column.field] || ''}
                            onChange={(e) =>
                              updateFilters({ [column.field]: e.target.value, page: 1 })
                            }
                            className=" w-full py-1 pl-2 pr-7  font-light  "
                          />
                          {/* {filtersV2[column.field] !== '' ? ( */}
                          <div className="absolute bottom-0 right-2 top-0 flex items-center ">
                            <IconX
                              size={14}
                              className="cursor-pointer"
                              onClick={() => updateFilters({ [column.field]: '', page: 1 })}
                            />
                          </div>
                          {/* ) : null} */}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {/* <LoadingTablePlaceholder
          perPage={filters?.perPage || 10}
          colspan={11 || orderColumns?.length}
        /> */}
          {isLoading ? (
            <LoadingTablePlaceholder
              perPage={filters?.perPage || 10}
              colspan={9 || orderColumns?.length}
            />
          ) : (
            <tbody>
              {rows?.map((row) => {
                {
                  /* const [showRow, setShowRow] = useState(false); */
                }
                const showRow = !!expandedRows[row?.order_name];
                return (
                  <>
                    <tr
                      className={`border-b ${row.status === 'completed' ? 'bg-[#F7F7F7]' : 'bg-white'}`}
                    >
                      <td className="px-2 py-1.5">
                        <div className="flex gap-2">
                          <button
                            className={`click  ${showRow ? 'rotate-180' : ''}`}
                            onClick={() => toggleRow(row?.order_name)}
                          >
                            <IconChevronDown className="text-slate-500" size={20} />
                          </button>
                          <p>{row?.order_name}</p>
                        </div>
                      </td>
                      <td className="px-2 py-1.5">{formatDate(row?.from)}</td>
                      <td className="px-2 py-1.5">{row?.costumer}</td>
                      {/* <td className="px-2 py-1.5">{row?.tags}</td> */}
                      <td className="px-2 py-1.5">
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            try {
                              const tags = JSON.parse(row?.tags);
                              return Array.isArray(tags)
                                ? tags.map((tag, index) =>
                                    tag ? (
                                      <div
                                        key={index}
                                        className=" w-max rounded-full bg-gray-200 px-2 py-0 text-[10px] text-gray-600"
                                      >
                                        {tag}
                                      </div>
                                    ) : (
                                      <div key={index}>-</div>
                                    ),
                                  )
                                : row?.tags;
                            } catch (e) {
                              return row?.tags;
                            }
                          })()}
                        </div>
                      </td>
                      <td className="px-2 py-1.5">{row?.payment}</td>
                      <td className="px-2 py-1.5">
                        {new Intl.NumberFormat('de-DE', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(row?.amount)}
                      </td>
                      <td className="px-2 py-1.5">{row?.shipping_method}</td>
                      {/* <td className="px-2 py-1.5">{row?.status}</td> */}
                      <td className="px-2 py-1.5">
                        {(() => {
                          const statusData = getStatusBadgeData(row?.status);
                          return (
                            <div className={`badge w-max ${statusData.classes}`}>
                              {statusData.text}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-2 py-1.5">
                        <div className=" flex items-center justify-between gap-5 text-right">
                          <div className="">
                            <span className="flex items-center gap-2">
                              {row?.status === 'completed' ? (
                                <>
                                  <div className="flex h-[26px] items-center justify-center rounded-md bg-gray-300 pl-1 pr-[5px]">
                                    <CheckMark />
                                  </div>
                                  <div className="flex h-[26px] items-center justify-center rounded-md bg-gray-300 pl-1 pr-[5px]">
                                    <CheckMark />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    className={`${
                                      row?.shipping_address_correct === 0
                                        ? 'bg-red-300'
                                        : 'bg-green-300'
                                    } flex h-[26px] items-center justify-center rounded-md pl-1 pr-1`}
                                  >
                                    <ShippingOrderIcon />
                                  </div>
                                </>
                              )}
                            </span>
                          </div>

                          <div>
                            <button
                              className="ml-auto cursor-pointer "
                              onClick={() => updateOrder(row)}
                            >
                              <IconPencil className="click text-gray-400" size={16} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr
                      className={`${row.status === 'completed' ? 'bg-[#F7F7F7]' : 'bg-[#F7F7F7]'}`}
                    >
                      <td colSpan={9} className="p-0">
                        <OrderDetailsRow row={row} showRow={showRow} />
                      </td>
                    </tr>
                  </>
                );
              })}
              {!isLoading ? (
                <tr className="h-8 border-t-2 bg-white">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="text-end">Insgesamt:</td>
                  <td className="font-bold">
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(totalAmount)}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ) : null}
            </tbody>
          )}
        </table>
      </div>
      <Modal
        open={openModal}
        onBackdropClick={() => setOpenModal(false)}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-modal-description"
        sx={{ bgcolor: 'rgba(156, 163, 175, 0.75)' }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 620,
            bgcolor: '#ffffff',
            border: 'none',
            outline: 'none',
            p: 4,
            boxShadow: 24,
          }}
        >
          <div className=" mb-3 flex items-center justify-center">
            <p className="modal-title text-center text-xl font-bold">Adresse bearbeiten</p>
          </div>
          <p id="modal-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div>
                <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                  Land/Region
                </Typography>
                <Controller
                  name="shipping_address_country"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <div>
                      <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                    </div>
                  )}
                />
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                    Vornamen
                  </Typography>
                  <Controller
                    name="first_name"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                      </div>
                    )}
                  />
                  <Controller
                    name="country_code"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input
                          className="hidden h-8 w-full rounded-md border pl-2 text-sm"
                          {...field}
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="order_shopify_id"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input
                          className="hidden h-8 w-full rounded-md border pl-2 text-sm"
                          {...field}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                    Nachname
                  </Typography>
                  <Controller
                    name="last_name"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                      </div>
                    )}
                  />
                </div>
              </div>
              <div>
                <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                  Unternehmen
                </Typography>
                <Controller
                  name="company"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <div>
                      <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                    </div>
                  )}
                />
              </div>
              <div>
                <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                  Straße und Hausnummer
                </Typography>
                <Controller
                  name="address1"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <div>
                      <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                    </div>
                  )}
                />
              </div>
              <div>
                <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                  Zusätzliche Adresse
                </Typography>
                <Controller
                  name="address2"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <div>
                      <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                    </div>
                  )}
                />
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                    Postleitzahl
                  </Typography>
                  <Controller
                    name="zip"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                      </div>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                    Stadt
                  </Typography>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="flex-col items-center justify-between gap-3">
                <div>
                  <Controller
                    name="skip_address_validation"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            color="primary"
                            checked={skipAddressValidation}
                            onChange={(e) => setSkipAddressValidation(e.target.checked)}
                          />
                        }
                        label={<span className="text-[13px]">Drucken ohne Änderungen</span>}
                        sx={{ fontSize: '12px' }}
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="costumer_update"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            color="primary"
                            checked={costumerUpdate}
                            onChange={(e) => setCostumerUpdate(e.target.checked)}
                          />
                        }
                        label={
                          <span className="text-[13px]">
                            Aktualisieren Sie die Adresse des Kunden auch in seinem Profil in
                            Shopify.
                          </span>
                        }
                        sx={{ fontSize: '12px' }}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-center gap-5">
                <div onClick={() => setOpenModal(false)} className="btn btn-default cursor-pointer">
                  Abbrechen
                </div>
                <button className="btn btn-primary" disabled={isModalLoading}>
                  {isModalLoading ? 'Aktualisierung...' : 'Speichern Sie'}
                </button>
              </div>
            </form>
          </p>
        </Box>
      </Modal>
    </>
  );
};
