import { useState } from 'react';
import axiosInstance from '../../utils/axios';
import showToast from '../../hooks/useToast';
import { ProductTabContentV2 } from '../../components/molecules/ProductTabContent/ProductTabContentV2';
import useFilters from '../../hooks/useFilters';
import CustomPaginationV2 from '../../components/molecules/CustomPagination/CustomPaginationV2';
import { filterQuery, filterQueryV2 } from '../../utils/dashboard/filterHelpers';
import { useProducts } from '../../apiHooks/useProducts';

const productsFilter = {
  page: 1, // Current page for pagination
  perPage: 10, // Items per page for pagination
  sortBy: 'asc', // Default sorting direction
  sortWith: '', // Field to sort by
  barcode_number: '',
  sku: '',
  title: '',
  reserved_stock: '',
  physical_stock: '',
  picklist_stock: '',
  reserved_picklist_stock: '',
};

const DashboardProductsPageV2 = () => {
  // useDocumentTitle('Pummys | Dashboard');

  const [fetchedProducts, setFetchedProducts] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingFullTable, setLoadingFullTable] = useState(false);

  const { filters, updateFilters } = useFilters(productsFilter);
  const queryString = filterQueryV2(filters);
  console.log(queryString);
  const { data = [], isLoading, isError, isFetching, refetch } = useProducts(queryString);
  console.log('productsPage');

  // const fetchProducts = async (query = '') => {
  //   setLoadingTable(true);
  //   setLoadingFullTable(false);
  //   try {
  //     await axiosInstance.get(`/product/all${query}`).then((res) => {
  //       setLoadingTable(false);
  //       const data = res.data;
  //       setFetchedProducts(data);
  //     });
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //     setLoadingTable(false);
  //   }
  // };

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
  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  return (
    <div className={loadingFullTable ? 'xentral-container relative' : 'xentral-container'}>
      {/* <div className="flex items-center justify-center gap-5   ">
        <h1 className="text-3xl">Products </h1>

        <div className="ml-auto">
          <IconLoader2
            className={`${isLoading || isFetching ? 'opacity-100' : 'opacity-0'} animate-spin duration-100`}
          />
        </div>
      </div>
      <p className=" text-lg text-gray-400">
        Total:<span className="text-gray-600"> {data?.products?.total || 'Loading'} records </span>
      </p> */}

      <ProductTabContentV2
        filters={filters}
        updateFilters={updateFilters}
        queryString={queryString}
        products={data || []}
        setFetchedProducts={setFetchedProducts}
        fetchProducts={refetch}
        fetchProductsFromStore={fetchProductsFromStore}
        loading={isLoading}
        loadingTable={isLoading}
        setLoadingTable={setLoadingTable}
        setLoadingFullTable={setLoadingFullTable}
        loadingFullTable={loadingFullTable}
      />
      <div className="pt-4">
        <CustomPaginationV2
          filters={filters}
          updateFilters={updateFilters}
          total={data?.products?.total || 0}
        />
      </div>
      {/* <PermissionCheck>
        <SyncShopifyProductForm />
      </PermissionCheck> */}
    </div>
  );
};
export default DashboardProductsPageV2;
