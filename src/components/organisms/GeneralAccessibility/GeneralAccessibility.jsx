import React, { useEffect, useRef, useState } from 'react';
import { generalAccessibility } from '../../../data/generalAccessibility';
import { AccessibilityButton } from '../../atoms/AccessibilityButton/AccessibilityButton';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import { ENVIRONMENT } from '../../../config/env';
import { TiDelete } from 'react-icons/ti';
import showToast from '../../../hooks/useToast';
import { useModal } from '../../../context/UnhandledItemNotificationModalContext';
import { useAuthContext } from '../../../context/Auth.context';
export const GeneralAccessibility = () => {
  const [funcId, setFuncId] = useState(-1);
  const inputRef = useRef(null);
  const [search, setSearch] = useState('');
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const { setShowModal, items } = useModal();
  const { user } = useAuthContext();

  const handleSelect = (id) => {
    setFuncId(id);
    if (id > 0) {
      inputRef.current.focus();
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleKeyPress = (event) => {
    const hasRequested = items.some((item) => item.status === 'requested');
    if (hasRequested && event.ctrlKey && user.role_id === 7) {
      setShowModal(true);
      return;
    } else {
      if (funcId > 0) {
        if (event.key === 'Enter' && funcId === 1) {
          fetchOrders();
        }
        if (event.key === 'Enter' && funcId === 2) {
          fetchShopifyOrder();
        }
      }
      if ((event.ctrlKey && event.key === 'o') || (event.ctrlKey && event.key === 'O')) {
        event.preventDefault();
        setFuncId(2);
        handleSelect(2);
      }
      if ((event.ctrlKey && event.key === 'g') || (event.ctrlKey && event.key === 'G')) {
        event.preventDefault();
        setFuncId(1);
        handleSelect(1);
      }
      if (event.key === 'Escape' || event.keyCode === 27) {
        if (funcId > 0) {
          setFuncId(-1);
        }
      }
    }
  };

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `/search-requested-orders?search=${encodeURIComponent(search)}`,
      );
      const { data } = response;
      if (data.status_code === 200) {
        setResponseData(data.orders);
      } else if (data.status_code === 404) {
        setResponseData([]);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };
  const fetchShopifyOrder = async () => {
    if (search === '') {
      showToast('Please type something to search!', 'failure');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/search-in-shopify`, {
        order_number: search,
      });
      const { data } = response;
      if (data.status_code === 200) {
        navigate(`/dashboard/shopify/order/` + encodeURIComponent(search));
        setFuncId(-1);
      } else if (data.status_code === 404) {
        showToast(data.message, 'failure');
        setResponseData([]);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (search.length > 2 && funcId === 1) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      const timeout = setTimeout(() => {
        fetchOrders();
      }, 800);

      setDebounceTimeout(timeout);
    }

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [search, funcId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyPress(event);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [funcId, search]);

  return (
    <div className="flex items-center gap-5">
      {generalAccessibility.map((item) => {
        return <AccessibilityButton key={item.id} item={item} id={funcId} onClick={handleSelect} />;
      })}

      <div
        className={`fixed inset-0 left-0 ${ENVIRONMENT === 'production' ? 'top-16' : 'top-20'}  backdrop-blur-sm transition-opacity duration-200 ${funcId > 0 ? 'opacity-100' : 'pointer-events-none opacity-0'} z-[99999999] flex justify-center border bg-gray-200 bg-opacity-75 p-4`}
        onClick={() => handleSelect(-1)}
      >
        <div
          className="flex max-h-[800px] w-[600px] flex-col gap-5 rounded-xl  bg-white p-4 shadow-xl hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              placeholder={funcId === 1 ? 'Retoure suchen' : 'Shopify suchen'}
              onChange={handleSearchChange}
              value={search}
              autoFocus
              className="w-full rounded-md border px-3 py-2 outline-none duration-150 focus:border-4 "
            />
            <button
              className="rounded-md border bg-slate-100 px-3 py-2 duration-150 hover:bg-slate-200  active:scale-[0.95]"
              onClick={() => {
                setResponseData([]);
                setSearch('');
                inputRef.current.focus();
              }}
            >
              <TiDelete size={24} className="text-gray-700" />
            </button>
            <button
              className="flex min-w-[100px] items-center justify-center rounded-md border bg-slate-100  px-3 py-2 duration-150 hover:bg-slate-200 active:scale-[0.95]"
              onClick={() => {
                handleKeyPress({ key: 'Enter' });
              }}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  <span>Suche...</span>
                </div>
              ) : (
                'Suchen'
              )}
            </button>
          </div>
          <SearchSwitch
            funcId={funcId}
            search={search}
            responseData={responseData}
            setFuncId={setFuncId}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

const SearchSwitch = ({ funcId, search, responseData, setFuncId, loading }) => {
  switch (funcId) {
    case 1:
      return (
        <div className="max-h-[700px] min-h-[300px] overflow-auto ">
          <div>
            {search.length < 3 ? (
              <div className="p-12 text-center">Tippe mindesten 3 Zeichen um zu suchen</div>
            ) : responseData.length === 0 ? (
              loading === false && (
                <div className="p-12 text-center">
                  Nothing found with: <span className="font-bold">{search}</span>
                </div>
              )
            ) : (
              loading === false && (
                <div className="flex flex-col gap-1.5">
                  {responseData.map((order, index) => (
                    <Link
                      to={`/dashboard/order?return_id=` + encodeURIComponent(order.barcode_number)}
                      key={index}
                      className="flex flex-col rounded-md border px-4  py-2 duration-75 hover:bg-secondary"
                      onClick={() => setFuncId(-1)}
                    >
                      <div className="flex gap-4">
                        <p className="text-lg font-bold">{order.order_number}</p>
                        {order.deleted_at !== null && (
                          <div className="flex items-center">
                            <div className=" rounded-full bg-gray-200 px-2 py-0.5  text-xs font-medium leading-4 text-gray-600">
                              <span>Archived</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4">
                        <p> {order.barcode_number}</p>
                        <p>{order.full_name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      );
      break;
    case 2:
      return (
        <div className="p-12 text-center">
          Tippe order number{' '}
          <span className="">
            "#12<span className="text-gray-400">3456789</span>"
          </span>{' '}
          & Enter
        </div>
      );
      break;
    default:
      return null;
  }
};
