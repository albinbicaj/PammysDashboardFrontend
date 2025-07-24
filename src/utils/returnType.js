export const determineReturnType = (lineItems) => {
  let hasReturn = false;
  let hasExchange = false;

  lineItems.forEach((item) => {
    if (item.type === 'return') {
      hasReturn = true;
    } else if (item.type === 'exchange') {
      hasExchange = true;
    }
  });

  let result;
  if (hasReturn && hasExchange) {
    result = 'mix';
  } else if (hasReturn) {
    result = 'return';
  } else if (hasExchange) {
    result = 'exchange';
  } else {
    result = null;
  }

  return result;
};
