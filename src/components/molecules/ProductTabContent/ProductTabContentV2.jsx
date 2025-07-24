import { productColumns } from '../../../context/productsColumns';
import { ProductsTable } from '../ProductsTable/ProductsTable';
import { ProductsTableV2 } from '../ProductsTable/ProductsTableV2';

export const ProductTabContentV2 = ({
  filters = {},
  updateFilters = () => {},
  queryString = '',
  products,
  setFetchedProducts,
  fetchProducts,
  fetchProductsFromStore,
  loading,
  loadingTable,
  setLoadingTable,
  setLoadingFullTable,
  loadingFullTable,
}) => {
  return (
    <>
      <div className="">
        <ProductsTableV2
          filters={filters}
          updateFilters={updateFilters}
          queryString={queryString}
          rows={products}
          columns={productColumns}
          setRows={setFetchedProducts}
          fetchProducts={fetchProducts}
          fetchProductsFromStore={fetchProductsFromStore}
          loading={loading}
          loadingTable={loadingTable}
          setLoadingTable={setLoadingTable}
          setLoadingFullTable={setLoadingFullTable}
          loadingFullTable={loadingFullTable}
        />
      </div>
      {/* <div className="pt-4">
        <CustomPaginationV2
          filters={filters}
          updateFilters={updateFilters}
          total={products?.products?.total || 0}
        />
      </div> */}
    </>
  );
};
