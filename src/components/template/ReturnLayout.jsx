import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrderContext } from '../../context/Order.context';
import { ReasonEnum } from '../../enums/Reason.enum';
import { Tooltip } from '@mui/material';
import { TypeEnum } from '../../enums/Type.enum';
import { determineReturnType } from '../../utils';
import axiosInstance from '../../utils/axios';
import { useTranslation } from 'react-i18next';

export const ReturnLayout = ({ children }) => {
  const { t } = useTranslation();
  const {
    orderContext,
    previousStep,
    nextStep,
    updateOrderContext,
    addFieldToState,
    updateMultipleFields,
  } = useOrderContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);
  const noProductsSelected = orderContext?.products?.length === 0;
  const hasMixedProducts = orderContext?.line_items?.some(
    (product) => product.type == TypeEnum.RETURN,
  );

  const damagedLineItems = orderContext.line_items.filter((line_item) => {
    return line_item.reason == ReasonEnum.DAMAGED;
  });

  const dislikedLineItems = orderContext.line_items.filter((line_item) => {
    return line_item.reason == ReasonEnum.DONT_LIKE_IT;
  });

  const lowQualityLineItems = orderContext.line_items.filter((line_item) => {
    return line_item.reason == ReasonEnum.QUALITY_INSUFFICIENT;
  });
  const misdeliveredLineItems = orderContext.line_items.filter((line_item) => {
    return line_item.reason == ReasonEnum.MISDELIVERY;
  });

  const tooSmallItems = orderContext.line_items.filter((line_item) => {
    return line_item.reason == ReasonEnum.TOO_SMALL && line_item.type == TypeEnum.EXCHANGE;
  });
  const tooLargeItems = orderContext.line_items.filter((line_item) => {
    return line_item.reason == ReasonEnum.TOO_LARGE && line_item.type == TypeEnum.EXCHANGE;
  });
  // const changedMindItems = orderContext.line_items.filter((line_item) => {
  //   return line_item.reason == ReasonEnum.CHANGED_MY_MIND && line_item.type == TypeEnum.EXCHANGE;
  // });
  const hasMissingExchangeInfo =
    tooSmallItems.some((item) => !item.exchange_variant_title || !item.exchange_variant_id) ||
    tooLargeItems.some((item) => !item.exchange_variant_title || !item.exchange_variant_id);

  const disabledForMissingImages =
    !damagedLineItems.every((line_item) => {
      return line_item.image && line_item.image.length >= 3 && line_item.image.length <= 5;
    }) ||
    !misdeliveredLineItems.every((line_item) => {
      return line_item.image && line_item.image.length >= 3 && line_item.image.length <= 5;
    });

  const disabledForMissingComment =
    damagedLineItems.some((damaged_line_item) => {
      return !damaged_line_item.comment || damaged_line_item.comment.length < 1;
    }) ||
    dislikedLineItems.some((disliked_line_item) => {
      return !disliked_line_item.comment || disliked_line_item.comment.length < 1;
    }) ||
    lowQualityLineItems.some((low_quality_line_item) => {
      return !low_quality_line_item.comment || low_quality_line_item.comment.length < 1;
    }) ||
    misdeliveredLineItems.some((misdelivered_line_item) => {
      return !misdelivered_line_item.comment || misdelivered_line_item.comment.length < 1;
    });

  const pathName = location.pathname;
  const backgroundImg = 'url("/background.png")';
  const styles = {
    // background: 'url("https://pw-backend.diesea.de/public/front-images/background.png")',
    background: 'url("/background.webp")',
    backgroundSize: 'cover', // You can customize these properties as needed
    backgroundRepeat: 'no-repeat',
  };

  const submitWithoutCredit = async () => {
    updateOrderContext('storeCredit', false);
    updateOrderContext('saveReturnLoading', true);
    let updatedLineItems = orderContext.line_items
      .filter(
        (line_item) =>
          !!line_item.reason &&
          line_item.reason !== '' &&
          line_item.reason !== 0 &&
          line_item.reason !== '0',
      )
      .map((line_item) => {
        // Update the quantity field with the value of selectedQuantity
        const updatedItem = {
          ...line_item,
          quantity: line_item.selectedQuantity,
          package_damaged:
            line_item.reason == 5 || line_item.reason == 7 ? orderContext.package_damaged : false,
        };

        // Remove the selectedQuantity field from the line item
        if (updatedItem.hasOwnProperty('selectedQuantity')) {
          delete updatedItem.selectedQuantity;
        }

        return updatedItem;
      });
    delete orderContext.products;
    delete orderContext.requested_line_items;
    delete orderContext.gift_initial_value;
    delete orderContext.currentStep;
    delete orderContext.pdfLink;
    delete orderContext.order_amount;
    delete orderContext.gift_card_offer;
    delete orderContext.gift_card_amount;
    delete orderContext.gift_card_percentage;
    delete orderContext.disabled;
    delete orderContext.storeCredit;
    const returnType = determineReturnType(updatedLineItems);
    const res = await axiosInstance
      .post('/save-return', {
        ...orderContext,
        gift_card_offer: false,
        line_items: updatedLineItems,
        type: returnType,
      })
      .then((response) => {
        console.log('/save-return, file ReturnLayout.jsx');
        updateMultipleFields({
          currentStep: 1,
          pdfLink: response.data.data.return_pdf_link,
          shippingLabel: response.data.data.shipping_label_link,
          saveReturnLoading: false,
          gift_card_offer: false,
          order_amount: '',
          gift_card_amount: '',
          gift_initial_value: '',
          gift_card_percentage: '',
          storeCredit: false,
          // line_items: [],
          // products: [],
          requestSubmited: true,
          barcode_number: response.data.barcode_number,
        });
        //
        // updateOrderContext('line_items', []);
        // updateOrderContext('products', []);
        // updateOrderContext('saveReturnLoading', false);
        navigate('/return-success');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleBackButton = () => {
    // Check if the current pathname is "/return-menu"
    if (pathName === '/return-menu') {
      navigate('/retourenportal');
    } else if (pathName === '/return-order') {
      if (orderContext.currentStep === 2) {
        previousStep();
      } else {
        navigate('/return-menu');
      }
    } else {
      navigate('/return-menu');
    }
  };
  const handleNextButton = () => {
    // #todo
    // #rgnpcrz-gift-card
    // this part is related to giftcard generation in the end
    if (pathName === '/return-order') {
      if (
        orderContext.currentStep === 2 &&
        hasMixedProducts &&
        misdeliveredLineItems.length === 0 &&
        damagedLineItems.length === 0
      ) {
        updateOrderContext('storeCredit', true);
      } else if (orderContext.currentStep === 2) {
        submitWithoutCredit();
      }
      nextStep();
    }
  };

  const handleMouseEnter = () => {
    if (disabledForMissingComment || disabledForMissingImages || hasMissingExchangeInfo) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  return (
    <div
      className="return-layout flex  w-full flex-col items-end justify-center text-center "
      style={styles}
    >
      <div className="return mt-5 flex flex-col items-center  justify-start bg-white text-center">
        <div className="mt-2 flex w-11/12 items-center  justify-around border-b">
          <div className="mb-2 mr-5 cursor-pointer" onClick={handleBackButton}>
            <img src="/images/Group.svg" alt="" />
          </div>
          <img className="mb-2 mt-2 h-10" src="/Pammys_Logo_2024.webp" />

          {pathName !== '/return-order-status' && (
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <Tooltip
                title={
                  disabledForMissingComment || disabledForMissingImages
                    ? t('global.requireText')
                    : hasMissingExchangeInfo
                      ? t('global.selectProductExchange')
                      : ''
                }
                arrow
                enterDelay={500}
                leaveDelay={200}
                placement="bottom"
                open={showTooltip} // Ensure Tooltip is open only when showTooltip is true
              >
                <div
                  disabled={orderContext.disabled}
                  onClick={
                    noProductsSelected ||
                    disabledForMissingComment ||
                    disabledForMissingImages ||
                    hasMissingExchangeInfo ||
                    orderContext.disabled
                      ? null
                      : handleNextButton
                  }
                  className={`next-button mb-3 flex cursor-pointer items-center justify-center font-bold  ${
                    noProductsSelected ||
                    disabledForMissingComment ||
                    disabledForMissingImages ||
                    hasMissingExchangeInfo ||
                    orderContext.disabled
                      ? 'disabled'
                      : ''
                  }`}
                >
                  {orderContext.currentStep === 1 ? (
                    <span>{t('global.waitButtonText')}</span>
                  ) : (
                    <span>{t('global.goBackButtonText')}</span>
                  )}
                  <span className="ml-2">
                    <img src="/images/Vector.svg" />
                  </span>
                </div>
              </Tooltip>
            </div>
          )}
        </div>
        <div className="flex w-11/12 items-center justify-center border-b font-semibold">
          {orderContext.currentStep === 1 ? (
            <span className="mb-5 mt-5">{t('returnPortalLayout.returnText')}</span>
          ) : (
            <span className="mb-5 mt-5">{t('returnPortalLayout.overviewText')}</span>
          )}
        </div>
        {children}
      </div>
      {location.pathname !== '/return-success' && (
        <div className="return-message mt-2 flex items-center justify-center bg-white sm:mr-96 ">
          <div className="ml-2 mr-1">
            <svg
              width="41"
              height="41"
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20.5" cy="20.5" r="19.5" fill="#E0FFE1" stroke="#98EF9B"></circle>
              <path
                d="M20.9168 28.0763C15.4386 29.1034 12.9908 26.342 12.3572 24.6524C8.50517 14.3808 23.77 10.1011 32.0443 10.5291C25.6246 12.669 27.7645 26.7923 20.9168 28.0763Z"
                fill="#50B153"
              ></path>
              <path
                d="M23.9114 15.6641C19.917 18.0893 11.8424 24.6517 11.5 31.4994"
                stroke="#38903D"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>
          <div className="text-left"> Pammys™ {t('returnPortalLayout.footerText')}</div>
        </div>
      )}
    </div>
  );
};
