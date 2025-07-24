import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrderContext } from '../../context/Order.context';
import { ReasonEnum } from '../../enums/Reason.enum';
import { Tooltip } from '@mui/material';
import { TypeEnum } from '../../enums/Type.enum';
import { determineReturnType } from '../../utils';
import axiosInstance from '../../utils/axios';
import { useTranslation } from 'react-i18next';
import './ReturnPortalLayout.css';
import LanguageSwitcher from '../atoms/LanguageSwitcher/LanguageSwitcher';
import { CONSOLE_LOG } from '../../config/env';
import { CO2Footer } from '../atoms/CO2Footer';

export const ReturnPortalLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const returnMenuPage = location.pathname === '/return-menu';
  const returnOrderPage = location.pathname === '/return-order';
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  //
  //
  const {
    orderContext,
    previousStep,
    nextStep,
    updateOrderContext,
    addFieldToState,
    updateMultipleFields,
  } = useOrderContext();
  const [showTooltip, setShowTooltip] = useState(false);
  const noProductsSelected = orderContext?.products?.length === 0;
  const hasMixedProducts = orderContext?.line_items?.some(
    (product) => product.type == TypeEnum.RETURN,
  );
  // console.log(orderContext);
  const damagedLineItems = orderContext.line_items.filter((line_item) => {
    return line_item.reason == ReasonEnum.DAMAGED;
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

  const dislikedLineItems = orderContext.line_items.filter((line_item) => {
    return line_item.reason == ReasonEnum.DONT_LIKE_IT && line_item.type == TypeEnum.EXCHANGE;
  });
  console.log(dislikedLineItems, 'dislikedLineItems');

  // // return portal #debugging
  // console.log('damagedLineItems');
  // console.log(damagedLineItems);
  // console.log('dislikedLineItems');
  // console.log(dislikedLineItems);
  // console.log('lowQualityLineItems');
  // console.log(lowQualityLineItems);
  // console.log('misdeliveredLineItems');
  // console.log(misdeliveredLineItems);
  // console.log('tooSmallItems(exchange)');
  // console.log(tooSmallItems);
  // console.log('tooLargeItems(exchange)');
  // console.log(tooLargeItems);
  // console.log('context PRODUCTS');
  // console.log(orderContext.products);
  // //

  // const changedMindItems = orderContext.line_items.filter((line_item) => {
  //   return line_item.reason == ReasonEnum.CHANGED_MY_MIND && line_item.type == TypeEnum.EXCHANGE;
  // });

  //
  //
  //
  //
  // rgnpcrz debugg
  // ===========
  // const hasMissingExchangeInfo =
  //   tooSmallItems.some((item) => !item.exchange_variant_title || !item.exchange_variant_id) ||
  //   tooLargeItems.some((item) => !item.exchange_variant_title || !item.exchange_variant_id);

  // const disabledForMissingImages =
  //   !damagedLineItems.every((line_item) => {
  //     return line_item.image && line_item.image.length >= 3 && line_item.image.length <= 5;
  //   }) ||
  //   !misdeliveredLineItems.every((line_item) => {
  //     return line_item.image && line_item.image.length >= 3 && line_item.image.length <= 5;
  //   });

  // console.log('disabledForMissingImages', disabledForMissingImages);

  // const disabledForMissingComment =
  //   damagedLineItems.some((damaged_line_item) => {
  //     return !damaged_line_item.comment || damaged_line_item.comment.length < 1;
  //   }) ||
  //   dislikedLineItems.some((disliked_line_item) => {
  //     return !disliked_line_item.comment || disliked_line_item.comment.length < 1;
  //   }) ||
  //   lowQualityLineItems.some((low_quality_line_item) => {
  //     return !low_quality_line_item.comment || low_quality_line_item.comment.length < 1;
  //   }) ||
  //   misdeliveredLineItems.some((misdelivered_line_item) => {
  //     return !misdelivered_line_item.comment || misdelivered_line_item.comment.length < 1;
  //   });

  // console.log('disabledForMissingComment', disabledForMissingComment);
  // console.log('===================');
  // ===========
  // Helper function to check if an item has valid exchange info
  const hasValidExchangeInfo = (item) => item.exchange_variant_title && item.exchange_variant_id;

  // Helper function to check if a line item has valid images
  const hasValidImages = (line_item) =>
    line_item.image && line_item.image.length >= 3 && line_item.image.length <= 5;

  // Helper function to check if a line item has a valid comment
  const hasValidComment = (line_item) => line_item.comment && line_item.comment.length >= 1;

  // Check if any item in tooSmallItems or tooLargeItems is missing exchange info
  const hasMissingExchangeInfo =
    tooSmallItems.some((item) => !hasValidExchangeInfo(item)) ||
    tooLargeItems.some((item) => !hasValidExchangeInfo(item)) ||
    dislikedLineItems.some((item) => !hasValidExchangeInfo(item));

  // Check if any item in damagedLineItems or misdeliveredLineItems is missing valid images
  const disabledForMissingImages =
    !damagedLineItems.every(hasValidImages) || !misdeliveredLineItems.every(hasValidImages);

  // Check if any item in damagedLineItems, dislikedLineItems, lowQualityLineItems, or misdeliveredLineItems is missing a valid comment
  const disabledForMissingComment =
    damagedLineItems.some((line_item) => !hasValidComment(line_item)) ||
    // dislikedLineItems.some((line_item) => !hasValidComment(line_item)) ||
    lowQualityLineItems.some((line_item) => !hasValidComment(line_item)) ||
    misdeliveredLineItems.some((line_item) => !hasValidComment(line_item));

  // console.log('disabledForMissingImages', disabledForMissingImages);
  // console.log('disabledForMissingComment', disabledForMissingComment);
  // console.log('===================');
  //
  //
  //
  //
  //
  const pathName = location.pathname;
  const submitWithoutCredit = async () => {
    if (isSubmitting) return; // Prevent function from running if already submitting
    setIsSubmitting(true); // Set submitting state to true
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
        const isSizeIssue =
          line_item.reason === '1' || line_item.reason === '2' || line_item.reason === '3';

        const updatedItem = {
          ...line_item,
          quantity: line_item.selectedQuantity,
          package_damaged:
            line_item.reason == 5 || line_item.reason == 7 ? orderContext.package_damaged : false,
        };

        if (!isSizeIssue) {
          delete updatedItem.exchange_variant_title;
          delete updatedItem.exchange_variant_id;
        }

        delete updatedItem.selectedQuantity;

        return updatedItem;
      });

    try {
      const res = await axiosInstance.post('/save-return', {
        ...orderContext,
        line_items: updatedLineItems,
        type: determineReturnType(updatedLineItems),
      });
      updateMultipleFields({
        currentStep: 1,
        pdfLink: res.data.data.return_pdf_link,
        shippingLabel: res.data.data.shipping_label_link,
        saveReturnLoading: false,
        // Other fields to reset
        requestSubmited: true,
        barcode_number: res.data.barcode_number,
      });
      navigate('/return-success');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false); // Reset submitting state regardless of outcome
    }
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
        // &&
        // orderContext.support === false
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
    <div className="max-h-screen items-center justify-center overflow-y-auto bg-mobileBgImage bg-cover bg-no-repeat text-center sm:bg-bgImage">
      <div className="mx-auto flex min-h-screen max-w-[1400px] items-center justify-center">
        <div className="hidden h-20 w-1/3 2xl:block"></div>
        <div className="mx-2.5 max-w-xl py-10 text-center">
          <div className="min-h-96 border bg-white">
            <div
              className={
                `flex items-center border-b bg-white px-4 lg:px-6 ` +
                (returnOrderPage ? 'justify-between' : 'justify-center')
              }
            >
              {returnOrderPage && (
                <div className="text-start font-semibold">
                  {orderContext.currentStep === 1 ? (
                    <span>{t('returnPortalLayout.returnText')}</span>
                  ) : (
                    <span>{t('returnPortalLayout.overviewText')}</span>
                  )}
                </div>
              )}
              {/* {returnMenuPage && (
              <div className="mb-2 mr-5 cursor-pointer" onClick={handleBackButton}>
                <img src="/images/Group.svg" alt="" />
              </div>
            )} */}
              <img
                className="my-4 max-w-32 bg-cover"
                src="/images/new/logo-new.svg"
                alt="Pammy's Logo."
              />
            </div>

            <div className=" min-h-[450px] overflow-y-auto ">{children}</div>
            {returnOrderPage && (
              <div className="flex border-t p-3">
                <div
                  className="flex h-12 w-12 cursor-pointer items-center justify-center bg-[#E6E6E6]"
                  onClick={handleBackButton}
                >
                  <img src="/images/Group.svg" alt="" />
                </div>
                {pathName !== '/return-order-status' && (
                  <div
                    className="flex-1"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
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
                        className={`flex h-12 cursor-pointer items-center justify-center gap-2 font-bold duration-300 ${
                          noProductsSelected ||
                          disabledForMissingComment ||
                          disabledForMissingImages ||
                          hasMissingExchangeInfo ||
                          orderContext.disabled
                            ? 'disabled bg-accent-disabled text-black'
                            : 'bg-accent'
                        }`}
                      >
                        {orderContext.currentStep === 1 ? (
                          <span>{t('global.waitButtonText')}</span>
                        ) : (
                          <span>{t('global.goBackButtonText')}</span>
                        )}
                        <span className="">
                          <img src="/images/Vector.svg" />
                        </span>
                      </div>
                    </Tooltip>
                  </div>
                )}
              </div>
            )}
          </div>
          {CONSOLE_LOG === true && <LanguageSwitcher />}
          {location.pathname !== '/return-success' ? <CO2Footer /> : null}
        </div>
      </div>
    </div>
  );
};
