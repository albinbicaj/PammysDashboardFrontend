import { Text } from '../../atoms';
import { useOrderContext } from '../../../context/Order.context';
import { useNavigate } from 'react-router-dom';
import { ReturnProductsStep } from './ReturnProductsStep';
import { AddressStep } from './AddressStep';
import axiosInstance from '../../../utils/axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { StoreCreditModal } from '../../molecules';
import { determineReturnType } from '../../../utils';
import { GIFTCARD_PRODUCT_ID } from '../../../config/env';
import { useTranslation } from 'react-i18next';

export const ReturnOrder = () => {
  // Get the value of the localStorage key "currentStep"
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { orderContext, updateOrderContext, addFieldToState, updateMultipleFields } =
    useOrderContext();

  const showStep = (step) => {
    switch (step) {
      case 1:
        return <ReturnProductsStep />;
      case 2:
        return <AddressStep productsType={'productsForReturn'} operationType={'return'} />;
    }
  };

  const refoundedItemCount = orderContext.line_items.filter(
    (item) => item.refunded === false && !item.requested && item.product_id != GIFTCARD_PRODUCT_ID,
  );

  const submit = async (type) => {
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
    delete orderContext.currentStep;
    delete orderContext.pdfLink;
    delete orderContext.saveReturnLoading;
    delete orderContext.disabled;
    delete orderContext.storeCredit;
    const returnType = determineReturnType(updatedLineItems);
    // #rgnpcrz this function doesn't get called ???
    // #rgnpcrz this one is getting CALLED
    const res = await axiosInstance
      .post('/save-return', {
        ...orderContext,
        gift_card_offer: type,
        line_items: updatedLineItems,
        type: returnType,
      })

      .then((response) => {
        console.log('/save-return, file ReturnOrder.jsx');
        console.log(response?.data?.data);
        // addFieldToState('currentStep', 1);
        // addFieldToState('pdfLink', response.data.data.return_pdf_link);
        // addFieldToState('shippingLabel', response.data.data.shipping_label_link);
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
          is_gift_card: response?.data?.data?.is_gift_card,
        });
        // updateOrderContext('saveReturnLoading', false);
        // updateOrderContext('gift_card_offer', false);
        // updateOrderContext('order_amount', '');
        // updateOrderContext('gift_card_amount', '');
        // updateOrderContext('gift_initial_value', '');
        // updateOrderContext('gift_card_percentage', '');
        // updateOrderContext('storeCredit', false);
        navigate('/return-success');
      })
      .catch(() => {});
  };

  return (
    <div className="flex flex-col p-4 text-center">
      {orderContext.currentStep === 1 && (
        <div className="flex items-center justify-center pb-5 ">
          <span className="items-count border-2"> {refoundedItemCount.length}</span>
          <Text className={'header-text '}>{t('returnOrder.title')}</Text>
        </div>
      )}

      {orderContext.saveReturnLoading === true ? (
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {showStep(orderContext.currentStep)}
          {orderContext.storeCredit && (
            <StoreCreditModal showModal={orderContext.storeCredit} handleSubmit={submit} />
          )}
        </>
      )}
    </div>
  );
};
