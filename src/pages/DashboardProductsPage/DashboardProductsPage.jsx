import { useEffect, useState } from 'react';
import useDocumentTitle from '../../components/useDocumentTitle';
import { ProductTabContent } from '../../components/molecules/ProductTabContent/ProductTabContent';
import axiosInstance from '../../utils/axios';
import showToast from '../../hooks/useToast';

const DashboardProductsPage = () => {
  useDocumentTitle('Pammys | Dashboard');
  const [fetchedProducts, setFetchedProducts] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingFullTable, setLoadingFullTable] = useState(true);

  const fetchProducts = async (query = '') => {
    setLoadingTable(true);
    setLoadingFullTable(false);
    try {
      await axiosInstance.get(`/product/all${query}`).then((res) => {
        setLoadingTable(false);
        const data = res.data;
        setFetchedProducts(data);
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoadingTable(false);
    }
  };

  const fetchProductsFromStore = async () => {
    setLoading(true);
    setLoadingTable(true);
    setLoadingFullTable(true);
    try {
      await axiosInstance.post('/product/sync-shopify-product').then(() => {
        showToast('Shopify-Produkt erfolgreich synchronisiert', 'success');
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setLoadingTable(false);
      setLoadingFullTable(false);
      showToast('Etwas ist schief gelaufen', 'failure');
      console.error('Error fetching products from store:', error);
    } finally {
      setLoadingTable(false);
      setLoadingFullTable(false);
      await fetchProducts();
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className={loadingFullTable ? 'xentral-container relative' : 'xentral-container'}>
      <ProductTabContent
        products={fetchedProducts}
        setFetchedProducts={setFetchedProducts}
        fetchProducts={fetchProducts}
        fetchProductsFromStore={fetchProductsFromStore}
        loading={loading}
        loadingTable={loadingTable}
        setLoadingTable={setLoadingTable}
        setLoadingFullTable={setLoadingFullTable}
        loadingFullTable={loadingFullTable}
      />
    </div>
  );
};
export default DashboardProductsPage;
