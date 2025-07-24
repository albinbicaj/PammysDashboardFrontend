import { IconPackage, IconTruckDelivery } from '@tabler/icons-react';
import dayjs from 'dayjs';

export const ReturnPeriodNotification = ({
  deliveredAt = null,
  fulfilledAt = null,
  status = '',
}) => {
  if (status === 'approved') {
    return null;
  }

  const deliveryDiff = dayjs().diff(deliveredAt, 'day');
  const fuldilledDiff = dayjs().diff(fulfilledAt, 'day');

  return (
    <>
      {deliveredAt !== null && deliveryDiff > 18 ? (
        <div className=" mb-4 flex gap-4 rounded border bg-red-500 p-4  font-semibold text-white">
          <IconPackage />
          <p>Rücksendefrist von 18 Tagen überschritten! ({deliveryDiff} Tagen seit Lieferung)</p>
        </div>
      ) : fulfilledAt !== null && fuldilledDiff > 21 ? (
        <div className=" mb-4 flex gap-4 rounded border bg-red-500 p-4  font-semibold text-white">
          <IconTruckDelivery />
          <p>
            Rücksendefrist von 21 Tagen überschritten! ({fuldilledDiff} Tagen seit Auslieferung)
          </p>
        </div>
      ) : null}
    </>
  );
};
