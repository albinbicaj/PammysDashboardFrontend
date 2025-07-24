import React, { useState, useEffect } from 'react';
import { useOrderContext } from '../../../context/Order.context';
import { TextField } from '../../molecules';
import { UploadField } from '../../molecules';
import { TypeEnum } from '../../../enums/Type.enum';
import { ReasonEnum } from '../../../enums/Reason.enum';
import { InputLabel } from '@mui/material';
import { ReklamationNotification } from '../../molecules/ReklamationNotification/ReklamationNotification';
import { SupportAllVariationsExchange } from '../../returnPortal/supportCustom/SupportAllVariationsExchange';
import { GIFTCARD_PRODUCT_ID } from '../../../config/env';
import { Product } from '../../atoms/Product/Product';
import { useTranslation } from 'react-i18next';

export const ReturnProductsStep = ({}) => {
  const { t } = useTranslation();

  const {
    orderContext,
    // toggleProduct,
    addReason,
    addComment,
    // addProduct,
    addType,
    addQuantity,
    removeProduct,
    // updateOrderContext,
    updateDisabled,
    addExchangeInfo,
    // addSupportExchangeInfo,
  } = useOrderContext();

  const noProducts = orderContext?.line_items?.length === 0;

  const handleReasonChange = (productId, selectedReason) => {
    // Update line_items and products with the selected reason
    console.log('productId');
    console.log(productId);
    addReason(productId, selectedReason);

    // Reset some state or perform other actions based on the selected reason
    updateDisabled(false);
  };
  const handleTypeChange = (productId, selectedType) => {
    addType(productId, selectedType);
  };

  const handleRemoveProduct = (product) => {
    console.log('product');
    console.log(product);
    removeProduct(product);
  };
  const handleCommentChange = (product_id, comment) => {
    addComment(product_id, comment);
  };
  const handleQuantity = (product_id, quantity) => {
    addQuantity(product_id, quantity);
  };

  return (
    // <div className={`${noProducts ? 'overflow-hidden' : 'no-scrollbar'}`}>
    <div className="space-y-5">
      {orderContext.reklamation && <ReklamationNotification />}

      {orderContext?.line_items?.length > 0 && orderContext?.requestSubmited === false ? (
        orderContext.line_items.map((product, i) => {
          //
          // Don't display the line_item if already requested/refunded or product is Gift Card
          if (
            product.refunded === true ||
            product.requested === true ||
            product.product_id == GIFTCARD_PRODUCT_ID
          )
            return null;
          //
          const isSelected = orderContext?.products?.some(
            (selectedProduct) => selectedProduct?.id === product.id,
          );

          const selectedProduct = orderContext.line_items.find(
            (selectedProduct) => selectedProduct.id === product.id,
          );
          //
          // ERROR FIX
          const slashIndex = selectedProduct?.current_variant?.title?.indexOf('/') ?? -1;

          // Ensure title exists and slashIndex is valid before calling substring()
          const currentVariantColor =
            slashIndex !== -1
              ? selectedProduct?.current_variant?.title?.substring(0, slashIndex)?.trim()
              : '';

          const currentVariantSize =
            slashIndex !== -1
              ? selectedProduct?.current_variant?.title?.substring(slashIndex + 1)?.trim()
              : '';

          {
            // ERROR HERE
            /* let slashIndex = selectedProduct.current_variant.title?.indexOf('/');

          const currentVariantColor = selectedProduct.current_variant?.title
            .substring(0, slashIndex)
            .trim();
          const currentVariantSize = selectedProduct.current_variant?.title
            .substring(slashIndex + 1)
            .trim(); // "Black" */
          }

          const [selectedColor, setSelectedColor] = useState(
            selectedProduct?.exchange_variant_title?.split(' / ')[1] || '',
          );

          const [selectedSize, setSelectedSize] = useState(
            selectedProduct?.exchange_variant_title?.split(' / ')[0] || '',
          );
          const filteredVariants = selectedProduct.variants.filter(
            (variant) => variant.option1 == selectedColor,
          );
          // Extracting color values from the product options
          const handleColorChange = (event) => {
            setSelectedColor(event.target.value);
            setSelectedSize('');
          };
          const handleSize = (event) => {
            const size = event.target.innerText;
            setSelectedSize(size);
            const selectedVariant = filteredVariants.find(
              (variant) => variant.option1 === selectedColor && variant.option2 === size,
            );
            addExchangeInfo(
              selectedProduct.id,
              selectedVariant.id,
              selectedVariant.title,
              selectedProduct.product_id,
              selectedProduct.title,
            );
          };
          const colorOptions = selectedProduct.options.find((option) =>
            ['Color', 'color', 'Farbe', 'farbe'].includes(option.name),
          );

          return (
            <>
              <div
                className={` flex  flex-col justify-start  border p-2.5   ${
                  isSelected && `border-accent `
                }`}
                key={i}
              >
                <Product
                  reason={selectedProduct.reason}
                  selected={isSelected}
                  productId={product.id}
                  img={product.product_image}
                  product={product.title}
                  price={product.price}
                  maxQuantity={product.quantity}
                  quantity={product.selectedQuantity}
                  type={product.type}
                  typeDisabled={false}
                  exchangeTitle={product.exchange_variant_title}
                  variant_info={product.current_variant}
                  handleQuantity={handleQuantity}
                  reasonChange={handleReasonChange}
                  typeChange={handleTypeChange}
                  disabledQuantitySelect={orderContext.currentStep == 2}
                  quantityDisabled={false}
                  currentStep={orderContext.currentStep}
                  handleRemoveProduct={() => handleRemoveProduct(product)}
                  discount={product.discount}
                  reklamation={orderContext.reklamation}
                />
                <>
                  {isSelected && product.type === TypeEnum.EXCHANGE && (
                    <>
                      {/* to-do #rgnpcrz support-return */}
                      {orderContext.support === false ? (
                        <div className="flex flex-col items-start justify-start">
                          <InputLabel id="feedback-label" className="select-label font-semibold">
                            {t('returnProductsStep.title')}
                          </InputLabel>
                          <span className="mb-2 ml-2 mt-2 font-bold">
                            {t('returnProductsStep.color')}
                          </span>
                          <select
                            className="select-color ml-2"
                            value={selectedColor}
                            onChange={handleColorChange}
                          >
                            <option value="">Farbe</option>
                            {colorOptions &&
                              colorOptions.values.map((color) => (
                                <option key={color} value={color}>
                                  {color}
                                </option>
                              ))}
                          </select>
                          {selectedColor && <span className="mb-2 ml-2 mt-2 font-bold">Größe</span>}
                          <div className="mb-4 ml-2 grid grid-cols-3 gap-4">
                            {selectedColor &&
                              filteredVariants.map((variant) => (
                                <span
                                  className={`variant-size flex cursor-pointer items-center justify-center ${
                                    variant.option2 === selectedSize ? 'variant-size selected' : ''
                                  }`}
                                  key={variant.id}
                                  onClick={handleSize}
                                  value={variant.title}
                                >
                                  {variant.option2}
                                </span>
                              ))}
                          </div>

                          {selectedColor && selectedSize && (
                            <span className="variant-selected ml-2 font-semibold">
                              Wird umgetauscht in: {selectedColor + ' / ' + selectedSize}
                            </span>
                          )}
                          {/* THIS WILL BE ENABLED LATES, THIS IS A TEMPORARY FIX FOR PROD */}
                          {/* <InputLabel id="feedback-label" className="select-label font-semibold">
                            {t('returnProductsStep.title')}
                          </InputLabel>
                          <span className="mb-2 ml-2 mt-2 font-bold">
                            {t('returnProductsStep.color')}
                          </span>
                          <select
                            className="select-color ml-2"
                            value={selectedColor}
                            onChange={handleColorChange}
                          >
                            <option value="">{t('returnProductsStep.' + 'color')}</option>
                            {colorOptions &&
                              colorOptions.values.map((color) => (
                                <option key={color} value={color}>
                                  {t('returnProductsStep.' + color)}
                                </option>
                              ))}
                          </select>
                          {selectedColor && (
                            <span className="mb-2 ml-2 mt-2 font-bold">
                              {t('returnProductsStep.' + 'size')}
                            </span>
                          )}
                          <div className="mb-4 ml-2 grid grid-cols-3 gap-4">
                            {selectedColor &&
                              filteredVariants.map((variant) => (
                                <span
                                  className={`variant-size flex cursor-pointer items-center justify-center ${
                                    variant.option2 === selectedSize ? 'variant-size selected' : ''
                                  }`}
                                  key={variant.id}
                                  onClick={handleSize}
                                  value={variant.title}
                                >
                                  {variant.option2}
                                </span>
                              ))}
                          </div>

                          {selectedColor && selectedSize && (
                            <span className="variant-selected ml-2 font-semibold">
                              {t('returnProductsStep.exchangeText')}:{' '}
                              {selectedColor + ' / ' + selectedSize}
                            </span>
                          )} */}
                        </div>
                      ) : (
                        <SupportAllVariationsExchange
                          selectedProduct={selectedProduct}
                          addExchangeInfo={addExchangeInfo}
                        />
                      )}
                    </>
                  )}
                  {(selectedProduct.reason == ReasonEnum.DAMAGED ||
                    selectedProduct.reason == ReasonEnum.QUALITY_INSUFFICIENT ||
                    selectedProduct.reason == ReasonEnum.MISDELIVERY) && (
                    <div className="product-feedback mt-4 ">
                      <TextField
                        label={t('returnProductsStep.noteSupport')}
                        value={selectedProduct.comment}
                        onChange={(e) => handleCommentChange(product.id, e.target.value)}
                        className=" "
                        minRows={2}
                      />
                    </div>
                  )}
                  {(selectedProduct.reason == ReasonEnum.DAMAGED ||
                    selectedProduct.reason == ReasonEnum.QUALITY_INSUFFICIENT ||
                    selectedProduct.reason == ReasonEnum.MISDELIVERY) && (
                    <div className="">
                      <UploadField product_id={product.id} image={selectedProduct.image} />
                    </div>
                  )}
                </>
              </div>
            </>
          );
        })
      ) : orderContext?.requestSubmited === true ? (
        <div className=" h-full overflow-hidden px-4 py-8">
          {t('returnProductsStep.requestSubmitedTrue')} <br />{' '}
          {t('returnProductsStep.thankyouText')}
        </div>
      ) : (
        <div className="overflow-hidden px-4 py-8">
          {t('returnProductsStep.requestSubmitedFalse')}
        </div>
      )}
    </div>
  );
};
