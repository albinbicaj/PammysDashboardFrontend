import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const useOrderList = (externalSetLoading) => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderList = async () => {
    if (externalSetLoading) externalSetLoading(true);
    try {
      const response = await axiosInstance.get('/dispatch-center/list');
      const filteredOrders =
        response?.data?.list?.data?.filter(
          (order) => order.problem !== 1 && order.is_fulfilled !== 1,
        ) || [];
      setOrderList(filteredOrders);
    } catch (error) {
      console.error('Error fetching order list:', error);
    } finally {
      setLoading(false);
      if (externalSetLoading) externalSetLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  const getNextOrder = (currentOrderNo) => {
    if (orderList.length === 0) return null;
    const currentIndex = orderList.findIndex((order) => order.order_no === currentOrderNo);
    return orderList[currentIndex + 1] || null;
  };

  return { orderList, loading, getNextOrder, fetchOrderList };
};

export default useOrderList;
