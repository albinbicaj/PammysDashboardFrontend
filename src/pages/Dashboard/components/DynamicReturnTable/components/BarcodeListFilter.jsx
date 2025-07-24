import { useEffect, useState } from 'react';

import axiosInstance from '../../../../../utils/axios';

export const BarcodeListFilter = ({ filters = {}, updateFilters = () => {} }) => {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [selectedBarcodes, setSelectedBarcodes] = useState(() =>
    parseBarcodes(filters.barcode || ''),
  );

  // Fetch items from backend
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.length > 2) {
        axiosInstance

          .get(`/picklist/get-items?keywords=${encodeURIComponent(search)}`)
          .then((res) => setItems(res.data.items || []))
          .catch(() => setItems([]));
      } else {
        setItems([]);
      }
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Sync external filters.barcode -> internal selectedBarcodes
  useEffect(() => {
    setSelectedBarcodes(parseBarcodes(filters.barcode || ''));
  }, [filters.barcode]);

  const handleAddBarcode = (barcode) => {
    if (!barcode || selectedBarcodes.includes(barcode)) return;
    const updated = [...selectedBarcodes, barcode];
    setSelectedBarcodes(updated);
    updateFilters({ barcode: updated.join(',') });
  };

  const handleRemoveBarcode = (barcode) => {
    const updated = selectedBarcodes.filter((b) => b !== barcode);
    setSelectedBarcodes(updated);
    updateFilters({ barcode: updated.join(',') });
  };

  return (
    <div className="space-y-4">
      <label className="block font-semibold">Artikel:</label>
      <input
        type="text"
        placeholder="Type at least 3 characters..."
        className=" w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {items.length > 0 && (
        <div className="max-h-60 overflow-y-auto rounded border bg-white shadow">
          {items.map((item, index) => (
            <button
              key={`+Q4nua8aMLO+Eawf-${index}-${item.barcode_number}`}
              onClick={() => handleAddBarcode(item.barcode_number)}
              className="w-full px-4 py-2 text-left hover:bg-blue-50"
            >
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-gray-500">{item.barcode_number}</div>
              <div className="text-xs text-gray-400">{item.product_name}</div>
            </button>
          ))}
        </div>
      )}

      {selectedBarcodes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedBarcodes.map((barcode) => (
            <span
              key={barcode}
              className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
            >
              {barcode}
              <button
                onClick={() => handleRemoveBarcode(barcode)}
                className="ml-1 text-blue-600 hover:text-blue-900"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Helpers
const parseBarcodes = (str) => {
  return str
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean);
};

// import { Chip, CircularProgress, TextField } from '@mui/material';
// import Autocomplete from '@mui/material/Autocomplete';
// import { useEffect, useState } from 'react';
// import axiosInstance from '../../../../../utils/axios';

// function parseIdString(str) {
//   return str
//     .split(',')
//     .map((id) => id.trim())
//     .filter((id) => id.length > 0);
// }

// function stringifyIds(ids) {
//   return ids
//     .map((id) => id.trim())
//     .filter((id) => id)
//     .join(',');
// }

// export const BarcodeListFilter = ({ filters = {}, updateFilters = () => {} }) => {
//   const [inputValue, setInputValue] = useState('');
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [options, setOptions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // // Fetch selected items on initial load (if editing existing filter)
//   // useEffect(() => {
//   //   const ids = parseIdString(filters.variant_ids || '');
//   //   if (ids.length > 0) {
//   //     axiosInstance
//   //       .get(`/picklist/get-items`, {
//   //         params: { keywords: ids.join(',') },
//   //       })
//   //       .then((res) => {
//   //         setSelectedItems(res.data.items);
//   //       });
//   //   }
//   // }, [filters.variant_ids]);

//   const handleSearch = async (value) => {
//     if (value.length < 3) {
//       setOptions([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axiosInstance.get('/picklist/get-items', {
//         params: { keywords: value },
//       });
//       setOptions(res.data.items || []);
//     } catch (err) {
//       console.error('Search error', err);
//     }
//     setLoading(false);
//   };

//   const handleSelect = (event, newValue) => {
//     setSelectedItems(newValue);
//     updateFilters({ variant_ids: stringifyIds(newValue.map((item) => item.shopify_variant_id)) });
//   };

//   const handleDelete = (variantIdToRemove) => {
//     const updated = selectedItems.filter((item) => item.shopify_variant_id !== variantIdToRemove);
//     setSelectedItems(updated);
//     updateFilters({ variant_ids: stringifyIds(updated.map((i) => i.shopify_variant_id)) });
//   };

//   return (
//     <div>
//       <p className="mb-1 font-semibold">Products</p>
//       <Autocomplete
//         freeSolo
//         filterOptions={(x) => x} // Disable built-in filtering to rely on backend
//         getOptionLabel={(option) =>
//           typeof option === 'string' ? option : `${option.product_name} (${option.title})`
//         }
//         options={options}
//         loading={loading}
//         value={null} // Prevents value being overwritten on select
//         onInputChange={(e, value) => {
//           setInputValue(value);
//           handleSearch(value);
//         }}
//         onChange={handleSelect}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             placeholder="Search products..."
//             InputProps={{
//               ...params.InputProps,
//               endAdornment: (
//                 <>
//                   {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                   {params.InputProps.endAdornment}
//                 </>
//               ),
//             }}
//           />
//         )}
//       />

//       <div className="flex flex-wrap gap-2 pt-2">
//         {selectedItems.map((item) => (
//           <Chip
//             key={item.shopify_variant_id}
//             label={`${item.product_name} (${item.title})`}
//             onDelete={() => handleDelete(item.shopify_variant_id)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };
