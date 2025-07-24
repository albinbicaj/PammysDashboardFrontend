import loadable from '@loadable/component';
import { timeout } from 'promise-timeout';
import { PAGE_LOAD_TIMEOUT } from '../config/global';

// import your loader component
const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center">
    <svg className="... mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24"></svg>
  </div>
);

// root settings pages
export const LoginPage = loadable(() => timeout(import('./Auth/Login'), PAGE_LOAD_TIMEOUT), {
  fallback: <PageLoader />,
});
export const LoginPageWarehouse = loadable(
  () => timeout(import('./Auth/LoginWarehouse'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
// error pages
export const ErrorPage = loadable(
  () => timeout(import('./ErrorPage/ErrorPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const ReturnPortalPage = loadable(
  () => timeout(import('./ReturnPortalPage/ReturnPortalPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const EditAddressPage = loadable(
  () => timeout(import('./EditAddressPage/EditAddressPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const ReturnUploadPdfPage = loadable(
  () => timeout(import('./ReturnUploadPdfPage/ReturnUploadPdfPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const ReturnOrdersPage = loadable(
  () => timeout(import('./ReturnOrdersPage/ReturnOrdersPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const ExchangeOrdersPage = loadable(
  () => timeout(import('./ExchangeOrdersPage/ExchangeOrdersPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const ReturnMenuPage = loadable(
  () => timeout(import('./ReturnMenuPage/ReturnMenuPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const FeedbackPage = loadable(
  () => timeout(import('./FeedbackPage/FeedbackPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const ReturnExchangeOrdersPage = loadable(
  () => timeout(import('./ReturnExchangeOrdersPage/ReturnExchangeOrdersPage'), PAGE_LOAD_TIMEOUT),
  { fallback: <PageLoader /> },
);
export const DashboardArchivePage = loadable(
  () => timeout(import('./Dashboard/DashboardArchivePage/DashboardArchivePage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);

export const DashboardAddStockPage = loadable(
  () =>
    timeout(import('./Dashboard/DashboardAddStockPage/DashboardAddStockPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);

export const DashboardHomePage = loadable(
  () => timeout(import('./DashboardHomePage/DashboardHomePage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardExchangePage = loadable(
  () => timeout(import('./DashboardExchangePage/DashboardExchangePage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardReturnPage = loadable(
  () => timeout(import('./DashboardReturnPage/DashboardReturnPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardRefundPage = loadable(
  () => timeout(import('./DashboardRefundPage/DashboardRefundPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardRequestPage = loadable(
  () => timeout(import('./DashboardRequestPage/DashboardRequestPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardOrdersSearchPage = loadable(
  () =>
    timeout(
      import('./Dashboard/DashboardOrdersSearchPage/DashboardOrdersSearchPage'),
      PAGE_LOAD_TIMEOUT,
    ),
  {
    fallback: <PageLoader />,
  },
);

export const DashboardPickListPage = loadable(
  () => timeout(import('./DashboardPickListPage/DashboardPickListPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);

export const DashboardPickListProfilePage = loadable(
  () =>
    timeout(
      import('./DashboardPickListProfilePage/DashboardPickListProfilePage'),
      PAGE_LOAD_TIMEOUT,
    ),
  {
    fallback: <PageLoader />,
  },
);

export const DashboardPostPage = loadable(
  () => timeout(import('./DashboardPostPage/DashboardPostPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardAddPostPage = loadable(
  () => timeout(import('./DashboardAddPostPage/DashboardAddPostPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);

export const DashboardDispatchCenter = loadable(
  () => timeout(import('./DashboardDispatchCenter/DashboardDispatchCenter'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardPickerPage = loadable(
  () => timeout(import('./DashboardPickerPage/DashboardPickerPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);

export const DashboardDispatchOrderCenter = loadable(
  () =>
    timeout(
      import('./DashboardDispatchOrderCenter/DashboardDispatchOrderCenter'),
      PAGE_LOAD_TIMEOUT,
    ),
  {
    fallback: <PageLoader />,
  },
);

export const DashboardProductsPage = loadable(
  () => timeout(import('./DashboardProductsPage/DashboardProductsPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);

export const DashboardAnalytics = loadable(
  () => timeout(import('./DashboardAnalytics/DashboardAnalytics'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);

export const DashboardEditProduct = loadable(
  () => timeout(import('./DashboardEditProduct/DashboardEditProduct'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardDamagedPage = loadable(
  () => timeout(import('./DashboardDamagedPage/DashboardDamagedPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardNewRequestPage = loadable(
  () => timeout(import('./DashboardNewRequestPage/DashboardNewRequestPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardStockPage = loadable(
  () => timeout(import('./DashboardStockPage/DashboardStockPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardGiftCardsPage = loadable(
  () => timeout(import('./DashboardGiftCardsPage/DashboardGiftCardsPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardOrdersPage = loadable(
  () => timeout(import('./DashboardOrdersPage/DashboardOrdersPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardProfilePage = loadable(
  () => timeout(import('./DashboardProfilePage/DashboardProfilePage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const DashboardUsersPage = loadable(
  () => timeout(import('./DashboardUsersPage/DashboardUsersPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);

export const ReturnSuccessPage = loadable(
  () => timeout(import('./ReturnSuccessPage/ReturnSuccessPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);

export const ReturnStatusPage = loadable(
  () => timeout(import('./ReturnStatusPage/ReturnStatusPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const ThankYouPage = loadable(
  () => timeout(import('./ThankYouPage/ThankYouPage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
export const ThemePage = loadable(
  () => timeout(import('./Dashboard/Theme/ThemePage'), PAGE_LOAD_TIMEOUT),
  {
    fallback: <PageLoader />,
  },
);
