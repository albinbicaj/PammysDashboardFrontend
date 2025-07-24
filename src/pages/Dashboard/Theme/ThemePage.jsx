import { PummysIcon } from '../../../components/atoms/Icons/PummysIcon';
import { Layout } from '../../../components/template';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../utils/axios';
import { useState } from 'react';
import dayjs from 'dayjs';
import { PammysLoading } from '../../../components/atoms/PammysLoading/PammysLoading';
import { CustomDatePickerV2 } from '../../../components/molecules/CustomDatePickerV2/CustomDatePickerV2';
import showToast from '../../../hooks/useToast';
import DownloadCSVButton from '../../../components/atoms/DownloadCSVButton/DownloadCSVButton';
import { useWebhooks } from '../../../apiHooks/useWebhooks';

const ThemePage = () => {
  const defaultStartDate = dayjs().subtract(1, 'month').toDate();
  const { data: webhook, isLoading: webhookLoading, error: webhookError } = useWebhooks();
  const [filters, setFilters] = useState({
    filterOn: false,
    filterDate: false,
    sortBy: 'asc',
    sortWith: '',
    paymentMethod: [],
    startDate: defaultStartDate,
    endDate: new Date(),
  });

  const updateFilters = (fieldsToUpdate) => {
    setFilters((prevContext) => {
      let updatedContext = { ...prevContext };
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        console.log('Updated filter: ', key, value);
        updatedContext[key] = value;
      }
      return updatedContext;
    });
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['dashboardStats', filters],
    queryFn: () =>
      axiosInstance.get(
        // `/home-anayltics/index?&startDate=${dayjs(filters.startDate).format('YYYY-MM-DD')}&endDate=${dayjs(filters.endDate).format('YYYY-MM-DD')}`,
        // `/all-orders?&requested_type=return&page=1&pagination=10&status=all`,
        `/order/get-order-count-shopify`,
        // `/cpu-stress`,
      ),
  });

  const handleCSV = async () => {
    try {
      const response = await axiosInstance.get(
        // `order/get-orders-csv?&order_name=123374&undefined&page=1&paginate=10&monitor=false`,
        `order/get-orders-csv`,
        {
          responseType: 'blob', // Important: Ensures that the response is treated as a file (blob)
        },
      );

      // Create a link element to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders.csv'); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      console.log('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };
  const stressTestTrigger = async () => {
    try {
      showToast('Stress test is being called.', 'success');
      console.log('Stress test is being called.');
      const response = await axiosInstance.get(`/cpu-stress`);
      showToast('Stress test completed.', 'success');
      console.log('Stress test completed.');
    } catch (err) {
      console.log('Stress test error:', err);
    } finally {
      console.log('Stress test completed. Final log.');
    }
  };
  // if (isLoading) {
  //   return <PammysLoading />;
  // }

  // if (error) {
  //   return (
  //     <div>
  //       <h2>Some error occured:</h2>
  //       <pre>{JSON.stringify(error, null, 2)}</pre>
  //     </div>
  //   );
  // }

  return (
    <Layout>
      <div className="mb-4 flex flex-col  gap-7 border bg-white p-4">
        <div>
          <pre>{JSON.stringify(webhook, null, 2)}</pre>
        </div>
        Image here
        <div className="max-w-[400px] overflow-hidden border-2">
          <img
            src="/images/background.webp"
            alt="High Resolution Image"
            style={{
              background:
                "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAALCAIAAAAStyFtAAACXklEQVR4nAXBTU/TYAAA4O5t13Zv3/Ztt3UbYxu2YwMhQSAhCIl6URNBvejB36Ee/CsejD/AgzduBoKLJkY8LBOUbWy4MdkXbu36zVqfJ/T6zaukgLDdbLQ6sdxyxVsSOC4EiIAgk9PWtqxxPA88F8mzA90+bY+DUa9Zq1SOylS/UZpVFZbDIkICHeSFsOY4DAAUlngbxjJJHEsBmoWCaDYbR2/fKfnCpNvPSoiydb1b/5Pb3CBpeDXoIGS57W6U52k3Axw9mFsPCBACFHHtdOvVi+NKVpZpz50CQD3cvrd4c8UYDX7ufeaScawPFnKFpbXtVq1y1m7+/nKpFFcZFiWKBbN/weMoYwyBY4TCDBAgry6v+QG5ur65c/+RKmfF+A0ioGiIJUn0IoigwNV5WWudAluXJdzTjFQ6FmJY4I6GZ98OhdjM3d1nEEKGZhLKPEoka/XacfVckmQGIX3817ImiTmVdfVoUpaVfIyHQBv9K3380K9XSQZGcJxmmErp0/H+XvXkl+W4JBm2BpfizJw9MT0SFLa2YOBwGSWengm9f/n88GsZ88gm/J2nj+W08uNgH3MRGvJ0POo3y/RkMADctNfLPXjSLp+cfy9BNR9HIsVli3cEmZ66XuB0Lju1njmbTiFe9C2dgexVvwdEngyxAHLg2uu2zmILy7n12ycHBxQvJ8SoZJsTAQujkVZrXjTGjmi5lq4XIDQMM5xK0d4UKwVWVld2XwQE6QNKvrVBmdqQiXA0hIbj0Cy1qOb8IAh834tL0yBgMeLTxanl4HQOZ+YZNLRMQxuPMmrxP63fDirvX2qLAAAAAElFTkSuQmCC') no-repeat center center",
              backgroundSize: 'cover',
              filter: 'blur(20px)',
              transition: 'filter 0.5s ease-in-out',
            }}
            onLoad={(e) => {
              setTimeout(() => {
                e.target.style.filter = 'none';
              }, 2000);
            }}
          />
        </div>
        <div id="theme-buttons" className="flex gap-3">
          <button className="btn btn-primary" onClick={() => stressTestTrigger()}>
            Trigger Stress Test
          </button>
        </div>
        <div id="theme-buttons" className="flex gap-3">
          <button className="btn btn-primary" onClick={handleCSV}>
            Handle CSV
          </button>
        </div>
        <div id="theme-buttons" className="flex gap-3">
          <DownloadCSVButton
            text="Download CSV"
            endpoint="order/get-orders-csv"
            query="?&order_name=123374&undefined&page=1&paginate=10&monitor=false"
            fileName="orders"
            disabled={false}
          />
        </div>
        <div id="theme-buttons" className="flex gap-3">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn">Btn class</button>
          <button className="btn btn-primary">btn btn-primary</button>
        </div>
        <div></div>
        <div>
          <input className="input" placeholder="Input demo" />
        </div>
        <CustomDatePickerV2 filters={filters} updateFilters={updateFilters} />
        {isLoading ? (
          <PammysLoading />
        ) : (
          <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ThemePage;
