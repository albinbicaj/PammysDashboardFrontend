export const convertPriceStringToNumber = (priceString) => {
  const cleanPriceString = priceString.replace(/[^0-9.]/g, '');
  const priceNumber = parseFloat(cleanPriceString);

  if (isNaN(priceNumber)) {
    console.error('Invalid price string provided');
    return null;
  }

  return priceNumber;
};

export const calculateTotalPrice = (products) => {
  return products.reduce(
    (total, product) => total + (convertPriceStringToNumber(product.price) || 0),
    0,
  );
};

export const convertToDE = (amount) => {
  let price;
  if (typeof amount === 'string') {
    price = convertPriceStringToNumber(amount);
  } else {
    price = amount;
  }
  // Ensure the price is a number and use toLocaleString to format it
  if (typeof price === 'number') {
    return price.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
  } else {
    // console.error('Invalid amount provided');
    console.log('Invalid amount provided');
    return NaN;
  }
};
