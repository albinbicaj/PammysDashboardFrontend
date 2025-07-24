import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axiosInstance from '../../utils/axios';
import showToast from '../../hooks/useToast';

const DashboardEditProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [shopifyVariantId, setShopifyVariantId] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Auftragsdetails laden');
  const [productData, setProductData] = useState([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleBackToReturns = () => {
    navigate('/dashboard/products');
  };

  const onSubmit = async (data) => {
    data.weight_unit = data?.weight_unit?.value;
    try {
      await axiosInstance
        .put(`/product/edit-product/${shopifyVariantId}`, data)
        .then((response) => {
          showToast('Produkt erfolgreich aktualisiert', 'success');
        });
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('Error updating product:', 'failure');
    }
  };

  const getProductById = async (productId) => {
    try {
      const response = await axiosInstance.get(`/product/product/${productId}`);
      const data = response.data;
      setShopifyVariantId(data?.shopify_variant_id);
      setProductData(data);
      reset({
        title: data.title,
        sku: data.sku,
        barcode_number: data.barcode_number,
        weight: data.weight,
        weight_unit: { value: data.weight_unit, label: data.weight_unit }, // Set weight_unit as an object with value and label
        storage_location: data.storage_location,
        physical_stock: data.physical_stock ? data.physical_stock : 0,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('id');

    reset({
      title: '',
    });

    // Make sure productId is available before making the request
    if (productId) {
      getProductById(productId);
    }
    setLoading(false);
  }, []);

  return (
    <div className="xentral-container">
      <div>
        <button
          className="focus:border-blue-625 focus:shadow-btn_blue focus:border-blue-625 mb-5  mr-3 box-border rounded-lg border  border-gray-300 p-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
          onClick={handleBackToReturns}
        >
          Zurück
        </button>
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <p>{loadingMessage}</p>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          </div>
        ) : (
          <div className="order no-scrollbar w-full overflow-y-scroll">
            <div className="mb-7 rounded-lg border bg-white px-4 py-5 shadow ">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-1">
                  <Typography color="#718093" variant="span" component="span" fontWeight="bold">
                    Produkt
                  </Typography>
                  <Typography color="#48509e" variant="h6" component="h6" fontWeight="bold">
                    {productData.sku}
                  </Typography>
                  <span className="text-sm"> {productData.title}</span>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5 flex gap-14 border bg-white px-4 py-5 shadow">
                <div className="mb-7 flex-[1.5] ">
                  <div className="w-full">
                    <Typography variant="p" component="p" fontWeight="bold">
                      Name und Nummer des Artikels
                    </Typography>

                    <div className="mt-8 flex items-center gap-5">
                      <Typography variant="p" component="p">
                        Artikel(DE)
                      </Typography>
                      <Controller
                        name="title"
                        control={control}
                        rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                        render={({ field }) => (
                          <div className="flex flex-col items-center gap-2">
                            <input
                              {...field}
                              className={`input  w-[300px] ${errors.title ? 'border-red-500' : ''}`}
                            />
                            {errors.title && (
                              <span className="text-red-500">{errors.title.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    <div className="mt-8 flex items-center gap-5">
                      <Typography variant="p" component="p">
                        Artikel no.:
                      </Typography>
                      <Controller
                        name="sku"
                        control={control}
                        rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                        render={({ field }) => (
                          <div className="flex flex-col items-center gap-2">
                            <input
                              {...field}
                              className={`input  w-[300px] ${errors.sku ? 'border-red-500' : ''}`}
                            />
                            {errors.sku && (
                              <span className="text-red-500">{errors.sku.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div className="mt-8 flex items-start  gap-5">
                      <Typography variant="p" component="p">
                        EAN no./ <br /> barcode:
                      </Typography>
                      <Controller
                        name="barcode_number"
                        control={control}
                        rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                        render={({ field }) => (
                          <div className="flex flex-col items-center gap-2">
                            <input
                              {...field}
                              className={`input  w-[300px] ${errors.barcode_number ? 'border-red-500' : ''}`}
                            />
                            {errors.barcode_number && (
                              <span className="text-red-500">{errors.barcode_number.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-7 flex-1">
                  <div className="w-full ">
                    <div className="mt-8 flex items-center justify-between">
                      <Typography variant="p" component="p">
                        Lagerbestand:
                      </Typography>
                      <Controller
                        name="physical_stock"
                        control={control}
                        rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                        render={({ field }) => (
                          <>
                            <div className="flex flex-col items-center gap-2">
                              <input
                                {...field}
                                className={`input  w-[300px] ${errors.physical_stock ? 'border-red-500' : ''}`}
                              />
                              {errors.physical_stock && (
                                <span className="text-red-500">
                                  {errors.physical_stock.message}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      />
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <Typography variant="p" component="p">
                        Regal:
                      </Typography>
                      <div className="flex flex-col items-center gap-2">
                        <Controller
                          name="storage_location"
                          control={control}
                          rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                          render={({ field }) => (
                            <>
                              <input
                                {...field}
                                className={`input  w-[300px] ${errors.storage_location ? 'border-red-500' : ''}`}
                              />
                              {errors.storage_location && (
                                <span className="text-red-500">
                                  {errors.storage_location.message}
                                </span>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-5">
                      <Typography variant="p" component="p">
                        Gewicht in (kg):
                      </Typography>
                      <div className="flex flex-col items-center gap-2">
                        <Controller
                          name="weight"
                          control={control}
                          rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                          render={({ field }) => (
                            <>
                              <input
                                {...field}
                                className={`input w-[300px] ${errors.weight ? 'border-red-500' : ''}`}
                              />
                              {errors.weight && (
                                <span className="text-red-500">{errors.weight.message}</span>
                              )}
                            </>
                          )}
                        />
                      </div>{' '}
                    </div>
                    <div className="mt-8 flex items-center justify-between gap-5">
                      <Typography variant="p" component="p">
                        Gewichtseinheit:
                      </Typography>
                      <div className="flex flex-col items-center gap-2">
                        <Controller
                          name="weight_unit"
                          control={control}
                          rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                          render={({ field }) => (
                            <>
                              <Select
                                {...field}
                                // className={`w-[300px] input ${errors.weight_unit ? 'border-red-500' : ''}`}
                                placeholder="Wählen Sie eine..."
                                className="w-[300px]"
                                options={[
                                  { value: 'kg', label: 'kg' },
                                  { value: 'g', label: 'g' },
                                ]}
                              />
                              {errors.weight_unit && (
                                <span className="text-red-500">{errors.weight_unit.message}</span>
                              )}
                            </>
                          )}
                        />
                      </div>{' '}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pb-28">
                <button type="submit" className="btn btn-primary">
                  Speichern Sie
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardEditProduct;
