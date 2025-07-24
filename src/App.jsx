import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import {
  EditAddressPage,
  LoginPage,
  LoginPageWarehouse,
  ReturnOrdersPage,
  ReturnPortalPage,
  ReturnSuccessPage,
  ReturnUploadPdfPage,
  ThankYouPage,
} from './pages';
import { RequireAuthRoute, RequireNonAuthRoute } from './components/molecules';
import { AuthContextProvider } from './context/Auth.context';
import { OrderProvider } from './context/Order.context';
import { RoleEnum } from './enums/Role.enum';
import { DashboardRoutes } from './pages/Dashboard/DashboardRoutes';
import './i18n';
import { CLARITY_TOKEN, CONSOLE_LOG, ENVIRONMENT } from './config/env';
import LanguageRedirector from './components/atoms/LanguageRedirector/LanguageRedirector';
import { Helmet } from 'react-helmet-async';
import ChangeDHLAddress from './pages/Customer/ChangeDHLAddress/ChangeDHLAddress';
import OrderStatusPage from './pages/Customer/OrderStatusPage/OrderStatusPage';
import PersonioTracking from './pages/PersoniaTracking/PersonioTracking';
import { ModalProvider } from './context/UnhandledItemNotificationModalContext';
// import { clarity } from 'react-microsoft-clarity';

// clarity.init(CLARITY_TOKEN);
// // Identify the user
// clarity.identify('USER_ID', { userProperty: 'value' });

// // Cookie consent
// clarity.consent();

// // Setup a custom tag
// clarity.setTag('key', 'value');

// // Upgrade session
// clarity.upgrade('upgradeReason');

// // Check if Clarity has been initialized before calling its methods
// if (clarity.hasStarted()) {
//   clarity.identify('USER_ID', { userProperty: 'value' });
// }

console.log('CONSOLE_LOG', CONSOLE_LOG);
console.log('ENVIRONMENT', ENVIRONMENT);
if (!CONSOLE_LOG) {
  // Disables console log on production
  console.log = function () {};
}

const App = () => {
  const isDashboardPath = window.location.pathname.startsWith('/dashboard');
  const isApiCall = window.location.href.includes('api');

  if (isApiCall) return null;

  return (
    <BrowserRouter>
      <ModalProvider>
        {isDashboardPath ? (
          <AuthContextProvider>
            <Routes>
              <Route element={<RequireNonAuthRoute />}>
                <Route path="/dashboard/login" element={<LoginPage />} />
                <Route path="/dashboard/login-warehouse" element={<LoginPageWarehouse />} />
                <Route path="/dashboard/personio" element={<PersonioTracking />} />
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
                      RoleEnum.IEM,
                    ]}
                  />
                }
              >
                <Route path="/dashboard/*" element={<DashboardRoutes />} />
              </Route>
            </Routes>
          </AuthContextProvider>
        ) : (
          <>
            <OrderProvider>
              <Routes>
                <Route path="/personio" element={<PersonioTracking />} />
                <Route element={<RequireNonAuthRoute />}>
                  <Route index path="/retourenportal" element={<ReturnPortalPage />} />
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
                          {/* <meta name="robots" content="noindex" /> */}
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
          </>
        )}
      </ModalProvider>
    </BrowserRouter>
  );
};

export default App;

//
//
// Optimized above
//
// THIS WAS THE FIRST VERSION v1
//
// const App = () => {
//   if (window.location.pathname.startsWith('/dashboard') && !window.location.href.includes('api')) {
//     return (
//       <BrowserRouter>
//         <AuthContextProvider>
//           <Routes>
//             <Route element={<RequireNonAuthRoute />}>
//               <Route path="/dashboard/login" element={<LoginPage />} />
//             </Route>
//             <Route
//               element={
//                 <RequireAuthRoute
//                   roles={[
//                     RoleEnum.ADMIN,
//                     RoleEnum.USER,
//                     RoleEnum.SUPPORT,
//                     RoleEnum.WAREHOUSE_EMPLOYEE,
//                     RoleEnum.PICK,
//                     RoleEnum.PACK,
//                     RoleEnum.RETOURE,
//                   ]}
//                 />
//               }
//             >
//               <Route path="/dashboard/*" element={<DashboardRoutes />} />
//             </Route>
//           </Routes>
//         </AuthContextProvider>
//       </BrowserRouter>
//     );
//   } else if (!window.location.href.includes('api')) {
//     return (
//       <BrowserRouter>
//         <Helmet>
//           <title>Pummys Retourenportal | Rücksendung & Umtausch</title>
//           <meta
//             name="description"
//             content="Du willst deine Pummys umtauschen oder zurücksenden? Dann bist du hier genau richtig. Zum Portal."
//           />
//           <meta name="robots" content="noindex" />
//         </Helmet>
//         <OrderProvider>
//           <Routes>
//             <Route element={<RequireNonAuthRoute />}>
//               <Route index path="/retourenportal" element={<ReturnPortalPage />} />
//               {/* <Route path="/*" element={<Navigate to="/retourenportal" />} /> */}
//               <Route path="/*" element={<LanguageRedirector />} />
//             </Route>
//             <Route element={<RequireNonAuthRoute />}>
//               <Route path="/retourenportal/upload-pdf" element={<ReturnUploadPdfPage />} />
//             </Route>
//             <Route element={<RequireNonAuthRoute />}>
//               <Route path="/return-portal/upload-pdf" element={<ReturnUploadPdfPage />} />
//             </Route>
//             <Route element={<RequireNonAuthRoute />}>
//               <Route path="/return-order" element={<ReturnOrdersPage />} />
//             </Route>
//             <Route element={<RequireNonAuthRoute />}>
//               <Route path="/return-success" element={<ReturnSuccessPage />} />
//             </Route>
//             {/* <Route element={<RequireNonAuthRoute />}>
//               <Route path="/feedback" element={<FeedbackPage />} />
//             </Route> */}
//             <Route element={<RequireNonAuthRoute />}>
//               <Route path="/thank-you" element={<ThankYouPage />} />
//             </Route>
//           </Routes>
//         </OrderProvider>
//       </BrowserRouter>
//     );
//   }
// };
// export default App;
