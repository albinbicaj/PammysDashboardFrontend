import React, { useState } from 'react';
import { Product } from '../../atoms/Product/Product';
import { useOrderContext } from '../../../context/Order.context';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Variant } from '../../atoms';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReasonEnum } from '../../../enums/Reason.enum';

export const ExchangeProductsStep = () => {
  const {
    orderContext,
    toggleProduct,
    addReason,
    addComment,
    addProduct,
    addQuantity,
    removeProduct,
    updateOrderContext,
    updateDisabled,
  } = useOrderContext();
  const location = useLocation();

  const handleReasonChange = (productId, selectedReason) => {
    // Update line_items and products with the selected reason
    addReason(productId, selectedReason);

    // Reset some state or perform other actions based on the selected reason
    updateDisabled(false);
    if (
      (selectedReason == ReasonEnum.TOO_SMALL || selectedReason == ReasonEnum.TOO_LARGE) &&
      location.pathname !== 'return-order'
    ) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  const handleRemoveProduct = (product) => {
    removeProduct(product);
  };
  const handleQuantity = (product_id, quantity) => {
    addQuantity(product_id, quantity);
  };
  return (
    // <div className="no-scrollbar">
    <div className="">
      {orderContext.line_items.map((product, i) => {
        const isSelected = orderContext?.products?.some(
          (selectedProduct) => selectedProduct?.id === product.id,
        );

        const selectedProduct = orderContext.line_items.find(
          (selectedProduct) => selectedProduct.id === product.id,
        );
        // State to track the selected color
        const [selectedColor, setSelectedColor] = useState('');
        // Extracting color values from the product options
        const handleColorChange = (event) => {
          setSelectedColor(event.target.value);
        };
        const colorOptions = selectedProduct.options.find((option) => option.name === 'Color');

        const filteredVariants = selectedProduct.variants.filter(
          (variant) => variant.option2 == selectedColor,
        );

        return (
          <>
            <div
              className={`product-wrapper mb-4 flex  flex-col  items-start justify-start bg-slate-200 ${
                isSelected && 'product-selected'
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
                variant_info={product.current_variant}
                handleQuantity={handleQuantity}
                reasonChange={handleReasonChange}
                disabledQuantitySelect={orderContext.currentStep == 2}
                quantityDisabled={false}
                currentStep={orderContext.currentStep}
                handleRemoveProduct={(event) => handleRemoveProduct(product, event)}
              />
              {isSelected && (
                <>
                  <div className="flex flex-col items-start justify-start">
                    <InputLabel id="feedback-label" className="select-label font-semibold">
                      Umtauschen in eine andere Variante
                    </InputLabel>

                    <select
                      className="select-color"
                      value={selectedColor}
                      onChange={handleColorChange}
                    >
                      {colorOptions &&
                        colorOptions.values.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                    </select>
                    {filteredVariants.map((variant) => (
                      <span className="variant-size" key={variant.id}>
                        {variant.title - variant.price}
                        {/* Add more details as needed */}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        );
      })}
    </div>
  );
};
