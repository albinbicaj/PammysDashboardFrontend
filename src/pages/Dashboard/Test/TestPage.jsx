import { Layout } from '../../../components/template';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../utils/axios';
import ScannerDetectorAssignPacker from '../../../components/organisms/ScannerDetector/ScannerDetectorAssignPacker';

const TestPage = () => {
  // const { isLoading, error, data } = useQuery({
  //   queryKey: ['dashboardStats'],
  //   queryFn: () =>
  //     axiosInstance.get(
  //       // `/home-anayltics/index?&startDate=${dayjs(filters.startDate).format('YYYY-MM-DD')}&endDate=${dayjs(filters.endDate).format('YYYY-MM-DD')}`,
  //       // `/all-orders?&requested_type=return&page=1&pagination=10&status=all`,
  //       `/order/get-order-count-shopify`,
  //       // `/cpu-stress`,
  //     ),
  // });

  return (
    <Layout>
      <div>
        <h1>Test Page</h1>
        {/* <ScannerDetectorAssignPacker /> */}
        {/* Render filters based on the filters state */}
        {/* Example buttons to apply or reset filters */}
      </div>
    </Layout>
  );
};

export default TestPage;
