import React from 'react';
import { useOrderContext } from '../../../context/Order.context';
import { Product } from '../../atoms/Product/Product';
import { Text } from '../../atoms';
import { GIFTCARD_PRODUCT_ID } from '../../../config/env';
import { useTranslation } from 'react-i18next';

export const AddressStep = ({ operationType }) => {
  const { t } = useTranslation();
  const { orderContext, updateOrderContext, addProduct, removeProduct, addReason } =
    useOrderContext();

  const notSelectedProducts = orderContext.line_items.filter(
    (item) =>
      !item.requested &&
      item.refunded === false &&
      !orderContext.products.some((product) => product.id === item.id) &&
      item.product_id != GIFTCARD_PRODUCT_ID,
  );

  const handleAddProduct = (product, event) => {
    const isQuantityChangeSelect = event.target.tagName.toLowerCase() === 'select';
    const isRemoveButton = event.target.tagName.toLowerCase() === 'button';

    if (isQuantityChangeSelect || isRemoveButton) {
      return;
    }
    // setDisabled(true);
    // addProduct(product);
    console.log('addProduct(product);');
    console.log(product);
  };
  const handleRemoveProduct = (product) => {
    removeProduct(product);
  };

  return (
    <div className="py-5 text-center">
      {/* no-scrollbar */}
      <div className="">
        <div className="flex  justify-center pb-5">
          <span className="items-count ">{notSelectedProducts.length}</span>
          <span className="header-text ">{t('returnOrder.title')}</span>
        </div>

        {notSelectedProducts.map((product, index) => {
          return (
            <div key={index} className="mb-2 border-2">
              <Product
                onClick={(event) => handleAddProduct(product, event)}
                img={product.product_image}
                product={product.title}
                price={product.price}
                type={product.type}
                variant_info={product.current_variant}
                quantity={product.quantity}
                // reason={getReasonLabel(product.reason)}
                quantityDisabled={false}
                discount={product.discount}
              />
            </div>
          );
        })}
        <div className="seperator h-10"></div>
        <div className="mb-5 flex items-center justify-center">
          <span className="selected-items-count border-2">{orderContext.products.length}</span>
          <Text className={'header-text w-5/12'}>{t('returnOrder.returnStartedText')}</Text>
        </div>
        <div className="flex flex-col gap-3">
          {orderContext.products.map((product, index) => {
            const isSelected = orderContext?.products?.some(
              (selectedProduct) => selectedProduct?.id === product.id,
            );
            const selectedLineItemImages = orderContext?.line_items?.find(
              (lineItem) => lineItem?.id === product.id,
            ).image;
            const selectedLineItemImagesData = orderContext?.line_items?.find(
              (lineItem) => lineItem?.id === product.id,
            ).imageData;
            const selectedLineItemType = orderContext?.line_items?.find(
              (lineItem) => lineItem?.id === product.id,
            ).type;
            return (
              <div
                key={index}
                className={`not-selected flex flex-col  justify-start p-2   ${
                  isSelected && `product-selected `
                }`}
              >
                <Product
                  selected={isSelected}
                  img={product.product_image}
                  product={product.title}
                  reason={product.reason}
                  price={product.price}
                  type={selectedLineItemType}
                  quantity={product.selectedQuantity}
                  quantityDisabled={true}
                  exchangeTitle={product.exchange_variant_title}
                  variant_info={product.current_variant}
                  handleRemoveProduct={(event) => handleRemoveProduct(product, event)}
                  currentStep={orderContext.currentStep}
                  images={selectedLineItemImages}
                  imagesData={selectedLineItemImagesData}
                  comment={product.comment}
                  typeDisabled={true}
                  discount={product.discount}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
