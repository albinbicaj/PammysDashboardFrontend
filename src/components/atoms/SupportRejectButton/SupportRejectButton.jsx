import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios';
import { Checkbox, CircularProgress } from '@mui/material';

export const SupportRejectButton = ({
  productId,
  variantId,
  requestedItemId,
  fetchOrderDetails,
  reasonNumber,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  // const [productOptions, setProductOptions] = useState([]);
  const [availableVariants, setAvailableVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [selectedVariant, setSelectedVariant] = useState([]);

  // Searche based on title
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

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
          `&exchange_item_title=${selectedVariant.product_title}`,
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
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching order details:', error);
    }
  };

  const handleRefund = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/dashboard/convert-return-to-pending-refund?` + `&requested_item_id=${requestedItemId}`,
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
        `/dashboard/convert-return-to-gift-card?` + `&requested_item_id=${requestedItemId}`,
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

  const fetchVariants = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        // `/variant-options?product_id=${productId}&variant_id=${variantId}`,
        `/dashboard/available-variants`,
      );
      if (response.data.status_code !== 200) {
        setLoading(false);
      } else {
        setAvailableVariants(response.data.variants);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching order details:', error);
    }
  };

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

      <Modal open={showModal} onClose={handleClose}>
        <Box sx={style} className="overflow-hidden rounded">
          {step === 0 ? (
            <div className="flex h-48 items-center justify-center gap-5">
              <button
                className="bg-accent  px-4 py-2 text-sm font-semibold"
                onClick={() => handleStep(1)}
              >
                Rückgabe
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
            </div>
          ) : step === 1 ? (
            <>
              <div className="flex h-48 items-center justify-center gap-5">
                <button
                  className="focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625 mr-3 box-border border  border-gray-300 p-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
                  onClick={() => handleStep(0)}
                >
                  Zurück
                </button>
                <button className="bg-accent px-4 py-2 text-sm" onClick={handleRefund}>
                  confirm Rückgabe
                </button>
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
                <button className="bg-accent px-4 py-2 text-sm" onClick={handleGiftCard}>
                  confirm Geschenkcode
                </button>
              </div>
            </>
          ) : step === 3 ? (
            <>
              <div className=" border-b  p-4">
                <div className="flex items-center justify-between text-base font-semibold leading-6 text-gray-800">
                  <p>
                    <button
                      className="focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625 mr-3 box-border border  border-gray-300 p-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
                      onClick={() => handleStep(0)}
                    >
                      Zurück
                    </button>
                    für den Umtausch verfügbare Produkte
                  </p>
                  <div>
                    <input
                      type="text"
                      className=" border px-4 py-1 text-sm   "
                      placeholder="Suche nach Titel"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="h-96  overflow-y-scroll">
                {loading === true ? (
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
                      className="focus:border-blue-625  focus:shadow-btn_blue focus:border-blue-625 box-border border border-gray-300  px-4 py-2  text-sm font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
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
                      Austausch
                    </button>
                  </div>
                </div>
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
