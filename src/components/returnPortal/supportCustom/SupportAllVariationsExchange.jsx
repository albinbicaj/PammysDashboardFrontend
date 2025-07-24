import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios';
import { Checkbox, CircularProgress } from '@mui/material';

export const SupportAllVariationsExchange = ({ selectedProduct, addExchangeInfo }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [productOptions, setProductOptions] = useState([]);
  const [availableVariants, setAvailableVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [selectedVariant, setSelectedVariant] = useState([]);

  // Searche based on title
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const toggleVariantChange = (variantId) => {
    const variantIndex = availableVariants.findIndex((item) => item.variant_id === variantId);

    if (availableVariants[variantIndex].variant_id === selectedVariantId) {
      setSelectedVariantId('');
      setSelectedVariant([]);
      addExchangeInfo(selectedProduct.id, '', '');
    } else {
      setSelectedVariantId(availableVariants[variantIndex].variant_id);
      setSelectedVariant(availableVariants[variantIndex]);
      addExchangeInfo(
        selectedProduct.id,
        availableVariants[variantIndex].variant_id,
        availableVariants[variantIndex].variant_title,
        availableVariants[variantIndex].product_id,
        availableVariants[variantIndex].product_title,
      );
      setError('');
    }
  };

  const fetchVariants = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        // `/variant-options?product_id=${productId}&variant_id=${variantId}`,
        `/dashboard/available-variants-support`,
      );
      if (response.data.status_code !== 200) {
        // setError(response.data.message);
        setLoading(false);
        // setLoadingMessage('');
      } else {
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

  useEffect(() => {
    fetchVariants();
  }, []);

  useEffect(() => {
    const filtered = availableVariants.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredData(filtered);
  }, [searchQuery, availableVariants]);

  return (
    <>
      <div className=" border-b  p-4">
        <div className="flex items-center justify-between text-base font-semibold leading-6 text-gray-800">
          <p className="text-sm">für den Umtausch verfügbare Produkte</p>
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
      </div>
    </>
  );
};
