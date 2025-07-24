import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useRef, useState } from 'react';
import { SearchIcon } from '../../atoms';
import { CircularProgress, InputBase } from '@mui/material';
import axios from '../../../utils/axios';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

export const SearchModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const inputRef = useRef(null);

  const handleClose = () => {
    setShowModal(false);
  };
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleOpenModal = () => {
    setShowModal(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    if (tab === 1) {
      const res = await axios
        .get(`/order/get-orders?search=` + encodeURIComponent(searchValue))
        .then((response) => {
          const { data } = response;
          if (data.status_code === 200) {
            setOrders(data.orders.data);
          } else if (data.status_code === 404) {
            setOrders([]);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      const res = await axios
        .get(`/search-requested-orders?search=` + encodeURIComponent(searchValue))
        .then((response) => {
          const { data } = response;
          if (data.status_code === 200) {
            setOrders(data.orders);
          } else if (data.status_code === 404) {
            setOrders([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Call your function here that needs to be triggered on Enter press
      // For example, you can trigger a search function
      console.log('Enter key pressed. Searching with: ', event.target.value);
      // handleSearch(event.target.value);
    }
  };
  //redeployin to vercel
  useEffect(() => {
    if (searchValue.length > 2) {
      fetchOrders();
    }
  }, [searchValue, tab]); // Update orders when page or pageSize changes

  return (
    <>
      <button onClick={handleOpenModal}>
        <div className="flex w-[300px]  items-center rounded-full border-2">
          <div className="search-icon-wrapper cursor-pointer px-4 py-2">
            <SearchIcon />
          </div>
          <div
            className="searchbar-input block w-full text-start focus:outline-none"
            inputProps={{ 'aria-label': 'search' }}
          >
            <span className="text-gray-400">Retoure suchen</span>
          </div>
          <div className="p-2 ">
            <div
              className="cursor-pointer rounded-full border px-2 py-0.5 text-xs text-gray-400"
              onClick={() => handleSearch(searchValue)}
            >
              Enter
            </div>
          </div>
        </div>
      </button>
      <Modal open={showModal} onClose={handleClose} className="bg-transparent">
        <Box sx={style} className="mx-auto w-[600px]">
          <div className=" w-[600px] overflow-hidden rounded-xl bg-white p-3">
            <div className="sticky top-0 flex w-full items-center rounded-full border-2 bg-white">
              <div className="search-icon-wrapper cursor-pointer px-4 py-2">
                {loading === true ? (
                  <div className="animate-spin">
                    {/* <div className=" h-5 w-5 rounded-full border-2s  border-gray-500 "></div> */}
                    <div className="loader h-5 w-5 rounded-full border-2 border-t-8 border-gray-200 ease-linear"></div>
                  </div>
                ) : (
                  <SearchIcon />
                )}
              </div>
              <InputBase
                className="searchbar-input block w-full focus:outline-none"
                placeholder={tab === 0 ? 'Retoure suchen' : 'Shopify suchen'}
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearchChange}
                value={searchValue}
                onKeyDown={handleKeyPress}
                inputRef={inputRef}
                classes={{
                  input: 'search-input', // You can add a custom class to the input for additional styling
                  placeholder: 'search-placeholder', // Add a custom class for styling the placeholder
                  placeholderTypography: 'placeholder-text', // Add a custom class for
                }}
              />
              <div className="p-2 ">
                <div
                  className="cursor-pointer rounded-full border px-2 py-0.5 text-xs text-gray-400"
                  onClick={() => handleSearch(searchValue)}
                >
                  Enter
                </div>
              </div>
            </div>
            <div className="flex gap-3 py-4">
              <div
                className={
                  'cursor-pointer rounded-full px-3 py-0.5 duration-150 ' +
                  (tab === 0 ? 'bg-accent' : 'bg-secondary')
                }
                onClick={() => setTab(0)}
              >
                Retourenportal
              </div>
              <div
                className={
                  'cursor-pointer rounded-full px-3 py-0.5 duration-150 ' +
                  (tab === 1 ? 'bg-accent' : 'bg-secondary')
                }
                onClick={() => setTab(1)}
              >
                Shopify
              </div>
            </div>
            <div className="max-h-[600px] min-h-[600px] overflow-auto ">
              {searchValue.length < 3 ? (
                <div className="p-12 text-center">
                  Please type at least 3 chatacters to start searching
                </div>
              ) : orders.length === 0 ? (
                loading === false && (
                  <div className="p-12 text-center">
                    Nothing found with: <span className="font-bold">{searchValue}</span>
                  </div>
                )
              ) : (
                loading === false && (
                  <div>
                    {tab === 0 ? (
                      <div>
                        {orders.map((order, index) => (
                          <Link
                            to={
                              `/dashboard/order?return_id=` +
                              encodeURIComponent(order.barcode_number)
                            }
                            key={index}
                            className="ga-3 flex flex-col rounded-md px-4 py-2 hover:bg-secondary"
                            onClick={() => setShowModal(false)}
                          >
                            <div className="flex gap-4">
                              <p className="text-lg font-bold">{order.order_number}</p>
                            </div>
                            <div className="flex gap-4">
                              <p> {order.barcode_number}</p>
                              <p>{order.full_name}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div>
                        {orders.map((order, index) => (
                          <Link
                            to={`/dashboard/shopify/order/` + encodeURIComponent(order.id)}
                            key={index}
                            className="ga-3 flex flex-col rounded-md px-4 py-2 hover:bg-secondary"
                            onClick={() => setShowModal(false)}
                          >
                            <div className="flex gap-4">
                              <p className="text-lg font-bold">{order.order_number}</p>
                            </div>
                            <div className="flex gap-4">
                              <p>{order.costumer}</p>-
                              <p>{dayjs(order.created_at).format('DD.MM.YYYY, hh:mm')}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

const style = {};
