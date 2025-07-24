export const checkMixedProducts = (products) =>
  products.some((product) =>
    ["Don't like it", 'Quality insufficient', 'Damaged', 'Delivery too late'].includes(
      product.reason,
    )
  );
