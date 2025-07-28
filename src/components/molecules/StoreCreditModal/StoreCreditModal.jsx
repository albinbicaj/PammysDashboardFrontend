import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import { RefundMode, TypeEnum } from '../../../enums/Type.enum';
import { useOrderContext } from '../../../context/Order.context';
import { convertToDE } from '../../../utils/price';
import axios from '../../../utils/axios';
import { Trans, useTranslation } from 'react-i18next';
import { Checkbox } from '@mui/material';
import showToast from '../../../hooks/useToast';
import { BlackCheckbox } from '../../UI/BlackCheckbox';

export const StoreCreditModal = ({ showModal, handleSubmit }) => {
  const { t } = useTranslation();
  const { orderContext, updateOrderContext, updateMultipleFields } = useOrderContext();
  const [checkbox, setCheckbox] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [loading, setLoading] = useState(true);
  const selectedProducts = orderContext.products.filter(
    (product) => product.type == TypeEnum.RETURN,
  );

  console.log(orderContext?.shipping_address?.country_code);
  const fetchGiftCardDetails = async () => {
    try {
      const response = await axios.post('/show-gift-card-offer', {
        shopify_order_id: orderContext.shopify_order_id,
        // line_items: selectedProducts,
        line_items: selectedProducts.map((item) => ({
          ...item,
          quantity: item.selectedQuantity,
        })),
        payment_method: orderContext.payment_method,
      });
      const { data } = response;

      if (data.gift_card.length == 0) {
        updateOrderContext('giftCardMessage', data.message);
        updateOrderContext('giftCardNotAvailable', true);
        delete orderContext.order_amount;
        delete orderContext.gift_card_amount;
        delete orderContext.gift_initial_value;
        delete orderContext.gift_card_percentage;
        // rgnpcrz submit automatically if there is no gift card
        handleSelection(RefundMode.MONEY);
      } else {
        updateOrderContext('giftCardNotAvailable', false);
        updateOrderContext('order_amount', data.gift_card.order_amount);
        updateOrderContext('gift_card_amount', data.gift_card.gift_card_amount);
        updateOrderContext('gift_initial_value', data.gift_card.gift_initial_value);
        updateOrderContext('gift_card_percentage', data.gift_card.gift_card_percentage);
      }
      setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGiftCardDetails();
  }, []);

  const handleSelection = (type) => {
    if (!checkbox) {
      setCheckboxError(true);
      console.log('Please read and accept...');
      return;
    }
    handleSubmit(type);
  };
  const handleAcceptGiftCard = (type) => {
    if (!checkbox) {
      setCheckboxError(true);
      console.log('Please read and accept...');
      return;
    }
    updateMultipleFields({
      giftOfferAccepted: true,
    });
    handleSubmit(type);
  };

  return (
    <div className="text-center">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          {/* <p>We are calculating a special offer for you</p> */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        </div>
      ) : (
        <Modal
          open={showModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          BackdropProps={{
            style: {
              backgroundColor: 'rgba(156, 163, 175, 0.75)', // bg-gray-400 with 75% opacity
            },
          }}
        >
          <Box className="custom-modal   max-h-[95%] w-full max-w-[550px] overflow-y-auto    md:max-h-[85%] md:min-w-[450px] ">
            <form
              className="m-4 flex h-full flex-1 flex-col justify-between gap-5 bg-white p-4"
              onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                // Handle form submission logic here
              }}
            >
              <p className="pb-4 text-xl font-medium">
                {orderContext.giftCardNotAvailable
                  ? t('storeCreditModal.giftCardNotAvailableText')
                  : t('storeCreditModal.giftCardNotAvailableSecondText')}
              </p>
              <div className="text-sm">
                {orderContext.giftCardNotAvailable ? (
                  <p className="giftcard-info">
                    {t('storeCreditModal.giftCardNotAvailableThridText')}
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {orderContext?.shipping_address?.country_code === 'DE' ? (
                      <>
                        <p className="">
                          <Trans
                            i18nKey="storeCreditModal.voucher_offer"
                            components={{ bold: <strong /> }}
                            values={{
                              amount: parseFloat(orderContext.gift_initial_value)
                                .toFixed(2)
                                .replace('.', ','),
                            }}
                          />
                        </p>
                        <p className="">
                          <Trans
                            i18nKey="storeCreditModal.free_shipping"
                            components={{ bold: <strong /> }}
                          />
                        </p>
                        <p>
                          <Trans
                            i18nKey="storeCreditModal.note"
                            components={{ bold: <strong /> }}
                          />
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="">
                          <Trans
                            i18nKey="storeCreditModal.outside_de.voucher_offer"
                            components={{ bold: <strong /> }}
                            values={{
                              amount: parseFloat(orderContext.gift_initial_value)
                                .toFixed(2)
                                .replace('.', ','),
                            }}
                          />
                        </p>
                        {/* <p className="">
                          <Trans
                            i18nKey="storeCreditModal.free_shipping"
                            components={{ bold: <strong /> }}
                          />
                        </p> */}
                        <p>
                          <Trans
                            i18nKey="storeCreditModal.outside_de.note"
                            components={{ bold: <strong /> }}
                          />
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div>
                  <div
                    className={`${checkboxError ? 'bg-red' : ''} flex w-full items-start gap-2 py-2 text-left text-xs`}
                  >
                    <BlackCheckbox
                      checked={checkbox}
                      onChange={() => {
                        setCheckbox(!checkbox);
                        setCheckboxError(false);
                      }}
                    />
                    <p>
                      <Trans
                        i18nKey="storeCreditModal.agreement"
                        components={{ bold: <strong /> }}
                      />
                    </p>
                  </div>
                  {checkboxError && (
                    <p className="pl-[24px] text-sm text-red-500">
                      Bitte lesen und akzeptieren Sie die Vereinbarung.
                    </p>
                  )}
                </div>
              </div>

              {orderContext.giftCardNotAvailable ? (
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => {
                      handleSelection(RefundMode.MONEY);
                    }}
                    className="gift-card-button"
                    type="submit"
                  >
                    {t('storeCreditModal.continue')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-start justify-between gap-3">
                  <button
                    onClick={() => {
                      handleAcceptGiftCard(RefundMode.VOUCHER);
                    }}
                    className="flex w-full justify-between bg-accent px-4 py-3 font-semibold"
                    type="submit"
                  >
                    <span>{t('storeCreditModal.giftCardText')}</span>
                    <span>{convertToDE(orderContext.gift_card_amount)}</span>
                  </button>
                  {orderContext.order_amount !== 0 && (
                    <button
                      onClick={() => {
                        handleSelection(RefundMode.MONEY);
                      }}
                      className="flex w-full justify-between bg-accent-50 px-4 py-2"
                      type="submit"
                    >
                      <span>{t('storeCreditModal.refund')}</span>
                      <span>{convertToDE(orderContext.order_amount)}</span>
                    </button>
                  )}
                </div>
              )}
            </form>
          </Box>
        </Modal>
      )}
    </div>
  );
};
