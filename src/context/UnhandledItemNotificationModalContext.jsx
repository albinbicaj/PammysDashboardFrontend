import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UnhandledItemNotificationModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const location = useLocation();

  const checkRequestedItems = (newItems) => {
    const hasRequested = newItems.some((item) => item.status === 'requested');

    const isOnReturnPage =
      location.pathname === '/dashboard/order' &&
      new URLSearchParams(location.search).has('return_id');

    if (isOnReturnPage && hasRequested) {
      setItems(newItems);
    } else {
      setItems([]);
      setShowModal(false);
    }
  };

  useEffect(() => {
    setShowModal(false);
    setItems([]);
  }, [location.pathname, location.search]);

  return (
    <UnhandledItemNotificationModalContext.Provider
      value={{ showModal, setShowModal, checkRequestedItems, items }}
    >
      {children}
    </UnhandledItemNotificationModalContext.Provider>
  );
};

export const useModal = () => useContext(UnhandledItemNotificationModalContext);
