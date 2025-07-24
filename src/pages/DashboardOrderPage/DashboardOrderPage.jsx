import { useEffect, useState } from 'react';
import { Layout } from '../../components/template';
import { TabContent } from '../../components/molecules';
import { Customer } from '../../components/atoms';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import axios from '../../utils/axios';
import useDocumentTitle from '../../components/useDocumentTitle';
// import { orders } from '../../data/orders';
const DashboardOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // use useLocation hook to get the current location
  const queryParams = queryString.parse(location.search); // parse the query parameters
  const orderId = queryParams.id; // get the orderId from the query parameters

  const handleGoBack = () => {
    navigate(-1);
  };
  const fetchDashboardOrderDetails = () => {
    try {
      const response = axios.get(`/order/get-order/${orderId}`);
    } catch (error) {}
  };
  useEffect(() => {
    fetchDashboardOrderDetails();
  }, []);
  return (
    <Layout>
      <div onClick={handleGoBack} className="w-fit cursor-pointer bg-slate-100 p-2">
        Back to orders
      </div>
      <div>Dashboard Einzelne Bestellseite (Bearbeiten)</div>
      <div className="flex w-full justify-around">
        {/* <div className="flex flex-col">{orders.map(() => {})}</div> */}
        <div>
          <Customer
            name="Chandler Henderson"
            address=""
            payment="manual"
            phone="00383123123"
            email="dm@dieseo.de"
          />
        </div>
      </div>
    </Layout>
  );
};
export default DashboardOrderPage;
