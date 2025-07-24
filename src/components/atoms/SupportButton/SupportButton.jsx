import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios';
import { Checkbox, CircularProgress } from '@mui/material';

export const SupportButton = ({
  item,
  productId,
  variantId,
  requestedItemId,
  fetchOrderDetails,
  reasonNumber,
  orderBarcode,
}) => {
  // console.log(item);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const [giftCardAmount, setGiftCardAmount] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  //
  // Rabatt button
  const [changeRefundAmount, setChangeRefundAmount] = useState(false);
  //
  // const [productOptions, setProductOptions] = useState([]);
  const [availableVariants, setAvailableVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [selectedVariant, setSelectedVariant] = useState([]);

  // Searche based on title
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //
  const [returnChecked, setReturnChecked] = useState(false);
  const handleReturnToggle = () => {
    setReturnChecked(!returnChecked);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedVariantId('');
    setSelectedVariant([]);
    setAvailableVariants([]);
    setSearchQuery('');
    setError('');
    setStep(0);
  };
  const handleOpen = () => {
    fetchVariants();
    setShowModal(true);
  };
  const handleStep = (step) => {
    setStep(step);
  };

  const toggleVariantChange = (variantId) => {
    const variantIndex = availableVariants.findIndex((item) => item.variant_id === variantId);

    if (availableVariants[variantIndex].variant_id === selectedVariantId) {
      setSelectedVariantId('');
      setSelectedVariant([]);
    } else {
      setSelectedVariantId(availableVariants[variantIndex].variant_id);
      setSelectedVariant(availableVariants[variantIndex]);
      setError('');
    }
  };

  const handleExchange = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/dashboard/convert-return-to-exchange?` +
          `&requested_item_id=${requestedItemId}` +
          `&exchange_variant_id=${selectedVariantId}` +
          `&exchange_variant_title=${selectedVariant.variant_title}` +
          `&exchange_item_title=${selectedVariant.product_title}` +
          `&return_checked=${returnChecked}`,
      );
      if (response.data.status_code !== 200) {
        // setError(response.data.message);
        setLoading(false);
        // setLoadingMessage('');
      } else {
        handleClose();
        fetchOrderDetails();
        setAvailableVariants(response.data.variants);
        setLoading(false);
        // setLoadingMessage('');
        // setError('');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching order details:', error);
    }
  };

  const handleRefund = async () => {
    // Determine refund amount
    const itemRefundAmount =
      changeRefundAmount && !isNaN(parseFloat(refundAmount)) ? parseFloat(refundAmount) : null;
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/dashboard/convert-return-to-pending-refund?` +
          `&requested_item_id=${requestedItemId}` +
          `&return_checked=${returnChecked}`,
        {
          requested_item_id: requestedItemId,
          return_checked: returnChecked,
          item_refund_amount: itemRefundAmount,
        },
      );
      if (response.data.status_code !== 200) {
        setLoading(false);
      } else {
        handleClose();
        fetchOrderDetails();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching order details:', error);
    }
  };

  const handleGiftCard = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/dashboard/convert-return-to-gift-card?` +
          `&requested_item_id=${requestedItemId}` +
          `&return_checked=${returnChecked}`,
        {
          gift_card_amount: parseFloat(parseFloat(giftCardAmount).toFixed(2)),
        },
      );
      if (response.data.status_code !== 200) {
        setLoading(false);
      } else {
        handleClose();
        fetchOrderDetails();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching order details:', error);
    }
  };

  const handleRefundCustomAmount = async () => {
    console.log('handleRefundCustomAmount');
    console.log(`/dashboard/change-refund-amount/${requestedItemId}`, {
      comment: null,
      order_id: orderBarcode,
      product_id: item.product_id,
      quantity: 1,
      reklamation_request: false,
      variant_id: item.variant_id,
      variant_title: item.variant_title,
      refund_amount: refundAmount,
    });
    console.log('CustomAmount', parseFloat(parseFloat(refundAmount).toFixed(2)));
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/dashboard/change-refund-amount/${requestedItemId}`,
        {
          comment: null,
          order_id: orderBarcode,
          product_id: item.product_id,
          quantity: 1,
          reklamation_request: false,
          variant_id: item.variant_id,
          variant_title: item.variant_title,
          refund_amount: refundAmount,
        },
      );
      if (response?.data?.status_code !== 200) {
        setLoading(false);
      } else {
        handleClose();
        fetchOrderDetails();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching order details:', error);
    }
  };

  const fetchVariants = async () => {
    try {
      setVariantsLoading(true);
      const response = await axiosInstance.get(
        // `/variant-options?product_id=${productId}&variant_id=${variantId}`,
        `/dashboard/available-variants`,
      );
      if (response.data.status_code !== 200) {
        // setError(response.data.message);
        setVariantsLoading(false);
        // setVariantsLoadingMessage('');
      } else {
        console.log(response.data);
        setAvailableVariants(response.data.variants);
        setVariantsLoading(false);
        // setVariantsLoadingMessage('');
        // setError('');
      }
    } catch (error) {
      setVariantsLoading(false);
      console.error('Error fetching order details:', error);
    }
  };

  // useEffect(() => {
  //   fetchVariants();
  // }, []);

  useEffect(() => {
    const filtered = availableVariants.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredData(filtered);
  }, [searchQuery, availableVariants]);

  return (
    <>
      <button className="bg-accent px-6 py-2 " onClick={handleOpen}>
        {reasonNumber == 5
          ? 'Reklamation bestätigen'
          : reasonNumber == 7
            ? 'Falschlieferung bestätigen'
            : 'Support bestätigt'}
      </button>

      <Modal
        open={showModal}
        onClose={handleClose}
        BackdropProps={{
          style: {
            // backgroundColor: 'rgba(229, 231, 235, 0.75)', // bg-gray-200 with 75% opacity
            // backgroundColor: 'rgba(209, 213, 219, 0.75)', // bg-gray-300 with 75% opacity
            backgroundColor: 'rgba(156, 163, 175, 0.75)', // bg-gray-400 with 75% opacity
          },
        }}
      >
        <Box sx={style} className="overflow-hidden rounded border-2">
          {loading === true ? (
            <div className="flex h-48 flex-col items-center  justify-center ">
              <CircularProgress />
            </div>
          ) : step === 0 ? (
            <div className="flex h-48 flex-col items-center  justify-center ">
              <div>
                Rücksendung
                <Checkbox
                  onChange={() => {
                    handleReturnToggle();
                  }}
                  checked={returnChecked}
                />
              </div>
              <div className=" flex items-center justify-center gap-5 border-t-2 pt-5">
                <button
                  className="bg-accent  px-4 py-2 text-sm font-semibold"
                  onClick={() => handleStep(1)}
                >
                  Erstattung
                </button>
                <button
                  className="bg-accent  px-4 py-2 text-sm font-semibold leading-5"
                  onClick={() => handleStep(2)}
                >
                  Geschenkcode
                </button>
                <button
                  className="bg-accent  px-4 py-2 text-sm font-semibold leading-5"
                  onClick={() => handleStep(3)}
                >
                  Ersatzlieferung
                </button>
                {!returnChecked && (
                  <button
                    className="bg-accent px-4 py-2 text-sm font-semibold leading-5"
                    onClick={() => handleStep(4)}
                  >
                    Rabatt
                  </button>
                )}
              </div>
            </div>
          ) : step === 1 ? (
            <>
              <div className="flex max-h-96 min-h-48 flex-col items-center justify-center gap-5 overflow-y-auto p-4">
                <div className="flex flex-col gap-5">
                  <p className={`font text-lg ${changeRefundAmount ? 'line-through' : ''}`}>
                    The customer will be{' '}
                    <span className="font-semibold"> refunded {item.price.toFixed(2)} €</span>
                  </p>
                  {changeRefundAmount ? (
                    <div className="py-6">
                      <div>
                        <input
                          type="number"
                          value={refundAmount}
                          min={0}
                          step={0.1}
                          onChange={(e) => {
                            // const value = parseFloat(e.target.value); // Convert to float
                            // setRefundAmount(isNaN(value) ? 0 : value); // Ensure it's a number

                            const value = e.target.value;
                            // Your validation logic here (if needed)
                            setRefundAmount(value);
                          }}
                          className="min-w-[300px] border  border-gray-300 p-2 text-lg  focus:border-blue-500 focus:outline-none"
                          placeholder="New refund amount"
                        />
                        <span className="pl-2 text-lg">€</span>
                      </div>
                      <p className="font pt-2 text-center text-lg ">
                        New refund amount:
                        <span className="font-semibold">
                          {refundAmount ? `${parseFloat(refundAmount).toFixed(2)} €` : '-'}
                        </span>
                      </p>
                    </div>
                  ) : null}
                </div>
                <div className=" flex gap-4">
                  <button
                    className=" focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625  box-border border  border-gray-300 p-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
                    onClick={() => handleStep(0)}
                  >
                    Zurück
                  </button>
                  <button
                    className="btn btn-secondary rounded-none text-sm"
                    onClick={() => setChangeRefundAmount(!changeRefundAmount)}
                  >
                    Change Refund Amount
                  </button>
                  <button className="bg-accent px-4 py-2 text-sm" onClick={handleRefund}>
                    Erstattung
                  </button>
                </div>
              </div>
            </>
          ) : step === 2 ? (
            <>
              <div className="flex h-48 items-center justify-center gap-5">
                <button
                  className="focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625 mr-3 box-border border  border-gray-300 p-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
                  onClick={() => handleStep(0)}
                >
                  Zurück
                </button>
                <input
                  type="text"
                  value={giftCardAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits and commas
                    if (/^[0-9,]*$/.test(value)) {
                      setGiftCardAmount(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                    if (!/^[0-9,]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-[300px] border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Betrag der Geschenkkarte eingeben"
                />
                <button className="bg-accent px-4 py-2 text-sm" onClick={handleGiftCard}>
                  Geschenkcode
                </button>
              </div>
            </>
          ) : step === 3 ? (
            <div className="bg-gray-200">
              <div className="flex items-center border-b p-4 font-semibold text-gray-800">
                <div className="flex  items-center justify-between ">
                  <div className="flex gap-3  ">
                    <img
                      alt="Produktbild"
                      src={item.product_image}
                      className="h-24 w-24 rounded-sm border-2"
                    />
                    <div>
                      <p className="pb-4 font-semibold">Exhange this product from below list</p>
                      <p className="pb-1 font-normal">{item.title}</p>
                      <p className="font-semibold">{item.variant_title}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" border-b   p-4">
                <div className="flex items-center justify-between text-base font-semibold leading-6 text-gray-800">
                  <p>
                    <button
                      className="focus:border-blue-625 focus:shadow-btn_blue focus:border-blue-625  mr-3 box-border border border-gray-300  bg-white p-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
                      onClick={() => handleStep(0)}
                    >
                      Zurück
                    </button>
                    für den Umtausch verfügbare Produkte
                  </p>
                  <div>
                    <input
                      type="text"
                      className=" w-[350px] border px-4 py-1 text-sm  "
                      placeholder="Suche nach Titel"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="h-96 overflow-y-scroll  bg-white">
                {variantsLoading === true ? (
                  <div className="flex h-96 items-center justify-center">
                    <CircularProgress />
                  </div>
                ) : (
                  filteredData.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b px-4 py-3 text-sm"
                      >
                        <Checkbox
                          sx={{
                            color: '#000',
                            '&.Mui-checked': {
                              // color: '#ffcc66',
                              color: '#000',
                            },
                          }}
                          checked={selectedVariantId === item.variant_id} // Check if the current item is selected
                          onClick={() => toggleVariantChange(item.variant_id)} // Update selectedVariantId on change
                        />

                        {item.title}
                        <span className="ml-auto">{item.inventory_quantity} verfügbar</span>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="flex items-center justify-between border-t p-4">
                <div>
                  {error.length === 0 ? (
                    selectedVariant.length === 0 ? (
                      'keine Variante ausgewählt'
                    ) : (
                      selectedVariant.title
                    )
                  ) : (
                    <span className="text-red-500">{error}</span>
                  )}
                  {}
                </div>
                <div className="flex gap-3">
                  <div>
                    <button
                      className="focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625 box-border border border-gray-300 bg-white  px-4 py-2  text-sm font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
                      onClick={handleClose}
                    >
                      abbrechen
                    </button>
                  </div>
                  <div>
                    <button
                      className="focus:border-blue-625 focus:shadow-btn_blue focus:border-blue-625 bg-accent px-6 py-2     text-sm font-semibold leading-5 hover:border-gray-400 focus:outline-none"
                      onClick={handleExchange}
                    >
                      Ersatzlieferung
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : step === 4 ? (
            <>
              <div className="flex h-48 items-center justify-center gap-5">
                <button
                  className="focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625 mr-3 box-border border  border-gray-300 p-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
                  onClick={() => handleStep(0)}
                >
                  Zurück
                </button>
                <input
                  type="number"
                  value={refundAmount}
                  min={0}
                  step={0.1}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Your validation logic here (if needed)
                    setRefundAmount(value);
                  }}
                  className=" w-[300px] border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Betrag der Rabatt eingeben"
                />
                <button className="bg-accent px-4 py-2 text-sm" onClick={handleRefundCustomAmount}>
                  Rabatt
                </button>
              </div>
            </>
          ) : (
            setStep(0)
          )}
        </Box>
      </Modal>
    </>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 850,
  minHeight: 160,
  bgcolor: '#fff',
};

// step 1 changeRefudnAmount change
// ) : step === 1 ? (
//             <>
//               <div className="flex max-h-96 min-h-48 flex-col items-center justify-center gap-5 overflow-y-auto p-4">
//                 <div className="flex flex-col gap-5">
//                   <p className={`font text-lg ${changeRefundAmount ? 'line-through' : ''}`}>
//                     The customer will be{' '}
//                     <span className="font-semibold"> refunded {item.price.toFixed(2)} €</span>
//                   </p>
//                   {changeRefundAmount ? (
//                     <div className="py-6">
//                       <div>
//                         <input
//                           type="number"
//                           value={refundAmount}
//                           min={0}
//                           step={0.1}
//                           onChange={(e) => {
//                             // const value = parseFloat(e.target.value); // Convert to float
//                             // setRefundAmount(isNaN(value) ? 0 : value); // Ensure it's a number

//                             const value = e.target.value;
//                             // Your validation logic here (if needed)
//                             setRefundAmount(value);
//                           }}
//                           className="min-w-[300px] border  border-gray-300 p-2 text-lg  focus:border-blue-500 focus:outline-none"
//                           placeholder="New refund amount"
//                         />
//                         <span className="pl-2 text-lg">€</span>
//                       </div>
//                       <p className="font pt-2 text-center text-lg ">
//                         New refund amount:
//                         <span className="font-semibold">
//                           {refundAmount ? `${parseFloat(refundAmount).toFixed(2)} €` : '-'}
//                         </span>
//                       </p>
//                     </div>
//                   ) : null}
//                 </div>
//                 <div className=" flex gap-4">
//                   <button
//                     className=" focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625  box-border border  border-gray-300 p-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
//                     onClick={() => handleStep(0)}
//                   >
//                     Zurück
//                   </button>
//                   <button
//                     className="btn btn-secondary rounded-none text-sm"
//                     onClick={() => setChangeRefundAmount(!changeRefundAmount)}
//                   >
//                     Change Refund Amount
//                   </button>
//                   <button className="bg-accent px-4 py-2 text-sm" onClick={handleRefund}>
//                     Erstattung
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : step === 2 ? (

// previous
//  ) : step === 1 ? (
//             <>
//               <div className="flex h-48 items-center justify-center gap-5">
//                 <button
//                   className="focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625 mr-3 box-border border  border-gray-300 p-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
//                   onClick={() => handleStep(0)}
//                 >
//                   Zurück
//                 </button>
//                 <button className="bg-accent px-4 py-2 text-sm" onClick={handleRefund}>
//                   Erstattung
//                 </button>
//               </div>
//             </>
//           ) : step === 2 ? (
