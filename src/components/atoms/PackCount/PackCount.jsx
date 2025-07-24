import { useQuery } from '@tanstack/react-query';
import { PammysLoading } from '../PammysLoading/PammysLoading';
import axiosInstance from '../../../utils/axios';
import { IconChecklist } from '@tabler/icons-react';

export const PackCount = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['dashboardPackCount'],
    queryFn: () => axiosInstance.get(`/order/count-orders-for-packers`),
    refetchInterval: 60000,
  });

  const getCellColor = (value, isHour) => {
    if (isHour) {
      if (value < 50) return { textColor: '#e31a32', backgroundColor: 'rgba(227, 26, 50, 0.035)' };
      if (value >= 50 && value <= 59)
        return { textColor: '#ee903a', backgroundColor: 'rgba(238, 144, 58, 0.035)' };
      if (value >= 60)
        return { textColor: '#5cc26d', backgroundColor: 'rgba(92, 194, 109, 0.035)' };
    } else {
      if (value < 392) return { textColor: '#e31a32', backgroundColor: 'rgba(227, 26, 50, 0.035)' };
      if (value >= 400 && value <= 472)
        return { textColor: '#ee903a', backgroundColor: 'rgba(238, 144, 58, 0.035)' };
      if (value >= 480)
        return { textColor: '#5cc26d', backgroundColor: 'rgba(92, 194, 109, 0.035)' };
    }
    return { textColor: '', backgroundColor: '' };
  };

  const hourlyColor = getCellColor(data?.data?.hourly_orders || 0, true);
  const dailyColor = getCellColor(data?.data?.total_orders || 0, false);

  return (
    <>
      {isLoading ? (
        <div className="scale-75 opacity-50">
          <PammysLoading />
        </div>
      ) : (
        <div className="flex gap-4">
          <div
            className={`cursor-pointer rounded-md border-2 px-2 py-1.5 duration-150 hover:scale-[1.01] hover:shadow-md active:scale-[1]`}
            style={{
              borderColor: hourlyColor.textColor,
              backgroundColor: hourlyColor.backgroundColor,
              color: hourlyColor.textColor,
            }}
          >
            <div className="flex items-center gap-1.5">
              <div>
                <IconChecklist />
              </div>
              <div className={`overflow-hidden text-nowrap text-start duration-200`}>
                <span className="px-1.5 font-bold">H</span>
              </div>
              <div
                className="rounded-md border px-2 font-bold"
                style={{
                  borderColor: hourlyColor.textColor,
                  backgroundColor: hourlyColor.backgroundColor,
                  color: hourlyColor.textColor,
                }}
              >
                {data?.data?.hourly_orders}/{data?.data?.hourly_items}
              </div>
            </div>
          </div>
          <div
            className={`cursor-pointer rounded-md border-2 px-2 py-1.5 duration-150 hover:scale-[1.01] hover:shadow-md active:scale-[1]`}
            style={{
              borderColor: dailyColor.textColor,
              backgroundColor: dailyColor.backgroundColor,
              color: dailyColor.textColor,
            }}
          >
            <div className="flex items-center gap-1.5">
              <div>
                <IconChecklist />
              </div>
              <div className={`overflow-hidden text-nowrap text-start duration-200`}>
                <span className="px-1.5 font-bold">D</span>
              </div>
              <div
                className="rounded-md border px-2 font-bold"
                style={{
                  borderColor: dailyColor.textColor,
                  backgroundColor: dailyColor.backgroundColor,
                  color: dailyColor.textColor,
                }}
              >
                {data?.data?.total_orders}/{data?.data?.total_items}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
