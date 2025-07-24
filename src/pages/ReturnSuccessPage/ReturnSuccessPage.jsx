import React from 'react';
import dayjs from 'dayjs';

import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../components/useDocumentTitle';
import { useOrderContext } from '../../context/Order.context';
import { ReasonEnum } from '../../enums/Reason.enum';
import { ReturnPortalLayout } from '../../components/template/ReturnPortalLayout';
import { Trans, useTranslation } from 'react-i18next';

const ReturnSuccesPage = () => {
  const { orderContext } = useOrderContext();
  const pdfUrl = decodeURIComponent(orderContext.pdfLink);
  const shippingLabelUrl = decodeURIComponent(orderContext.shippingLabel);
  const { t } = useTranslation();

  // console.log('orderContext.shippingLabel');
  // console.log(orderContext.shippingLabel);
  console.log('orderContext');
  console.log(orderContext);
  console.log('==============');

  const handlePDFDownload = () => {
    const formattedDateTime = dayjs().format('DD-MM-YYYY_HH-mm-ss');
    const fileName = orderContext.barcode_number || `request_details_${formattedDateTime}.pdf`;

    // Extract base64 PDF string
    const base64String = pdfUrl.split(',')[1];
    // Decode base64 PDF string
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the PDF data
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    //
    // // Open PDF in a new tab
    // window.open(url, '_blank');

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}`);
    link.target = '_blank'; // Open in a new tab/window
    link.rel = 'noopener noreferrer'; // Security best practice
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  };
  // console.log(orderContext);
  const damagedLineItems = orderContext.line_items.filter((line_item) => {
    return line_item.reason == ReasonEnum.DAMAGED;
  });
  const misdeliveredLineItems = orderContext.line_items.filter((line_item) => {
    return line_item.reason == ReasonEnum.MISDELIVERY;
  });
  const handleShippingLabelDownload = () => {
    const formattedDateTime = dayjs().format('DD-MM-YYYY_HH-mm-ss');
    const fileName =
      orderContext.barcode_number + '_shipping_label' ||
      `shipping_details_${formattedDateTime}.pdf`;

    // Extract base64 PDF string
    const base64String = shippingLabelUrl.split(',')[1];
    // Decode base64 PDF string
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the PDF data
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    //
    // // Open PDF in a new tab
    // window.open(url, '_blank');

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}`);
    link.target = '_blank'; // Open in a new tab/window
    link.rel = 'noopener noreferrer'; // Security best practice
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  };
  useDocumentTitle('Pammys™ Retourenportal');
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate('/retourenportal');
  };

  return (
    <ReturnPortalLayout>
      <div className=" h-full max-w-[500px] items-center  py-7">
        <div className="border-b ">
          <h1 className="pb-7 font-bold">{t('returnSuccessPage.finishedText')}</h1>
        </div>
        <div className="flex min-h-[350px] flex-col items-center justify-center px-2">
          <div className=" text-[15px]">
            {misdeliveredLineItems.length !== 0 || damagedLineItems.length !== 0 ? (
              <p className="success-message mt-6 w-full text-[15px]">
                {damagedLineItems.length !== 0 && (
                  <p>
                    {t('returnSuccessPage.thankyouText')}
                    <br />
                    <br />
                    {t('returnSuccessPage.text')}
                  </p>
                )}
                {misdeliveredLineItems.length !== 0 && (
                  <p>
                    {t('returnSuccessPage.thankyouTextSecond')}
                    <br />
                    <br />
                    {t('returnSuccessPage.textSecond')}
                  </p>
                )}
                <p className="mt-6">{t('returnSuccessPage.processingTimeText')}</p>
              </p>
            ) : (
              <div className="flex flex-col items-center gap-5 text-left sm:min-w-[450px]">
                <div className="mx-auto flex w-full max-w-[400px] flex-col gap-3">
                  {orderContext?.shipping_address?.country_code === 'DE' &&
                  orderContext?.is_gift_card === true ? (
                    <>
                      <p>
                        <Trans
                          i18nKey="returnSuccessPage.de.instruction"
                          components={{ strong: <strong /> }}
                        />{' '}
                        <Trans
                          i18nKey="returnSuccessPage.de.return_period"
                          components={{ strong: <strong /> }}
                        />{' '}
                        <Trans
                          i18nKey="returnSuccessPage.de.email_info"
                          components={{ strong: <strong /> }}
                        />
                      </p>
                      <p>
                        <Trans
                          i18nKey="returnSuccessPage.de.free_return_label"
                          components={{ strong: <strong /> }}
                        />
                        {''}
                        <Trans
                          i18nKey="returnSuccessPage.de.free_shipping"
                          components={{ strong: <strong /> }}
                        />
                        {''}
                        <Trans
                          i18nKey="returnSuccessPage.de.more_info"
                          components={{ strong: <strong /> }}
                        />
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <Trans
                          i18nKey="returnSuccessPage.outside_de.instruction"
                          components={{ strong: <strong /> }}
                        />

                        <Trans
                          i18nKey="returnSuccessPage.outside_de.return_period"
                          components={{ strong: <strong /> }}
                        />

                        <Trans
                          i18nKey="returnSuccessPage.outside_de.email_info"
                          components={{ strong: <strong /> }}
                        />
                      </p>
                      <p>
                        <Trans
                          i18nKey="returnSuccessPage.outside_de.important_note"
                          components={{ strong: <strong /> }}
                        />
                      </p>
                      <p>
                        <Trans
                          i18nKey="returnSuccessPage.outside_de.more_info"
                          components={{ strong: <strong /> }}
                        />
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* #rgnpcrz #todo this div will be used to show backend text automatically */}
          {/* <div style={{ whiteSpace: 'pre-wrap' }}></div> */}
          {pdfUrl.length > 0 &&
            misdeliveredLineItems.length === 0 &&
            damagedLineItems.length === 0 && (
              <div
                onClick={handlePDFDownload} // Corrected function name
                className="download-order-button  mt-7 flex cursor-pointer items-center justify-around bg-button font-bold"
              >
                {/* rgnpcrz-01.03.2024 */}
                {/* <span className="ml-3"> Rücksendeschein herunterladen  </span> */}
                <span className="ml-3">{t('returnSuccessPage.downloadReturnForm')}</span>
                <span>
                  <img src="/images/download.svg" alt="Download icon" />
                  {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="h-4 w-4"
                >
                  <path d="M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
                  <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
                </svg> */}
                </span>
              </div>
            )}
          {shippingLabelUrl.length > 0 &&
            misdeliveredLineItems.length === 0 &&
            damagedLineItems.length === 0 &&
            orderContext?.shipping_address?.country_code === 'DE' && (
              <div
                onClick={handleShippingLabelDownload} // Corrected function name
                className="download-label-button  mt-7 flex cursor-pointer items-center justify-around bg-button font-bold"
              >
                <span className="ml-3">{t('returnSuccessPage.downloadDhReturnLabel')}</span>
                <span>
                  <img src="/images/download.svg" alt="Download icon" />
                </span>
              </div>
            )}
          <div className="mt-12  font-bold ">
            <a className=" px-4 py-2" href="/retourenportal">
              {t('returnSuccessPage.returnToPortal')}
            </a>
          </div>
        </div>
      </div>
    </ReturnPortalLayout>
  );
};

export default ReturnSuccesPage;

{
  /* OLD RETURN DESIGN */
}
{
  /* <div className="flex flex-col items-center gap-5 sm:min-w-[450px]">
                  <p className=" mx-auto mt-6 w-full max-w-[350px]">
               
                    {orderContext.giftOfferAccepted === true
                      ? t('returnSuccessPage.giftOrderAcceptText')
                      : t('returnSuccessPage.giftOrderAcceptText')}
                  </p>
                  <p className="max-w-[350px] ">
                    <span className="font-semibold">{t('returnSuccessPage.note')} </span>
                    {t('returnSuccessPage.orderAcceptNote')}
                  </p>
                </div> */
}
