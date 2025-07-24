import { useState } from 'react';
import { RejectedIcon, UploadedImage } from '../../atoms';
import { RejectModal } from '../RejectModal/RejectModal';
import { RequestStatus } from '../RequestStatus/RequestStatus';
import { StatusEnum } from '../../../enums/Status.enum';
import dayjs from 'dayjs';
import { convertToDE, getReasonLabelDashboard } from '../../../utils';
import { getStatusDE } from '../../../utils/getStatusDE';
import { SupportButton } from '../../atoms/SupportButton/SupportButton';
import { useAuthContext } from '../../../context/Auth.context';
import { includesText } from '../../../utils/helpers';
import { FiTrash2 } from 'react-icons/fi';
import { ItemBasedCustomerContact } from '../../../pages/DashboardRequestPage/components/ItemBasedCustomerContact';
import showToast from '../../../hooks/useToast';
import axiosInstance from '../../../utils/axios';

export const ReturnedProductV2 = ({
  item,
  handleOffer,
  handleOrder,
  fetchOrderDetails,
  handleItemGiftCard,
  handleDeleteItem,
  // customerContacted,
  returnedToCustomer,
  // giftCard,
  deletedAt,
  orderBarcode,
  orderNotification,
  clientDidntUploadLabel,
  orderStatus,
}) => {
  const product_title = item.product_title;
  const product_quantity = item.quantity;
  const product_price = item.price;
  const product_image = item.product_image;
  const uploaded_images = item.submitted_images;
  const comment = item.comment;
  const reason = getReasonLabelDashboard(item.reason);
  const variant_info = item.variant_title;
  const reasonNumber = item.reason;
  const itemId = item.id;
  const product_id = item.product_id;
  const variantId = item.variant_id;
  const variantTitle = item.variant_title;
  const status = item.logs[0] || 'NO STATUS';
  const exchangeItemTitle = item.exchange_item_title;
  const exchangeVariantTitle = item.exchange_variant_title;
  const rejected_reason = item.rejected_reason;
  const [images, setImages] = useState([]);
  const [rejectComment, setRejectComment] = useState('');
  const [rejectMessage, setRejectMessage] = useState('');
  const [showRejectModal, setRejectModal] = useState(false);
  const [reklamation, setReklamation] = useState(false);
  const [backToStock, setBackToStock] = useState(false);
  const [rejectButtonLoading, setRejectButtonLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuthContext();
  const handleAcceptOffer = () => {
    handleOffer('accept', itemId, variantId);
  };
  const handleRejectOffer = () => {
    handleOrder('reject', product_title, itemId, variantId, variantTitle, product_quantity, false);
  };

  const rejectItemFromSupport = async (id, rejectComment, rejectMessage) => {
    setRejectButtonLoading(true);
    try {
      const response = await axiosInstance.post(`/dashboard/reject-item-from-support/${id}`, {
        rejectComment,
        rejectMessage,
      });
      showToast('Item rejected successfully!', 'success');
      setRejectButtonLoading(false);
      return response.data;
    } catch (error) {
      console.error('Error rejecting item:', error);
      setRejectButtonLoading(false);
    }
  };

  const handleRejectOrder = async () => {
    if (rejectComment === '') {
      setErrorMessage('Please select reason!');
      showToast('Please select reason!', 'failure');
      return;
    }
    if (
      rejectMessage.length < 10 &&
      (reasonNumber == 5 || reasonNumber == 7 || rejectComment == 'sonstiges') &&
      item.return_checked === null
    ) {
      setErrorMessage('Message should be at least 10 characters long!');
      showToast('Message should be at least 10 characters long!', 'failure');
      return;
    }
    setRejectButtonLoading(true);
    try {
      await rejectItemFromSupport(itemId, rejectComment, rejectMessage);
      setErrorMessage('');
      fetchOrderDetails();
      setShowModal(false);
      showToast('Item rejected successfully!', 'success');
      setRejectButtonLoading(false);
      // Additional logic after successful rejection
    } catch (error) {
      setErrorMessage('Failed to reject item. Please try again.');
      setRejectButtonLoading(false);
    }
  };

  const handleAcceptOrder = () => {
    handleOrder(
      'accept',
      product_title,
      itemId,
      product_id,
      variantId,
      variantTitle,
      product_quantity,
      false,
      null,
      images,
      null,
      reklamation,
      backToStock,
    );
  };

  const handleReject = () => {
    handleOrder(
      'reject',
      product_title,
      itemId,
      product_id,
      variantId,
      variantTitle,
      product_quantity,
      false,
      rejectComment,
      images,
      rejectMessage,
      reklamation,
      backToStock,
    );
  };
  const handleModal = () => {
    setRejectModal(true);
  };
  const handleRejectGiftCard = () => {
    handleItemGiftCard('reject', itemId);
  };
  const handleAcceptGiftCard = () => {
    handleItemGiftCard('accept', itemId);
  };

  return (
    <div
      className={
        'relative mb-7 border bg-white px-4 py-5  ' + (item.deleted_at === null ? 'shadow' : '')
      }
    >
      {item.status === 'requested' && item.deleted_at == null ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2">
          <span class="relative flex h-4 w-4">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span class="relative inline-flex h-4 w-4 rounded-full bg-sky-500"></span>
          </span>
        </div>
      ) : null}
      <div className={item.deleted_at === null ? '' : 'opacity-50'}>
        <ItemBasedCustomerContact
          itemId={item?.id}
          itemCurrentStatus={item?.status}
          orderNotification={orderNotification}
          clientDidntUploadLabel={clientDidntUploadLabel}
          refetch={fetchOrderDetails}
          supportStatusItem={item?.support_status}
          returnCheckedItem={item?.return_checked}
          reasonNumber={reasonNumber}
        />
        <div className="flex w-full justify-between">
          {showRejectModal && (
            <RejectModal
              showModal={showRejectModal}
              comment={rejectComment}
              setComment={setRejectComment}
              message={rejectMessage}
              setMessage={setRejectMessage}
              setShowModal={setRejectModal}
              images={images}
              setImages={setImages}
              handleRejectOrder={handleRejectOrder}
              setReklamation={setReklamation}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              reasonNumber={reasonNumber}
              returnChecked={item.return_checked}
              rejectButtonLoading={rejectButtonLoading}
              handleReject={handleReject}
            />
          )}
          <div className="flex  justify-start">
            <div>
              {(orderNotification === 'sent_back_to_customer' ||
                orderNotification === 'to_edit' ||
                orderNotification === 'donated') &&
              item.status !== 'approved' ? (
                <RejectedIcon />
              ) : (
                <RequestStatus comment={rejectComment} status={status.status} />
              )}
            </div>

            <div className="ml-2 flex flex-col">
              <span className="font-semibold">
                {(orderNotification === 'sent_back_to_customer' ||
                  orderNotification === 'to_edit' ||
                  orderNotification === 'donated') &&
                item.status !== 'approved'
                  ? orderStatus === 'contacted'
                    ? 'abgelehnt/contacted'
                    : 'abgelehnt'
                  : status.status === 'requested' && orderStatus === 'contacted'
                    ? getStatusDE(status.status) + '/contacted'
                    : getStatusDE(status.status)}
                {status.status === 'rejected' ? ' - ' + rejected_reason : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="">
              {(orderNotification === 'sent_back_to_customer' ||
                orderNotification === 'to_edit' ||
                orderNotification === 'donated') &&
              item.status !== 'approved'
                ? 'abgelehnt'
                : getStatusDE(status.status)}{' '}
              <span className="ps-2">{dayjs(status.created_at).format('DD.MM.YYYY')}</span>
            </div>
            {item.deleted_at == null ? (
              user.role_id !== 4 ? (
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="cursor-pointer rounded-lg border  bg-secondary p-2  text-gray-500 duration-150 hover:text-red-600 active:scale-[0.9]"
                >
                  <FiTrash2 className="" size={18} />
                </button>
              ) : null
            ) : (
              <div className="rounded-lg bg-secondary px-2 py-1 text-red-600 ">
                Produkt entfernt
              </div>
            )}
          </div>
        </div>
        <div className="border-b ">
          <div className="flex min-w-[120px] items-center justify-between ">
            <div className="flex gap-3  py-5">
              <img
                src={product_image}
                alt="Produktbild"
                className="h-24 w-24 rounded-sm border-2"
              />
              <div>
                <p className="pb-1">{product_title}</p>
                <p className="pb-2">
                  <span className=" font-semibold">{variant_info}</span>
                </p>
                {/* <div className="variant-data"></div> */}
                <div className="flex gap-5 border-t pt-2">
                  <p>
                    {convertToDE(product_price)} x {product_quantity}
                  </p>
                  {/* <p className="font-semibold">{convertToDE(product_price * product_quantity)}</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {exchangeVariantTitle && (
          <>
            <div className="flex gap-3  border-b py-5">
              {item.return_checked !== null &&
              includesText(item.converted_to, 'to exchange') &&
              item.return_checked !== 1
                ? 'Ersatzartikel:'
                : 'Umtausch:'}
              <div>
                <p className="pb-1">{exchangeItemTitle}</p>
                <p className="pb-2">
                  <span className=" font-semibold">{exchangeVariantTitle}</span>
                </p>
              </div>
            </div>
          </>
        )}
        <div className="flex items-center py-5 ">
          <p className="text-wrap">
            <span className="pr-3 font-semibold">Nachricht vom Kunden:</span> {comment}
          </p>
        </div>
        {uploaded_images.length !== 0 && (
          <div className="flex  w-full flex-col border-t bg-white py-5">
            <p className=" pb-3 font-semibold">Fotos vom Kunden</p>
            <div className="flex flex-wrap gap-5">
              {uploaded_images.map((uploaded_image, index) => {
                return <UploadedImage key={index} uploaded_image={uploaded_image.image} />;
              })}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between gap-5 border-t pt-5">
          <div>
            <p>
              <span className="pr-3 font-semibold">Grund: </span> {reason}
            </p>
            {(item.return_checked !== null ||
              includesText(item.converted_to, 'return to discount')) &&
              (() => {
                switch (true) {
                  case includesText(item.converted_to, 'to exchange'):
                    return item.return_checked === 1 ? (
                      <p>
                        <span className="pr-3 font-semibold">Maßnahme: </span> Rücksendung -
                        Ersatzlieferung
                      </p>
                    ) : (
                      <p>
                        <span className="pr-3 font-semibold">Maßnahme: </span> kein Rücksendung -
                        Ersatzlieferung
                      </p>
                    );
                  case includesText(item.converted_to, 'to refund'):
                    return item.return_checked === 1 ? (
                      <p>
                        <span className="pr-3 font-semibold">Maßnahme: </span> Rücksendung -
                        Erstattung
                      </p>
                    ) : (
                      <p>
                        <span className="pr-3 font-semibold">Maßnahme: </span> kein Rücksendung -
                        Erstattung
                      </p>
                    );
                  case includesText(item.converted_to, 'to gift card'):
                    return item.return_checked === 1 ? (
                      <p>
                        <span className="pr-3 font-semibold">Maßnahme: </span> Rücksendung -
                        Geschenkcode
                      </p>
                    ) : (
                      <p>
                        <span className="pr-3 font-semibold">Maßnahme: </span> kein Rücksendung -
                        Geschenkcode
                      </p>
                    );
                  case includesText(item.converted_to, 'return to discount'):
                    return (
                      <p>
                        <span className="pr-3 font-semibold">Maßnahme: </span> kein Rücksendung -
                        Rabatt
                      </p>
                    );
                  case includesText(item.converted_to, 'return to discount'):
                    return (
                      <p>
                        <span className="pr-3 font-semibold">Maßnahme: </span> kein Rücksendung -
                        Rabatt
                      </p>
                    );
                  default:
                    return null;
                }
              })()}
          </div>
          {/* //rgnpcrz-ui-todo */}
          {item.deleted_at === null && deletedAt === null && (
            <>
              {(status.status == StatusEnum.REQUESTED || status.status == StatusEnum.IN_PROGRESS) &&
                !returnedToCustomer &&
                ((reasonNumber == 5 || reasonNumber == 7) && item?.support_status !== 'approved' ? (
                  user?.role_id !== 4 ? (
                    <div className="flex items-center gap-3">
                      <button className=" border px-3 py-2  text-red-500" onClick={handleModal}>
                        {reasonNumber == 5
                          ? 'Reklamation ablehnen'
                          : reasonNumber == 7
                            ? 'Falschlieferung ablehnen'
                            : 'Support ablehnen'}
                      </button>
                      <SupportButton
                        item={item}
                        productId={product_id}
                        variantId={variantId}
                        requestedItemId={itemId}
                        fetchOrderDetails={fetchOrderDetails}
                        reasonNumber={reasonNumber}
                        orderBarcode={orderBarcode}
                      />
                    </div>
                  ) : (
                    <div>Support muss diese Anfrage erst prüfen.</div>
                  )
                ) : (
                  !(item.status === 'rejected' || item.status === 'partially') &&
                  !(item.type === 'exchange' && orderNotification === 'donated') && (
                    <>
                      <div className="flex items-center gap-3">
                        <button className="action-button bg-gray-300" onClick={handleModal}>
                          ablehnen
                        </button>
                        <button className="action-button" onClick={handleAcceptOrder}>
                          akzeptieren
                        </button>
                      </div>
                    </>
                  )
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
