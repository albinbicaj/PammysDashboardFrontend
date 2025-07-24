import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import axios from '../../utils/axios';
import useDocumentTitle from '../../components/useDocumentTitle';
import queryString from 'query-string';
import { Layout } from '../../components/template';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomBreadCrumb } from '../../components/atoms';
import { StockTable } from '../../components/molecules';
import { stockColumns } from '../../data/stockColumns';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';
const DashboardStockPage = () => {
  useDocumentTitle('Pammys | Dashboard');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const [items, setItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const deleteRed = red[500];
  // Extract query parameters from the URL
  const parsed = queryString.parse(location.search);
  const pageQueryParam = parseInt(parsed.page, 10);
  const pageSizeQueryParam = parseInt(parsed.pageSize, 10);
  const [page, setPage] = useState(!isNaN(pageQueryParam) ? pageQueryParam : 1); // Default to page 1
  const [pageSize, setPageSize] = useState(!isNaN(pageSizeQueryParam) ? pageSizeQueryParam : 10); // Default to page size 10

  const updatePageQueryParam = (newPage) => {
    setPage(newPage);
    const updatedSearch = `page=${newPage}&per_page=${pageSize}`;
    navigate(`?${updatedSearch}`);
  };

  // Function to update the pageSize query parameter and state
  const updatePageSizeQueryParam = (newPageSize) => {
    setPageSize(newPageSize);
    const updatedSearch = `page=${page}&pageSize=${newPageSize}`;
    navigate(`?${updatedSearch}`);
  };
  const fetchStock = async () => {
    setLoading(true);
    setLoadingMessage('Fetching stock...');
    const res = await axios
      .get(`/stock/get?page=${page}&pagination=${pageSize}`)
      .then((response) => {
        const { data } = response;
        setItems(data.warehouse);
        setLoading(false);
        setLoadingMessage('');
      })

      .catch((error) => {
        setLoading(false);
        setLoadingMessage('');
        console.error(error);
      });
  };
  const handleDeleteStock = async () => {
    setLoading(true);
    setLoadingMessage('Deleting stock');
    try {
      const response = await axios.delete('/stock/delete');
      setLoading(false);
      setLoadingMessage('');
      fetchStock();
    } catch (error) {
      setLoading(false);
      setLoadingMessage('');
    }
  };
  const putBackInStock = async (productId, name, variantTitle, variantId, quantity) => {
    const response = await axios.post('/stock/put-back', {
      product_id: productId,
      name,
      variant_title: variantTitle,
      variant_id: variantId,
      quantity,
    });

    try {
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchStock();
  }, []);
  return (
    <div className="returns-container">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <p>{loadingMessage}</p>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PammysLoading />
          </Box>
        </div>
      ) : (
        <div className="sm:w-[600px] md:w-[800px] lg:w-[1300px]">
          <div className="flex w-full items-center justify-end">
            <IconButton aria-label="delete" color="secondary" onClick={handleDeleteStock}>
              <DeleteIcon style={{ color: deleteRed }} />
            </IconButton>
          </div>
          <StockTable
            columns={stockColumns}
            rows={items}
            page={page}
            setPage={updatePageQueryParam}
            pageSize={pageSize}
            setPageSize={updatePageSizeQueryParam}
          />
        </div>
      )}
    </div>
  );
};
export default DashboardStockPage;
