import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/template/DashboardLayout';
import {
  DashboardArchivePage,
  DashboardHomePage,
  DashboardReturnPage,
  DashboardExchangePage,
  DashboardRefundPage,
  DashboardRequestPage,
  DashboardDamagedPage,
  DashboardNewRequestPage,
  DashboardStockPage,
  DashboardGiftCardsPage,
  DashboardProfilePage,
  DashboardUsersPage,
  DashboardOrdersPage,
  DashboardProductsPage,
  DashboardPickListPage,
  DashboardPickListProfilePage,
  DashboardPostPage,
  DashboardDispatchCenter,
  DashboardDispatchOrderCenter,
  DashboardPickerPage,
  DashboardAnalytics,
  ThemePage,
  DashboardAddStockPage,
  DashboardOrdersSearchPage,
} from './../index';
import { RequireAuthRoute, RequireNonAuthRoute } from '../../components/molecules';
import { RoleEnum } from '../../enums/Role.enum';
import ShopifyOrder from './ShopifyOrder';
import DashboardRedirect from './DashboardRedirect/DashboardRedirect';
import WebhooksPage from './Webhooks/WebhooksPage';
import TestPage from './Test/TestPage';
import DashboardReturnPageV2 from '../DashboardReturnPage/DashboardReturnPageV2';
import DashboardExchangePageV2 from '../DashboardExchangePage/DashboardExchangePageV2';
import DashboardDamagedPageV2 from '../DashboardDamagedPage/DashboardDamagedPageV2';
import DashboardGiftCardsPageV2 from '../DashboardGiftCardsPage/DashboardGiftCardsPageV2';
import DashboardRefundPageV2 from '../DashboardRefundPage/DashboardRefundPageV2';
import DashboardArchivePageV2 from './DashboardArchivePage/DashboardArchivePageV2';
import DashboardDispatchOrderCenterV2 from '../DashboardDispatchOrderCenter/DashboardDispatchOrderCenterV2';
import StockUpdateLogs from './StockUpdateLogs/StockUpdateLogs';
import DashboardDispatchCenterV2 from '../DashboardDispatchCenter/DashboardDispatchCenterV2';
import DashboardDispatchOrderCenterWorkingMain from '../DashboardDispatchOrderCenter/DashboardDispatchOrderCenterWorkingMain';
import DashboardDispatchOrderCenterV3 from '../DashboardDispatchOrderCenter/DashboardDispatchOrderCenterV3';
import DashboardCalendarView from '../DashboardCalendarView/DashboardCalendarView';
import DashboardProductsPageV2 from '../DashboardProductsPage/DashboardProductsPageV2';
import DashboardUsersPageV2 from '../DashboardUsersPage/DashboardUsersPageV2';
import CSVUploadFilterDownloadPage from '../CSVUploadFilterDownloadPage/CSVUploadFilterDownloadPage';
import DashboardOrdersPageV2 from '../DashboardOrdersPage/DashboardOrdersPageV2';
import DashboardRejectedPage from '../DashboardRejectedPage/DashboardRejectedPage';

export const DashboardRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="/" element={<DashboardRedirect />} />

      <Route
        element={
          <RequireAuthRoute
            roles={[
              RoleEnum.ADMIN,
              RoleEnum.SUPPORT,
              RoleEnum.USER,
              RoleEnum.WAREHOUSE_EMPLOYEE,
              RoleEnum.PACK,
              RoleEnum.PICK,
              RoleEnum.RETOURE,
              RoleEnum.IEM,
            ]}
          />
        }
      >
        <Route path="/profile" element={<DashboardProfilePage />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[
              RoleEnum.ADMIN,
              RoleEnum.SUPPORT,
              RoleEnum.USER,
              RoleEnum.RETOURE,
              RoleEnum.WAREHOUSE_EMPLOYEE,
              RoleEnum.IEM,
            ]}
          />
        }
      >
        <Route path="/stats" element={<DashboardHomePage />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[
              RoleEnum.ADMIN,
              RoleEnum.LAGERLEITER,
              RoleEnum.IEM,
              RoleEnum.WAREHOUSE_EMPLOYEE,
            ]}
          />
        }
      >
        <Route path="/users" element={<DashboardUsersPageV2 />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[
              RoleEnum.ADMIN,
              RoleEnum.SUPPORT,
              RoleEnum.USER,
              RoleEnum.RETOURE,
              RoleEnum.WAREHOUSE_EMPLOYEE,
            ]}
          />
        }
      >
        <Route path="/return" element={<DashboardReturnPageV2 />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[
              RoleEnum.ADMIN,
              RoleEnum.SUPPORT,
              RoleEnum.USER,
              RoleEnum.RETOURE,
              RoleEnum.WAREHOUSE_EMPLOYEE,
            ]}
          />
        }
      >
        <Route path="/returnV2" element={<DashboardReturnPageV2 />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.WAREHOUSE_EMPLOYEE]}
          />
        }
      >
        <Route path="/archive" element={<DashboardArchivePageV2 />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.USER, RoleEnum.WAREHOUSE_EMPLOYEE]}
          />
        }
      >
        <Route path="/add-stock" element={<DashboardAddStockPage />} />
      </Route>

      <Route
        element={
          <RequireAuthRoute
            roles={[
              RoleEnum.ADMIN,
              RoleEnum.SUPPORT,
              RoleEnum.USER,
              RoleEnum.RETOURE,
              RoleEnum.WAREHOUSE_EMPLOYEE,
            ]}
          />
        }
      >
        <Route path="/exchange" element={<DashboardExchangePageV2 />} />
      </Route>
      <Route element={<RequireAuthRoute roles={[RoleEnum.ADMIN, RoleEnum.SUPPORT]} />}>
        <Route path="/refund" element={<DashboardRefundPageV2 />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[
              RoleEnum.ADMIN,
              RoleEnum.SUPPORT,
              RoleEnum.USER,
              RoleEnum.RETOURE,
              RoleEnum.WAREHOUSE_EMPLOYEE,
            ]}
          />
        }
      >
        <Route path="/damaged" element={<DashboardDamagedPageV2 />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[
              RoleEnum.ADMIN,
              RoleEnum.SUPPORT,
              RoleEnum.USER,
              RoleEnum.RETOURE,
              RoleEnum.WAREHOUSE_EMPLOYEE,
            ]}
          />
        }
      >
        <Route path="/rejected" element={<DashboardRejectedPage />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.SUPPORT, RoleEnum.IEM]}
          />
        }
      >
        <Route path="/orders" element={<DashboardOrdersPage />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            // roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.SUPPORT, RoleEnum.IEM]}
            roles={[RoleEnum.ADMIN]}
          />
        }
      >
        <Route path="/orders-v2" element={<DashboardOrdersPageV2 />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[
              RoleEnum.ADMIN,
              RoleEnum.SUPPORT,
              RoleEnum.USER,
              RoleEnum.WAREHOUSE_EMPLOYEE,
              RoleEnum.RETOURE,
              RoleEnum.LAGERLEITER,
              RoleEnum.PACK,
              RoleEnum.PICK,
              RoleEnum.IEM,
            ]}
          />
        }
      >
        <Route path="/shopify/order/:id" element={<ShopifyOrder />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.SUPPORT, RoleEnum.IEM]}
          />
        }
      >
        <Route path="/products" element={<DashboardProductsPageV2 />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.SUPPORT, RoleEnum.IEM]}
          />
        }
      >
        <Route path="/products/stock-update-logs" element={<StockUpdateLogs />} />
      </Route>
      <Route element={<RequireAuthRoute roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE]} />}>
        <Route path="/pick-list" element={<DashboardPickListPage />} />
      </Route>
      <Route element={<RequireAuthRoute roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE]} />}>
        <Route path="/pick-list-profile" element={<DashboardPickListProfilePage />} />
      </Route>
      <Route element={<RequireAuthRoute roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE]} />}>
        <Route path="/post" element={<DashboardPostPage />} />
      </Route>
      <Route element={<RequireAuthRoute roles={[RoleEnum.ADMIN]} />}>
        <Route path="/csv-upload-filter-download" element={<CSVUploadFilterDownloadPage />} />
      </Route>

      {/* CSVUploadFilterDownloadPage */}
      {/* <Route element={<RequireAuthRoute roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE]} />}>
        <Route path="/post-add" element={<DashboardAddPostPage />} />
      </Route> */}
      {/* <Route
        element={
          <RequireAuthRoute roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.PACK]} />
        }
      >
        <Route path="/dispatch-center" element={<DashboardDispatchCenter />} />
      </Route> */}
      <Route
        element={
          <RequireAuthRoute roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.PICK]} />
        }
      >
        <Route path="/picker" element={<DashboardPickerPage />} />
      </Route>
      <Route element={<RequireAuthRoute roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE]} />}>
        <Route path="/analytics" element={<DashboardAnalytics />} />
      </Route>
      <Route element={<RequireAuthRoute roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE]} />}>
        <Route path="/calendar" element={<DashboardCalendarView />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.PACK]} />
        }
      >
        <Route path="/dispatch-center/:id" element={<DashboardDispatchOrderCenterV3 />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.PACK]} />
        }
      >
        <Route path="/dispatch-center" element={<DashboardDispatchCenterV2 />} />
      </Route>
      <Route
        path="/dispatch-center-working-main/:id"
        element={<DashboardDispatchOrderCenterWorkingMain />}
      />
      <Route
        element={
          <RequireAuthRoute
            roles={[
              RoleEnum.ADMIN,
              RoleEnum.SUPPORT,
              RoleEnum.USER,
              RoleEnum.WAREHOUSE_EMPLOYEE,
              RoleEnum.RETOURE,
            ]}
          />
        }
      >
        <Route path="/order" element={<DashboardRequestPage />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.USER, RoleEnum.WAREHOUSE_EMPLOYEE]}
          />
        }
      >
        <Route path="/order-search-page" element={<DashboardOrdersSearchPage />} />
      </Route>
      {/* <Route
        element={
          <RequireAuthRoute
            roles={[RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.USER, RoleEnum.WAREHOUSE_EMPLOYEE]}
          />
        }
      >
        <Route path="/product" element={<DashboardEditProduct />} />
      </Route> */}
      <Route
        element={
          <RequireAuthRoute
            roles={[RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.USER, RoleEnum.WAREHOUSE_EMPLOYEE]}
          />
        }
      >
        <Route path="/request" element={<DashboardNewRequestPage />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.USER, RoleEnum.RETOURE]}
          />
        }
      >
        <Route path="/gift-card" element={<DashboardGiftCardsPageV2 />} />
      </Route>
      <Route element={<RequireAuthRoute roles={[RoleEnum.ADMIN]} />}>
        <Route path="/stock" element={<DashboardStockPage />} />
      </Route>
      <Route element={<RequireAuthRoute roles={[RoleEnum.ADMIN]} />}>
        <Route path="/theme" element={<ThemePage />} />
      </Route>
      <Route element={<RequireAuthRoute roles={[RoleEnum.ADMIN]} />}>
        <Route path="/test" element={<TestPage />} />
      </Route>
      <Route element={<RequireAuthRoute roles={[RoleEnum.ADMIN]} />}>
        <Route path="/webhooks" element={<WebhooksPage />} />
      </Route>
      <Route element={<RequireNonAuthRoute />}>
        <Route path="/*" element={<Navigate to="/dashboard/login" />} />
      </Route>
    </Routes>
  </DashboardLayout>
);
