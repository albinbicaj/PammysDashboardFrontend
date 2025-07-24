import { useTranslation } from 'react-i18next';
import { operationTypes } from '../data/type';
export const getOperationType = (operationValue) => {
  const {t} = useTranslation()
  const type = operationTypes.find((item) => item.value === operationValue);
  return type ? t("product." + type.label) : 'Type not found';
};
