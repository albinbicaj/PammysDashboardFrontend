import React from 'react';
// import { reasons } from '../../../data/reasons';
import { Product } from '../../atoms/Product/Product';
import { useOrderContext } from '../../../context/Order.context';
import { InputLabel } from '@mui/material';
import { Variant } from '../../atoms';
import { useTranslation } from 'react-i18next';

// TODO-RGNPCRZ-BUGFIX
// reasons structure is changed in general file, the below is previous version
const reasons = [
  {
    label: 'Grund',
    value: 0,
  },

  {
    label: 'zu klein',
    value: 1,
  },
  {
    label: 'zu groß',
    value: 2,
  },
  {
    label: 'gefällt mir nicht',
    value: 3,
  },
  {
    label: 'Qualitat nicht ausreichend',
    value: 4,
  },
  {
    label: 'beschädigt',
    value: 5,
  },
  {
    label: 'Lieferung zu spät',
    value: 6,
  },
  {
    label: 'Falschlieferung / fehlender Artikel',
    value: 7,
  },
];

export const MixedProductsStep = () => {
  const { t } = useTranslation();
  const {
    orderContext,
    toggleMixedProducts,
    addType,
    addReasonToMixedProducts,
    toggleNewProducts,
  } = useOrderContext();

  const handleTypeChange = (productId, type) => {
    // Call addReturnReason to add the reason to the product
    addType(productId, type);
  };
  const handleReasonChange = (productId, reason) => {
    addReasonToMixedProducts(productId, reason);
  };
  const handleExchangeWith = (variant) => {
    toggleNewProducts(variant);
  };

  return (
    <div className="">
      {orderContext.products.map((product, i) => {
        const isSelected = orderContext.products.some(
          (selectedProduct) => selectedProduct.product_id === product.product_id,
        );
        const optionSelected = orderContext.line_items.some(
          (selectedProduct) =>
            selectedProduct.product_id === product.product_id && !!selectedProduct.type,
        );
        const reasonSelected = orderContext.products.some(
          (selectedProduct) =>
            selectedProduct.product_id === product.product_id &&
            selectedProduct.type === 'exchange',
        );
        const selectedProduct = orderContext.products.find(
          (selectedProduct) => selectedProduct.product_id === product.product_id,
        );

        return (
          <>
            <div
              className={` product-wrapper mb-4 flex  flex-col items-start justify-start bg-slate-200 ${
                isSelected && 'product-selected'
              }`}
              key={i}
            >
              <Product
                product={product.title}
                selected={isSelected}
                img={product.product_image}
                onClick={() => toggleMixedProducts(product)}
                quantity={product.quantity}
              />
              {isSelected && (
                <div className="flex flex-col items-start justify-start">
                  <InputLabel id="feedback-label" className="select-label font-semibold">
                    Return or Exchange
                  </InputLabel>
                  <select
                    value={selectedProduct.type || ''}
                    onChange={(e) => {
                      handleTypeChange(product.product_id, e.target.value);
                    }}
                    className="select-reason mr-2 h-10"
                  >
                    <option className="" value="return">
                      Return
                    </option>

                    <option value="exchange">Exchange</option>
                  </select>
                </div>
              )}
              {optionSelected && (
                <div className="flex flex-col items-start justify-start">
                  <InputLabel id="feedback-label" className="select-label font-semibold">
                    Reason
                  </InputLabel>
                  <select
                    value={selectedProduct.reason || ''}
                    onChange={(e) => {
                      handleReasonChange(product.id, e.target.value);
                    }}
                    className="select-reason mr-2 h-10"
                  >
                    {reasons.map((reason, index) => (
                      <option key={index} value={reason.value}>
                        {t(reason.label)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {reasonSelected && (
              <div className="flex flex-col items-start justify-start">
                <InputLabel id="feedback-label" className="select-label font-semibold">
                  Exchange with
                </InputLabel>
                {selectedProduct.variants.map((variant, index) => {
                  const selectedVariant = orderContext.newProducts.some(
                    (selectedProduct) => selectedProduct.id === variant.id,
                  );
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        handleExchangeWith(variant);
                      }}
                      className={`${
                        selectedVariant ? 'border-grey-500 border-2' : ''
                      } variant-wrapper`}
                    >
                      <Variant
                        image={product.product_image}
                        product={variant.title}
                        price={variant.price}
                      />
                      ;
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );
      })}
    </div>
  );
};
