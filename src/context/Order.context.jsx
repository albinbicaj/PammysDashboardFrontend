import React, { useState, createContext, useContext } from 'react';
import { ReasonEnum } from '../enums/Reason.enum';
import { TypeEnum } from '../enums/Type.enum';

export const OrderContext = createContext();

export const OrderProvider = (props) => {
  const [orderContext, setOrderContext] = useState({
    currentStep: 1,
    customer_id: '',
    shopify_order_id: '',
    order_number: '',
    contact_email: '',
    payment_method: '',
    line_items: [],
    shipping_address: {},
    products: [],
    comment: '',
    requested_line_items: [],
    feedback: '',
    gift_card_offer: false,
    order_amount: '',
    gift_card_amount: '',
    gift_initial_value: '',
    gift_card_percentage: '',
    disabled: true,
    storeCredit: false,
    pdfLink: '',
    shippingLabel: '',
    saveReturnLoading: false,
    giftCardMessage: '',
    giftCardNotAvailable: false,
    reklamation: false,
    support: false,
    requestSubmited: false,
    giftOfferAccepted: false,
    is_gift_card: false,
    barcode_number: null,
    package_damaged: false,
  });

  const updateOrderContext = (key, value) => {
    setOrderContext((prevContext) => ({
      ...prevContext,
      [key]: value,
    }));
  };
  // #rgnpcrz optimization
  const updateMultipleFields = (fieldsToUpdate) => {
    setOrderContext((prevContext) => {
      let updatedContext = { ...prevContext };
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        updatedContext[key] = value;
      }
      return updatedContext;
    });
  };
  const addFieldToState = (fieldName, fieldValue) => {
    setOrderContext((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  const toggleProduct = (product, type, reason) => {
    const productIndex = orderContext.products.findIndex(
      (selectedProduct) => selectedProduct.id === product.id,
    );

    if (productIndex !== -1) {
      const updatedProducts = [...orderContext.products];
      updatedProducts.splice(productIndex, 1);
      const updatedLineItems = orderContext.line_items.map((product) => {
        if (product.id === product.id) {
          return { ...product, reason: '' };
          // return { ...product, reason: '', selectedQuantity: 1 };
        }
        return product;
      });
      // Update the context
      updateOrderContext('products', updatedProducts);
      updateOrderContext('line_items', updatedLineItems);
    } else {
      // If the product is not selected, add it with the provided reason
      updateOrderContext('products', [...orderContext.products, { ...product, quantity: 1 }]);
    }
  };
  const removeProduct = (product) => {
    const productIndex = orderContext.products.findIndex(
      (selectedProduct) => selectedProduct.id === product.id,
    );

    if (productIndex !== -1) {
      const updatedProducts = [...orderContext.products];
      // Remove the product from the array
      updatedProducts.splice(productIndex, 1);
      const updatedLineItems = orderContext.line_items.map((lineItem) => {
        if (lineItem.id === product.id) {
          return {
            ...product,
            reason: '',
            selectedQuantity: 1,
            comment: '',
            image: [],
            imageData: [],
            type: '',
          };
        }
        return lineItem;
      });

      // Update the context
      updateOrderContext('line_items', updatedLineItems);
      updateOrderContext('products', updatedProducts);
    }
  };
  const addProduct = (product_id, reason, type) => {
    // Check if the product is not already in the array
    const productIndex = orderContext.products.findIndex(
      (existingProduct) => existingProduct.id === product_id,
    );

    if (productIndex === -1) {
      // Find the corresponding line_item based on product_id
      const lineItem = orderContext.line_items.find((item) => item.id === product_id);

      if (lineItem) {
        // Add the product with the corresponding line_item and a default quantity
        const updatedProducts = [
          ...orderContext.products,
          { ...lineItem, reason, type }, // You can set a default reason if needed
          // { ...lineItem, selectedQuantity: 1, reason, type }, // You can set a default reason if needed
        ];

        // Update the context
        updateOrderContext('products', updatedProducts);
      }
    }
  };
  const updateDisabled = (value) => {
    updateOrderContext('disabled', value);
  };
  const nextStep = () => {
    setOrderContext((prevState) => ({
      ...prevState,
      currentStep: prevState.currentStep + 1,
    }));
  };

  const previousStep = () => {
    setOrderContext((prevState) => ({
      ...prevState,
      currentStep: Math.max(1, prevState.currentStep - 1), // Ensure the current step doesn't go below 1
    }));
  };

  const addReason = (product_id, reason) => {
    // Update line_items
    const updatedLineItems = orderContext.line_items.map((product) => {
      if (product.id === product_id) {
        return {
          ...product,
          reason,
          type:
            reason == ReasonEnum.TOO_LARGE ||
            reason == ReasonEnum.TOO_SMALL ||
            reason == ReasonEnum.CHANGED_MY_MIND ||
            reason == ReasonEnum.DONT_LIKE_IT
              ? TypeEnum.EXCHANGE
              : TypeEnum.RETURN,
        };
      }
      return product;
    });

    // Update products
    const updatedProducts = orderContext.products.map((product) => {
      if (product.id === product_id) {
        return {
          ...product,
          reason,
          type:
            reason == ReasonEnum.TOO_LARGE ||
            reason == ReasonEnum.TOO_SMALL ||
            reason == ReasonEnum.CHANGED_MY_MIND ||
            reason == ReasonEnum.DONT_LIKE_IT
              ? TypeEnum.EXCHANGE
              : TypeEnum.RETURN,
        };
      }
      return product;
    });

    // If the product is not in the array, add it with the provided reason
    const productIndex = updatedProducts.findIndex(
      (existingProduct) => existingProduct.id === product_id,
    );
    //
    if (productIndex === -1 && reason !== '0') {
      const lineItem = orderContext.line_items.find((item) => item.id === product_id);

      if (lineItem) {
        updatedProducts.push({
          ...lineItem,
          // selectedQuantity: selectedQuantity || 1,
          reason,
          type:
            reason == ReasonEnum.TOO_LARGE ||
            reason == ReasonEnum.TOO_SMALL ||
            reason == ReasonEnum.CHANGED_MY_MIND ||
            reason == ReasonEnum.DONT_LIKE_IT
              ? TypeEnum.EXCHANGE
              : TypeEnum.RETURN,
        });
      }
    }
    // rgnpcrz-bug-fix
    // If the product is in the array, and reason is 0 (grund) remove it from products
    if (productIndex !== -1 && reason === '0') {
      updatedProducts.splice(productIndex, 1);
    }

    // Update the context with the updated line_items and products
    updateOrderContext('line_items', updatedLineItems);
    updateOrderContext('products', updatedProducts);
  };
  const addType = (productId, type) => {
    const updatedLineItems = orderContext.line_items.map((product) => {
      if (product.id === productId) {
        // Check if type is "return" and update keys accordingly
        const updatedProduct = { ...product };
        if (type === 'return') {
          updatedProduct.exchange_variant_id = null;
          updatedProduct.exchange_variant_title = null;
        }
        return { ...updatedProduct, type };
      }
      return product;
    });

    const updatedProducts = orderContext.products.map((product) => {
      if (product.id === productId) {
        // Check if type is "return" and update keys accordingly
        const updatedProduct = { ...product };
        if (type === 'return') {
          updatedProduct.exchange_variant_id = null;
          updatedProduct.exchange_variant_title = null;
        }
        return { ...updatedProduct, type };
      }
      return product;
    });

    updateOrderContext('line_items', updatedLineItems);
    updateOrderContext('products', updatedProducts);
  };

  const addExchangeInfo = (
    productId,
    exchangeId,
    exchangeTitle,
    exchangeProductId,
    exchangeProductTitle,
  ) => {
    const updatedLineItems = orderContext.line_items.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          exchange_variant_id: exchangeId,
          exchange_variant_title: exchangeTitle,
          exchange_product_id: exchangeProductId,
          exchange_product_title: exchangeProductTitle,
          exchange_item_title: exchangeProductTitle,
        };
      }
      return product;
    });
    const updatedProducts = orderContext.products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          exchange_variant_id: exchangeId,
          exchange_variant_title: exchangeTitle,
          exchange_product_id: exchangeProductId,
          exchange_product_title: exchangeProductTitle,
          exchange_item_title: exchangeProductTitle,
        };
      }
      return product;
    });
    // updateOrderContext('line_items', updatedLineItems);
    // updateOrderContext('products', updatedProducts);
    updateMultipleFields({ line_items: updatedLineItems, products: updatedProducts });
  };

  // const addSupportExchangeInfo = (productId, exchangeId, exchangeTitle) => {
  //   const updatedLineItems = orderContext.line_items.map((product) => {
  //     if (product.id === productId) {
  //       return {
  //         ...product,
  //         exchange_variant_id: exchangeId,
  //         exchange_variant_title: exchangeTitle,
  //         exchange_product_id: exchangeProductId,
  //         exchange_product_title: exchangeProductTitle,
  //       };
  //     }
  //     return product;
  //   });
  //   const updatedProducts = orderContext.products.map((product) => {
  //     if (product.id === productId) {
  //       return {
  //         ...product,
  //         exchange_variant_id: exchangeId,
  //         exchange_variant_title: exchangeTitle,
  //         exchange_product_id: exchangeProductId,
  //         exchange_product_title: exchangeProductTitle,
  //       };
  //     }
  //     return product;
  //   });
  //   // updateOrderContext('line_items', updatedLineItems);
  //   // updateOrderContext('products', updatedProducts);
  //   updateMultipleFields({ line_items, updatedLineItems, products: updatedProducts });
  // };

  const addComment = (product_id, comment) => {
    const updatedLineItems = orderContext.line_items.map((product) => {
      if (product.id === product_id) {
        return { ...product, comment };
      }
      return product;
    });
    const updatedProducts = orderContext.products.map((product) => {
      if (product.id === product_id) {
        return { ...product, comment };
      }
      return product;
    });
    // updateOrderContext('line_items', updatedLineItems);
    // updateOrderContext('products', updatedProducts);
    updateMultipleFields({ line_items: updatedLineItems, products: updatedProducts });
  };
  const addQuantity = (product_id, quantity) => {
    const updatedLineItems = orderContext.line_items.map((product) => {
      if (product.id === product_id) {
        return { ...product, selectedQuantity: parseInt(quantity) };
      }
      return product;
    });
    const updatedProducts = orderContext.products.map((product) => {
      if (product.id === product_id) {
        return { ...product, selectedQuantity: parseInt(quantity) };
      }
      return product;
    });

    // Update the context with the updated products
    updateMultipleFields({ line_items: updatedLineItems, products: updatedProducts });
    // updateOrderContext('products', updatedProducts);
    // updateOrderContext('line_items', updatedLineItems);
  };
  const toggleImageForReturn = (product_id, image, imageData = []) => {
    setOrderContext((prevContext) => {
      const updatedProducts = prevContext.line_items.map((product) => {
        if (product.id === product_id) {
          return {
            ...product,
            image: image,
            imageData: imageData,
          };
        }
        return product;
      });

      return {
        ...prevContext,
        line_items: updatedProducts,
      };
    });
  };
  return (
    <OrderContext.Provider
      value={{
        orderContext,
        updateOrderContext,
        updateMultipleFields,
        addReason,
        toggleProduct,
        addComment,
        toggleImageForReturn,
        addQuantity,
        removeProduct,
        nextStep,
        previousStep,
        addProduct,
        updateDisabled,
        addType,
        addExchangeInfo,
        addFieldToState,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
};
export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};
