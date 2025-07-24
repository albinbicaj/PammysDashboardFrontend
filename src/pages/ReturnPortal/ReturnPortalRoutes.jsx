import { Routes, Route, Navigate } from 'react-router-dom';
import {
  ReturnOrdersPage,
  ReturnPortalPage,
  ReturnSuccessPage,
  ReturnUploadPdfPage,
  ThankYouPage,
} from '../index';
import { RequireNonAuthRoute } from '../../components/molecules';
import { RoleEnum } from '../../enums/Role.enum';
import { OrderProvider } from '../../context/Order.context';
import OrderStatusPage from '../Customer/OrderStatusPage/OrderStatusPage';

//
//
//
//THIS COMPONENT IS IN DEVELOPMENT
//
//
//
export const ReturnPortalRoutes = () => (
  <OrderProvider>
    <Routes>
      <Route element={<RequireNonAuthRoute />}>
        <Route index path="/retourenportal" element={<ReturnPortalPage />} />
      </Route>
      <Route element={<RequireNonAuthRoute />}>
        <Route path="/retourenportal/upload-pdf" element={<ReturnUploadPdfPage />} />
      </Route>
      <Route element={<RequireNonAuthRoute />}>
        <Route path="/order-status" element={<OrderStatusPage />} />
      </Route>
      <Route element={<RequireNonAuthRoute />}>
        <Route path="/return-portal/upload-pdf" element={<ReturnUploadPdfPage />} />
      </Route>
      <Route element={<RequireNonAuthRoute />}>
        <Route path="/return-order" element={<ReturnOrdersPage />} />
      </Route>
      <Route element={<RequireNonAuthRoute />}>
        <Route path="/return-success" element={<ReturnSuccessPage />} />
      </Route>
      {/* <Route element={<RequireNonAuthRoute />}>
              <Route path="/feedback" element={<FeedbackPage />} />
            </Route> */}
      <Route element={<RequireNonAuthRoute />}>
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Route>
      <Route element={<RequireNonAuthRoute />}>
        <Route path="/*" element={<Navigate to="/retourenportal" />} />
      </Route>
    </Routes>
  </OrderProvider>
);
