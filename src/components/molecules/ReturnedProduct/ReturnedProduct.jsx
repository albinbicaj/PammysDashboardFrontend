import { useState } from 'react';
import { UploadedImage } from '../../atoms';
import { RejectModal } from '../RejectModal/RejectModal';
import { RequestStatus } from '../RequestStatus/RequestStatus';
import { StatusEnum } from '../../../enums/Status.enum';
import dayjs from 'dayjs';
import { capitalizeFirstLetter, convertToDE } from '../../../utils';
import { getStatusDE } from '../../../utils/getStatusDE';
import { SupportButton } from '../../atoms/SupportButton/SupportButton';
import { useAuthContext } from '../../../context/Auth.context';
import { includesText } from '../../../utils/helpers';
import { FiTrash2 } from 'react-icons/fi';

export const ReturnedProduct = ({
  item,
  product_title,
  product_quantity,
  product_price,
  product_image,
  uploaded_images,
  comment,
  variant_info,
  reason,
  handleOffer,
  itemId,
  variantId,
  handleOrder,
  variantTitle,
  status,
  product_id,
  handleItemGiftCard,
  exchangeItemTitle,
  exchangeVariantTitle,
  rejected_reason,
  reasonNumber,
  fetchOrderDetails,
  returnedToCustomer,
  deletedAt,
  handleDeleteItem,
}) => {
  const [images, setImages] = useState([]);
  const [rejectComment, setRejectComment] = useState('');
  const [rejectMessage, setRejectMessage] = useState('');
  const [showRejectModal, setRejectModal] = useState(false);
  const [reklamation, setReklamation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuthContext();

  const handleAcceptOffer = () => {
    handleOffer('accept', itemId, variantId);
  };
  const handleRejectOffer = () => {
    handleOrder('reject', product_title, itemId, variantId, variantTitle, product_quantity, false);
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
      reklamation,
    );
  };

  const handleRejectOrder = () => {
    if (rejectComment === '') {
      setErrorMessage('Please select reason!');
      return;
    } else if (
      rejectMessage.length < 10 &&
      (reasonNumber == 5 || reasonNumber == 7) &&
      item.return_checked === null
    ) {
      setErrorMessage('Please leave a message!');
      return;
    } else {
      setErrorMessage('');
    }

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
      className={'mb-7 border bg-white px-4 py-5  ' + (item.deleted_at === null ? 'shadow' : '')}
    >
      <div className={item.deleted_at === null ? '' : 'opacity-50'}>
        <div className="flex w-full justify-between">
          {showRejectModal && (
            <RejectModal
              comment={rejectComment}
              showModal={showRejectModal}
              message={rejectMessage}
              setMessage={setRejectMessage}
              setShowModal={setRejectModal}
              images={images}
              setImages={setImages}
              setComment={setRejectComment}
              handleRejectOrder={handleRejectOrder}
              setReklamation={setReklamation}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              reasonNumber={reasonNumber}
              returnChecked={item.return_checked}
            />
          )}
          <div className="flex  justify-start">
            <div>
              <RequestStatus comment={rejectComment} status={status.status} />
            </div>
            <div className="ml-2 flex flex-col">
              <span className="font-semibold">
                {capitalizeFirstLetter(getStatusDE(status.status))}
                {/* show reject_reason if rejected */}
                {status.status === 'rejected' ? ' - ' + rejected_reason : ''}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="">
              {getStatusDE(status.status)}{' '}
              <span className="ps-2">{dayjs(status.created_at).format('DD.MM.YYYY')}</span>
            </div>
            {item.deleted_at === null ? (
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="cursor-pointer rounded-lg border  bg-secondary p-2  text-gray-500 duration-150 hover:text-red-600 active:scale-[0.9]"
              >
                <FiTrash2 className="" size={18} />
              </button>
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
              Umtausch in:
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
            {item.return_checked !== null &&
              (function () {
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
                  default:
                    return null; // Return null if none of the cases match
                }
              })()}
          </div>
          {/* //rgnpcrz-ui-todo */}
          {/* //rgnpcrz-ui-todo */}
          {item.deleted_at === null && deletedAt === null && (
            <>
              {(status.status == StatusEnum.REQUESTED || status.status == StatusEnum.IN_PROGRESS) &&
                !returnedToCustomer &&
                ((reasonNumber == 5 || reasonNumber == 7) &&
                status.status == StatusEnum.REQUESTED ? (
                  user.role_id !== 4 ? (
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
                      />
                    </div>
                  ) : (
                    <div>Support muss diese Anfrage erst prüfen.</div>
                  )
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <button className=" action-button bg-gray-300 " onClick={handleModal}>
                        ablehnen
                      </button>
                      <button className="action-button " onClick={handleAcceptOrder}>
                        akzeptieren
                      </button>
                    </div>
                  </>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

{
  /* <div className="w-full returned-product-images bg-white mt-5 flex flex-col pl-2 pt-2">
          <p className="ml-2 mb-2 font-semibold">Fotos vom Kunden</p>
          <div className="flex items-center justify-around w-50">
            {uploaded_images.map((uploaded_image, index) => {
              return <UploadedImage key={index} uploaded_image={uploaded_image.image} />;
            })}
          </div>
        </div> */
}
