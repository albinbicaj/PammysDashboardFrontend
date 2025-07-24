import { reasons } from '../data/reasons';
import { reasonsDashboard } from '../data/reasons';
import { useTranslation } from 'react-i18next';

export const getReasonLabel = (reasonValue = 0) => {
  const { t } = useTranslation();
  const label = reasons[reasonValue];

  return label ? t('selectOptionReasonsDashboard.' + label) : 'Reason not found';
};

export const getReasonLabelDashboard = (reasonValue = 0) => {
  const { t } = useTranslation();
  const label = reasonsDashboard[reasonValue];

  return label ? t('selectOptionReasonsDashboard.' + label) : 'Reason not found';
};
