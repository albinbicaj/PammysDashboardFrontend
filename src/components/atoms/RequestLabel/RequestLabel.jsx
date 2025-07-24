import React from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import ShareIcon from '@mui/icons-material/Share';
import { TypeEnum } from '../../../enums/Type.enum';
import { formatCommentTime } from '../../../utils';
import { getStatusDE } from '../../../utils/getStatusDE';
import { DeleteModal } from '../DeleteModal/DeleteModal';
import { GiftcardToRefundButton } from '../GiftcardToRefundButton/GiftcardToRefundButton';
import { ResetRequestedOrderStatus } from '../ResetRequestedOrderStatus/ResetRequestedOrderStatus';
import ClipboardButton from '../ClipboardButton';
import {
  IconBrandShopee,
  IconCalendarMonth,
  IconDownload,
  IconFileText,
} from '@tabler/icons-react';
import { Tooltip } from '@mui/material';
import { PammysLoading } from '../PammysLoading/PammysLoading';

export const RequestLabel = ({
  orderId,
  orderNumber,
  orderPath,
  orderPdf,
  customerPath,
  newOrderPath,
  name,
  address,
  payment,
  labelDate,
  orderType,
  orderStatus,
  orderCreated,
  shippingLabel,
  email,
  refundType,
  handleDeleteOrder,
  trackingNumber,
  handleGiftCardToRefun,
  resetRequestedOrderStatus,
  deleted_at,
  hasReturnChecked,
  updateOrderStatusToContacted,
  loadingStatusChangedToContacted,
  items,
}) => {
  const shippingLabelUrl = decodeURIComponent(shippingLabel);
  const blueColor = blue[600];
  const handleShippingLabelDownload = () => {
    const formattedDateTime = dayjs().format('DD-MM-YYYY_HH-mm-ss');
    const fileName = `shipping_details_${formattedDateTime}.pdf`;
    const link = document.createElement('a');
    link.href = shippingLabelUrl;

    link.download = fileName; // Specify the file name
    link.target = '_blank'; // Open in a new tab/window
    link.rel = 'noopener noreferrer'; // Security best practice
    link.click();
  };
  console.log(items, 'test');
  const getRefundTypeInGerman = (refundType) => {
    switch (refundType) {
      case 'Geld':
        return 'Rückerstattung';
      case 'Geschenkkarte':
        return 'Geschenkcode';
      default:
        return refundType;
    }
  };
  return (
    <div className="flex max-w-[550px] flex-1 flex-col gap-5 border !bg-white !p-5 !shadow">
      {/* <div className="sticky top-0 #ABOVE-CLASS"> */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="flex items-center gap-3 font-semibold">
            <ClipboardButton textToCopy={orderNumber} />
            <Link className="flex items-center !no-underline" to={orderPath} target="_blank">
              {orderNumber}
              {/* <ShareIcon style={{ marginLeft: '5px', fontSize: '12px', color: blueColor }} /> */}
            </Link>
          </span>
          <span className="flex items-center gap-2 !text-gray-500">
            {/* <CalendarMonthIcon style={{ marginRight: '5px', fontSize: '14px', color: grey[400] }} /> */}
            <IconCalendarMonth size={16} />
            {dayjs(labelDate).format('DD.MM.YYYY')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>
            <Link
              className="btn !hover:text-gray-800 flex cursor-pointer items-center gap-2 !bg-gray-100 !px-2 !py-1 !text-sm !text-gray-600 !no-underline"
              to={orderPath}
              target="_blank"
            >
              <IconBrandShopee size={16} />
              Go to Shopify
            </Link>
          </span>

          <span>
            <Link
              className="btn !hover:text-gray-800 flex cursor-pointer items-center gap-2 !bg-gray-100 !px-2 !py-1 !text-sm !text-gray-600 !no-underline"
              to={orderPdf}
              target="_blank"
            >
              {/* <PictureAsPdfIcon /> */}
              Rücksendeformular
              <IconFileText size={18} />
            </Link>
          </span>
        </div>
      </div>
      <div className="space-y-3 border-t-2 py-4">
        {(orderType === TypeEnum.MIX || orderType === TypeEnum.EXCHANGE) && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">
              {items.some(
                (item) =>
                  item.return_checked !== null &&
                  item.converted_to &&
                  item.converted_to.includes('to exchange') &&
                  item.return_checked !== 1,
              )
                ? 'Ersatzlieferung'
                : 'Umtausch-Bestellung'}
            </span>
            {newOrderPath !== null ? (
              <Link to={newOrderPath} target="_blank">
                <span className="flex items-center">
                  <ShareIcon style={{ marginLeft: '5px', fontSize: '14px', color: blueColor }} />
                </span>
              </Link>
            ) : (
              <ShareIcon
                className="cursor-not-allowed"
                style={{ marginLeft: '5px', fontSize: '14px', color: 'black' }}
              />
            )}
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Zahlungsmethode</span>
          <span>{payment}</span>
        </div>
        {orderType != TypeEnum.EXCHANGE && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Erstattung</span>
            <span>{getRefundTypeInGerman(refundType)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Retourenfenster</span>
          <span>{formatCommentTime(orderCreated.created_at)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Status</span>
          {/* <span>{capitalizeFirstLetter(orderStatus)}</span> */}
          <span>{getStatusDE(orderStatus)}</span>
        </div>
      </div>
      {(orderType === TypeEnum.EXCHANGE ||
        orderType === TypeEnum.MIX ||
        (orderType === TypeEnum.RETURN && hasReturnChecked) ||
        (orderType === TypeEnum.RETURN && refundType === 'Geschenkkarte')) && (
        <div className="space-y-1 border-t-2 pt-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Versender</span>
            <span>DHL</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Sendungsnummer</span>
            <div className="flex gap-3">
              <span className="text-blue-500">{trackingNumber}</span>
              <ClipboardButton textToCopy={trackingNumber} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Label</span>
            {shippingLabel == null ? (
              'Kein Versandetikett'
            ) : (
              <span
                className="btn flex cursor-pointer items-center gap-2 bg-gray-100 px-2 py-1 text-sm text-gray-600 hover:text-blue-500"
                onClick={handleShippingLabelDownload}
              >
                <span className="">Download Label</span>
                <IconDownload size={18} />
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Erstellt am</span>
            <span></span>
          </div>
        </div>
      )}

      <div className="space-y-4 border-t-2 pt-6">
        <div className="flex flex-col  ">
          <span className="text-gray-400">Kunde</span>
          <div className="flex justify-between gap-2">
            <span>{name}</span>
            {/* <Link to={customerPath} target="_blank">
              <span className="flex items-center">
                <ShareIcon style={{ marginLeft: '5px', fontSize: '14px', color: blueColor }} />
              </span>
            </Link> */}
            <Tooltip title={`Shopify kunde profile`} arrow placement="top">
              <Link
                className="btn  !hover:text-gray-800   cursor-pointer !bg-gray-100 !p-1 !text-sm !text-gray-600"
                to={customerPath}
                target="_blank"
              >
                <IconBrandShopee size={16} />
              </Link>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400">Email</span>
          <span className="flex justify-between gap-2">
            <span>{email}</span>
            <ClipboardButton textToCopy={email} />
          </span>
        </div>
        {/* <div className="flex  items-center justify-between gap-2">
          <span className="text-gray-400">Lieferadresse</span>
          <span className=" text-right">
            {address}
            <ClipboardButton textToCopy={address} />
          </span>
        </div> */}
        <div className="flex flex-col">
          <span className="text-gray-400">Lieferadresse</span>
          <div className="flex justify-between">
            <span className="">
              {address.split(',').map((line, index, array) => (
                <React.Fragment key={index}>
                  {line.trim()}
                  {index < array.length - 1 && ','} {/* Keep the comma except for the last line */}
                  <br />
                </React.Fragment>
              ))}
            </span>
            <ClipboardButton textToCopy={address} />
          </div>
        </div>
        {deleted_at === null && (
          <>
            {refundType == 'Geschenkkarte' && payment !== 'gift_card' && (
              <div className="pt-10">
                <GiftcardToRefundButton handleGiftCardToRefun={handleGiftCardToRefun} />
              </div>
            )}
            <ResetRequestedOrderStatus onConfirm={() => resetRequestedOrderStatus(orderId)} />
            <DeleteModal
              confirmButton={handleDeleteOrder}
              buttonText="Rücksendung unwiderruflich löschen"
              modalTitle="Möchtest du diese Rücksendung wirklich löschen? Der Vorgang kann nicht rückgängig gemacht werden."
              cancelText="abbrechen"
              deleteText="Rücksendung unwiderruflich löschen"
            />
            {orderStatus === 'requested' && (
              <div>
                <button
                  className="w-[100%] bg-accent px-6 py-2"
                  onClick={() => {
                    updateOrderStatusToContacted(orderId);
                  }}
                >
                  {loadingStatusChangedToContacted ? (
                    <PammysLoading height={5} width={5} />
                  ) : (
                    'Kontaktiert'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

//  <div className="dbg-red mt-10 space-y-3">
//    <div className="flex items-center justify-between ">
//      <span className="text-gray-400">Kunde</span>
//      <Link to={customerPath} target="_blank">
//        <span className="flex items-center">
//          <span>{name}</span>
//          <ShareIcon style={{ marginLeft: '5px', fontSize: '14px', color: blueColor }} />
//        </span>
//      </Link>
//    </div>
//    <div className=" flex items-center justify-between">
//      <span className="text-gray-400">Email</span>
//      <span className="flex items-center gap-2">
//        <span>{email}</span>
//        <ClipboardButton textToCopy={email} />
//      </span>
//    </div>
//    {/* <div className="flex  items-center justify-between gap-2">
//           <span className="text-gray-400">Lieferadresse</span>
//           <span className=" text-right">
//             {address}
//             <ClipboardButton textToCopy={address} />
//           </span>
//         </div> */}
//    <div className="flex items-center justify-between gap-2">
//      <span className="text-gray-400">Lieferadresse</span>
//      <span className="text-right">
//        {address.split(',').map((line, index, array) => (
//          <React.Fragment key={index}>
//            {line.trim()}
//            {index < array.length - 1 && ','} {/* Keep the comma except for the last line */}
//            <br />
//          </React.Fragment>
//        ))}
//        <ClipboardButton textToCopy={address} />
//      </span>
//    </div>
//    {deleted_at === null && (
//      <>
//        {refundType == 'Geschenkkarte' && payment !== 'gift_card' && (
//          <div className="pt-10">
//            <GiftcardToRefundButton handleGiftCardToRefun={handleGiftCardToRefun} />
//          </div>
//        )}
//        <ResetRequestedOrderStatus onConfirm={() => resetRequestedOrderStatus(orderId)} />
//        <DeleteModal
//          confirmButton={handleDeleteOrder}
//          buttonText="Rücksendung unwiderruflich löschen"
//          modalTitle="Möchtest du diese Rücksendung wirklich löschen? Der Vorgang kann nicht rückgängig gemacht werden."
//          cancelText="abbrechen"
//          deleteText="Rücksendung unwiderruflich löschen"
//        />
//      </>
//    )}
//  </div>;
