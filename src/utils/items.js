import { StatusEnum } from '../enums/Status.enum';
import { TypeEnum } from '../enums/Type.enum';
export const hasNotApprovedItems = (products) => {
  if (!products || products.length === 0) {
    return false;
  }
  return products.some((product) => product.status != StatusEnum.APPROVED);
};

export const hasAllItemsExchange = (products) => {
  if (!products || products.length === 0) {
    return false;
  }
  return products.every((product) => product.type === TypeEnum.EXCHANGE);
};

export const hasWrongItem = (products) => {
  if (!products || products.length === 0) {
    return false;
  }
  return products.some((product) => product.rejected_reason === 'fremder Artikel');
};
