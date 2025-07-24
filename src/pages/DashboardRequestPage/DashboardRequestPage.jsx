import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { useNavigate, useLocation } from 'react-router-dom';
import { RejectedIcon, RequestLabel } from '../../components/atoms';
import axios from '../../utils/axios';
import useDocumentTitle from '../../components/useDocumentTitle';
import { green } from '@mui/material/colors';
import { Timeline } from '../../components/organisms';
import { StatusEnum } from '../../enums/Status.enum';
import queryString from 'query-string';
import { getStatusDE } from '../../utils/getStatusDE';
import { hasNotApprovedItems, capitalizeFirstLetter, hasWrongItem } from '../../utils';
import CheckIcon from '@mui/icons-material/Check';
import dayjs from 'dayjs';
import showToast from '../../hooks/useToast';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';
// import { ReturnedProduct } from '../../components/molecules';
import { ReturnedProductV2 } from '../../components/molecules/ReturnedProductV2/ReturnedProductV2';
import { ReturnPeriodNotification } from './components/ReturnPeriodNotification';
import { UnhandledItemNotification } from './components/UnhandledItemNotification';
import { CustomerContactedNewLogic } from '../../components/returnPortal/CustomerContactedNewLogic/CustomerContactedNewLogic';
import axiosInstance from '../../utils/axios';
import { useModal } from '../../context/UnhandledItemNotificationModalContext';
import { useAuthContext } from '../../context/Auth.context';
const DashboardOrderPage = () => {
  const greenColor = green[500];
  useDocumentTitle('Dashboard Order');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentOrderNumber = queryParams.get('return_id') || '';
  const [order_details, setOrderDetails] = useState([]);
  const [shopifyOrderCreatedAt, setShopifyOrderCreatedAt] = useState('');
  const [customerContacted, setCustomerContacted] = useState(false);
  const [hasRejectedItem, setHasRejectedItem] = useState(false);
  const [hasReklamation, setHasReklamation] = useState(false);
  const [hasReturnChecked, setHasReturnChecked] = useState(false);
  // const [hasRequestedItem, setHasRequestedItem] = useState(false);
  // const [hasApprovedItem, setHasApprovedItem] = useState(false);
  // const [passedDays, setPaddesDays] = useState(0);
  const [clientDidntUploadLabel, setClientDidntUploadLabel] = useState(true);
  const [returnedToCustomer, setReturnedToCustomer] = useState(false);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [commentToDelete, setCommentToDelete] = useState('');
  const [pdf, setPdf] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const [loadingMessage, setLoadingMessage] = useState('Auftragsdetails laden');
  const [loadingStatusChangedToContacted, setLoadingStatusChangedToContacted] = useState(false);
  const returnId = queryParams.get('return_id');
  const { setShowModal, checkRequestedItems } = useModal();
  const { user } = useAuthContext();

  const handleBackToReturns = () => {
    // Check if there are any items with a "requested" status
    const hasRequestedItems = order_details?.items?.some((item) => item.status === 'requested');

    if (hasRequestedItems && user?.role_id === 7) {
      // Show the modal and prevent navigation
      setShowModal(true);
    } else {
      // Proceed with navigation if there are no "requested" items
      const activeTab = localStorage.getItem('activeTab');
      const currentParams = queryString.parse(location.search.slice(1));
      const updatedParams = { ...currentParams, activeTab };
      navigate(-1, { state: updatedParams });
    }
  };

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/order-logs?barcode_number=` + encodeURIComponent(currentOrderNumber),
      );

      if (response.data.status_code !== 200) {
        setError(response.data.message);
        setLoading(false);
        setLoadingMessage('');
      } else {
        // if (response.data.requested_order_logs.requested_logs.length !== 0) {
        //   const requestDate =
        //     response.data.requested_order_logs.requested_logs[
        //       response.data.requested_order_logs.requested_logs.length - 1
        //     ].created_at;
        //   if (requestDate) {
        //     const currentDate = dayjs();
        //     const differenceInDays = currentDate.diff(requestDate, 'day');
        //     setPaddesDays(differenceInDays);
        //   }
        // }

        const requestedOrderLogs = response.data.requested_order_logs;
        const orderId = requestedOrderLogs?.id;
        const orderStatus = requestedOrderLogs?.status;
        const orderNumber = requestedOrderLogs?.order_number;
        const markedLogs = requestedOrderLogs.requested_logs.map((log) => {
          return {
            ...log,
            isEmailLog:
              (log.comment && log.comment.includes('E-Mail')) || log.comment.includes('Email'),
          };
        });
        checkRequestedItems(requestedOrderLogs?.items || []);

        setOrderDetails({
          ...requestedOrderLogs,
          requested_logs: markedLogs,
          id: orderId,
          order_number: orderNumber,
          order_status: orderStatus,
        });

        setShopifyOrderCreatedAt(response.data.requested_order_logs.shopify_created_at);
        //rgnpcrz
        const hasDeclinedItem = response.data.requested_order_logs.items.filter((item) => {
          return item.status == 'rejected';
        });
        if (hasDeclinedItem.length !== 0) {
          setHasRejectedItem(true);
        }

        //
        //
        // Reklamation check
        const hasReklmationItem = response.data.requested_order_logs.items.filter((item) => {
          return item.reason == '5';
        });
        if (hasReklmationItem.length !== 0) {
          setHasReklamation(true);
        }
        const hasReturnCheckedItem = response.data.requested_order_logs.items.filter((item) => {
          return item.return_checked == '1';
        });
        if (hasReturnCheckedItem.length !== 0) {
          setHasReturnChecked(true);
        }

        if (response.data.requested_order_logs.notifications === 'sent_back_to_customer') {
          setCustomerContacted(true);
          setReturnedToCustomer(true);
        } else if (response.data.requested_order_logs.notifications === 'customer_contacted') {
          setCustomerContacted(true);
        }
        setClientDidntUploadLabel(
          response?.data?.requested_order_logs?.items?.some(
            (item) => item.email_status === 'return_label_not_uploaded',
          ),
        );

        setLoading(false);
        setLoadingMessage('');
        setError('');
      }
    } catch (error) {
      // Handle the error
      console.error('Error fetching order details:', error);
    }
  };
  useEffect(() => {
    fetchOrderDetails();
  }, [currentOrderNumber]);

  const archivedOrderStatus = order_details.deleted_at;
  const allItemsApproved = !hasNotApprovedItems(order_details?.items);
  const containsWrongItem = hasWrongItem(order_details?.items);

  const handleOffer = async (type, itemId, variantId) => {
    try {
      const response = await axios.post(`${type}-damaged-request`, {
        barcode_number: currentOrderNumber,
        item_id: itemId,
        variant_id: variantId,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleOrder = async (
    type,
    name,
    itemId,
    productId,
    variantId,
    variantTitle,
    quantity,
    full,
    comment,
    image,
    message = '',
    reklamation,
    backToStock = false,
  ) => {
    console.log('reklamation:', reklamation);
    console.log('handleorder:', backToStock);
    setLoading(true);
    setLoadingMessage(`Laden`);

    try {
      // Function to split the message and wrap each line with <p> tags
      const formatMessageAsParagraphs = (text) => {
        if (!text) {
          return ''; // Return an empty string if text is null, undefined, or falsy
        }

        return text
          .split('\n')
          .map((line) => (line.trim() === '' ? '<p>&nbsp;</p>' : `<p>${line.trim()}</p>`))
          .join('');
      };

      // If there is a message, format it as paragraphs
      const formattedMessage = formatMessageAsParagraphs(message);

      const requestPayload = {
        product_id: productId,
        name: name,
        variant_id: variantId,
        variant_title: variantTitle,
        order_id: currentOrderNumber,
        quantity: quantity,
        comment: comment,
        reklamation_request: reklamation,
      };

      // Only add message and image if type is 'reject'
      if (type === 'reject') {
        requestPayload.customized_text = formattedMessage; // Use formatted message here
        requestPayload.image = image;
      }

      // Uncomment to handle 'accept' type
      // if (type === 'accept') {
      //   requestPayload.back_to_stock = backToStock;
      // }

      console.log('ACCEPT TRIGGERED');
      console.log(requestPayload);
      const response = await axios.post(
        `return/${type}/${full ? currentOrderNumber : itemId}`,
        requestPayload,
      );
      if (response?.data?.status_code === 400) {
        showToast(
          'Dies kann weder akzeptiert noch abgelehnt werden, solange eine Falschlieferung nicht bearbeitet wurde.',
          'failure',
        );
        consol.log('response?.data?.status_code', response?.data?.status_code);
      }
      if (response.data.status_code === 201) {
        await fetchOrderDetails();
        // rgnpcrz set notification to "customer_contacted"
        // handleContactCustomer();
        // This part is moved to finally
        // setLoading(false);
        // this logic is handled on backend
        // if (allItemsApproved) {
        //   handleGiftCardCreation();
        // }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    try {
      const response = await axios.post('/timeline-comment/add', {
        barcode_number: currentOrderNumber,
        comment,
        pdf,
      });
      if (response.data.status_code !== 200) {
        console.log('Something went wrong');
      } else {
        setComment('');
        setPdf('');
        fetchOrderDetails();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteComment = async () => {
    try {
      const response = await axios.post('/timeline-comment/delete', {
        barcode_number: currentOrderNumber,
        comment: commentToDelete,
      });
      if (response.data.status_code !== 200) {
        console.log('Something went wrong');
      } else {
        setComment('');
        fetchOrderDetails();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const response = await axios.delete(`/delete-requested-order/${currentOrderNumber}`);
      if (response.data.status_code === 200) {
        navigate('/dashboard/');
        console.log('Deleted succesfully');
        setComment('');
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGiftCardToRefun = async () => {
    try {
      setLoading(true);
      setLoadingMessage('Converting Gift Card to Refund');
      const response = await axios.post(
        `/dashboard/gift-card-to-refund?&requested_order_id=${order_details.id}`,
      );

      if (response.data.status_code === 200) {
        console.log('converted succesfully');
        fetchOrderDetails();
      } else {
        console.log('Something went wrong');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const resetRequestedOrderStatus = async (id) => {
    try {
      setLoading(true);
      setLoadingMessage('Reseting order staus');
      const response = await axios.put(`/dashboard/reset-requested-order-status/${id}`);

      if (response.data.status_code === 200) {
        console.log('Converted succesfully');
        showToast('Order status has been reset successfully.', 'success');
        fetchOrderDetails();
      } else {
        showToast(response.data.message, 'failure');
        console.log('Something went wrong');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleItemGiftCard = async (type, id) => {
    setLoading(true);
    // setLoadingMessage(`${type}ing gift card`);
    setLoadingMessage(`Laden`);

    try {
      const response = await axios.get(`/dashboard/${type}-gift-card-item/${id}`);

      if (response.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  //
  //
  const handleContactCustomer = async () => {
    setLoading(true);
    setLoadingMessage(`Laden`);

    try {
      const response = await axios.post('/return/contact-customer', {
        id: order_details.id,
      });
      if (response.data.status_code !== 200) {
        console.log('Something went wrong');
      } else {
        setComment('');
        fetchOrderDetails();
        setCustomerContacted(true);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  //
  //
  const handleConfirmReturn = async () => {
    setLoading(true);
    // setLoadingMessage(`Development`);
    setLoadingMessage(`Laden`);

    try {
      const response = await axios.post('/return/sent-back-to-customer', {
        id: order_details.id,
      });
      if (response.data.status_code !== 200) {
        console.log('Something went wrong');
      } else {
        setComment('');
        fetchOrderDetails();
        setReturnedToCustomer(true);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  // Funksioni i njejt u mbart ne CustomerContactedNewLogic
  // mundet me u fshi mas testimeve
  const handleResolveDispute = async () => {
    setLoading(true);
    // setLoadingMessage(`Development`);
    setLoadingMessage(`Laden`);

    try {
      const response = await axios.post('/return/resolve-dispute', {
        id: order_details.id,
      });
      if (response.data.status_code !== 200) {
        console.log('Something went wrong');
      } else {
        setComment('');
        fetchOrderDetails();
        setReturnedToCustomer(true);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDeleteItem = async (id) => {
    setLoading(true);

    setLoadingMessage('Deleting item...');

    try {
      const response = await axios.delete(`/requested-item/${id}`);
      if (response.status !== 200) {
        showToast('Something went wrong', 'failure');
        setLoading(false);
      } else {
        showToast('Artikel erfolgreich gelöscht', 'success');
        setComment('');
        fetchOrderDetails();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateOrderStatusToContacted = async (id) => {
    try {
      setLoadingStatusChangedToContacted(true);
      setLoadingMessage('Updating order status');

      const response = await axiosInstance.patch(`/dashboard/change-order-status/${id}`, {
        status: 'contacted',
      });
      showToast('Order status has been updated successfully.', 'success');
      fetchOrderDetails();
    } catch (error) {
      setLoadingStatusChangedToContacted(false);
    } finally {
      setLoadingStatusChangedToContacted(false);
    }
  };

  if (loading) {
    return <PammysLoading />;
  }
  return (
    <div className="order-page-container ">
      <Button onClick={handleBackToReturns}>Zurück</Button>
      <div className="flex w-full  ">
        <div className="flex-1 ">
          {error && error.length !== 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12">
              <Box sx={{ display: 'flex flex-1', justifyContent: 'center', alignItems: 'center' }}>
                <div className="flex items-center justify-center">
                  <span className="mr-2">
                    <RejectedIcon />
                  </span>
                  <span>falsche Antragsnummer, bitte gebe eine korrekte Antragsnummer ein</span>
                </div>
              </Box>
            </div>
          ) : (
            <div className="">
              <div id="kunde-lager" className="flex justify-between py-5">
                <div className="flex items-center">
                  <div className="text-2xl font-semibold ">
                    {currentOrderNumber}

                    {order_details.status == StatusEnum.APPROVED && (
                      <span className="approved-order ml-5 text-base font-normal">
                        {capitalizeFirstLetter(getStatusDE(order_details?.status))}
                      </span>
                    )}
                  </div>
                  {/* {order_details.status == StatusEnum.REJECTED && ( */}
                  {/* now the customer contacted or not status will be shown based on the
                    notification parameter from orders */}
                  <div>
                    <div>
                      {customerContacted &&
                      order_details.status !== StatusEnum.APPROVED &&
                      order_details.status !== StatusEnum.REQUESTED &&
                      hasRejectedItem &&
                      hasReturnChecked ? (
                        <>
                          <div className="ml-2">
                            {customerContacted ? (
                              <span className="font-semibold">
                                <CheckIcon
                                  sx={{
                                    fontSize: '22px',
                                    marginRight: '5px',
                                    color: greenColor,
                                    fontWeight: 'bold',
                                  }}
                                />
                                Kunde kontaktiert
                              </span>
                            ) : (
                              <span
                                onClick={handleContactCustomer}
                                className="contact-client cursor-pointer p-2 font-semibold"
                              >
                                Kunde kontaktiert
                              </span>
                            )}
                            <span className="ml-2 mr-2 font-semibold">- - - - - - - -</span>
                            {customerContacted && !returnedToCustomer ? (
                              <span
                                onClick={handleConfirmReturn}
                                className="contact-client cursor-pointer p-2 font-semibold"
                              >
                                An Kunden zurückgesendet
                              </span>
                            ) : customerContacted && returnedToCustomer ? (
                              <span className="font-semibold">
                                <CheckIcon
                                  sx={{
                                    fontSize: '22px',
                                    marginRight: '5px',
                                    color: greenColor,
                                    fontWeight: 'bold',
                                  }}
                                />
                                An Kunden zurückgesendet
                              </span>
                            ) : (
                              <span className="font-semibold text-gray-300">
                                An Kunden zurückgesendet
                              </span>
                            )}
                          </div>
                          {customerContacted && returnedToCustomer ? (
                            <div className="ml-72">
                              <span
                                onClick={handleResolveDispute}
                                className="contact-client cursor-pointer p-2 font-semibold"
                              >
                                Klärfall lösen
                              </span>
                            </div>
                          ) : null}
                        </>
                      ) : (
                        !hasReturnChecked &&
                        hasRejectedItem && (
                          <span className="ps-3 font-semibold">
                            <CheckIcon
                              sx={{
                                fontSize: '22px',
                                marginRight: '5px',
                                color: greenColor,
                                fontWeight: 'bold',
                              }}
                            />
                            Kunde kontaktiert
                          </span>
                        )
                      )}
                    </div>

                    {hasReklamation && customerContacted && (
                      <span className="ps-3 font-semibold">
                        <CheckIcon
                          sx={{
                            fontSize: '22px',
                            marginRight: '5px',
                            color: greenColor,
                            fontWeight: 'bold',
                          }}
                        />
                        Kunde kontaktiert
                      </span>
                    )}
                  </div>
                </div>
                {/* {order_details.order_status !== 'contacted' && (
                  <div>
                    <button
                      className="bg-accent px-6 py-2"
                      onClick={() => {
                        updateOrderStatusToContacted(order_details.id);
                      }}
                    >
                      {loadingStatusChangedToContacted ? (
                        <PammysLoading height={5} width={5} />
                      ) : (
                        'Kontaktiert'
                      )}
                    </button>
                  </div>
                )} */}
              </div>
              {order_details?.status === 'rejected' ? (
                <CustomerContactedNewLogic
                  order_details={order_details}
                  refetch={fetchOrderDetails}
                />
              ) : null}
              {order_details.gift_card_link && order_details.gift_card_link.length !== 0 && (
                <div className="flex  items-center gap-5 py-5">
                  <Link
                    to={order_details.gift_card_link}
                    target="_blank"
                    className=" bg-success px-2 py-1 text-base font-normal !no-underline"
                  >
                    Link zum Geschenkcode
                  </Link>
                </div>
              )}

              <div className="flex flex-col-reverse gap-6 order:flex-row ">
                <div className="flex-1 ">
                  {order_details.deleted_at !== null && (
                    <div className=" mb-4 flex gap-4 rounded border bg-gray-500 p-4  font-semibold text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                        />
                      </svg>
                      <p>Archiviert!</p>
                    </div>
                  )}
                  <ReturnPeriodNotification
                    deliveredAt={order_details?.delivered_at}
                    fulfilledAt={order_details?.fulfilled_at}
                    status={order_details?.status}
                  />
                  <UnhandledItemNotification
                    items={order_details?.items}
                    status={order_details?.status}
                    deleted_at={order_details?.deleted_at}
                  />

                  <div className="no-scrollbar  rounded-sm">
                    {/* <Order status={order_details.status} /> */}

                    {order_details?.items?.map((item, index) => {
                      return (
                        <div key={`Qg1fc1X0-${index}`}>
                          {/* <pre>TESt: {JSON.stringify(item, null, 2)}</pre> */}
                          <ReturnedProductV2
                            item={item}
                            handleOffer={handleOffer}
                            handleOrder={handleOrder}
                            fetchOrderDetails={fetchOrderDetails}
                            handleItemGiftCard={handleItemGiftCard}
                            handleDeleteItem={handleDeleteItem}
                            customerContacted={customerContacted}
                            returnedToCustomer={returnedToCustomer}
                            giftCard={order_details.gift_card_offer}
                            deletedAt={order_details.deleted_at || null}
                            orderBarcode={currentOrderNumber}
                            orderNotification={order_details?.notifications}
                            clientDidntUploadLabel={clientDidntUploadLabel}
                            orderStatus={order_details?.order_status}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="">
                    <Timeline
                      comment={comment}
                      setComment={setComment}
                      pdf={pdf}
                      setPdf={setPdf}
                      logs={order_details.requested_logs}
                      saveComment={handleSubmitComment}
                      commentToDelete={commentToDelete}
                      setCommentToDelete={setCommentToDelete}
                      deleteComment={handleDeleteComment}
                      orderId={order_details.id}
                      returnId={returnId}
                      archivedOrderStatus={archivedOrderStatus}
                    />
                  </div>
                </div>
                <div className=" max-w-[500px] flex-1 flex-col">
                  <div className="sticky top-0  ">
                    <RequestLabel
                      orderId={order_details.id}
                      orderType={order_details.type}
                      orderPath={order_details.shopify_order_path}
                      orderNumber={order_details.order_number}
                      orderStatus={order_details.status}
                      orderPdf={order_details.pdf_url}
                      orderCreated={order_details?.requested_logs[0] || ''}
                      labelDate={shopifyOrderCreatedAt}
                      customerPath={order_details.shopify_customer_path}
                      newOrderPath={
                        order_details?.shopify_new_order_path
                          ? order_details.shopify_new_order_path
                          : order_details?.draft_order_link
                      }
                      name={order_details?.full_name}
                      email={order_details?.email || ''}
                      address={order_details?.address || ''}
                      phone={order_details?.phone}
                      payment={order_details?.payment_method}
                      shippingLabel={order_details?.shipping_label_url}
                      customer={order_details?.full_name}
                      handleDeleteOrder={handleDeleteOrder}
                      handleGiftCardToRefun={handleGiftCardToRefun}
                      resetRequestedOrderStatus={resetRequestedOrderStatus}
                      refundType={order_details.gift_card_offer == 1 ? 'Geschenkkarte' : 'Geld'}
                      trackingNumber={order_details.tracking_number}
                      deleted_at={order_details.deleted_at || null}
                      hasReturnChecked={hasReturnChecked}
                      updateOrderStatusToContacted={updateOrderStatusToContacted}
                      loadingStatusChangedToContacted={loadingStatusChangedToContacted}
                      items={order_details?.items}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DashboardOrderPage;
