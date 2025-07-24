import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import './i18n';
import LanguageRedirector from './components/atoms/LanguageRedirector/LanguageRedirector';

import {
  EditAddressPage,
  LoginPage,
  ReturnOrdersPage,
  ReturnPortalPage,
  ReturnSuccessPage,
  ReturnUploadPdfPage,
  ThankYouPage,
} from './pages';
import { DashboardRoutes } from './pages/Dashboard/DashboardRoutes';
import OrderStatusPage from './pages/Customer/OrderStatusPage/OrderStatusPage';
import ChangeDHLAddress from './pages/Customer/ChangeDHLAddress/ChangeDHLAddress';

// Lazy-loaded route components
// const DashboardRoutes = lazy(() => import('./pages/Dashboard/DashboardRoutes'));
// const OrderStatusPage = lazy(() => import('./pages/Customer/OrderStatusPage/OrderStatusPage'));
// const ChangeDHLAddress = lazy(() => import('./pages/Customer/ChangeDHLAddress/ChangeDHLAddress'));

// Layouts and Contexts
import { AuthContextProvider } from './context/Auth.context';
import { OrderProvider } from './context/Order.context';
import { RequireAuthRoute, RequireNonAuthRoute } from './components/molecules';
import { RoleEnum } from './enums/Role.enum';
import { PammysLoading } from './components/atoms/PammysLoading/PammysLoading';
import { CONSOLE_LOG, ENVIRONMENT } from './config/env';

console.log('CONSOLE_LOG', CONSOLE_LOG);
console.log('ENVIRONMENT', ENVIRONMENT);
// Disables console log on production
if (!CONSOLE_LOG) {
  console.log = function () {};
}

const DashboardLayout = () => (
  <AuthContextProvider>
    <Routes>
      <Route element={<RequireNonAuthRoute />}>
        <Route path="/dashboard/login" element={<LoginPage />} />
      </Route>
      <Route
        element={
          <RequireAuthRoute
            roles={[
              RoleEnum.ADMIN,
              RoleEnum.USER,
              RoleEnum.SUPPORT,
              RoleEnum.WAREHOUSE_EMPLOYEE,
              RoleEnum.PICK,
              RoleEnum.PACK,
              RoleEnum.RETOURE,
            ]}
          />
        }
      >
        <Route path="/*" element={<DashboardRoutes />} />
      </Route>
    </Routes>
  </AuthContextProvider>
);

const CustomerLayout = () => (
  <OrderProvider>
    <Routes>
      <Route element={<RequireNonAuthRoute />}>
        <Route path="/retourenportal" element={<ReturnPortalPage />} />
        <Route path="/order-status" element={<OrderStatusPage />} />
        <Route path="/status" element={<OrderStatusPage />} />
        <Route path="/edit-address/:token" element={<EditAddressPage />} />
        <Route
          path="/"
          element={
            <>
              <Helmet>
                <title>Pammys Retourenportal | Rücksendung & Umtausch</title>
                <meta
                  name="description"
                  content="Du willst deine Pammys umtauschen oder zurücksenden? Dann bist du hier genau richtig. Zum Portal."
                />
              </Helmet>
              <Navigate to={'/retourenportal'} />
            </>
          }
        />
        <Route path="/*" element={<LanguageRedirector />} />
        <Route path="/retourenportal/upload-pdf" element={<ReturnUploadPdfPage />} />
        <Route path="/return-portal/upload-pdf" element={<ReturnUploadPdfPage />} />
        <Route path="/return-order" element={<ReturnOrdersPage />} />
        <Route path="/return-success" element={<ReturnSuccessPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/change-dhl-address" element={<ChangeDHLAddress />} />
      </Route>
    </Routes>
  </OrderProvider>
);

const AppV3 = () => (
  <BrowserRouter>
    <Suspense fallback={<PammysLoading />}>
      <Routes>
        {/* Use nested routes for layout */}
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="/*" element={<CustomerLayout />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppV3;
