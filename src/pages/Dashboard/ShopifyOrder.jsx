import { useEffect, useState } from 'react';
import { Layout } from '../../components/template';
// import queryString from 'query-string';
import axios from '../../utils/axios';
import useDocumentTitle from '../../components/useDocumentTitle';
import axiosInstance from '../../utils/axios';
// import { CircularProgress } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CONSOLE_LOG, SHOPIFY_STORE } from '../../config/env';
import { convertToDE } from '../../utils';
import { useAuthContext } from '../../context/Auth.context';
import { notification } from '../../utils/notification';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';
// import toast from 'react-simple-toasts';
import showToast from '../../hooks/useToast';

const issues = [
  { text: 'nicht abgeholt / annahme verweigert', price: '-4,00 €', reason: 9 },
  { text: 'Empfänger nicht zu ermitteln / nicht zustellbar', price: '-4,00 €', reason: 10 },
  {
    text: 'entspricht nicht den Versandbedingunge / Beschädigung der Umverpackung',
    price: '-0,00 €',
    reason: 11,
  },
];

const ShopifyOrder = () => {
  useDocumentTitle('Pammys | Shopify Orders');
  const [order, setOrder] = useState([]);
  const [reason, setReason] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  let { id } = useParams();
  id = id.replace('#', ''); // Remove the # from the id
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance
        .post(`/search-in-shopify`, {
          order_number: id,
        })
        .then((response) => {
          if (response.data.status_code === 200) {
            setOrder(response?.data?.order);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const convertToRequest = async () => {
    try {
      setLoading(true);

      const response = await axios.post(`/user-order-refuse`, {
        order_number: order.order_name,
        email: order.contact_email,
        order_refused_shipping_applied: reason === 11,
        reason: reason,
      });
      const { data } = response;
      if (response.status === 200) {
        notification(response.data);
        navigate(`/dashboard/order?return_id=${response.data.order.barcode_number}`);
      } else {
        // notification('Error!');
        console.log('Error: Status code !== 200');
        console.log(response.data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      notification(error.message, false);
      console.log('Error: Status code !== 200');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  return (
    <Layout>
      {loading ? (
        <div className="h-full">
          <PammysLoading />
        </div>
      ) : (
        <div className="flex max-w-[800px] flex-col gap-7">
          <div className="flex flex-col border">
            <div className="flex flex-col gap-3 bg-white p-4">
              <div className="flex">
                <Link
                  to={`https://admin.shopify.com/store/${SHOPIFY_STORE}/orders/${order.shopify_order_id}`}
                  target="_blank"
                >
                  <p className="w-[100px] text-xl font-semibold">{id}</p>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {/* <p className="text-lg font-bold">Client info:</p> */}
            <div className="flex flex-col gap-3 border bg-white p-4">
              <div className="flex">
                <p className="w-[150px] text-lg font-semibold">Kunde </p>
                {order.shipping_address.name}
              </div>
              <div className="flex">
                <p className="w-[150px] text-lg font-semibold">Email </p>
                {order.contact_email}
              </div>
              <div className="flex">
                <p className="w-[150px] text-lg font-semibold">Lieferadresse </p>
                {order.shipping_address.address}, {order.shipping_address.zip}{' '}
                {order.shipping_address.city}, {order.shipping_address.country}
              </div>
              {/* <div className="flex">
                <p className="w-[150px] text-lg font-semibold">Tracking number </p>
                {order.contact_email}
              </div> */}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {/* <p className="text-lg font-bold">Order items:</p> */}
            <div className="flex flex-col gap-3">
              {order.line_items.map((item) => {
                return (
                  <div className="flex items-center border bg-white p-4 font-semibold text-gray-800">
                    <div className="flex  items-center justify-between ">
                      <div className="flex gap-3  ">
                        <img
                          alt="Produktbild"
                          src={item.product_image}
                          className="h-24 w-24 rounded-sm border-2"
                        />
                        <div>
                          <p className="pb-1">{item.title}</p>
                          <p className="pb-2">
                            <span className=" font-semibold">{item.variant_title}</span>
                          </p>
                          {/* <div className="variant-data"></div> */}
                          <div className="flex gap-7 border-t pt-2">
                            <p>
                              {convertToDE(item.price)} x {item.quantity}
                            </p>
                            <p className="font-semibold">
                              {convertToDE(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-5 border bg-white p-4 ">
            <p className="text-xl font-semibold">Please select a reason</p>
            <div className="flex flex-col gap-3">
              {issues.map((item) => (
                <button
                  className={`btn flex cursor-pointer justify-between rounded-none  border-2 px-4 py-2 ${item.reason == reason ? 'border-accent bg-yellow-100' : ''}`}
                  onClick={() => setReason(item.reason)}
                  key={`O952G2fFnluf9Wdf${item.reason}`}
                >
                  <span className="text-left">{item.text}</span>
                  <span className="text-nowrap text-right">{item.price}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="border bg-white p-4 ">
            <button
              className={`${reason !== 0 ? 'bg-accent' : 'bg-accent-50'} btn rounded-none px-4 py-2 duration-150`}
              onClick={() => {
                if (reason !== 0) {
                  convertToRequest();
                } else {
                  showToast('Please elect a reason.', 'failure');
                  console.log('Select a reason');
                  // You can also add a notification here to inform the user
                }
              }}
            >
              Rücksendung anlegen
            </button>
          </div>
          {/* <pre>{JSON.stringify(order, null, 2)}</pre> */}
        </div>
      )}
    </Layout>
  );
};
export default ShopifyOrder;
