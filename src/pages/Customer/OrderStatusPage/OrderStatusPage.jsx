import { CustomerLayout } from '../../../components/template/CustomerLayout';
import { useState } from 'react';
import { t } from 'i18next';
import { IconArrowBackUp, IconHash } from '@tabler/icons-react';
import axiosInstance from '../../../utils/axios';
import { PammysLoading } from '../../../components/atoms/PammysLoading/PammysLoading';
import { OrderStatusPageFooter } from './components/OrderStatusPageFooter';
import {
  FulfillmentStatus,
  OrderShippingStatus,
  ReturnStatus,
  ShippingStatus,
} from './components/StatusHandler';
import dayjs from 'dayjs';
import { OrderStatusPageFooterV2 } from './components/OrderStatusPageFooterV2';
import { useLocation } from 'react-router-dom';
import showToast from '../../../hooks/useToast';
// const initialFormState = {
//   order_number: '',
//   email: '',
// };
// const initialFormState = {
//   order_number: '12673124',
//   email: 'c.groeting@gmx.de',
// };
const initialFormState = {
  order_number: '12347374',
  email: 'kerstin21.05.kw@gmail.com',
};

function formatPrice(price) {
  // Ensure price is a number
  let numericPrice = parseFloat(price);

  // Check if it's a valid number
  if (isNaN(numericPrice)) {
    // return NaN;
    return 'Invalid price';
  }

  // Format the price to two decimal places and replace dot with comma
  // let formattedPrice = numericPrice.toFixed(2).replace('.', ',');
  let formattedPrice = numericPrice.toFixed(2);

  // Append the euro sign
  return `${formattedPrice} €`;
}

// const checkReturn = (tags = '') => {
//   if (!tags) {
//     return false; // Handle null, undefined, or empty strings
//   }
//   // Convert tags to lowercase for case-insensitive matching (optional)
//   const lowerCaseTags = tags?.toLowerCase() || '';

//   // Check if the tags string includes 'rückgabe' or 'falschelieferung-o'
//   if (lowerCaseTags.includes('rückgabe') || lowerCaseTags.includes('falschelieferung-o')) {
//     return true; // Or return a specific value/message if needed
//   }

//   return false;
// };

const OrderStatusPage = () => {
  const [form, setForm] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Updated form');
    console.log(form);
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/shopify-order-status?&order_number=${encodeURIComponent(form.order_number)}&email=${encodeURIComponent(form.email)}`,
      );
      if (response?.data?.status_code === 200) {
        setOrder(response?.data);
        showToast(`${response?.data?.message}`, 'success');
      }
      console.log('response');
      console.log(response);
    } catch (error) {
      showToast(`${error.message}`, 'failure');
      console.log('Something went wrong! code: #bq9Pw');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isVorbestellung = (order?.data?.notes || '').toLowerCase().includes('vorbestellung');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const extractDate = (text) => {
    const datePattern = /\b\d{2}\.\d{2}\.\d{4}\b/;
    const match = text.match(datePattern);
    return match ? match[0] : null;
  };

  return (
    <CustomerLayout>
      <div
        className={`sticky top-0 flex items-center justify-between gap-3 border-b bg-white px-4 lg:px-6`}
      >
        {/* <p className=" text-right text-base font-bold md:text-xl">Check order status</p> */}
        <div className="min-w-10">
          {order?.status_code === 200 ? (
            <button className="btn btn-secondary p-2" onClick={() => setOrder(null)}>
              <IconArrowBackUp />
            </button>
          ) : null}
        </div>
        <img
          className="my-4 max-w-24 bg-cover sm:max-w-32"
          src="/images/new/logo-new.svg"
          alt="Pammy's Logo."
        />
        <div className="min-w-10 scale-75">{isLoading ? <PammysLoading /> : null}</div>
      </div>
      <div className="bg-slate-50">
        {order?.status_code === 200 ? (
          <div className="space-y-14 overflow-y-auto bg-slate-50  px-4 pb-6 pt-12">
            <div className="  text-center ">
              <p className="pb-2 text-xl font-bold">Bestellung {order?.data?.order_name}</p>
              {isVorbestellung ? (
                <>
                  <p className="text-accent">Du hast eine Vorbestellung getätigt.</p>
                  <p className="text-accent">
                    Voraussichtliches Lieferdatum: ab dem {extractDate(order?.data?.notes)}
                  </p>
                </>
              ) : null}
            </div>
            <div className="space-y-8 bg-white p-4 ">
              <div className=" flex justify-between ">
                <div className="flex flex-col justify-between">
                  <div className="">
                    <p className=" font-semibold">Bestellnummer:</p>
                    <p className="">{order?.data?.order_name}</p>
                  </div>
                  <div className="">
                    <p className=" font-semibold">Bestelldatum:</p>

                    <p className="">
                      {dayjs(order?.data?.created_at, 'DD.MM.YYYY HH:mm:ss').format('DD.MM.YYYY')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className=" font-semibold">Lieferadresse:</p>
                  <p className="">
                    {order?.data?.shipping_address?.first_name}{' '}
                    {order?.data?.shipping_address?.last_name}
                  </p>
                  <p className="">
                    {order?.data?.shipping_address?.address1}{' '}
                    {order?.data?.shipping_address?.address2}
                  </p>
                  <p className="">
                    {order?.data?.shipping_address?.zip} {order?.data?.shipping_address?.city}
                  </p>
                  <p className="">
                    {t(`countries.${order?.data?.shipping_address?.country_code}`)}
                  </p>
                </div>
              </div>

              {order?.data?.status ? (
                <div className="">
                  <p className=" font-semibold">Bestellstatus:</p>
                  <p className="flex justify-between">
                    <span>Status:</span>
                    <ReturnStatus status={order?.data?.status} />
                  </p>
                  <p className="flex justify-between">
                    {/* falschlieferung-o,  */}
                    Sendungsverfolgung:
                    <span className="pl-3 text-blue-500">
                      {order?.data?.requested_tracking_number}
                    </span>
                  </p>
                  <p className="flex justify-between text-gray-300">
                    {/* falschlieferung-o,  */}
                    Return Status:
                    <span>{JSON.stringify(order?.data?.status)}</span>
                  </p>
                </div>
              ) : order?.data?.dhl?.tracking ? (
                <div className="">
                  <p className=" font-semibold">Bestellstatus:</p>
                  <p className="flex justify-between">
                    <span>Status:</span>
                    <ReturnStatus status={order?.data?.status} />
                  </p>
                  <p className="flex justify-between">
                    <span>Sendungsverfolgung:</span>
                    <span className="text-green-500">{order?.data?.dhl?.tracking}</span>
                  </p>
                </div>
              ) : (
                <div className="">
                  <p className=" font-semibold">Bestellstatus:</p>
                  <p className="flex justify-between">
                    <span>Status:</span>
                    {order?.data?.fulfillment_status === 'unfulfilled' ? (
                      <span className="text-red-500">warten auf Verfügbarkeit</span>
                    ) : (
                      <span className="text-orange-500">in Bearbeitung</span>
                    )}
                  </p>
                  <p className="flex justify-between">
                    <span>Sendungsverfolgung:</span>
                    <span className="text-red-500">noch nicht verfügbar</span>
                  </p>
                </div>
              )}
            </div>
            <div>
              <div className="pb-6 text-center text-lg font-semibold">
                <p>Bestellübersicht</p>
              </div>
              <div className="space-y-5">
                {order?.data?.line_items.map((item) => {
                  return (
                    <div className="flex flex-col gap-5  bg-white p-5">
                      {/* <div> */}
                      {/* <p> */}
                      {/* Status: */}
                      {/* <FulfillmentStatus status={item.last_status} /> */}
                      {/* <span className="pl-3 text-red-500">
                            {order?.data?.fulfillment_status}
                          </span> */}
                      {/* </p> */}
                      {/* <p>
                          Sendungsverfolgung:
                          <ShippingStatus status={order?.data?.dhl?.status_code} />
                        </p> */}
                      {/* </div> */}
                      <div className=" flex flex-col justify-between gap-3 sm:flex-row   ">
                        <div className=" flex gap-5">
                          <img
                            src={item.image}
                            alt="Produktbild"
                            className="h-24 w-24 object-cover"
                          />
                          <div className="space-y-3">
                            <p className="font-semibold">{item.product_title}</p>
                            <div>
                              <p className="">Variant: {item.variant_title}</p>
                              <p className="">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                        </div>
                        <div className=" flex flex-col self-end text-right">
                          {isVorbestellung ? (
                            <p className="text-sm text-accent">Verbestellung</p>
                          ) : null}
                          {item.discounted_price === 0 ? (
                            <p>{formatPrice(item.price)}</p>
                          ) : (
                            <p>
                              {formatPrice(item.price)}
                              <span className="pl-3 line-through">
                                {formatPrice(item.discounted_price)}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="pb-6 text-center text-lg font-semibold">
                <p>Zusammenfassung</p>
              </div>
              <div className="bg-white p-8">
                <div className="flex">
                  <p>Zwischensumme:</p>
                  <span className="ml-auto">{formatPrice(order?.data?.total)}</span>
                </div>
                <div className="flex">
                  <p>Versand:</p>
                  <span className="ml-auto">
                    {order?.data?.dhl?.status ? formatPrice(order?.data?.dhl?.total) : 'Free'}
                  </span>
                </div>
                <div className="flex pt-3 font-bold">
                  <p>Gesamtsumme:</p>
                  <span className="ml-auto">{formatPrice(order?.data.total)}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="pb-6 text-center text-lg font-semibold">
                <p>Zahlungsdetails</p>
              </div>
              <div className="bg-white p-8">
                <div className="flex">
                  <p>Bezahlt mit:</p>
                  <span className="ml-auto">{order?.data?.payment_method}</span>
                </div>
              </div>
            </div>
            {/* <pre>{JSON.stringify(order, null, 2)}</pre> */}
          </div>
        ) : (
          <div className="bg-white pb-6 pt-12">
            <div className="flex items-center ">
              <div className="mx-auto flex flex-col items-center pb-5 text-center">
                <p className="mb-2 text-2xl font-bold">Check order status</p>
                <p className={'text-l max-w-[300px] text-gray-500'}>{t('loginForm.text')}</p>
              </div>
            </div>
            <form
              className="mx-auto max-w-[400px] space-y-5 px-4  pt-12 sm:pb-12"
              autoComplete="off"
              onSubmit={handleSubmit}
              id="form-rIKF5wAdJBBAMK0G"
            >
              <div>
                <div className=" space-y-5 overflow-y-auto  ">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative  ">
                      {/* <label className="block">Order number:</label> */}
                      <span className="pointer-events-none absolute left-0  flex h-full items-center   pl-3">
                        <IconHash size={20} stroke={1} className=" text-slate-500" />
                      </span>
                      <input
                        disabled={isLoading}
                        type="number"
                        name="order_number"
                        value={form.order_number}
                        placeholder="Bestellnummer (#1001)"
                        onChange={handleChange}
                        className="w-full border p-2 pl-8"
                        required={true}
                      />
                    </div>
                    <div className="">
                      {/* <label className="block">Email:</label> */}
                      <input
                        disabled={isLoading}
                        type="email"
                        name="email"
                        value={form.email}
                        placeholder="email@domain.com"
                        onChange={handleChange}
                        className="w-full  border p-2"
                        required={true}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  disabled={isLoading}
                  type="submit"
                  form="form-rIKF5wAdJBBAMK0G"
                  className={`btn btn-primary flex w-full rounded-none px-10 py-3 text-center  font-semibold duration-200 `}
                >
                  <p className="mx-auto">{t(`Submit`)} </p>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      {location.pathname === '/order-status' ? (
        <OrderStatusPageFooter />
      ) : (
        <OrderStatusPageFooterV2 />
      )}
    </CustomerLayout>
  );
};

export default OrderStatusPage;
