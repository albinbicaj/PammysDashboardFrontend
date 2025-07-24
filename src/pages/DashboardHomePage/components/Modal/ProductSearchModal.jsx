import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Button,
  FormControl,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../../../utils/axios';
import { PammysLoading } from '../../../../components/atoms/PammysLoading/PammysLoading';
import { BlackCheckbox } from '../../../../components/UI/BlackCheckbox';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'product_title', label: 'Product Title' },
  { value: 'product_id', label: 'Product ID' },
  { value: 'barcode', label: 'Barcode' },
  { value: 'sku', label: 'SKU' },
  { value: 'variant_id', label: 'Variant ID' },
  { value: 'variant_title', label: 'Variant Title' },
];

const PAGE_SIZE = 100;

const ProductSelectionModal = ({
  open,
  onClose,
  onAdd,
  searchQuery,
  filterType,
  setFilterType,
}) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(searchQuery || '');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const fetchProducts = useCallback(
    async (term, pageNum = 1, append = false) => {
      if (!term) {
        setProducts([]);
        setHasMore(false);
        return;
      }
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const encodedTerm = btoa(term);

        const { data } = await axiosInstance.get(
          `/home-anayltics/get-items/${filterType}/${encodedTerm}/${PAGE_SIZE}?page=${pageNum}`,
        );

        const newItems = data.items.data || [];

        setProducts((prev) => (append ? [...prev, ...newItems] : newItems));

        setHasMore(pageNum < data.items.last_page);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filterType],
  );

  useEffect(() => {
    setPage(1);
    fetchProducts(search, 1, false);
  }, [search, filterType, fetchProducts]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(search, nextPage, true);
  };

  const handleVariantSelect = (variantId) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId) ? prev.filter((id) => id !== variantId) : [...prev, variantId],
    );
  };

  const handleSelectAllForProduct = (productName, isChecked) => {
    const productIds = products
      .filter((product) => product.product_name === productName)
      .map((product) => product.id);

    setSelectedVariants((prev) =>
      isChecked ? [...prev, ...productIds] : prev.filter((id) => !productIds.includes(id)),
    );
  };

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.product_name]) {
      acc[product.product_name] = [];
    }
    acc[product.product_name].push(product);
    return acc;
  }, {});

  const handleAddSelectedVariants = () => {
    const selectedValues = products
      .filter((product) => selectedVariants.includes(product.id))
      .map((product) => {
        switch (filterType) {
          case 'product_title':
            return { product_name: product.product_name };
          case 'product_id':
            return { product_id: product.product_id };
          case 'barcode':
            return { barcode: product.barcode_number };
          case 'sku':
            return { sku: product.sku };
          case 'variant_id':
            return { variant_id: product.id };
          case 'variant_title':
            return { variant_title: product.title };
          default:
            return {
              product_id: product.product_id,
              product_name: product.product_name,
              variant_title: product.title,
              sku: product.sku,
              barcode: product.barcode_number,
              variant_id: product.id,
            };
        }
      });

    onAdd(selectedValues);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" sx={{ height: '90vh' }}>
      <DialogTitle
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'background.paper',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Select Products</span>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box
        sx={{ position: 'sticky', top: 64, backgroundColor: 'background.paper', zIndex: 10, p: 2 }}
      >
        <Box display="flex" gap={2}>
          <TextField
            autoFocus={true}
            fullWidth
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}
            inputRef={searchInputRef}
          />
          <FormControl sx={{ minWidth: 180 }}>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              displayEmpty
              sx={{ height: '40px' }}
            >
              <MenuItem value="" disabled>
                Filter Type
              </MenuItem>
              {filterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <DialogContent dividers sx={{ height: '70vh', overflowY: 'auto', pt: 0, p: 0 }}>
        {loading && page === 1 ? (
          <Box display="flex" justifyContent="center" py={5}>
            <PammysLoading />
          </Box>
        ) : (
          <List sx={{ pt: 0 }}>
            {Object.entries(groupedProducts).map(([productName, variants]) => {
              const allSelected = variants.every((variant) =>
                selectedVariants.includes(variant.id),
              );

              return (
                <Box key={productName} mb={3}>
                  <Box
                    sx={{
                      position: 'sticky',
                      top: 0,
                      backgroundColor: 'background.paper',
                      zIndex: 9,
                      p: '0.5rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '1px solid #ccc',
                    }}
                  >
                    <BlackCheckbox
                      checked={allSelected}
                      onChange={(e) => handleSelectAllForProduct(productName, e.target.checked)}
                    />
                    <h1 style={{ fontSize: '13px', fontWeight: 'bold', color: '#030303' }}>
                      {productName}
                    </h1>
                  </Box>
                  {variants.map((product) => (
                    <ListItem
                      key={product.id}
                      disablePadding
                      style={{
                        paddingLeft: '3rem',
                        borderBottom: '0.04125rem solid rgba(235, 235, 235, 1)',
                      }}
                    >
                      <ListItemIcon>
                        <BlackCheckbox
                          checked={selectedVariants.includes(product.id)}
                          onChange={() => handleVariantSelect(product.id)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#030303' }}>
                            {product.title}
                          </div>
                        }
                        secondary={
                          <Typography component="span" variant="body2" color="text.secondary">
                            SKU: {product.sku} — Barcode: {product.barcode_number}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </Box>
              );
            })}
          </List>
        )}
        {loadingMore && (
          <Box display="flex" justifyContent="center" py={2}>
            <PammysLoading height={5} width={5} />
          </Box>
        )}
        {hasMore && !loadingMore && (
          <Box display="flex" justifyContent="center" mt={2}>
            <button className="btn btn-primary" onClick={loadMore}>
              Show More
            </button>
          </Box>
        )}
        {!hasMore && products.length > 0 && (
          <Typography align="center" color="text.secondary" mt={2}>
            No more products to load
          </Typography>
        )}
      </DialogContent>
      <DialogActions
        sx={{ position: 'sticky', bottom: 0, backgroundColor: 'background.paper', zIndex: 10 }}
      >
        <Typography sx={{ flexGrow: 1, ml: 2 }} variant="body2" color="text.secondary">
          {selectedVariants.length} selected
        </Typography>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleAddSelectedVariants}
          disabled={selectedVariants.length === 0}
        >
          Add
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductSelectionModal;
